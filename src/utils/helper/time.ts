import moment from 'moment';

export function formatDate(millis: string | number): string {
  const mom = moment(new Date(Number(millis)));

  return mom.format('YYYY-MM-DD HH:mm:ss UTC');
}
