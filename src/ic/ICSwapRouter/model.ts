import { TokenId, TokenSymbol, TokenStd, Time, Txid } from '@/ic/common/icType';
import { Principal } from '@dfinity/principal';
import { BalanceChange } from '@/ic/ICDex/model';
export type DexName = string;
export type SwapTokenInfo = [TokenId, TokenSymbol, TokenStd];
export interface TrieList {
  total: bigint;
  totalPage: bigint;
  data: Array<TrieListData>;
}
export type TrieListData = [SwapCanister, PairResponse];
export type SwapCanister = Principal;
export interface SwapPair {
  feeRate: string;
  token0: SwapTokenInfo;
  token1: SwapTokenInfo;
  dexName: DexName;
  canisterId: SwapCanister;
}
export type Pairs = [SwapCanister, [SwapPair, bigint]];
export interface PairRequest {
  token0: SwapTokenInfo;
  token1: SwapTokenInfo;
  dexName: string;
}
export interface PairResponse {
  pair: SwapPair__1;
  sponsored: boolean;
  liquidity: Array<TokenLiquidity>;
  score: bigint;
  listingReferrers: Array<[ListingReferrer, Time]>;
  usdPrice?: string;
}
export interface SwapPair__1 {
  feeRate: string;
  token0: TokenInfo;
  token1: TokenInfo;
  dexName: DexName;
  canisterId: SwapCanister;
}
export type TokenInfo = [Principal, TokenSymbol, TokenStd];
export interface PairsTrieList {
  total: bigint;
  totalPage: bigint;
  data: Array<PairTrie>;
}
export type PairTrie = [SwapCanister, PairTrieResponse];
export interface PairTrieResponse {
  pair: SwapPair;
  sponsored: boolean;
  liquidity: Array<TokenLiquidity>;
  score: bigint;
  listingReferrers: ListingReferrers;
}
export type ListingReferrers = Array<[ListingReferrer, Time]>;
export interface ListingReferrer {
  end: Time[];
  verified: boolean;
  referrer: Principal;
  name: string;
  start: Time;
  nftId: string;
}
export type Valid = boolean;
export type Verified = boolean;
export interface TokenLiquidity {
  vol: Vol;
  shares: Shares;
  shareWeighted: ShareWeighted;
  unitValue: [Amount, Amount];
  orderCount: bigint;
  token0: Amount;
  token1: Amount;
  priceWeighted: PriceWeighted;
  price: bigint;
  userCount: bigint;
  unitSize: bigint;
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
export type Amount = bigint;
export interface TrieList_2 {
  total: bigint;
  data: Array<CompetitionsData>;
  totalPage: bigint;
}
export type CompetitionsData = [
  SwapCanister,
  {
    end: Time;
    name: string;
    pair: PairResponse;
    start: Time;
    round: bigint;
  }
];
export interface DexCompetitionResponse {
  end: Time;
  content: string;
  name: string;
  start: Time;
  pairs: Array<[string, SwapPair__1, { token0: null } | { token1: null }]>;
  hostedDex: string;
}
export interface TrieList_3 {
  total: bigint;
  data: Array<[AccountId, Array<TraderDataResponse>]>;
  totalPage: bigint;
}
export type AccountId = Array<number>;
export interface TraderDataResponse {
  startTime: Time;
  total: Array<[TraderStats, string]>;
  endTime: Array<Time>;
  data: Array<TraderStats>;
  pair: SwapPair__1;
  quoteToken: { token0: null } | { token1: null };
}
export interface TraderStats {
  pnl: string;
  vol: bigint;
  trades: Array<FilledTrade>;
  count: bigint;
  time: Time;
  avgPrice: string;
  capital: string;
  position: bigint;
}
export interface FilledTrade {
  time: Time;
  token0Value: BalanceChange;
  counterparty: Txid;
  token1Value: BalanceChange;
}

export default interface Service {
  getCompetitions(
    dexName: Array<DexName>,
    page: Array<number>,
    size: Array<number>
  ): Promise<TrieList_2>;
  getDexCompetitionRound(): Promise<bigint>;
  getDexCompetition(round: bigint): Promise<Array<DexCompetitionResponse>>;
  getDexCompetitionTraders(
    round: bigint,
    page: Array<number>,
    size: Array<number>
  ): Promise<TrieList_3>;
  getPairs2(
    dexName: Array<string>,
    principal: Array<Principal>,
    page: Array<bigint>,
    pageSize: Array<bigint>
  ): Promise<TrieList>;
}
