import ComingSoon from '@/components/coming-soon';
import { appName } from '@/lib/app-info';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: `Improv Theatres | ${appName}`
};

export default function TheatresPage() {
    return <ComingSoon />
}