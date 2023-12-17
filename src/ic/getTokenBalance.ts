import { Address, Icrc1Account, TokenStd } from '@/ic/common/icType';
import { DRC20TokenService } from '@/ic/DRC20Token/DRC20TokenService';
import RosettaApi from '@/ic/RosettaApi';
const rosettaApi = new RosettaApi();
export const getCompetitionsBalance = async (
  tokenStd: TokenStd,
  tokenId: string,
  account: [Icrc1Account, Address]
): Promise<string> => {
  const currentDRC20TokenService = new DRC20TokenService(tokenId);
  let balance = '0';
  const std = Object.keys(tokenStd)[0].toLocaleLowerCase();
  try {
    if (std === 'icp') {
      // const ledgerService = new LedgerService();
      // const balanceRes = await ledgerService.getBalance(account[1]);
      // if (balanceRes?.e8s || Number(balanceRes?.e8s) === 0) {
      //   balance = new BigNumber(balanceRes?.e8s.toString(10)).toString(10);
      // }
      const res = await rosettaApi.getAccountBalance(account[1]);
      balance = res.toString(10)
    }
    if (std === 'icrc1') {
      const res = await currentDRC20TokenService.icrc1_balance_of(account[0]);
      balance = res.toString(10);
    }
    if (std === 'drc20') {
      const res = await currentDRC20TokenService.drc20_balanceOf(account[1]);
      balance = res.toString(10);
    }
    if (std === 'dip20') {
      const res = await currentDRC20TokenService.balanceOf(account[0].owner);
      balance = res.toString(10);
    }
  } catch (e) {
    console.log(std, account[0]);
    console.log(e)
  }
  return balance;
};
