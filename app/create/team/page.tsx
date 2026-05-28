import { postTeam } from "@/actions";
import Form from "@/components/form/form";
import NameInput from "./name-input";
import ImagePicker from "@/components/form/image-picker";
import Autocomplete from "@/components/form/autocomplete";
import Text from "@/components/form/text";
import Checkbox from "@/components/form/checkbox";
import LocationInputs from "./location-inputs";
import InputList from "@/components/form/input-list";
import Input from "@/components/form/input";
import { getCurrentUser } from "@/lib/users";

export default async function CreateTeamPage() {
    const user = await getCurrentUser();
    const creatorName = `${user?.firstName} ${user?.lastName}`;
    return (
        <section className="medium-section extra-padding">
            <Form onSubmit={postTeam}>
                <NameInput />
                <ImagePicker />
                <LocationInputs />
                <div className="flex flex-col gap-2">
                    <p className="label">Team Members</p>
                    <Input name="creator" value={creatorName} disabled />
                    <InputList name="team-members" addLabel="Player" />
                </div>
                <Autocomplete options={[]} label="Coach" />
                <Checkbox label="Looking for Coach" name="lookingForCoach" />
                <Text label="Team Description" name="description" />
            </Form>
        </section>
    )
}