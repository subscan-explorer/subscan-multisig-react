import moment from 'moment';

export function formatDate(millis: string | number, isSecord?: boolean): string {
  // eslint-disable-next-line no-magic-numbers
  const mom = moment(new Date(Number(isSecord ? parseInt(millis.toString(), 10) * 1000 : millis)));

  return mom.format('YYYY-MM-DD HH:mm:ss UTC');
}
