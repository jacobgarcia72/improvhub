'use server'

import { createAuthSession, destroySession, verifyAuth } from "@/lib/auth";
import { uploadImage } from "@/lib/cloudinary";
import { hashUserPassword, verifyPassword } from "@/lib/hash";
import { getUser, saveUser, updatePassword, updateUser } from "@/lib/users";
import { supabase } from "@/lib/supabase";
import { supabaseAdmin } from "@/lib/supabase-server";
import { User } from "@/types";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createUser(prevState: void | { message?: string }, formData: FormData) {
    const username = (formData.get('username') as string).trim().toLowerCase();
    const password = formData.get('password') as string;
    const email = (formData.get('email') as string).trim().toLowerCase();
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;

    if (!username) return { message: 'Username is required' };
    if (!email) return { message: 'Email is required' };
    if (!password) return { message: 'Password is required' };
    if (password.length < 8) return { message: 'Password must be at least 8 characters' };
    if (!firstName) return { message: 'First Name is required' };
    if (!lastName) return { message: 'Last Name is required' };

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
        lastName,
        pronouns: formData.get('pronouns') as string,
    }
    const userRoles: { [role: string]: boolean } = { };
    ['player', 'tech', 'director', 'musician', 'coach'].forEach((role) => {
        userRoles[role] = Boolean(formData.get(role));
    });

    try {
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: {
                username,
                app_user_id: username,
            },
        });

        if (authError || !authData.user) {
            console.error(authError);
            return { message: 'Unable to create your account right now.' };
        }

        await saveUser(user, userRoles);
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
    const email = (formData.get('email') as string).trim().toLowerCase();
    const password = formData.get('password') as string;

    if (!email || !password) {
        return { message: 'Invalid credentials.' };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error || !data.user) {
        return { message: 'Invalid credentials.' };
    }

    const username = (data.user.user_metadata?.username as string | undefined)?.trim().toLowerCase()
        || (data.user.user_metadata?.app_user_id as string | undefined)?.trim().toLowerCase()
        || data.user.email?.split('@')[0] || '';

    const existingUser = await getUser(username, true);
    if (!existingUser) {
        return { message: 'Your profile has not been set up yet.' };
    }

    await createAuthSession(existingUser.id);
    redirect(redirectRoute);
}

export async function logout() {
    try {
        await supabase.auth.signOut();
    } catch {
        // Ignore Supabase sign-out issues and fall back to the local session cleanup.
    }
    await destroySession();
    redirect('/login');
}

export async function updateUserInfo(prevState: void | { message?: string }, formData: FormData, updateImage: boolean) {
    const firstName = (formData.get('firstName') as string).trim();
    const lastName = (formData.get('lastName') as string).trim();

    if (!firstName) return { message: 'First Name is required' };
    if (!lastName) return { message: 'Last Name is required' };
    const userUpdates: Partial<User> = {
        firstName,
        lastName,
        pronouns: formData.get('pronouns') as string,
    };
    if (updateImage) {
        const imageFile = formData.get('image') as File;
        if (imageFile && imageFile.size) {
            if (imageFile.size > 5 * 1024 * 1024) { // 5MB limit
                return { message: 'Image file size exceeds 5MB limit' };
            }
            try {
                userUpdates.image = await uploadImage(imageFile, 'users');
            } catch {
                throw new Error('Image upload failed');
            }
        }
    }
    const userRoles: { [role: string]: boolean } = { };
    ['player', 'tech', 'director', 'musician', 'coach'].forEach((role) => {
        userRoles[role] = Boolean(formData.get(role));
    });
    await updateUser(userUpdates, userRoles);
    revalidatePath(`/profile`, 'layout');
}
export async function updateUserPassword(prevState: void | { message?: string }, formData: FormData) {
    const currentPassword = formData.get('currentPassword') as string;
    const newPassword = formData.get('newPassword') as string;
    const confirmNewPassword = formData.get('confirmNewPassword') as string;

    if (!currentPassword) return { message: 'Current password is required' };
    if (!newPassword) return { message: 'New password is required' };
    if (newPassword.length < 8) return { message: 'New password must be at least 8 characters' };
    if (newPassword !== confirmNewPassword) return { message: 'New passwords do not match' };

    const user = (await verifyAuth()).user;
    if (!user || !user.password) return { message: 'User not found' };

    const isValidCurrentPassword = verifyPassword(user.password, currentPassword);

    if (!isValidCurrentPassword) return { message: 'Current password is incorrect' };

    const success = await updatePassword(user.id, hashUserPassword(newPassword));
    if (success) {
        await createAuthSession(user.id);
        redirect('/account?passwordChanged=true');
    }
}

export async function updateUserBio(prevState: void | { message?: string }, formData: FormData) {
    const bio = (formData.get('bio') as string).trim().replaceAll(/\r\n/g, '<br>').replaceAll(/\n/g, '<br>').replaceAll(/\r/g, '<br>');
    await updateUser({ bio });
    revalidatePath(`/profile`, 'layout');
}
export async function updateUserWebsite(prevState: void | { message?: string }, formData: FormData) {
    const website = (formData.get('website') as string).trim();
    await updateUser({ website });
    revalidatePath(`/profile`, 'layout');
}