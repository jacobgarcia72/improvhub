import { appName } from '@/lib/app-info';
import { getCurrentUser } from '@/lib/users';
import { Metadata } from 'next';
import SearchResults from '../search/search-results';

export const metadata: Metadata = {
    title: `Improv Theatres | ${appName}`
};

export default async function TheatresPage() {
    const currentUser = await getCurrentUser();
    return <>
        {currentUser?.city && currentUser.state ? (
            <section>
                <h2 className="text-slate-700 dark:text-slate-300">Nearby Theatres</h2>
                <SearchResults params={{
                        location: `${currentUser.city} ${currentUser.state}`,
                        miles: '10',
                        for: 'theatres'
                    }}
                />
            </section>
        ) : null}
    </>
}