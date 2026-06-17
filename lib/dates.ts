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

export const getWeekdayOccurence = (date: Date | string) => {
    const dateObject = typeof date === 'string' ? newDate(date) : date;
    return Math.floor((dateObject.getDate() - 1) / 7) + 1;
}

export const isLastOfMonth = (date: Date | string): boolean => {
    const dateObject = typeof date === 'string' ? newDate(date) : date;
    const currentMonth = dateObject.getMonth();
    const nextMonth = addDays(new Date(dateObject), 7).getMonth();
    return currentMonth !== nextMonth;
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