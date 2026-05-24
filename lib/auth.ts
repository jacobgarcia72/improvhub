import { Lucia } from "lucia";
import { BetterSqlite3Adapter } from "@lucia-auth/adapter-sqlite";
import { usersDb as db} from "./db";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

const adapter = new BetterSqlite3Adapter(db, {
    user: 'users', // must match table name
    session: 'sessions'
});

const lucia = new Lucia(adapter, {
    sessionCookie: {
        expires: false,
        attributes: {
            secure: process.env.NODE_ENV === 'production'
        }
    }
});

export async function createAuthSession(userId: string) {
    const session = await lucia.createSession(userId, { });
    const sessionCookie = lucia.createSessionCookie(session.id);
    const { name, value, attributes } = sessionCookie;
    (await cookies()).set(name, value, attributes);
}

export async function verifyAuth() {
    const sessionCookie = (await cookies()).get(lucia.sessionCookieName);
    const sessionId = sessionCookie?.value;

    if (sessionId) {
        const result = await lucia.validateSession(sessionId);
        return result;
    } else {
        return {
            user: null,
            session: null
        }
    }
}

export async function isSignedIn(): Promise<boolean> {
    return Boolean((await verifyAuth()).user?.id);
}

export async function destroySession() {
    const { session } = await verifyAuth();
    if (!session) {
        return {
            error: 'Unauthorized'
        }
    }

    await lucia.invalidateSession(session.id);
    const sessionCookie = lucia.createBlankSessionCookie();
    const { name, value, attributes } = sessionCookie;
    (await cookies()).set(name, value, attributes);
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