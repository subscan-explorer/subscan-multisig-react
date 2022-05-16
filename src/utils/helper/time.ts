export function formatDate(millis: string | number): string {
  return new Date(Number(millis)).toUTCString();
}
