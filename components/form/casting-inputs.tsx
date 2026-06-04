import Checkbox from "@/components/form/checkbox";
import InputList from "@/components/form/input-list";
import { optimizeImage } from "@/lib/cloudinary";
import { capitalize, pluralize } from "@/lib/helper-functions";
import { getAllTeams } from "@/lib/teams";
import { getAllUsers, getCurrentUser } from "@/lib/users";
import { Role } from "@/types";

export default async function CastingInputs({ roles, creatorAsDefaultPlayer }: { roles: (Role | 'team')[], creatorAsDefaultPlayer?: boolean }) {
    const user = await getCurrentUser();
    const allUsers = (await getAllUsers()).map(({ id, name, image}) => {
        return { id, image: image ? optimizeImage(image, 50, 50, 80, true, true) : undefined, text: name };
    });
    const allTeams = roles.includes('team') ? (
        await getAllTeams()).map(({ id, name, image}) => {
            return { id, image: image ? optimizeImage(image, 50, 50, 80, true, true) : undefined, text: name };
        }
    ) : [];
    const creatorOption = creatorAsDefaultPlayer ? allUsers.find((option) => option.id === user?.id) : null;
    return <div className="flex flex-col gap-4">
        {roles.map((role) => {
            const roleCap = capitalize(role);
            const label = pluralize(roleCap, ['player', 'director', 'team'].includes(role));
            let maybePlural = '';
            if (role === 'coach') maybePlural = '(es)';
            if (role === 'musician') maybePlural = '(s)';
            return (
                <div key={role} className="flex flex-col gap-2">
                    <p className="label">{`${label}${maybePlural}`}</p>
                    <Checkbox label={`Looking for ${label}${maybePlural}`} name={`lookingFor${label}`} />
                    <InputList
                        options={role === 'team' ? allTeams : allUsers}
                        name={role}
                        addLabel={roleCap}
                        startingOptions={(creatorOption && role === 'player') ? [creatorOption] : undefined}
                    />
                </div>
            )
        })}
    </div>
}