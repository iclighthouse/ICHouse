import { Principal } from '@dfinity/principal';

export type CanisterIdString = string;
export type AccountIdentifier = string;
export type BlockHeight = bigint;
export type E8s = bigint;
export type Memo = bigint;
export type PrincipalString = string;
export type SubAccount = Uint8Array;
export type Option<T> = T | null;
export type ICL = bigint;
export type PrincipalType =
  | 'Canister'
  | 'User'
  | 'Anonymous'
  | 'Derived'
  | 'Unknown';

// token
export type TokenSymbol = string;
export type TokenId = Principal;
export type SwapId = Principal;
export type Bucket = Principal;
export type Txid = Array<number>;
export type Time = bigint;
export type AccountId = Array<number>;
export type Decimals = number;
export type TotalSupply = bigint;
export type Gas = { token: bigint } | { cycles: bigint } | { noFee: null };
export interface Metadata {
  content: string;
  name: string;
}
export interface TokenInfo {
  name?: string;
  symbol?: string;
  decimals: number;
  fee?: Gas | bigint;
  totalSupply?: bigint;
  logo?: string;
  tokenStd?: TokenStd;
  maxSupply?: bigint;
}

export interface SwapInfo {
  name: string;
  decimals: number;
  token0: [TokenType, TokenStd];
  token1: [TokenType, TokenStd];
  mmType: { AMM: null } | { OrderBook: null };
  feeRate: string;
}
export type TokenStd =
  | { dft: null }
  | { icp: null }
  | { other: null }
  | { cycles: null }
  | { dip20: null }
  | { drc20: null }
  | { icrc1: null };
export type TokenType = { Icp: null } | { Cycles: null } | { Token: string };
export type Address = string;
export interface Icrc1Account {
  owner: Principal;
  subaccount: Array<Array<number>>;
}
