import Checkbox from "@/components/form/checkbox";
import Input from "@/components/form/input";
import InputList from "@/components/form/input-list";
import { optimizeImage } from "@/lib/cloudinary";
import { getAllUsers, getCurrentUser } from "@/lib/users";

export async function TeamMemberInputs() {
    const user = await getCurrentUser();
    const creatorName = `${user?.firstName} ${user?.lastName}`;
    const userImage = user?.image ? optimizeImage(user.image, 50, 50, 80, true, true) : undefined
    const allUsers = (await getAllUsers()).map(({ id, name, image}) => {
        return { id, image: image ? optimizeImage(image, 50, 50, 80, true, true) : undefined, text: name };
    });
    const usersMinusCreator = allUsers.filter((option) => option.id !== user?.id);
    return <>
        <div className="flex flex-col gap-2">
            <p className="label">Players</p>
            <input name="creator" className="hidden" value={user?.id} readOnly />
            <Input name="creator-display" value={creatorName} disabled image={userImage} />
            <InputList options={usersMinusCreator} name="player" addLabel="Player" />
        </div>
        <Checkbox label="Looking for Players" name="lookingForPlayers" />
        <div>
            <p className="label pb-2">Coach</p>
            <InputList options={allUsers} name="coach" addLabel="Coach" />
        </div>
        <Checkbox label="Looking for Coach" name="lookingForCoach" />
        <div>
            <p className="label pb-2">Musician</p>
            <InputList options={allUsers} name="musician" addLabel="Musician" />
        </div>
        <Checkbox label="Looking for Musician" name="lookingForMusician" />
    </>
}