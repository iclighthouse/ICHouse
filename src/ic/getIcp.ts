import BigNumber from 'bignumber.js';
import { LedgerService } from '@/ic/ledger/ledgerService';

const ledgerService = new LedgerService();
const decimals = 8;
export const getIcp = async (account: string): Promise<string> => {
  if (account) {
    try {
      const balanceRes = await ledgerService.getBalance(account);
      if (balanceRes?.e8s || Number(balanceRes?.e8s) === 0) {
        return (
          new BigNumber(balanceRes?.e8s.toString())
            .div(10 ** decimals)
            .toString(10) + ' ICP'
        );
      } else {
        return '-';
      }
    } catch (e) {
      return '-';
    }
  }
  return '-';
};
