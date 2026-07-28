import { InputOptionObject, Theatre } from "@/types";
import { abbreviateState, getZipCodesWithinRange } from "./location";
import { supabaseAdmin } from './supabase-server';
import { camelCaseObject, removeLeadingArticles } from "./helper-functions";
import slugify from 'slugify';
import { createNewsFeedItem } from "./news";
import { theatres as mockDataTheatres } from "./mock-data";

export const populateTheatresInDb = async () => {
  for (let i = 0; i < mockDataTheatres.length; i++) {
    const { name, city, state, zipcode, website, image } = mockDataTheatres[i];
    if (!name) return;
    let id = name;
    if (mockDataTheatres.filter((t) => t.name === name).length > 1) {
      id += ` ${city}`;
    }
    await supabaseAdmin
      .from('theatres')
      .insert({
        id: slugify(removeLeadingArticles(id), { lower: true, trim: true, strict: true }),
        name,
        city,
        state,
        zipcode,
        website: website || null,
        image: image || null 
      });
  }
}

export const getAllTheatres = async (): Promise<InputOptionObject[]> => {
  const { data } = await supabaseAdmin
    .from('theatres')
    .select('*');
  return (data as Theatre[]).map(({ name, image, id }) => ({ text: name, image, id }));
}

export const getTheatre = async (idOrName: string): Promise<Theatre | null> => {
  const { data } = await supabaseAdmin
    .from('theatres')
    .select('*')
    .or(`id.eq.${idOrName},name.ilike.${idOrName}`)
    .maybeSingle();
  return data ? camelCaseObject(data) as Theatre : null;
}

export const getTheatresByCity = async (city: string, state: string, miles?: number): Promise<Theatre[]> => {
  const zipcodesInRange = miles ? getZipCodesWithinRange(`${city} ${state}`, miles) : [];
  const { data } = await supabaseAdmin
    .from('theatres')
    .select('*')
    .or(`and(state.ilike.${abbreviateState(state)},city.ilike.${city}),zipcode.in.(${zipcodesInRange.join(',')})`);
  return data ? data.map(camelCaseObject) as Theatre[] : [];
}

export const getTheatresByState = async (state: string): Promise<Theatre[]> => {
  const { data } = await supabaseAdmin
    .from('theatres')
    .select('*')
    .ilike('state', abbreviateState(state));
  return data ? data.map(camelCaseObject) as Theatre[] : [];
}

export const getTheatresByZipcode = async (zipcode: string, miles?: number): Promise<Theatre[]> => {
  const zipcodesInRange = miles ? getZipCodesWithinRange(zipcode, miles) : [zipcode];
  const { data } = await supabaseAdmin
    .from('theatres')
    .select('*')
    .in('zipcode', zipcodesInRange);
  return data ? data.map(camelCaseObject) as Theatre[] : [];
}

export async function saveTheatre(theatre: Theatre, userId: string): Promise<string> {
    const baseId = theatre.id;
    let theatreId = baseId;
    let counter = 1;
    let existingTheatre = await getTheatre(theatreId);
    while (existingTheatre) {
        counter++;
        theatreId = `${baseId}-${counter}`;
        existingTheatre = await getTheatre(theatreId);
    }
    theatre.id = theatreId;
    const { error: theatreInsertError } = await supabaseAdmin
        .from('theatres')
        .insert({
            id: theatre.id,
            name: theatre.name,
            image: theatre.image,
            address: theatre.address,
            city: theatre.city,
            state: theatre.state,
            zipcode: theatre.zipcode,
            website: theatre.website,
        });
    if (theatreInsertError) {
      console.error(theatreInsertError);
    } else if (theatre.city && theatre.state) {
      createNewsFeedItem('city', `${theatre.city} ${theatre.state}`, 'new_theatre', theatre.id, null, userId);
    }
    return theatre.id;
}

export async function updateTheatre(theatre: Theatre): Promise<string> {
    const { error } = await supabaseAdmin
        .from('theatres')
        .update({
            name: theatre.name,
            image: theatre.image,
            address: theatre.address,
            city: theatre.city,
            state: theatre.state,
            zipcode: theatre.zipcode,
            website: theatre.website,
        })
        .eq('id', theatre.id);
    if (error) console.error(error);
    return theatre.id;
}