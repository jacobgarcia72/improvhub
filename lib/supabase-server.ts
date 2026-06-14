import { createClient } from '@supabase/supabase-js';

let _supabaseAdmin: any | null = null;

function ensureSupabaseAdmin() {
    if (_supabaseAdmin) return _supabaseAdmin;
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
        throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable');
    }
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
        throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable');
    }
    _supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY,
        {
            auth: {
                persistSession: false,
                autoRefreshToken: false,
            }
        }
    );
    return _supabaseAdmin;
}

export const supabaseAdmin: any = new Proxy({}, {
    get(_target, prop: string) {
        const client = ensureSupabaseAdmin();
        const value = (client as any)[prop];
        if (typeof value === 'function') return value.bind(client);
        return value;
    }
});
