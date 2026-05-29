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
import { getAllUsers, getCurrentUser } from "@/lib/users";
import { optimizeImage } from "@/lib/cloudinary";

export default async function CreateTeamPage() {
    const user = await getCurrentUser();
    const creatorName = `${user?.firstName} ${user?.lastName}`;
    const userImage = user?.image ? optimizeImage(user.image, 50, 50, 80, true, true) : undefined
    const allUsers = (await getAllUsers()).map(({ id, name, image}) => {
        return { id, image: image ? optimizeImage(image, 50, 50, 80, true, true) : undefined, text: name };
    });
    return (
        <section className="medium-section extra-padding">
            <Form onSubmit={postTeam}>
                <NameInput />
                <ImagePicker />
                <Input label="Photo Credit" name="photoCredit" />
                <LocationInputs />
                <div className="flex flex-col gap-2">
                    <p className="label">Players</p>
                    <input name="creator" className="hidden" value={user?.id} readOnly />
                    <Input name="creator-display" value={creatorName} disabled image={userImage} />
                    <InputList options={allUsers} name="player" addLabel="Player" />
                </div>
                <Checkbox label="Looking for Players" name="lookingForPlayers" />
                <div>
                    <p className="label pb-2">Coach</p>
                    <Autocomplete name="coach" options={allUsers} />
                </div>
                <Checkbox label="Looking for Coach" name="lookingForCoach" />
                <div>
                    <p className="label pb-2">Musician</p>
                    <Autocomplete name="musician" options={allUsers} />
                </div>
                <Checkbox label="Looking for Coach" name="lookingForCoach" />
                <Text label="Team Description" name="description" />
            </Form>
        </section>
    )
}