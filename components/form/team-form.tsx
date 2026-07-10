import { postTeam, updateTeamDetails } from "@/actions";
import Form from "@/components/form/form";
import NameInput from "./team-name-input";
import ImagePicker from "@/components/form/image-picker";
import Text from "@/components/form/text";
import LocationInputs from "@/components/form/location-inputs";
import Input from "@/components/form/input";
import CastingInputs from "@/components/form/casting-inputs";
import { Team } from "@/types";
import { redirect } from "next/navigation";

export default async function TeamForm({
    newTeam,
    team
} : {
    newTeam?: boolean;
    team?: Team;
}) {
    const onCancel = async () => {
        'use server'
        redirect(`/teams/${newTeam ? '' : team?.id}`);
    }
    return (
        <section className="medium-section">
            <Form
                onSubmit={newTeam ? postTeam : updateTeamDetails.bind(null, team?.id || '')}
                cancel={onCancel}>
                <NameInput value={team?.name} />
                <ImagePicker currentImage={team?.image} />
                <Input label="Photo Credit" name="photoCredit" value={team?.photoCredit || ''} />
                <LocationInputs
                    cityCaption="Where is your team based?"
                    theatreCaption="Where does your team perform (or hope to perform)?"
                    defaults={team || undefined}
                />
                {newTeam && <CastingInputs roles={['player', 'coach', 'musician']} creatorAsDefaultPlayer />}
                <Text label="Team Description" name="description" value={team?.description?.split('<br>').join('\n')} />
            </Form>
        </section>
    )
}
