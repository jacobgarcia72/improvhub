import crypto from "node:crypto";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "./supabase-server";

const COOKIE_NAME = "improvhub_session";
const COOKIE_PATH = "/";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export async function createAuthSession(userId: string) {
    const sessionId = crypto.randomUUID();
    const expiresAt = Math.floor(Date.now() / 1000) + COOKIE_MAX_AGE;

    const { error } = await supabaseAdmin
        .from('sessions')
        .insert({ id: sessionId, user_id: userId, expires_at: expiresAt });
    if (error) throw error;

    (await cookies()).set(COOKIE_NAME, sessionId, {
        httpOnly: true,
        path: COOKIE_PATH,
        maxAge: COOKIE_MAX_AGE,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production'
    });
}

export async function verifyAuth() {
    const cookie = (await cookies()).get(COOKIE_NAME);
    const sessionId = cookie?.value;
    if (!sessionId) {
        return { user: null, session: null };
    }

    const { data: session, error: sessionError } = await supabaseAdmin
        .from('sessions')
        .select('*')
        .eq('id', sessionId)
        .maybeSingle();
    if (sessionError || !session || session.expires_at < Math.floor(Date.now() / 1000)) {
        return { user: null, session: null };
    }

    const { data: user, error: userError } = await supabaseAdmin
        .from('users')
        .select('*')
        .eq('id', session.user_id)
        .maybeSingle();
    if (userError || !user) {
        return { user: null, session: null };
    }

    return { user, session };
}

export async function isSignedIn(): Promise<boolean> {
    return Boolean((await verifyAuth()).user?.id);
}

export async function destroySession() {
    const { session } = await verifyAuth();
    if (!session) {
        return { error: 'Unauthorized' };
    }

    const { error } = await supabaseAdmin
        .from('sessions')
        .delete()
        .eq('id', session.id);
    if (error) throw error;

    (await cookies()).set(COOKIE_NAME, '', {
        httpOnly: true,
        path: COOKIE_PATH,
        maxAge: 0,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production'
    });
}

export async function protectRoute() {
    if (!(await isSignedIn())) {
        let currentPath = (await headers()).get('x-pathname') || '';
        if (currentPath.startsWith('/')) currentPath = currentPath.slice(1);
        let redirectPath = '/login';
        if (currentPath) redirectPath += `?reroute=${currentPath.replaceAll('/', '%2F')}`;
        redirect(redirectPath);
    }
}