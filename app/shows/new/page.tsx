import Form from '@/components/form/form';
import Input from '@/components/form/input';
import ImagePicker from '@/components/form/image-picker';
import { postShow } from '@/lib/actions';
import Text from '@/components/form/text';
import TheatreSelect from '@/components/form/theatre-select';
import DateInputs from './date-inputs';

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
                <div className="flex flex-row flex-wrap">
                    <div className="w-1/2 pr-2">
                        <Input label="Ticket Price" name="price" type="price"/>
                    </div>
                    <div className="w-1/2">
                        <Input label="Price at Door (if different)" name="doorPrice" type="price" />
                    </div>
                </div>
                {/* TODO: make hours and minutes inputs */}
                <Input label="Approximate Runtime" name="runtime" />
                <Input label="Link to Buy Tickets" name="ticketsUrl" type="url" />
                <Input label="Notes (Trademark info, etc.)" name="notes" maxLength={200} />
            </Form>
        </section>
    )
}