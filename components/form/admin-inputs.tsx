import InputList from "@/components/form/input-list";
import { optimizeImage } from "@/lib/optimize-image";
import { getAllUsersAbbreviated, getUserAbbreviated } from "@/lib/users";
import Form from "./form";

export default async function AdminsInputs({
    currentAdmins,
    onSubmit,
    cancel
}: {
    currentAdmins: string[],
    onSubmit: (prevState: void | { message?: string }, formData: FormData) => Promise<{ message?: string } | void>,
    cancel?: () => void
}) {
    const allUsers = (await getAllUsersAbbreviated()).map(({ id, name, image}) => {
        return { id, image: image ? optimizeImage(image, 50, 50, 80, true, true) : undefined, text: name };
    });
    const startingOptions = (await Promise.all(
        currentAdmins.map((admin) => getUserAbbreviated(admin))
    ))
    .filter((admin) => admin !== null)
    .map(({ id, name, image }) => ({ text: name, id, image }))

    return (
        <Form
            onSubmit={onSubmit}
            cancel={cancel}
            className="flex flex-col gap-1"
        >
            <InputList
                options={allUsers}
                name="admin"
                addLabel="Admin"
                startingOptions={startingOptions}
            />
        </Form>
    )
}
