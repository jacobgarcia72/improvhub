'use client'
import Button from '@/components/form/button';
import Input from '@/components/form/input';
import { addDays, addOrdinal, weekdays } from '@/lib/dates';
import { useState } from 'react';



function DateAndTime({ label = 'Day', index = 0, date, time, onDateChange, onTimeChange }: {
    label: string;
    index: number;
    date: string;
    time: string;
    onDateChange?: (date: string) => void;
    onTimeChange?: (date: string) => void;
}) {
    return (
        <div className='flex flex-row flex-wrap gap-4'>
            <div>
                <Input
                    onChange={onDateChange}
                    value={date}
                    label={label} name={`date-${index}`} type='date' required
                />
            </div>
            <div>
                <Input
                    onChange={onTimeChange}
                    value={time}
                    label='Time' name={`time-${index}`} type='time' required
                />
            </div>
        </div>
    )
}

export default function DateInputs() {
    const [datesTBD, setDatesTBD] = useState<boolean>(false);
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

    const getAutofillOptions = (): { value: number, text: string }[] => {
        if (dates[0]) {
            const date = new Date(`${dates[0]} 00:00`);
            const dayOfWeek = weekdays[date.getDay()];
            const dayOfMonth = date.getDate();
            const weekdayOccurrence = Math.floor((dayOfMonth - 1) / 7) + 1;
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
            options.push({ value: 4, text: `Every ${addOrdinal(dayOfMonth)} day of the Month` });
            return options;
        } else {
            return [];
        }
    }

    const handleAutofill = () => {
        const newDates = dates.slice();
        const baseDate = new Date(dates[0]);
        for (let index = 1; index < numberOfShowings; index++) {
            switch (autofillSelection) {
                case 0:
                    newDates[index] = addDays(baseDate, index * 7).toISOString().split('T')[0];
                    break;
                case 1:
                    newDates[index] = addDays(baseDate, index * 14).toISOString().split('T')[0];
                    break;
                default:
                    break;
            }
            
        }
        const newTimes = new Array(numberOfShowings).fill(times[0]);
        setDates(newDates);
        setTimes(newTimes);
    }

    return (
        <>
            <div>
                <input
                    name='tbd'
                    type='checkbox'
                    id='tbd'
                    className='mr-1'
                    onChange={(e) => setDatesTBD(e.target.checked)}
                />
                <label htmlFor='tbd'>Dates TBD</label>
            </div>
            {!datesTBD && <>
                <Input type='number'
                    name='showings'
                    label='Number of Showings'
                    value={`${numberOfShowings}`}
                    onChange={(value) => setNumberOfShowings(Number(value))}
                    min={1}
                    max={52}
                />
                <DateAndTime
                    index={0}
                    label={numberOfShowings > 1 ? 'Showing #1' : 'Date'}
                    date={dates[0]}
                    time={times[0]}
                    onDateChange={(date) => handleSetDate(date, 0)}
                    onTimeChange={(time) => handleSetTime(time, 0)}
                />
                {numberOfShowings > 2 && dates[0] && times[0] && (
                    <div className='flex flex-row'>
                        <p>Autofill:</p>
                        <select value={autofillSelection} onChange={(e) => setAutofillSelection(Number(e.target.value))}>
                            {getAutofillOptions().map((option) => (
                                <option key={option.value} value={option.value}>{option.text}</option>
                            ))}
                        </select>
                        <Button caption='Go' onClick={handleAutofill} />
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
                        />
                    })
                )}
            </>}
        </>
    )
}