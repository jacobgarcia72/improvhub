import Form from '@/components/form/form';
import Input from '@/components/form/input';
import ImagePicker from '@/components/form/image-picker';
import { postShow } from '@/actions';
import Text from '@/components/form/text';
import TheatreSelect from '@/components/form/theatre-select';
import DateInputs from './date-inputs';
import PriceInputs from './price-inputs';

export default function NewShowPage() {
    return (
        <section>
            <Form onSubmit={postShow} buttonCaption="Create Show">
                <Input label="Show Name" name="title" required />
                <TheatreSelect />
                <ImagePicker />
                <Input label="Photo Credit" name="photoCredit" />
                <Text label="Description" name="description" />
                <DateInputs />
                <PriceInputs />
                <div>
                    <p className='label'>Approximate Runtime:</p>
                    <div className='flex flex-row mt-1'>
                        <Input className='w-1/5 min-w-[72px] pr-2' type='number'
                            label="Hours" name="runtimeHours" min={0} />
                        <Input className='w-1/5 min-w-[72px]' type='number'
                            label="Minutes" name="runtimeMinutes" min={0} max={59} />
                    </div>
                </div>
                <Input label="Link to Buy Tickets" name="ticketsUrl" inputMode="url" />
                <Input label="Notes (Trademark info, etc.)" name="notes" maxLength={200} />
            </Form>
        </section>
    )
}