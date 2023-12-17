import { Gas, TokenInfo } from '@/ic/common/icType';
import BigNumber from 'bignumber.js';

export const gasToString = (gas: Gas, tokenInfo: TokenInfo): string => {
  if (gas && tokenInfo) {
    const { token } = gas as { token: bigint };
    if (token) {
      return `${new BigNumber(token.toString())
        .div(10 ** tokenInfo.decimals)
        .toString(10)} ${tokenInfo.symbol}`;
    }
    const { cycles } = gas as { cycles: bigint };
    if (cycles) {
      return `${cycles} cycles`;
    }
    return 'noFee';
  }
  return '';
};
