export default function getTimeDifference (date: Date) {
    const now = new Date();
    let dif = now.getTime() - date.getTime();

    const seconds = Math.floor(dif / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    const daysInYear = 365.25;
    const daysInMonth = 30.44; 

    const years = Math.floor(days / daysInYear);
    const months = Math.floor(days / daysInMonth);

    return {
        years,
        months,
        days,
        hours,
        minutes,
        seconds
    }
}