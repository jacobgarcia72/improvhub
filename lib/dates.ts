export const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const addOrdinal = (num: number) => `${num}${['st', 'nd', 'rd'][((num + 90) % 100 - 10) % 10 - 1] || 'th'}`;

export const addDays = (date: Date | string, days: number) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}