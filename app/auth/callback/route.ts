import { createSupabaseServerClient } from "@/lib/supabase-ssr";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');
    const nextParam = requestUrl.searchParams.get('next') || '/';
    const next = nextParam.startsWith('/') && !nextParam.startsWith('//') ? nextParam : '/';

    if (code) {
        const supabase = await createSupabaseServerClient();
        const { error } = await supabase.auth.exchangeCodeForSession(code);

        if (!error) {
            return NextResponse.redirect(new URL(next, requestUrl.origin));
        }
    }

    return NextResponse.redirect(new URL('/login/forgot-password?error=invalid-link', requestUrl.origin));
}
