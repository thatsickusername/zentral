export function displayDuration(secondsInput: number): string {
    const totalSeconds = Math.floor(secondsInput); // Remove decimals
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const parts: string[] = [];
    if (hours > 0) parts.push(`${hours}hr`);
    if (minutes > 0) parts.push(`${minutes}min`);
    if (hours < 0 && seconds > 0 || parts.length === 0) parts.push(`${seconds}s`);

    return parts.join(' ');
}