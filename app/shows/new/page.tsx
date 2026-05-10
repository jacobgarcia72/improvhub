import Form from '@/components/form/form';
import Input from '@/components/form/input';
import ImagePicker from '@/components/form/image-picker';
import { postShow } from '@/lib/actions';
import Text from '@/components/form/text';
import PriceInputs from './price-inputs';
import TheatreSelect from '@/components/form/theatre-select';

export default function NewShowPage() {
    return (
        <main>
            <section>
                <Form onSubmit={postShow} buttonCaption="Create Show">
                    <Input label="Show Name" name="title" required />
                    <ImagePicker />
                    <TheatreSelect />
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
            </section>
        </main>
    )
}