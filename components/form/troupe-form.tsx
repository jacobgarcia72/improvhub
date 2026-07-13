import { postTroupe, updateTroupeDetails } from "@/actions";
import Form from "@/components/form/form";
import NameInput from "./troupe-name-input";
import ImagePicker from "@/components/form/image-picker";
import Text from "@/components/form/text";
import LocationInputs from "@/components/form/location-inputs";
import Input from "@/components/form/input";
import CastingInputs from "@/components/form/casting-inputs";
import { Troupe } from "@/types";
import { redirect } from "next/navigation";

export default async function TroupeForm({
    newTroupe,
    troupe
} : {
    newTroupe?: boolean;
    troupe?: Troupe;
}) {
    const onCancel = async () => {
        'use server'
        redirect(`/troupes/${newTroupe ? '' : troupe?.id}`);
    }
    return (
        <section className="medium-section">
            <Form
                onSubmit={newTroupe ? postTroupe : updateTroupeDetails.bind(null, troupe?.id || '')}
                cancel={onCancel}>
                <NameInput value={troupe?.name} />
                <ImagePicker currentImage={troupe?.image} />
                <Input label="Photo Credit" name="photoCredit" value={troupe?.photoCredit || ''} />
                <LocationInputs
                    cityCaption="Where is your troupe based?"
                    theatreCaption="Where does your troupe perform (or hope to perform)?"
                    defaults={troupe || undefined}
                />
                {newTroupe && <CastingInputs roles={['player', 'coach', 'musician']} creatorAsDefaultPlayer />}
                <Text label="Troupe Description" name="description" value={troupe?.description?.split('<br>').join('\n')} />
            </Form>
        </section>
    )
}
