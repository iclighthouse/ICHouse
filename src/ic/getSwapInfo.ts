import { AppId } from '@/ic/DRC205Proxy/model';
import { DRC205SwapService } from '@/ic/DRC205Swap/DRC205SwapService';
import { SwapInfo, TokenId } from '@/ic/common/icType';

export const getSwapInfo = async (appId: AppId): Promise<SwapInfo> => {
  const swapInfo: SwapInfo = {
    name: '',
    decimals: 0,
    token0: [{ Cycles: null }, { drc20: null }],
    token1: [{ Icp: null }, { drc20: null }],
    mmType: { AMM: null },
    feeRate: ''
  };
  const swapService = new DRC205SwapService(appId.toString());
  const promiseAllValue = [];
  promiseAllValue.push(
    await swapService.decimals(),
    await swapService.drc205_dexInfo()
  );
  const swap = await Promise.all(promiseAllValue);
  swapInfo.decimals = swap[0] || 0;
  try {
    swapInfo.feeRate = swap[1].feeRate;
    swapInfo.name = swap[1].pairName;
    swapInfo.mmType = swap[1].mmType;
    console.log(swap);
    if ((swap[1].token0[0] as { Token: TokenId }).Token) {
      swapInfo.token0 = [
        { Token: (swap[1].token0[0] as { Token: TokenId }).Token.toString() },
        swap[1].token0[1]
      ];
    } else {
      swapInfo.token0 = swap[1].token0;
    }
    if ((swap[1].token1[0] as { Token: TokenId }).Token) {
      swapInfo.token1 = [
        { Token: (swap[1].token1[0] as { Token: TokenId }).Token.toString() },
        swap[1].token1[1]
      ];
    } else {
      swapInfo.token1 = swap[1].token1;
    }
  } catch (e) {
    console.log(e);
  }
  return swapInfo;
};
