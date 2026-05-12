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

export const getWeekdayOccurence = (date: Date) => {
    return Math.floor((date.getDate() - 1) / 7) + 1;
}

const getNthWeekdayOfMonth = (year: number, month: number, weekday: number, ordinal: number): Date | null => {
    // Start at the 1st day of the specified month
    const date = new Date(year, month, 1);
    
    // Find the number of days to the first occurrence of that weekday
    // (Target Weekday - First Day Weekday + 7) % 7
    const daysToFirst = (weekday - date.getDay() + 7) % 7;
    
    // Calculate the target day of the month
    // 1 (start) + daysToFirst + (ordinal - 1) * 7
    const targetDay = 1 + daysToFirst + (ordinal - 1) * 7;
    
    date.setDate(targetDay);
    
    // Verify the date is still in the requested month (handles 5th occurrences)
    return date.getMonth() === month ? date : null;
}

export const findNextOrdinalWeekday = (date: Date | string): Date => {
    const dateObject = typeof date === 'string' ? newDate(date) : date;
    const dayOfWeekIndex = dateObject.getDay();
    const ordinal = getWeekdayOccurence(dateObject);
    let month = dateObject.getMonth();
    let year = dateObject.getFullYear();
    const incrementMonth = () => {
        month += 1;
        if (month === 12) {
            month = 0;
            year += 1;
        }
    }
    incrementMonth();
    let nextOccurrence: Date | null = null;
    do {
        nextOccurrence = getNthWeekdayOfMonth(year, month, dayOfWeekIndex, ordinal);
        if (!nextOccurrence) incrementMonth();
    } while (!nextOccurrence)
    return nextOccurrence || new Date();
}

export const formatDate = (date: Date): string => date.toISOString().split('T')[0];