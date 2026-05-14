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
                <ImagePicker />
                <TheatreSelect />
                <Text label="Description" name="description" />
                <DateInputs />
                <div className="flex flex-row gap-4 flex-wrap">
                    <div>
                        <Input label="Ticket Price" name="price" type="price"/>
                    </div>
                    <div>
                        <Input label="Price at Door (if different)" name="doorPrice" type="price" />
                    </div>
                </div>
                <Input label="Webpage" name="webpage" type="url" />
            </Form>
        </section>
    )
}