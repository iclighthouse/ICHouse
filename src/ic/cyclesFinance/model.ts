import { Address, Time } from '@/ic/common/icType';

export interface FeeStatus {
  fee: string;
  cumulFee: {
    icpBalance: IcpE8s;
    cyclesBalance: CyclesAmount;
  };
  totalFee: {
    icpBalance: IcpE8s;
    cyclesBalance: CyclesAmount;
  };
}
export type IcpE8s = bigint;
export type CyclesAmount = bigint;
export interface CyclesFinanceLiquidity {
  icpE8s: IcpE8s;
  vol: Vol;
  shareWeighted: ShareWeighted;
  unitValue: [number, number];
  shares: bigint;
  cycles: bigint;
  priceWeighted: PriceWeighted;
  swapCount: bigint;
}
export interface Vol {
  swapIcpVol: bigint;
  swapCyclesVol: bigint;
}
export interface ShareWeighted {
  updateTime: Time;
  shareTimeWeighted: bigint;
}
export interface PriceWeighted {
  updateTime: Time;
  icpTimeWeighted: bigint;
  cyclesTimeWeighted: bigint;
}

export default interface Service {
  feeStatus(): Promise<FeeStatus>;
  liquidity(accountId: Array<Address>): Promise<CyclesFinanceLiquidity>;
}
