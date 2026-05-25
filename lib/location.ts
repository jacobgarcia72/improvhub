import zipcodes from 'zipcodes';
import { validateInputValue } from './helper-functions';

export function getZipCodesWithinRange(cityOrZip: string, radius: number) {
    let originZipcodes = [];

    if (validateInputValue(cityOrZip, 'zipcode')) {
        originZipcodes = [ cityOrZip ];
    } else {
        const { city, state } = separateCityAndState(cityOrZip);
        originZipcodes = zipcodes.lookupByName(city, state).map((z) => z.zip);
    }

    if (!radius) return originZipcodes;

    const zipcodesInRange = [...new Set(
        originZipcodes
            .map((z) => (
                zipcodes.radius(z, radius).map((z) => typeof z === 'string' ? z : z.zip)
            ))
            .flat()
        )].sort((z) => originZipcodes.includes(z) ? -1 : 1);
    return zipcodesInRange;
}

export function separateCityAndState(cityAndState: string): { city: string, state: string } {
    const split = cityAndState.trim().replaceAll(',', '') .split(' ');
    const state = split[split.length - 1];
    const city = split.slice(0, split.length - 1).join(' ');
    return { city, state: abbreviateState(state) };
}

export const states: { name: string, abbreviation: string }[] = [
    { name: 'Alabama', abbreviation: 'AL' },
    { name: 'Alaska', abbreviation: 'AK' },
    { name: 'Arizona', abbreviation: 'AZ' },
    { name: 'Arkansas', abbreviation: 'AR' },
    { name: 'California', abbreviation: 'CA' },
    { name: 'Colorado', abbreviation: 'CO' },
    { name: 'Connecticut', abbreviation: 'CT' },
    { name: 'Delaware', abbreviation: 'DE' },
    { name: 'Florida', abbreviation: 'FL' },
    { name: 'Georgia', abbreviation: 'GA' },
    { name: 'Hawaii', abbreviation: 'HI' },
    { name: 'Idaho', abbreviation: 'ID' },
    { name: 'Illinois', abbreviation: 'IL' },
    { name: 'Indiana', abbreviation: 'IN' },
    { name: 'Iowa', abbreviation: 'IA' },
    { name: 'Kansas', abbreviation: 'KS' },
    { name: 'Kentucky', abbreviation: 'KY' },
    { name: 'Louisiana', abbreviation: 'LA' },
    { name: 'Maine', abbreviation: 'ME' },
    { name: 'Maryland', abbreviation: 'MD' },
    { name: 'Massachusetts', abbreviation: 'MA' },
    { name: 'Michigan', abbreviation: 'MI' },
    { name: 'Minnesota', abbreviation: 'MN' },
    { name: 'Mississippi', abbreviation: 'MS' },
    { name: 'Missouri', abbreviation: 'MO' },
    { name: 'Montana', abbreviation: 'MT' },
    { name: 'Nebraska', abbreviation: 'NE' },
    { name: 'Nevada', abbreviation: 'NV' },
    { name: 'New Hampshire', abbreviation: 'NH' },
    { name: 'New Jersey', abbreviation: 'NJ' },
    { name: 'New Mexico', abbreviation: 'NM' },
    { name: 'New York', abbreviation: 'NY' },
    { name: 'North Carolina', abbreviation: 'NC' },
    { name: 'North Dakota', abbreviation: 'ND' },
    { name: 'Ohio', abbreviation: 'OH' },
    { name: 'Oklahoma', abbreviation: 'OK' },
    { name: 'Oregon', abbreviation: 'OR' },
    { name: 'Pennsylvania', abbreviation: 'PA' },
    { name: 'Rhode Island', abbreviation: 'RI' },
    { name: 'South Carolina', abbreviation: 'SC' },
    { name: 'South Dakota', abbreviation: 'SD' },
    { name: 'Tennessee', abbreviation: 'TN' },
    { name: 'Texas', abbreviation: 'TX' },
    { name: 'Utah', abbreviation: 'UT' },
    { name: 'Vermont', abbreviation: 'VT' },
    { name: 'Virginia', abbreviation: 'VA' },
    { name: 'Washington', abbreviation: 'WA' },
    { name: 'West Virginia', abbreviation: 'WV' },
    { name: 'Wisconsin', abbreviation: 'WI' },
    { name: 'Wyoming', abbreviation: 'WY' },
];

export const isAState = (text: string): boolean => {
    const lc = text.toLowerCase();
    return Boolean(states.find((state) => (
        state.name.toLowerCase() === lc || 
        state.abbreviation.toLowerCase() === lc
    )));
}

export const abbreviateState = (state: string): string => {
    const lc = state.toLowerCase();
    if (Boolean(states.find((s) => s.abbreviation.toLowerCase() === lc))) return state;
    return states.find((s) => s.name.toLowerCase() === lc)?.abbreviation || '';
}