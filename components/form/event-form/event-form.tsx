import Form from '@/components/form/form';
import Input from '@/components/form/input';
import ImagePicker from '@/components/form/image-picker';
import { postEvent } from '@/actions';
import Text from '@/components/form/text';
import TheatreSelect from '@/components/form/theatre-select';
import DateInputs from './date-inputs';
import PriceInputs from './price-inputs';
import { Event, EventType } from '@/types';
import { redirect } from 'next/navigation';
import { getEventOccurrences } from '@/lib/shows';
import { capitalize, pluralize } from '@/lib/helper-functions';
import Checkbox from '../checkbox';

export default async function EventForm({ existingEvent, type }: {
    existingEvent?: Event,
    type: EventType
}) {
    const existingEventDates = (existingEvent && !existingEvent.recurringDay) ? (
        (await getEventOccurrences(existingEvent.id, type)).map((eventOccurrence) => eventOccurrence.dateTime)
    ) : undefined;
    const onCancel = async () => {
        'use server'
        redirect(`/${pluralize(type)}/${existingEvent?.id || ''}`);
    }
    return (
        <section className='medium-section'>
            <Form
                cancel={onCancel}
                onSubmit={postEvent.bind(null, type, existingEvent || null)}
                buttonCaption={existingEvent ? 'Save Changes' : `Create ${capitalize(type)}`}
            >
                <Input
                    value={existingEvent?.title || ''}
                    label={`${capitalize(type)} Title`}
                    name="title"
                    required
                />
                <TheatreSelect
                    existingEvent={existingEvent}
                />
                <ImagePicker
                    currentImage={existingEvent?.image || null}
                />
                <Input
                    value={existingEvent?.photoCredit || ''}
                    label="Photo Credit"
                    name="photoCredit"
                />
                <Text
                    value={existingEvent?.description?.replaceAll('<br>', '\r\n') || ''}
                    label="Description"
                    name="description"
                />
                <DateInputs
                    existingEvent={existingEvent}
                    existingEventDates={existingEventDates}
                    type={type}
                />
                <div>
                    <p className='label'>{type === 'show' ? 'Approximate Runtime:' : `${capitalize(type)} Duration:`}</p>
                    <div className='flex flex-row mt-1'>
                        <Input
                            value={existingEvent?.runtime?.split('h')[0] || ''}
                            className='w-1/5 min-w-[72px] pr-2'
                            type='number'
                            label="Hours"
                            name="runtimeHours"
                            min={0}
                        />
                        <Input
                            value={existingEvent?.runtime?.split('h')[1] || ''}
                            className='w-1/5 min-w-[72px]'
                            type='number'
                            label="Minutes"
                            name="runtimeMinutes"
                            min={0}
                            max={59}
                        />
                    </div>
                </div>
                {['show', 'workshop', 'class'].includes(type) && <PriceInputs
                    existingShow={existingEvent}
                    type={type as 'show' | 'workshop' | 'class'}
                />}
                {['show', 'workshop', 'class'].includes(type) && <>
                    <Input
                        value={(existingEvent)?.ticketsUrl || ''}
                        label={`Link to ${type === 'show' ? 'Buy Tickets' : 'Register'}`}
                        name="ticketsUrl"
                        inputMode="url"
                    />
                </>}
                {type === 'show' && <>
                    <Input
                        value={(existingEvent)?.notes || ''}
                        label="Notes (Trademark info, etc.)"
                        name="notes"
                        maxLength={200}
                    />
                </>}
                {!existingEvent && ['jam', 'class', 'workshop'].includes(type) ? (
                    <Checkbox
                        name="isInstructor"
                        label={`I am ${type === 'jam' ? 'leading' : 'teaching'} this ${type}`}
                        defaultChecked={true}
                    />
                ) : null}
            </Form>
        </section>
    )
}