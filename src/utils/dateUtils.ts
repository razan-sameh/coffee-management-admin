// utils/dateUtils.ts
export const getDateOnly = (str?: string): Date | null => {
    if (!str) return null;
    const [datePart] = str.split(' ');
    return new Date(datePart);
};

export const isSameDay = (a: Date, b: Date): boolean =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

export const isSameMonth = (a: Date, b: Date): boolean =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth();

export const isSameYear = (a: Date, b: Date): boolean =>
    a.getFullYear() === b.getFullYear();
