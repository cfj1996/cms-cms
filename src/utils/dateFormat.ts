import moment from 'moment';

export const dateFormat = function (timeStr: number | string | Date) {
  const date = new Date(timeStr);
  if (moment(date).isValid()) {
    return moment(date).format('yyyy-MM-DD HH:mm:ss');
  }
  return '--';
};
