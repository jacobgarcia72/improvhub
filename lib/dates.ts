// use to get new dates to avoid time zone issues
export const newDate = (dateAsString: string): Date => new Date(`${dateAsString} 00:00`);

export const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

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