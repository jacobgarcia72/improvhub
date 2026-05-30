import Checkbox from "@/components/form/checkbox";
import InputList from "@/components/form/input-list";
import { optimizeImage } from "@/lib/cloudinary";
import { getAllUsers, getCurrentUser } from "@/lib/users";

export async function TeamMemberInputs() {
    const user = await getCurrentUser();
    const allUsers = (await getAllUsers()).map(({ id, name, image}) => {
        return { id, image: image ? optimizeImage(image, 50, 50, 80, true, true) : undefined, text: name };
    });
    const creatorOption = allUsers.find((option) => option.id === user?.id);
    return <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
            <p className="label">Players</p>
            <Checkbox label="Looking for Players" name="lookingForPlayers" />
            <InputList options={allUsers} name="player" addLabel="Player" startingOptions={creatorOption ? [creatorOption] : undefined} />
        </div>
        <div className="flex flex-col gap-2">
            <p className="label">Coach(es)</p>
            <Checkbox label="Looking for Coach" name="lookingForCoach" />
            <InputList options={allUsers} name="coach" addLabel="Coach" />
        </div>
        <div className="flex flex-col gap-2">
            <p className="label">Musician(s)</p>
            <Checkbox label="Looking for Musician" name="lookingForMusician" />
            <InputList options={allUsers} name="musician" addLabel="Musician" />
        </div>
    </div>
}