import { postTeam } from "@/actions";
import Form from "@/components/form/form";
import NameInput from "./name-input";

export default function CreateTeamPage() {
    return (
        <section className="medium-section extra-padding">
            <Form onSubmit={postTeam}>
                <NameInput />
            </Form>
        </section>
    )
}