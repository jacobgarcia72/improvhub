import Checkbox from "@/components/form/checkbox";
import InputList from "@/components/form/input-list";
import { optimizeImage } from "@/lib/optimize-image";
import { capitalize, pluralize } from "@/lib/helper-functions";
import { getAllTroupes } from "@/lib/troupes";
import { getAllUsersAbbreviated, getCurrentUserId } from "@/lib/users";
import { CastMember, Role } from "@/types";

export default async function CastingInputs({
    roles,
    currentCast,
    lookingFors,
    creatorAsDefaultPlayer
}: {
    roles: (Role | 'troupe')[],
    currentCast?: CastMember[],
    lookingFors?: Partial<Record<`lookingFor${string}`, boolean>>,
    creatorAsDefaultPlayer?: boolean
}) {
    const userId = await getCurrentUserId();
    const allUsers = (await getAllUsersAbbreviated()).map(({ id, name, image}) => {
        return { id, image: image ? optimizeImage(image, 50, 50, 80, true, true) : undefined, text: name };
    });
    const allTroupes = roles.includes('troupe') ? (
        await getAllTroupes()).map(({ id, name, image}) => {
            return { id, image: image ? optimizeImage(image, 50, 50, 80, true, true) : undefined, text: name };
        }
    ) : [];
    const creatorOption = creatorAsDefaultPlayer ? allUsers.find((option) => option.id === userId) : null;
    return <div className="flex flex-col gap-4">
        {roles.map((role) => {
            const roleCap = capitalize(role);
            const label = pluralize(roleCap, ['player', 'director', 'troupe'].includes(role));
            let maybePlural = '';
            if (role === 'coach') maybePlural = '(es)';
            if (role === 'musician') maybePlural = '(s)';
            let startingOptions;
            if (currentCast) {
                startingOptions = currentCast
                    .filter((c) => c.role === role)
                    .map((c) => typeof c === 'string' ? c : (role === 'troupe' ? allTroupes : allUsers).find((troupeOrUser) => troupeOrUser.id === c.id) || c.name);
            } else if (creatorOption && role === 'player') {
                startingOptions = [creatorOption];
            }
            return (
                <div key={role} className="flex flex-col gap-2">
                    <p className="label">{`${label}${maybePlural}`}</p>
                    <Checkbox
                        label={`Looking for ${label}${maybePlural}`}
                        name={`lookingFor${label}`}
                        defaultChecked={lookingFors?.[`lookingFor${label}`]}
                    />
                    <InputList
                        options={role === 'troupe' ? allTroupes : allUsers}
                        name={role}
                        addLabel={roleCap}
                        startingOptions={startingOptions}
                    />
                </div>
            )
        })}
    </div>
}
