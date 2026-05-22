import { Event } from "@/types";
import { addDays, formatDate, getWeekdayOccurence, isLastOfMonth, weekdayInitials } from "./dates";

export function validateInputValue(value: string, type: 'price' | 'zipcode' | 'username'): boolean {
        if (type === 'price') return /^\d*\.?\d?\d?$/.test(value);
        if (type === 'zipcode') return /^\d{0,5}$/.test(value);
        if (type === 'username') return /^[a-zA-Z0-9]{0,20}$/.test(value);
        return true;
}

export const filterArrayBySearchTerm = (options: string[], searchTerm: string, limit?: number): string[] => {
    const normalized = searchTerm.trim().toLowerCase();
    if (!normalized) {
        return options;
    }
    const results = options
        .filter((option) => option.toLowerCase().includes(normalized))
        .sort((a, b) => {
            const aStarts = a.toLowerCase().startsWith(normalized);
            const bStarts = b.toLowerCase().startsWith(normalized);
            const aIncludesWord = a.toLowerCase().includes(` ${normalized}`);
            const bIncludesWord = b.toLowerCase().includes(` ${normalized}`);
            if (aStarts && !bStarts) return -1;
            if (!aStarts && bStarts) return 1;
            if (aIncludesWord && !bIncludesWord) return -1;
            if (!aIncludesWord && bIncludesWord) return 1;
            return a.localeCompare(b);
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

export const arrangeEventsByDate = (events: Event[], startingDate?: string, limit: number = 30, maxDaysSearched = 365): {
    [date: string]: { time: string, event: Event }[]
} => {
    const date = startingDate ? new Date(startingDate) : new Date();
    const res: { [date: string]: { time: string, event: Event }[] } = { };
    let daysSearched = 0;
    while (Object.keys(res).length < limit && daysSearched < maxDaysSearched) {
        const dateString = formatDate(date);
        const dayOfWeek = weekdayInitials[date.getDay()];
        const eventsOnDate = events.filter((event) => event.dateTimes?.some((dt) => dt.includes(dateString)) || (
            event.recurringDay === dayOfWeek && (
                event.cadence?.includes(`${getWeekdayOccurence(dateString)}`) ||
                event.cadence === 'last' && (
                    isLastOfMonth(dateString)

                )
            )
        ));
        if (eventsOnDate.length) {
            res[dateString] = eventsOnDate.map((event) => {
                return {
                    event,
                    time: event.recurringTime || event.dateTimes?.find((dt) => dt.includes(dateString))?.split(' ')[1] || ''
                }
            }).sort((a, b) => {
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
