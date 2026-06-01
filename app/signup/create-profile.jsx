import Input from '@/components/form/input';
import ImagePicker from '@/components/form/image-picker';
import { pronouns } from '@/lib/demographics';
import Form from '@/components/form/form';
import Autocomplete from '@/components/form/autocomplete';
import { createUser } from '@/actions/auth-actions';
import UsernameInput from './username-input';

export default function CreateProfileForm() {
    return (
        <section className='grid gap-4 medium-section'>
            <Form
                onSubmit={createUser}
                buttonCaption='Create Profile'
                className="min-w-3/4"
            >
                <h1 className='text-slate-700 text-xl m-1'>Create Profile</h1>
                <div className="grid gap-4 sm:grid-cols-2">
                    <UsernameInput />
                    <Input required type='password' label='Password' name="password" />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                    <ImagePicker label="Profile Picture" name="image" square />
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                    <Input label="First Name" name="firstName" maxLength={20} required />
                    <Input label="Last Name" name="lastName" maxLength={20} />
                    <Autocomplete options={pronouns} name="pronouns" maxLength={20} label="Pronouns" />
                </div>
            </Form>
        </section>
    );
}
