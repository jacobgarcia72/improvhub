import { postTheatreClaim } from "@/actions";
import Form from "@/components/form/form";
import Text from "@/components/form/text";

export default function TheatreClaimForm({ theatreId, theatreName }: {
    theatreId: string;
    theatreName: string;
}) {
    return (
        <section className="px-6">
            <h3 className="mb-2 font-semibold">Claim Theatre</h3>
            <p className="mb-3 text-sm text-slate-700 dark:text-slate-300">
                {`${theatreName} does not have any admins yet. If you are authorized to represent this theatre, submit a claim for review.`}
            </p>
            <p className="mb-2">
                How are you authorized to represent this theatre? Include an official email, website, public staff listing, or authorization note.
            </p>
            <Form
                onSubmit={postTheatreClaim.bind(null, theatreId)}
                buttonCaption="Submit Claim"
            >
                <Text
                    name="proof"
                    rows={4}
                />
            </Form>
        </section>
    )
}
