import { Icrc1Account } from '@/ic/common/icType';
import { AccountPrincipalMapService } from '@/ic/AccountPrincipalMap/AccountPrincipalMapService';
const accountPrincipalMapService = new AccountPrincipalMapService();

export const fromAccountId = async (
  accountId: Array<number>
): Promise<Icrc1Account> => {
  const res = await accountPrincipalMapService.fromAccountId(accountId);
  if (res && res.length) {
    const subaccount = res[0].subaccount;
    if (subaccount && subaccount.length) {
      const flag = subaccount[0].every((item) => {
        return item === 0;
      });
      if (flag) {
        res[0].subaccount = [];
      }
    }
    return res[0];
  }
  return null;
};
