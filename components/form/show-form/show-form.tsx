import Form from '@/components/form/form';
import Input from '@/components/form/input';
import ImagePicker from '@/components/form/image-picker';
import { postShow } from '@/actions';
import Text from '@/components/form/text';
import TheatreSelect from '@/components/form/theatre-select';
import DateInputs from './date-inputs';
import PriceInputs from './price-inputs';
import { Event } from '@/types';
import { redirect } from 'next/navigation';
import { getShowings } from '@/lib/shows';

export default async function ShowForm({ existingShow }: {
    existingShow?: Event
}) {
    const existingShowDates = (existingShow && !existingShow.recurringDay) ? (
        (await getShowings(existingShow.id)).map((showing) => showing.dateTime)
    ) : undefined;
    const onCancel = async () => {
        'use server'
        redirect(`/shows/${existingShow?.id || ''}`);
    }
    return (
        <section className='medium-section'>
            <Form
                cancel={onCancel}
                onSubmit={postShow.bind(null, existingShow || null)}
                buttonCaption={existingShow ? 'Save Changes' : 'Create Show'}
            >
                <Input
                    value={existingShow?.title || ''}
                    label="Show Name"
                    name="title"
                    required
                />
                <TheatreSelect
                    existingShow={existingShow}
                />
                <ImagePicker
                    currentImage={existingShow?.image || null}
                />
                <Input
                    value={existingShow?.photoCredit || ''}
                    label="Photo Credit"
                    name="photoCredit"
                />
                <Text
                    value={existingShow?.description?.replaceAll('<br>', '\r\n') || ''}
                    label="Description"
                    name="description"
                />
                <DateInputs
                    existingShow={existingShow}
                    existingShowDates={existingShowDates}
                />
                <PriceInputs
                    existingShow={existingShow}
                />
                <div>
                    <p className='label'>Approximate Runtime:</p>
                    <div className='flex flex-row mt-1'>
                        <Input
                            value={existingShow?.runtime?.split('h')[0] || ''}
                            className='w-1/5 min-w-[72px] pr-2'
                            type='number'
                            label="Hours"
                            name="runtimeHours"
                            min={0}
                        />
                        <Input
                            value={existingShow?.runtime?.split('h')[1] || ''}
                            className='w-1/5 min-w-[72px]'
                            type='number'
                            label="Minutes"
                            name="runtimeMinutes"
                            min={0}
                            max={59}
                        />
                    </div>
                </div>
                <Input
                    value={existingShow?.ticketsUrl || ''}
                    label="Link to Buy Tickets"
                    name="ticketsUrl"
                    inputMode="url"
                />
                <Input
                    value={existingShow?.notes || ''}
                    label="Notes (Trademark info, etc.)"
                    name="notes"
                    maxLength={200}
                />
            </Form>
        </section>
    )
}