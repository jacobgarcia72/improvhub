'use server';

import { InputOptionObject } from '@/types';
import { getTeamsByUser } from './teams';
import { getTheatre } from './theatres';
import { getUser } from './users';

export async function getChatRooms(userId: string): Promise<{
        theatres: InputOptionObject[],
        teams: InputOptionObject[]
    }> {
    const theatreStrings = (await getUser(userId))?.theatres || [];
    const theatres = (await Promise.all(theatreStrings.map(getTheatre))).filter((t) => t !== null);
    const theatreChatRooms = theatres.map(({ id, name, image }) => ({ id: `theatre-${id}`, text: name, image }));
    const teams = await getTeamsByUser(userId);
    const teamChatRooms = teams.map(({ id, name, image }) => ({ id: `team-${id}`, text: name, image: image || undefined }));
    return ({
        theatres: theatreChatRooms,
        teams: teamChatRooms
    });
}
