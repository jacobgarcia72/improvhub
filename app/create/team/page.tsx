import { postTeam } from "@/actions";
import Form from "@/components/form/form";
import NameInput from "./name-input";
import ImagePicker from "@/components/form/image-picker";
import Autocomplete from "@/components/form/autocomplete";
import Text from "@/components/form/text";
import Checkbox from "@/components/form/checkbox";

export default function CreateTeamPage() {
    return (
        <section className="medium-section extra-padding">
            <Form onSubmit={postTeam}>
                <NameInput />
                <ImagePicker />
                <Autocomplete options={[]} label="Team Members" />
                <Autocomplete options={[]} label="Coach" />
                <Checkbox label="Looking for Coach" name="lookingForCoach" />
                <Text label="Team Description" name="description" />
            </Form>
        </section>
    )
}