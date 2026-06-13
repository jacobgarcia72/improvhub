import { NextResponse } from "next/server";
import { getSuggestionsForTeam } from "@/lib/teams";
import { Role } from "@/types";

export async function GET(req: Request) {
    const url = new URL(req.url);
    const roleParam = url.searchParams.get('role') as Role | null;
    if (!roleParam) return NextResponse.json([], { status: 200 });
    const teamParam = url.searchParams.get('team') as string | null;
    if (!teamParam) return NextResponse.json([], { status: 200 });
    const users = await getSuggestionsForTeam(teamParam, roleParam);
    return NextResponse.json(users || []);
}
