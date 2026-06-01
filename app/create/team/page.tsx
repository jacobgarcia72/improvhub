import { postTeam } from "@/actions";
import Form from "@/components/form/form";
import NameInput from "./name-input";
import ImagePicker from "@/components/form/image-picker";
import Text from "@/components/form/text";
import LocationInputs from "./location-inputs";
import Input from "@/components/form/input";
import { TeamMemberInputs } from "./team-member-inputs";

export default async function CreateTeamPage() {
    return (
        <section className="medium-section">
            <Form onSubmit={postTeam}>
                <NameInput />
                <ImagePicker />
                <Input label="Photo Credit" name="photoCredit" />
                <LocationInputs />
                <TeamMemberInputs />
                <Text label="Team Description" name="description" />
            </Form>
        </section>
    )
}