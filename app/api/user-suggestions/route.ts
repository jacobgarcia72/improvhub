import { NextResponse } from "next/server";
import { getSuggestionsForTroupe } from "@/lib/troupes";
import { Role } from "@/types";

export async function GET(req: Request) {
    const url = new URL(req.url);
    const roleParam = url.searchParams.get('role') as Role | null;
    if (!roleParam) return NextResponse.json([], { status: 200 });
    const troupeParam = url.searchParams.get('troupe') as string | null;
    const users = await getSuggestionsForTroupe(roleParam, troupeParam);
    return NextResponse.json(users || []);
}
