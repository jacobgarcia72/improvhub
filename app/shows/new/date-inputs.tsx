'use client'
import Button from '@/components/form/button';
import Input from '@/components/form/input';
import XButton from '@/components/form/x';
import { addDays, addOrdinal, findNextOrdinalWeekday, formatDate, getDayOfWeek, getWeekdayOccurence, newDate, weekdays } from '@/lib/dates';
import { Candence } from '@/types';
import { useState } from 'react';

function RecurringOptions() {
    const [weekday, setWeekday] = useState<number>(0);
    const [cadence, setCadence] = useState<Candence>('12345');
    return (
        <>
            <div className="flex flex-row flex-wrap">
                <div className="flex flex-col pr-2 w-2/5">
                    <label htmlFor='weekday'>Day of the Week</label>
                    <select id='weekday' name='weekday' value={weekday} onChange={(e) => setWeekday(Number(e.target.value))}>
                        {weekdays.map((day, i) => <option key={i} value={i}>{day}</option>)}
                    </select>
                </div>
                <div className="flex flex-col w-3/5">
                    <label htmlFor='cadence'>Cadence</label>
                    <select id='cadence' name='cadence' value={cadence} onChange={(e) => setCadence(e.target.value as Candence)}>
                        <option value="12345">{`Every ${weekdays[weekday]}`}</option>
                        <option value="1">{`1st ${weekdays[weekday]} of each month`}</option>
                        <option value="2">{`2nd ${weekdays[weekday]} of each month`}</option>
                        <option value="3">{`3rd ${weekdays[weekday]} of each month`}</option>
                        <option value="4">{`4th ${weekdays[weekday]} of each month`}</option>
                        <option value="last">{`Last ${weekdays[weekday]} of each month`}</option>
                        <option value="5">{`5th ${weekdays[weekday]}s`}</option>
                        <option value="13">{`1st and 3rd ${weekdays[weekday]}s`}</option>
                        <option value="24">{`Even ${weekdays[weekday]}s (2nd and 4th)`}</option>
                        <option value="135">{`Odd ${weekdays[weekday]}s (1st, 3rd and 5th)`}</option>
                    </select>
                </div>
            </div>
            <div className="w-1/2 pr-2">
                <Input
                    label='Time' name='regularTime' type='time' required
                />
            </div>
        </>
    )
}

function DateAndTime({ label = 'Day', index = 0, date, time, onDateChange, onTimeChange, removeDateTime }: {
    label: string;
    index: number;
    date: string;
    time: string;
    onDateChange?: (date: string) => void;
    onTimeChange?: (date: string) => void;
    removeDateTime?: (index: number) => void;
}) {
    return (
        <div className='flex flex-row flex-wrap items-end'>
            <div className='pr-2 w-1/2'>
                <Input
                    onChange={onDateChange}
                    value={date || ''}
                    label={label} name={`date-${index}`} type='date' required
                />
            </div>
            <div className={removeDateTime ? 'w-7/16' : 'w-1/2'}>
                <Input
                    onChange={onTimeChange}
                    value={time || ''}
                    label='Time' name={`time-${index}`} type='time' required
                />
            </div>
            {removeDateTime && <div className='w-1/16 pl-1.5 mb-1.5'>
                <XButton onClick={() => removeDateTime(index)} />
            </div>}
        </div>
    )
}

function ScheduleOptions() {
    const [numberOfShowings, setNumberOfShowings] = useState<number>(1);
    const [autofillSelection, setAutofillSelection] = useState<number>(0);
    const [dates, setDates] = useState<string[]>([]);
    const [times, setTimes] = useState<string[]>([]);

    const handleSetDate = (date: string, index: number) => {
        const newDates = dates.slice();
        newDates[index] = date;
        setDates(newDates);
    }

    const handleSetTime = (time: string, index: number) => {
        const newTimes = times.slice();
        newTimes[index] = time;
        setTimes(newTimes);
    }

    const handleRemoveDateTime = (index: number) => {
        const newDates = dates.slice();
        const newTimes = times.slice();
        newDates.splice(index, 1);
        newTimes.splice(index, 1);
        setDates(newDates);
        setTimes(newTimes);
        setNumberOfShowings(numberOfShowings - 1);
    }

    const getAutofillOptions = (): { value: number, text: string }[] => {
        if (dates[0]) {
            const date = newDate(dates[0]);
            const dayOfWeek = getDayOfWeek(date);
            const weekdayOccurrence = getWeekdayOccurence(date);
            let complimentaryOccurences;
            if ([1, 3].includes(weekdayOccurrence)) complimentaryOccurences = '1st and 3rd';
            if ([2, 4].includes(weekdayOccurrence)) complimentaryOccurences = '2nd and 4th';
            const options = [
                { value: 0, text: `Every ${dayOfWeek}` },
                { value: 1, text: `Every other ${dayOfWeek}` },
                { value: 2, text: `Every ${addOrdinal(weekdayOccurrence)} ${dayOfWeek}` }
            ];
            if (complimentaryOccurences) {
                options.push({ value: 3, text: `Every ${complimentaryOccurences} ${dayOfWeek}` });
            }
            return options;
        } else {
            return [];
        }
    }

    const handleAutofill = () => {
        const newDates = dates.slice();
        const ordinalOfBaseDate = getWeekdayOccurence(dates[0]);
        let ordinals = [ordinalOfBaseDate];
        if (autofillSelection === 3) {
            if ([1, 3].includes(ordinalOfBaseDate)) {
                ordinals = [1, 3];
            } else {
                ordinals = [2, 4];
            }
        }
        for (let index = 1; index < numberOfShowings; index++) {
            if (autofillSelection === 0) {
                newDates[index] = formatDate(addDays(newDates[index - 1], 7));
            } else if (autofillSelection === 1) {
                newDates[index] = formatDate(addDays(newDates[index - 1], 14));
            } else {
                newDates[index] = formatDate(
                    findNextOrdinalWeekday(newDates[index - 1], ordinals)
                );
            }
        }
        const newTimes = new Array(numberOfShowings).fill(times[0]);
        setDates(newDates);
        setTimes(newTimes);
    }
    return <>
        <div className="w-1/2 pr-2">
            <Input type='number'
                name='showings'
                label='Number of Showings'
                value={`${numberOfShowings}`}
                onChange={(value) => setNumberOfShowings(Number(value))}
                min={1}
                max={52}
            />
        </div>
        <DateAndTime
            index={0}
            label={numberOfShowings > 1 ? 'Showing #1' : 'Date'}
            date={dates[0]}
            time={times[0]}
            onDateChange={(date) => handleSetDate(date, 0)}
            onTimeChange={(time) => handleSetTime(time, 0)}
        />
        {numberOfShowings > 2 && dates[0] && (
            <div className='flex flex-row items-end'>
                <div className='flex flex-col mr-2 w-3/4'>
                    <label htmlFor='autofill' className='pr-2'>Autofill:</label>
                    <select value={autofillSelection} onChange={(e) => setAutofillSelection(Number(e.target.value))}>
                        {getAutofillOptions().map((option) => (
                            <option key={option.value} value={option.value}>{option.text}</option>
                        ))}
                    </select>
                </div>
                <div className='flex flex-col w-1/4'>
                    <Button type='button' caption='Autofill' onClick={handleAutofill} />
                </div>
            </div>
        )}
        {numberOfShowings > 1 && (
            [...Array(Math.min(51, numberOfShowings - 1))].map((x, arrayIndex) => {
                const index = arrayIndex + 1;
                return <DateAndTime
                    key={index}
                    index={index}
                    date={dates[index]}
                    time={times[index]}
                    onDateChange={(date) => handleSetDate(date, index)}
                    onTimeChange={(time) => handleSetTime(time, index)}
                    label={`Showing #${index + 1}`}
                    removeDateTime={handleRemoveDateTime}
                />
            })
        )}
    </>
}

export default function DateInputs() {
    const [datesTBD, setDatesTBD] = useState<boolean>(false);
    const [isRecurring, setIsRecurring] = useState<boolean>(false);

    return (
        <>
            <p className='-mb-1 label'>Show Dates</p>
            <div className="checkbox-wrapper">
                <input
                    name='tbd'
                    type='checkbox'
                    id='tbd'
                    className='mr-1'
                    value={1}
                    onChange={(e) => {
                        setDatesTBD(e.target.checked);
                        if (e.target.checked) setIsRecurring(false);
                    }}
                />
                <label htmlFor='tbd'>Dates TBD</label>
            </div>
            {!datesTBD && <div className="checkbox-wrapper">
                <input
                    name='recurring'
                    type='checkbox'
                    id='recurring'
                    className='mr-1'
                    value={1}
                    onChange={(e) => setIsRecurring(e.target.checked)}
                />
                <label htmlFor='recurring'>Ongoing show</label>
            </div>}
            {!datesTBD && isRecurring && <RecurringOptions />}
            {!(datesTBD || isRecurring) && <ScheduleOptions />}
        </>
    )
}