'use client';

import { useState } from 'react';
import Button from '@/components/form/button';
import Input from '@/components/form/input';
import Text from '@/components/form/text';
import ImagePicker from '@/components/form/image-picker';
import { ethnicities, genderIdentities, orientations, pronouns } from '@/lib/demographics';
import Form from '@/components/form/form';
import Autocomplete from '@/components/form/autocomplete';
import { getTheatreNames } from '@/lib/theatres';

export default function CreateProfileForm() {
    const [message, setMessage] = useState('');

    function handleSubmit(event) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const profile = {
            image: formData.get('image'),
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            pronouns: formData.get('pronouns'),
            headline: formData.get('headline'),
            bio: formData.get('bio'),
            theatre: formData.get('theatre'),
            secondaryTheatre: formData.get('secondaryTheatre'),
            genderIdentity: formData.get('genderIdentity'),
            orientation: formData.get('orientation'),
            ethnicity: formData.get('ethnicity'),
            website: formData.get('website'),
            experience: formData.get('experience'),
        };

        console.log('Performer profile submitted', profile);
        setMessage('Your performer profile draft has been created.');
    }

    const theatres = getTheatreNames();

    return (
        <section className="max-w-3xl mx-auto p-6">

            <Form onSubmit={handleSubmit} className="grid gap-6">
                <ImagePicker label="Headshot" name="image" />
                <div className="grid gap-4 sm:grid-cols-3">
                    <Input label="First Name" name="firstName" required />
                    <Input label="Last Name" name="lastName" />
                    <Autocomplete options={pronouns} name="pronouns" label="Pronouns" />
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
                    <Autocomplete options={genderIdentities} name="genderIdentity" label="Gender Indentity" />
                    <Autocomplete options={orientations} name="orientation" label="Orientation" />
                </div>

                <div className="grid gap-4 sm:grid-cols-1">
                    <Autocomplete options={ethnicities} name="ethnicity" label="Race / Ethnicity" />
                </div>

                <div className="grid gap-4 sm:grid-cols-1">
                    <Input label="Website or Reel" name="website" type="url" />
                </div>
                <Text label="Improv Experience" name="experience" rows={2} />

                <div className="grid gap-3 sm:grid-cols-[1fr_auto] items-end">
                    <Button caption="Save Profile" type="submit" />
                </div>

                {message && (
                    <div className="rounded border border-green-300 bg-green-50 px-4 py-3 text-sm text-green-800">
                        {message}
                    </div>
                )}
            </Form>
        </section>
    );
}
