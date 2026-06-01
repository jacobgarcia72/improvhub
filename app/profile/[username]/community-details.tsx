import { User } from "@/types";

export default function CommunityDetails({ user }: { user: User }) {
    return (
        <>
            {user.city || user.state ? (
                <p className="mt-2">{`${user.city ? user.city + ', ' : ''}${user.state || ''}`}</p>
            ) : null}
            {user.theatres?.length ? (
                <div className="mt-2">
                    {user.theatres.map((theatre, i) => <p key={i}>{theatre}</p>)}
                </div>
            ) : null}
        </>
    )
}