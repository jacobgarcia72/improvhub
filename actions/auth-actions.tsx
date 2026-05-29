'use server'

import { createAuthSession, destroySession } from "@/lib/auth";
import { uploadImage } from "@/lib/cloudinary";
import { hashUserPassword, verifyPassword } from "@/lib/hash";
import { getUser, saveUser } from "@/lib/users";
import { User } from "@/types";
import { redirect } from "next/navigation";

export async function createUser(prevState: void | { message?: string }, formData: FormData) {
    const username = (formData.get('username') as string).trim().toLowerCase();
    const password = formData.get('password') as string;
    const firstName = formData.get('firstName') as string;

    if (!username) return { message: 'Username is required' };
    if (!password) return { message: 'Password is required' };
    if (password.length < 8) return { message: 'Password must be at least 8 characters' };
    if (!firstName) return { message: 'First Name is required' };

    const imageFile = formData.get('image') as File;
    let imageUrl = '';
    if (imageFile && imageFile.size) {
        if (imageFile.size > 5 * 1024 * 1024) { // 5MB limit
            return { message: 'Image file size exceeds 5MB limit' };
        }
        try {
            imageUrl = await uploadImage(imageFile, 'users');
        } catch {
            throw new Error('Image upload failed');
        }
    }
    const user: User = {
        id: username,
        password: hashUserPassword(password),
        joinDate: new Date().toISOString(),
        image: imageUrl,
        firstName,
        lastName: formData.get('lastName') as string,
        pronouns: formData.get('pronouns') as string,
    }

    try {
        await saveUser(user);
        await createAuthSession(username);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        if (error?.code && error.code.includes('CONSTRAINT')) {
            return { message: 'Username is unavailable.' }
        }
        console.error(error);
        return { message: 'Hmm, something went wrong. Try again later.'};
    }
    redirect(`/profile`);
}

export async function login(redirectRoute = '/', prevState: void | { message?: string }, formData: FormData) {
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    const existingUser = await getUser(username);

    if (!existingUser) {
        return { message: 'Invalid credentials.' }
    }

    const isValidPassword = verifyPassword(existingUser.password, password);

    if (!isValidPassword) {
        return { message: 'Invalid credentials.' }
    }

    await createAuthSession(existingUser.id);
    redirect(redirectRoute);
}

export async function logout() {
    await destroySession();
    redirect('/login');
}