import { Event, InputOption, Showing } from "@/types";
import { addDays, formatDate, getWeekdayOccurence, isLastOfMonth } from "./dates";
import { isAState, separateCityAndState } from "./location";

export function validateInputValue(value: string, type: 'price' | 'zipcode' | 'username'): boolean {
    if (type === 'price') return /^\d*\.?\d?\d?$/.test(value);
    if (type === 'zipcode') return /^\d{0,5}$/.test(value);
    if (type === 'username') return /^[a-zA-Z0-9]{0,20}$/.test(value);
    return true;
}

export function matchPattern(value: string, type: 'zipcode' | 'city' | 'state'): boolean {
    if (type === 'zipcode') return /^\d{5}$/.test(value);
    if (type === 'city') {
        const { city, state } = separateCityAndState(value);
        return /^[a-zA-Z\s\-\']{2,50}$/.test(city) && isAState(state);
    }
    if (type === 'state') return isAState(value);
    return false;
}

export const pluralize = (word: string, pluralize: boolean | number = true): string => {
    if (pluralize === false || pluralize === 1) return word;
    if (word.slice(1) === 'erson') return word[0] + 'eople';
    if (word === 'Goose') return 'Geese';
    if (word === 'goose') return 'geese';
    const last = word[word.length - 1];
    const last2 = word.slice(word.length - 2);
    if (['io', 'eo', 'oo', 'uo'].includes(last2)) return `${word}s`;
    if (['o', 's', 'x', 'z'].includes(last)) return `${word}es`;
    if (['ch', 'sh', 'oy', 'uy'].includes(last2)) return `${word}es`;
    if (['ay', 'ey', 'oy', 'uy'].includes(last2)) return `${word}s`;
    if (last === 'y') return `${word.slice(0, word.length - 1)}ies`;
    return `${word}s`;
}

export const capitalize = (phrase: string): string => (
    phrase.split(' ').map((word) => word[0].toUpperCase() + word.slice(1)).join(' ')
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getRandomElements(array: any[], x: number): any[] {
    if (x > array.length) x = array.length;

    const shuffled = [...array];

    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled.slice(0, x);
}

export const getText = (option: InputOption): string => typeof option === 'string' ? option : option.text;
export const filterArrayBySearchTerm = (
    options: InputOption[], searchTerm: string, limit?: number
): InputOption[] => {
    const normalized = searchTerm.trim().toLowerCase();
    if (!normalized) {
        return options;
    }
    const results: InputOption[] = options
        .filter((option) => getText(option).toLowerCase().includes(normalized))
        .sort((a, b) => {
            const aStarts = getText(a).toLowerCase().startsWith(normalized);
            const bStarts = getText(b).toLowerCase().startsWith(normalized);
            const aIncludesWord = getText(a).toLowerCase().includes(` ${normalized}`);
            const bIncludesWord = getText(b).toLowerCase().includes(` ${normalized}`);
            if (aStarts && !bStarts) return -1;
            if (!aStarts && bStarts) return 1;
            if (aIncludesWord && !bIncludesWord) return -1;
            if (!aIncludesWord && bIncludesWord) return 1;
            return getText(a).localeCompare(getText(b));
        });
    if (limit) {
        return results.slice(0, limit);
    } else {
        return results;
    }
}

export const getRandomNumberString = (digits: number): string => {
    return Array.from({ length: digits }, () => Math.floor(Math.random() * 10)).join('');
};

export const removeLeadingArticles = (text: string): string => {
    let result = text;
    const articles = ['a', 'an', 'the'];
    for (let index = 0; index < articles.length; index++) {
        const article = articles[index];
        if (result.toLowerCase().startsWith(`${article} `)) {
            result = result.slice(article.length + 1);
            break;
        }   
    }
    return result;
}

export const arrangeEventsByDate = (showings: Showing[], shows: Event[], startingDate?: string, limit: number = 30, maxDaysSearched = 365): {
    [date: string]: { time: string, event: Event }[]
} => {
    const date = startingDate ? new Date(startingDate) : new Date();
    const res: { [date: string]: { time: string, event: Event }[] } = { };
    let daysSearched = 0;
    while (Object.keys(res).length < limit && daysSearched < maxDaysSearched) {
        const dateString = formatDate(date);
        const dayOfWeek = date.getDay();
        const scheduledShowingsOnDate = showings.filter(({dateTime}) => {
            const date = dateTime.split(' ')[0];
            return date === dateString
        })
        const recurringShowsOnDate = shows.filter((show) => (
            show.recurringDay === dayOfWeek && (
                show.cadence?.includes(`${getWeekdayOccurence(dateString)}`) ||
                show.cadence === 'last' && isLastOfMonth(dateString)
            )
        ));
        if (scheduledShowingsOnDate.length || recurringShowsOnDate.length) {
            res[dateString] = scheduledShowingsOnDate
                .map(({ dateTime, eventId }) => {
                    const event = shows.find((show) => show.id === eventId);
                    if (!event) return null;
                    return { event, time: dateTime?.split(' ')[1] }
                })
                .concat(
                    recurringShowsOnDate.map((event) => {
                        if (!event.recurringTime) return null;
                        return {
                            event,
                            time: event.recurringTime
                        }
                    })
                )
                .filter((event) => event !== null)
                .concat()
                .sort((a, b) => {
                    const [aHours, aMinutes] = a.time.split(':').map(Number);
                    const [bHours, bMinutes] = b.time.split(':').map(Number);
                    return (aHours * 60 + aMinutes) - (bHours * 60 + bMinutes);
                });
        }
        addDays(date, 1);
        daysSearched++;
    }
    return res;
}

export const toSnakeCase = (key: string): string => key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
export const toCamelCase = (key: string): string => key.toLowerCase().replace(/_([a-z0-9])/g, (_, char) => char.toUpperCase());
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const snakeCaseObject = (data: { [key: string]: any }) => {
// eslint-disable-next-line @typescript-eslint/no-explicit-any
    return Object.keys(data).reduce((result: { [key: string]: any }, key) => {
        result[toSnakeCase(key)] = data[key];
        return result;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
    }, {} as { [key: string]: any });
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const camelCaseObject = (data: { [key: string]: any }) => {
// eslint-disable-next-line @typescript-eslint/no-explicit-any
    return Object.keys(data).reduce((result: { [key: string]: any }, key) => {
        result[toCamelCase(key)] = data[key];
        return result;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
    }, {} as { [key: string]: any });
};