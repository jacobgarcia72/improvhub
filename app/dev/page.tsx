'use client'
import Checkbox from "@/components/form/checkbox";
import Form from "@/components/form/form";
import Input from "@/components/form/input";
import { handleDevFormSubmit } from "@/lib/dev-helpers";

export default function DevPage() {
    return (
        <section className="flex flex-col justify-center items-center">
            <Form onSubmit={handleDevFormSubmit} className="flex flex-col items-center justify-center align-center gap-4">
                <Input label="Create Dummy Users" type='number' name='users' placeholder="#" />
                <Input label="Create Dummy Troupes" type='number' name='troupes' placeholder="#" />
                <Checkbox name="create-theatres" label="Create Dummy Theatres" />
            </Form>
        </section>
    )
}