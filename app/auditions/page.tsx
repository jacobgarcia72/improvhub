import { formatDateTimeForDisplay, isDateTimeInPast } from "@/lib/dates";
import { getUserAuditions, UserAudition } from "@/lib/submission-forms";
import { getCurrentUserId } from "@/lib/users";
import { optimizeImage } from "@/lib/optimize-image";
import { appName } from "@/lib/app-info";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
    title: `Auditions | ${appName}`
};

function getAuditionTimes(audition: UserAudition): string[] {
    return audition.form.auditionSlots
        .map((slot) => slot.dateTime)
        .filter((dateTime) => !Number.isNaN(new Date(dateTime).getTime()))
        .sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
}

function isPastAudition(audition: UserAudition): boolean {
    if (audition.form.auditionDatesTbd) return false;

    const times = getAuditionTimes(audition);
    if (times.length) {
        return times.every((dateTime) => isDateTimeInPast(dateTime));
    }

    return isDateTimeInPast(audition.form.closesAt);
}

function getSortTime(audition: UserAudition): number {
    const times = getAuditionTimes(audition);
    const nextTime = times.find((dateTime) => !isDateTimeInPast(dateTime));
    const fallbackTime = times[times.length - 1] || audition.form.closesAt || audition.form.updatedAt;
    return new Date(nextTime || fallbackTime).getTime();
}

function getAssignedSlotLabel(audition: UserAudition): string | null {
    const slotId = audition.submission?.assignedAuditionSlotId;
    if (!slotId) return null;

    const slot = audition.form.auditionSlots.find((auditionSlot) => auditionSlot.id === slotId);
    return slot ? formatDateTimeForDisplay(slot.dateTime, false, true, true) : null;
}

function getPrimaryTimeLabel(audition: UserAudition): string {
    if (audition.form.auditionDatesTbd) return 'Audition date(s) TBD';

    const assignedSlotLabel = getAssignedSlotLabel(audition);
    if (assignedSlotLabel) return `Assigned: ${assignedSlotLabel}`;

    const times = getAuditionTimes(audition);
    const nextTime = times.find((dateTime) => !isDateTimeInPast(dateTime));
    const fallbackTime = times[times.length - 1];
    if (!nextTime && !fallbackTime) return 'No audition date listed';

    return `${nextTime ? 'Next' : 'Last'}: ${formatDateTimeForDisplay(nextTime || fallbackTime, false, true, true)}`;
}

function getRelationshipLabel(relationship: UserAudition['relationships'][number]): string {
    return relationship === 'auditioner' ? 'Auditioner' : 'Troupe member';
}

function AuditionCard({ audition }: { audition: UserAudition }) {
    const { form, troupe, relationships } = audition;
    const past = isPastAudition(audition);
    const title = troupe?.name || form.title;

    return (
        <div className="rounded border border-gray-300 p-3 flex flex-row gap-3 items-center">
            <div className="shrink-0">
                {troupe?.image ? (
                    <Link href={`/troupes/${troupe.id}`}>
                        <Image
                            src={optimizeImage(troupe.image, 120, 120, 90, true)}
                            alt={title}
                            width={54}
                            height={54}
                            className="rounded object-cover h-[54px] w-[54px]"
                        />
                    </Link>
                ) : (
                    <div className="rounded bg-slate-200 dark:bg-slate-800 h-[54px] w-[54px]" />
                )}
            </div>
            <div className="min-w-0 grow">
                <div className="flex flex-row flex-wrap justify-between gap-x-3 gap-y-1">
                    <div className="min-w-0">
                        {troupe ? (
                            <Link href={`/troupes/${troupe.id}`} className="link font-semibold">
                                {troupe.name}
                            </Link>
                        ) : (
                            <h2 className="font-semibold text-slate-900 dark:text-slate-100">{title}</h2>
                        )}
                        {troupe?.city && troupe.state ? (
                            <p className="text-xs text-slate-600 dark:text-slate-300">{troupe.city}, {troupe.state}</p>
                        ) : null}
                    </div>
                    {past ? (
                        <span className="h-fit rounded border border-gray-300 px-2 py-0.5 text-xs text-slate-700 dark:text-slate-300">
                            Past
                        </span>
                    ) : null}
                </div>
                <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">{getPrimaryTimeLabel(audition)}</p>
                <div className="mt-2 flex flex-row flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                    {relationships.map((relationship) => (
                        <span key={relationship} className="text-slate-600 dark:text-slate-400">
                            {getRelationshipLabel(relationship)}
                        </span>
                    ))}
                    <Link className="link font-semibold text-sm" href={`/submission-form/${form.ownerType}/${form.ownerId}`}>
                        View form
                    </Link>
                </div>
            </div>
        </div>
    );
}

function AuditionGroup({ title, auditions }: { title: string; auditions: UserAudition[] }) {
    if (!auditions.length) return null;

    return (
        <div className="flex flex-col gap-3 rounded">
            <h2 className="font-semibold text-slate-700 dark:text-slate-300">{title}</h2>
            {auditions.map((audition) => <AuditionCard key={audition.form.id} audition={audition} />)}
        </div>
    );
}

export default async function AuditionsPage() {
    const userId = await getCurrentUserId();

    if (!userId) {
        return (
            <section className="medium-section">
                <h1 className="text-xl mb-2">Auditions</h1>
                <p><Link className="link" href="/login">Sign in</Link> to see auditions you are part of.</p>
            </section>
        );
    }

    const auditions = await getUserAuditions(userId);
    const currentAuditions = auditions
        .filter((audition) => !isPastAudition(audition))
        .sort((a, b) => getSortTime(a) - getSortTime(b));
    const pastAuditions = auditions
        .filter(isPastAudition)
        .sort((a, b) => getSortTime(b) - getSortTime(a));

    return (
        <section className="px-10! sm:px-16! flex flex-col gap-5">
            <div>
                <h1 className="text-xl">Auditions</h1>
            </div>
            {!auditions.length ? (
                <p className="text-slate-700 dark:text-slate-300">No auditions to display.</p>
            ) : (
                <>
                    <AuditionGroup title="Upcoming Auditions" auditions={currentAuditions} />
                    <AuditionGroup title="Past Auditions" auditions={pastAuditions} />
                </>
            )}
        </section>
    );
}
