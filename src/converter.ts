const formatDateToUTC = (date: Date): string => {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();
  const hour = date.getUTCHours();
  const minute = date.getUTCMinutes();
  const second = date.getUTCSeconds();

  return (
    year +
    '/' +
    appendZero(month) +
    '/' +
    appendZero(day) +
    ' ' +
    hour +
    ':' +
    appendZero(minute) +
    ':' +
    appendZero(second) +
    ' UTC'
  );
};
/**
 * @return {string}
 */
function appendZero(obj: number) {
  if (obj < 10) {
    return '0' + obj;
  } else {
    return obj;
  }
}
export { formatDateToUTC };
