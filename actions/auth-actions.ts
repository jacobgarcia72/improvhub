'use server'

import { destroySession, verifyAuth } from "@/lib/auth";
import { uploadImage } from "@/lib/cloudinary";
import { saveUser, updateUser } from "@/lib/users";
import { supabaseAdmin } from "@/lib/supabase-server";
import { createSupabaseServerClient } from "@/lib/supabase-ssr";
import { User } from "@/types";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { isDevOrStaging } from "@/lib/app-info";

function isDuplicateAuthUserError(error: unknown): boolean {
    if (!error || typeof error !== 'object') return false;
    const message = 'message' in error && typeof error.message === 'string'
        ? error.message.toLowerCase()
        : '';
    const code = 'code' in error && typeof error.code === 'string'
        ? error.code
        : '';
    return code === 'email_exists' || code === 'user_already_exists' || message.includes('already');
}

function getErrorCode(error: unknown): string {
    return error && typeof error === 'object' && 'code' in error && typeof error.code === 'string'
        ? error.code
        : '';
}

function getErrorMessage(error: unknown): string {
    return error && typeof error === 'object' && 'message' in error && typeof error.message === 'string'
        ? error.message
        : String(error);
}

function getSignupErrorMessage(error: unknown): string {
    const code = getErrorCode(error);
    const message = getErrorMessage(error);
    const lowerMessage = message.toLowerCase();

    if (code === '23505' || lowerMessage.includes('duplicate key')) {
        if (lowerMessage.includes('users_pkey') || lowerMessage.includes('users_id')) {
            return 'Username is unavailable.';
        }
        if (lowerMessage.includes('users_uid')) {
            return 'That Supabase Auth user is already linked to a profile.';
        }
        return 'That account already exists.';
    }
    if ((code === '42703' || code === 'PGRST204') && lowerMessage.includes('uid')) {
        return 'The users.uid database migration has not been applied or Supabase needs its schema cache reloaded.';
    }
    if (code === '23503') {
        return 'Profile creation failed because a related database row was missing.';
    }
    if (code === '23502') {
        return 'Profile creation failed because a required database field was missing.';
    }

    if (isDevOrStaging) {
        return `Signup failed: ${code ? `${code} ` : ''}${message}`;
    }

    return 'Hmm, something went wrong. Try again later.';
}

async function getSiteUrl() {
    const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL;
    if (configuredUrl) return configuredUrl.replace(/\/$/, '');

    const headerStore = await headers();
    const host = headerStore.get('x-forwarded-host') || headerStore.get('host');
    if (!host) return 'http://localhost:3000';

    const protocol = headerStore.get('x-forwarded-proto') || 'http';
    return `${protocol}://${host}`;
}

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

    const { data: existingUsername, error: usernameError } = await supabaseAdmin
        .from('users')
        .select('id')
        .eq('id', username)
        .maybeSingle();
    if (usernameError) {
        console.error(usernameError);
        return { message: 'Unable to create your account right now.' };
    }
    if (existingUsername) return { message: 'Username is unavailable.' };

    let authUserId: string | null = null;
    let profileCreated = false;

    try {
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: {
                username,
                app_user_id: username,
                display_name: `${firstName} ${lastName}`
            },
        });

        if (authError || !authData.user) {
            console.error(authError);
            if (isDuplicateAuthUserError(authError)) {
                const supabase = await createSupabaseServerClient();
                const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (signInError || !signInData.user) {
                    return { message: 'Email is already in use.' };
                }

                const { data: existingProfile, error: profileLookupError } = await supabaseAdmin
                    .from('users')
                    .select('id')
                    .eq('uid', signInData.user.id)
                    .maybeSingle();
                if (profileLookupError) throw profileLookupError;
                if (existingProfile) return { message: 'Email is already in use.' };

                try {
                    await saveUser(user, signInData.user.id, userRoles);
                } catch (profileError) {
                    throw profileError;
                }
                profileCreated = true;
            } else {
                return { message: 'Unable to create your account right now.' };
            }
        }

        if (!profileCreated && authData.user) {
            authUserId = authData.user.id;

            try {
                await saveUser(user, authData.user.id, userRoles);
            } catch (profileError) {
                if (authUserId) {
                    const { error: cleanupError } = await supabaseAdmin.auth.admin.deleteUser(authUserId);
                    if (cleanupError) console.error('Failed to clean up Supabase Auth user after profile creation failed', cleanupError);
                }
                throw profileError;
            }

            const supabase = await createSupabaseServerClient();
            const { error: signInError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            if (signInError) {
                console.error(signInError);
                return { message: 'Your account was created, but sign-in failed. Try logging in.' };
            }
        }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error('Signup failed', error);
        return { message: getSignupErrorMessage(error) };
    }
    redirect(`/profile`);
}

export async function login(redirectRoute = '/', prevState: void | { message?: string }, formData: FormData) {
    const email = (formData.get('email') as string).trim().toLowerCase();
    const password = formData.get('password') as string;

    if (!email || !password) {
        return { message: 'Invalid credentials.' };
    }

    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error || !data.user) {
        return { message: 'Invalid credentials.' };
    }

    const { data: existingUser, error: userError } = await supabaseAdmin
        .from('users')
        .select('id')
        .eq('uid', data.user.id)
        .maybeSingle();

    if (userError) {
        console.error(userError);
        return { message: 'Invalid credentials.' };
    }

    if (!existingUser) {
        await supabase.auth.signOut();
        return { message: 'Your profile has not been set up yet.' };
    }

    redirect(redirectRoute);
}

export async function requestPasswordReset(prevState: void | { message?: string }, formData: FormData) {
    const email = (formData.get('email') as string).trim().toLowerCase();
    if (!email) return { message: 'Email is required' };

    const siteUrl = await getSiteUrl();
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${siteUrl}/auth/callback?next=/account/reset-password`,
    });

    if (error) {
        console.error(error);
        return { message: 'Unable to send a password reset email right now.' };
    }

    redirect('/login/forgot-password?sent=true');
}

export async function resetForgottenPassword(prevState: void | { message?: string }, formData: FormData) {
    const newPassword = formData.get('newPassword') as string;
    const confirmNewPassword = formData.get('confirmNewPassword') as string;

    if (!newPassword) return { message: 'New password is required' };
    if (newPassword.length < 8) return { message: 'New password must be at least 8 characters' };
    if (newPassword !== confirmNewPassword) return { message: 'New passwords do not match' };

    const supabase = await createSupabaseServerClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
        return { message: 'This reset link is invalid or has expired. Request a new reset email.' };
    }

    const { error } = await supabase.auth.updateUser({
        password: newPassword,
    });

    if (error) {
        console.error(error);
        return { message: 'Failed to update password' };
    }

    redirect('/account?passwordChanged=true');
}

export async function logout() {
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
    if (!user) return { message: 'User not found' };
    if (!user.uid) return { message: 'Unable to verify user' };

    // Get the user's email from Supabase
    const { data: { user: authUser }, error: authError } = await supabaseAdmin.auth.admin.getUserById(user.uid);
    if (authError || !authUser?.email) return { message: 'Unable to verify user' };

    // Verify current password by attempting sign in
    const supabase = await createSupabaseServerClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
        email: authUser.email,
        password: currentPassword,
    });

    if (signInError) return { message: 'Current password is incorrect' };

    // Update password using Supabase admin API
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(user.uid, {
        password: newPassword,
    });

    if (updateError) return { message: 'Failed to update password' };

    await supabase.auth.signInWithPassword({
        email: authUser.email,
        password: newPassword,
    });
    redirect('/account?passwordChanged=true');
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
