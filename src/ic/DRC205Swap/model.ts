import { Address, Decimals, Time, TokenId, Txid } from '@/ic/common/icType';
import { TxnRecord } from '@/ic/DRC205Bucket/model';
import { Principal } from '@dfinity/principal/lib/cjs';
export type TokenType = { Icp: null } | { Cycles: null } | { Token: TokenId };
export type TokenStd =
  | { dft: null }
  | { icp: null }
  | { other: null }
  | { cycles: null }
  | { dip20: null }
  | { drc20: null }
  | { icrc1: null };
export interface FeeStatus {
  feeRate: string;
  feeBalance: FeeBalance;
  totalFee: FeeBalance;
}
export type FeeBalance = { value0: Amount; value1: Amount };
export type Amount = bigint;
export interface Liquidity {
  vol: Vol;
  shares: Shares;
  shareWeighted: ShareWeighted;
  unitValue: [Amount, Amount];
  value0: Amount;
  value1: Amount;
  priceWeighted: PriceWeighted;
  swapCount: bigint;
}
export interface Vol {
  value0: Amount;
  value1: Amount;
}
export type Shares = bigint;
export interface ShareWeighted {
  updateTime: Time;
  shareTimeWeighted: bigint;
}
export interface PriceWeighted {
  updateTime: Time;
  token1TimeWeighted: bigint;
  token0TimeWeighted: bigint;
}
export interface DexInfo {
  feeRate: string;
  mmType: { AMM: null } | { OrderBook: null };
  token0: [TokenType, TokenStd];
  token1: [TokenType, TokenStd];
  pairName: string;
  dexName: string;
  canisterId: TokenId;
}
export interface KBar {
  kid: bigint;
  low: bigint;
  vol: Vol;
  high: bigint;
  close: bigint;
  open: bigint;
  updatedTs: bigint;
}
export interface DexSetting {
  TRADING_FEE: bigint;
  UNIT_SIZE: bigint;
  FEE_TO: Array<number>;
  ICP_FEE: bigint;
}
export interface Icrc1Account {
  owner: Principal;
  subaccount: Array<Array<number>>;
}

export default interface Service {
  name(): Promise<string>;
  decimals(): Promise<Decimals>;
  token0(): Promise<[TokenType, Array<TokenStd>]>;
  token1(): Promise<[TokenType, Array<TokenStd>]>;
  feeStatus(): Promise<FeeStatus>;
  liquidity(address: Array<Address>): Promise<Liquidity>;
  drc205_events(address: Array<Address>): Promise<Array<TxnRecord>>;
  drc205_txn(txid: Txid): Promise<Array<TxnRecord>>;
  drc205_dexInfo(): Promise<DexInfo>;
  getQuotes(kInterval: bigint): Promise<Array<KBar>>;
  getConfig(): Promise<DexSetting>;
  getTxAccount(address: string): Promise<[Icrc1Account, string, bigint, Txid]>;
  count(address: Array<string>): Promise<bigint>;
  drc205_events_filter(
    address: Array<Address>,
    start: Array<bigint>,
    end: Array<bigint>
  ): Promise<[Array<TxnRecord>, boolean]>;
}
