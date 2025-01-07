export const timeValues = [
    60,            // 1 minute
    300,           // 5 minutes
    600,           // 10 minutes
    1800,          // 30 minutes
    3600,          // 1 hour
    7200,          // 2 hours
    14400,         // 4 hours
    28800,         // 8 hours
    43200,         // 12 hours
    86400,         // 1 day
    172800,        // 2 days
    345600,        // 4 days
    604800,        // 1 week
    1209600,       // 2 weeks
    2592000,       // 30 days (approx. 1 month)
  ];
  
export function formatTime(seconds: number): string {
    if (seconds < 60) return `${seconds} ${seconds === 1 ? 'second' : 'seconds'}`;
    if (seconds < 3600) {
        const minutes = Math.floor(seconds / 60);
        return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`;
    }
    if (seconds < 86400) {
        const hours = Math.floor(seconds / 3600);
        return `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
    }
    const days = Math.floor(seconds / 86400);
    return `${days} ${days === 1 ? 'day' : 'days'}`;
}