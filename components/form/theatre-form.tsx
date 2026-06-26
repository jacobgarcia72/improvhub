import { postTheatre } from "@/actions";
import Form from "@/components/form/form";
import ImagePicker from "@/components/form/image-picker";
import Input from "@/components/form/input";
import { Theatre } from "@/types";
import StateSelect from "./state-select";
import { redirect } from "next/navigation";

export default async function TheatreForm({
    theatre
} : {
    theatre?: Theatre;
}) {
    const handleCancel = async () => {
        'use server';
        redirect(theatre ? `/theatres/${theatre.id}` : '/create');
    }
    return (
        <section className="medium-section">
            <Form onSubmit={postTheatre.bind(null, theatre || null)} cancel={handleCancel}>
                <Input required name="name" label="Name" value={theatre?.name} />
                <ImagePicker currentImage={theatre?.image} label="Logo" square />
                <Input label="Address"
                    name="address"
                    value={theatre?.address}
                />
                <div className="flex flex-row flex-wrap gap-2">
                    <div className="w-54">
                        <Input
                            label="City"
                            required
                            name="city"
                            value={theatre?.city}
                        />
                    </div>
                    <div>
                        <StateSelect
                            required
                            name="state"
                            value={theatre?.state}
                        />
                    </div>
                    <div className="w-40">
                        <Input
                            label="ZIP Code"
                            required
                            name="zipcode"
                            value={theatre?.zipcode}
                            type="zipcode"
                        />
                    </div>
                </div>
                <Input label="Website"
                    name="website"
                    value={theatre?.website}
                    type="url"
                />
            </Form>
        </section>
    )
}
