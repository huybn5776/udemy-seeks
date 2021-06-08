export function parseTimeToSeconds(formattedTime: string): number {
  const [minutesStr, secondStr] = formattedTime.split(':');
  const seconds = +minutesStr * 60 + +secondStr;
  return roundSeconds(seconds);
}

export function roundSeconds(seconds: number): number {
  return Math.round(seconds * 100) / 100;
}
