import Input from '@/components/form/input';
import Text from '@/components/form/text';
import ImagePicker from '@/components/form/image-picker';
import { ethnicities, genderIdentities, orientations, pronouns } from '@/lib/demographics';
import Form from '@/components/form/form';
import Autocomplete from '@/components/form/autocomplete';
import { getTheatreNames } from '@/lib/theatres';
import { createUser } from '@/lib/actions';
import UsernameInput from './username-input';

export default function CreateProfileForm() {

    const theatres = getTheatreNames();

    return (
        <section className="max-w-3xl mx-auto p-6">
            <Form onSubmit={createUser} className="grid gap-6" buttonCaption='Create Profile'>
                <ImagePicker label="Headshot" name="image" />
                <div className="grid gap-4 sm:grid-cols-2">
                    <Input label="First Name" name="firstName" maxLength={20} required />
                    <Input label="Last Name" name="lastName" maxLength={20} />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                    <UsernameInput />
                    <Autocomplete options={pronouns} name="pronouns" maxLength={20} label="Pronouns" />
                </div>

                <div className="grid gap-4 sm:grid-cols-1">
                    <Input label="Headline" name="headline" placeholder="Short performer tagline" />
                </div>

                <Text label="Bio" name="bio" rows={2} />

                <div className="grid gap-4 sm:grid-cols-2">
                    <Autocomplete options={theatres} name="theatre" label="Primary Theatre" />
                    <Autocomplete options={theatres} name="secondaryTheatre" label="Secondary Theatre" />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <Autocomplete options={genderIdentities} name="gender" label="Gender Indentity" />
                    <Autocomplete options={orientations} name="orientation" label="Orientation" />
                </div>

                <div className="grid gap-4 sm:grid-cols-1">
                    <Autocomplete options={ethnicities} name="ethnicity" label="Race / Ethnicity" />
                </div>

                <div className="grid gap-4 sm:grid-cols-1">
                    <Input label="Website or Reel" name="website" type="url" />
                </div>
                <Text label="Improv Experience" name="experience" rows={2} />
            </Form>
        </section>
    );
}
