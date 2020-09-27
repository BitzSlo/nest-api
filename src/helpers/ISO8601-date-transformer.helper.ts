import * as moment from 'moment';

export function TransformDateToISO8601(date) {
  return date && moment.isDate(date)
    ? moment(date).format('YYYY-MM-DDTHH:mm:ssZ')
    : null;
}
