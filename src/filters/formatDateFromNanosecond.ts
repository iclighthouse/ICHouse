import BigNumber from 'bignumber.js';
import { formatDateToUTC } from '@/converter';

export const formatDateFromNanosecond = (time: bigint): string => {
  if (time) {
    const date = new Date(Number(new BigNumber(time.toString()).div(1000000)));
    return formatDateToUTC(date);
  }
  return '';
};
export const formatDateFromSecondUTC = (timestamp: bigint): string => {
  if (timestamp) {
    return formatDateToUTC(new Date(Number(timestamp) * 1000));
  }
  return '';
};
