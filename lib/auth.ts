import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "./supabase-ssr";
import { supabaseAdmin } from "./supabase-server";

export async function verifyAuth() {
    const supabase = await createSupabaseServerClient();
    const { data: authData, error: authError } = await supabase.auth.getClaims();

    if (authError || !authData?.claims?.sub) {
        return { user: null, session: null };
    }

    const { data: user, error: userError } = await supabaseAdmin
        .from('users')
        .select('*')
        .eq('uid', authData.claims.sub)
        .maybeSingle();

    if (userError || !user) {
        return { user: null, session: null };
    }

    return { user, session: { claims: authData.claims } };
}

export async function isSignedIn(): Promise<boolean> {
    return Boolean((await verifyAuth()).user?.id);
}

export async function destroySession() {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
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
