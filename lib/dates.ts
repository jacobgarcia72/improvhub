import { WeekdayInitial } from "@/types";

// use to get new dates to avoid time zone issues
export const newDate = (dateAsString: string): Date => new Date(`${dateAsString} 00:00`);

export const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const weekdayInitials: WeekdayInitial[] = ['u', 'm', 't', 'w', 'r', 'f', 's']

export const addOrdinal = (num: number) => `${num}${['st', 'nd', 'rd'][((num + 90) % 100 - 10) % 10 - 1] || 'th'}`;

export const addDays = (date: Date | string, days: number) => {
    const result = typeof date === 'string' ? new Date(date) : date;
    result.setDate(result.getDate() + days);
    return result;
}

export const getDayOfWeek = (date: Date) => weekdays[date.getDay()];

export const getWeekdayOccurence = (date: Date | string) => {
    const dateObject = typeof date === 'string' ? newDate(date) : date;
    return Math.floor((dateObject.getDate() - 1) / 7) + 1;
}

export const findNextOrdinalWeekday = (date: Date | string, ordinals: number[]): Date => {
    const dateObject = typeof date === 'string' ? newDate(date) : date;
    do {
        addDays(dateObject, 7);
    } while (!ordinals.includes(getWeekdayOccurence(dateObject)));
    return dateObject;
}

export const formatDate = (date: Date): string => date.toISOString().split('T')[0];

export const formatTime = (time: string): string => {
    const [hour, minute] = time.split(':').map(Number);
    const ampm = hour >= 12 ? 'pm' : 'am';
    const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
    return `${formattedHour}:${minute.toString().padStart(2, '0')}${ampm}`;
}

export const formatDateTimeForDisplay = (date: Date | string): string => {
    const dateObject = typeof date === 'string' ? new Date(date) : date;
    const month = dateObject.toLocaleString('default', { month: 'long' });
    const day = dateObject.getDate();
    const year = dateObject.getFullYear();
    const time = dateObject.toLocaleTimeString([], { hour:'numeric', minute: '2-digit' });
    return `${month} ${(day)}${year !== new Date().getFullYear() ? `, ${year}` : ''}, ${time}`;
}

export const removePastDates = (dates: string[]): string[] => {
    const today = new Date();
    return dates.filter(date => new Date(date) >= today);
}

export const sortDates = (dates: string[]): string[] => {
    return dates.sort((a, b) => newDate(a).getTime() - newDate(b).getTime());
}