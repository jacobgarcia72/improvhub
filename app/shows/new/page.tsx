import Form from '@/components/form/form';
import Input from '@/components/form/input';
import ImagePicker from '@/components/form/image-picker';
import { postShow } from '@/lib/actions';
import Text from '@/components/form/text';
import PriceInputs from './price-inputs';

export default function NewShowPage() {
    return (
        <main className="px-4 py-6">
            <Form onSubmit={postShow} buttonCaption="Create Show">
                <Input label="Show Name" name="title" required />
                <ImagePicker />
                <div className="flex flex-row gap-4">
                    <div>
                        <Input label="Theatre" name="theatre" />
                    </div>
                    <div>
                        <Input label="ZIP Code" name="zipcode" required type='zipcode' />
                    </div>
                </div>
                <Text label="Description" name="description" />
                <div className="flex flex-row gap-4">
                    <div>
                        <Input label="Day" name="date" type="date" required />
                    </div>
                    <div>
                        <Input label="Time" name="time" type="time" required />
                    </div>
                </div>
                <PriceInputs />
                <Input label="Webpage" name="webpage" type="url" />
            </Form>
        </main>
    )
}