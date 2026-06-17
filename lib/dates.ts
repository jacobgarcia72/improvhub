// use to get new dates when there is no time to avoid time zone issues
export const newDate = (dateAsString: string): Date => new Date(`${dateAsString} 00:00`);

export const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const normalizeDateTime = (dateTime: string) => dateTime.replaceAll('%20', ' ').replaceAll('%3A', ':');

export const addOrdinal = (num: number) => `${num}${['st', 'nd', 'rd'][((num + 90) % 100 - 10) % 10 - 1] || 'th'}`;

export const addDays = (date: Date | string, days: number) => {
    const result = typeof date === 'string' ? newDate(date) : date;
    result.setDate(result.getDate() + days);
    return result;
}

export const getDayOfWeek = (date: Date) => weekdays[date.getDay()];

// export const getWeekdayOccurence = (date: Date | string) => {
//     const dateObject = typeof date === 'string' ? newDate(date) : date;
//     return Math.floor((dateObject.getDate() - 1) / 7) + 1;
// }

// export const isLastOfMonth = (date: Date | string): boolean => {
//     const dateObject = typeof date === 'string' ? newDate(date) : date;
//     const currentMonth = dateObject.getMonth();
//     const nextMonth = addDays(new Date(dateObject), 7).getMonth();
//     return currentMonth !== nextMonth;
// }

export function getWeekdayOccurence(dateTime: string | Date): number {
    let dayOfMonth: number;
    if (typeof dateTime === 'string') {
        const [, , day] = dateTime.split(/[ -]/).map(Number);
        dayOfMonth = day
    } else {
        dayOfMonth = dateTime.getDate();
    }
    return Math.floor((dayOfMonth - 1) / 7) + 1;
}

export function isLastOfMonth(dateTime: string | Date): boolean {
    let date: Date;
    if (typeof dateTime === 'string') {
        const [y, m, d] = dateTime.split(/[ -]/).map(Number);
        date = new Date(y, m - 1, d);
    } else {
        date = dateTime;
    }
    const nextWeek = new Date(date);
    nextWeek.setDate(nextWeek.getDate() + 7);
    return nextWeek.getMonth() !== date.getMonth();
}

export const findNextOrdinalWeekday = (date: Date | string, ordinals: number[]): Date => {
    const dateObject = typeof date === 'string' ? newDate(date) : date;
    do {
        addDays(dateObject, 7);
    } while (!ordinals.includes(getWeekdayOccurence(dateObject)));
    return dateObject;
}

export const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

export const formatTime = (time: string): string => {
    const [hour, minute] = time.split(':').map(Number);
    const ampm = hour >= 12 ? 'pm' : 'am';
    const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
    return `${formattedHour}:${minute.toString().padStart(2, '0')}${ampm}`;
}

export const formatDateForDisplay = (date: Date | string): string => {
    const dateObject = typeof date === 'string' ? newDate(date) : date;
    const month = dateObject.toLocaleString('default', { month: 'long' });
    const day = dateObject.getDate();
    const year = dateObject.getFullYear();
    const weekday = weekdays[dateObject.getDay()];
    return `${weekday}, ${month} ${(day)}${year !== new Date().getFullYear() ? `, ${year}` : ''}`;
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
    return dates.sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
}

export function dateMatchesRecurringSchedule(
    dateTime: string,
    recurringDay: number | null,
    cadence: string | null,
    recurringTime: string | null
): boolean {
    console.log({
        dateTime,
        recurringDay,
        cadence,
        recurringTime
    })
    if (recurringDay === null || recurringDay === undefined || !cadence) return false;
    const [dateString, time] = dateTime.split(' ');
    if (!dateString) return false;
    const [year, month, day] = dateString.split('-').map(Number);
    const weekday = new Date(year, month - 1, day).getDay();
    if (weekday !== Number(recurringDay)) return false;
    if (recurringTime && time !== recurringTime) return false;
    const occurrence = getWeekdayOccurence(dateTime);
    return cadence.includes(`${occurrence}`) || (cadence === 'last' && isLastOfMonth(dateTime));
}