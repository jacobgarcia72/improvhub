import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/users";
import { getOpenTroupes } from "@/lib/troupes";
import { Role } from "@/types";

export async function GET(req: Request) {
    const url = new URL(req.url);
    const roleParam = url.searchParams.get('role') as Role | null;
    if (!roleParam) return NextResponse.json([], { status: 200 });
    const user = await getCurrentUser();
    if (!user) return NextResponse.json([], { status: 200 });
    const troupes = await getOpenTroupes(user, roleParam);
    return NextResponse.json(troupes || []);
}
