'use client'
import Form from "@/components/form/form";
import Input from "@/components/form/input";
import { handleDevFormSubmit } from "@/lib/dev-helpers";

export default function DevPage() {
    return (
        <section>
            <Form onSubmit={handleDevFormSubmit} className="flex flex-col items-center justify-center align-center gap-4">
                <Input label="Create Dummy Users" type='number' name='users' />
                <Input label="Create Dummy Troupes" type='number' name='troupes' />
            </Form>
        </section>
    )
}