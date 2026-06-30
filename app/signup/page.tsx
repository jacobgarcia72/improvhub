import CreateProfileForm from './create-profile';
import { appName } from '@/lib/app-info';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: `Sign Up | ${appName}`
};

export default function LoginPage() {
    return (
        <CreateProfileForm />
    )
}