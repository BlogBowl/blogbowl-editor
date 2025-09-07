import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import localizedFormat from 'dayjs/plugin/localizedFormat';

import relativeTime from 'dayjs/plugin/relativeTime';

// Extend dayjs with the relativeTime plugin
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(localizedFormat);
dayjs.extend(relativeTime);

// Function to get user's timezone
function getUserTimezone() {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

// Function to get user's locale
function getUserLocale() {
    return navigator.language || 'en';
}

// Function to format date in user's timezone and locale
export function formatUserDate(utcDate: string, format = 'L LT') {
    const userTimezone = getUserTimezone();
    const userLocale = getUserLocale();

    return dayjs
        .utc(utcDate)
        .tz(userTimezone)
        .locale(userLocale)
        .format(format);
}

export const formatDateToHistory = (date: string) => {
    const datejs = dayjs(date);

    return {
        title: datejs.fromNow(),
        formattedDate: formatUserDate(date, 'dddd, DD/MM/YYYY, HH:mm'),
    };
};

export const getUtcDateTime = (scheduledDate: Date, scheduledTime: string) => {
    const [hours, minutes] = scheduledTime
        .split(':')
        .map(numStr => parseInt(numStr));

    const scheduleDateWTime = dayjs(scheduledDate)
        .set('hours', hours)
        .set('minutes', minutes);

    return scheduleDateWTime.utc().toDate();
};
