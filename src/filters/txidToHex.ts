import { toHexString } from '@/ic/converter';

export const txidToHex = (val: Array<number>): string => {
  return toHexString(new Uint8Array(val));
};
