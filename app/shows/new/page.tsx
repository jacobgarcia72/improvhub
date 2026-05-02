import Form from '@/components/form/form';
import Input from '@/components/form/input';
import ImagePicker from '@/components/form/image-picker';
import { postShow } from '@/lib/actions';
import Text from '@/components/form/text';

export default function NewShowPage() {
    return (
        <main className="px-4 py-6">
            <Form onSubmit={postShow} buttonCaption="Create Show">
                <Input label="Title" name="title" required />
                <ImagePicker />
                <Input label="Theatre" name="theatre" />
                <Input label="Address" name="address" required />
                <Text label="Description" name="description" />
                <div className="flex flex-row gap-4">
                    <div>
                        <Input label="Day" name="date" type="date" required />
                    </div>
                    <div>
                        <Input label="Time" name="time" type="time" required />
                    </div>
                </div>
                <div className="flex flex-row gap-4">
                    <div>
                        <Input label="Ticket Price" name="price" type="number" />
                    </div>
                    <div>
                        <Input label="Price at Door" name="door" type="number" />
                    </div>
                </div>
                <Input label="Webpage" name="webpage" type="url" />
            </Form>
        </main>
    )
}