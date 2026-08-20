import { appName } from '@/lib/app-info';
import { getCurrentUser, getFollowees } from '@/lib/users';
import { Metadata } from 'next';
import SearchResults from '../search/search-results';
import Link from 'next/link';
import Button from '@/components/form/button';
import ItemCard from '../search/item-card';

export const metadata: Metadata = {
    title: `Improv Theatres | ${appName}`
};

export default async function TheatresPage() {
    const currentUser = await getCurrentUser();
    const followedTheatres = currentUser ? await getFollowees(currentUser.id, 'theatre') : [];
    return <>
        <section className="flex flex row gap-2">
            <Link href="/create/theatre">
                <Button caption="New Theatre" />
            </Link>
            <Link href="/search?for=theatres">
                <Button caption="Find Theatres" />
            </Link>
        </section>
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
        {currentUser ? (
            <section>
                <h2 className="text-slate-700 dark:text-slate-300">Theatres I Follow</h2>
                {followedTheatres.length ? (
                    <div className="flex flex-row flex-wrap px-4 pb-4 justify-evenly">
                        {followedTheatres.map((theatre) => (
                            <ItemCard
                                key={theatre.id}
                                item={theatre}
                                type="theatres"
                                userId={currentUser.id}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="min-h-32 flex flex-col items-center justify-center gap-2">
                        <p className="text-gray-600 dark:text-gray-300">You are not following any theatres yet.</p>
                        <Link href="/search?for=theatres">
                            <Button caption="Find Theatres" style="link" />
                        </Link>
                    </div>
                )}
            </section>
        ) : null}
    </>
}
