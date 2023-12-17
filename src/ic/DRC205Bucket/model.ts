import { Principal } from '@dfinity/principal';
import { AppId } from '@/ic/DRC205Proxy/model';
import { Time, TokenId, Txid, AccountId } from '@/ic/common/icType';

export type TxnResult = [TxnRecord, Time];
export interface TxnRecord {
  fee: { token0Fee: bigint; token1Fee: bigint };
  shares: ShareChange;
  msgCaller: Array<Principal> | [];
  data: Array<Array<number>> | [];
  time: Time;
  txid: Txid;
  filled: TxnRecordFilled;
  order: TxnRecordOrder;
  status: TxnRecordStatus;
  orderMode: { AMM: null } | { OrderBook: null };
  orderType: [OrderType];
  token0: TokenType;
  token1: TokenType;
  nonce: bigint;
  operation: OperationType;
  account: AccountId;
  details: Array<TxnRecordDetails>;
  caller: AccountId;
  index: bigint;
  cyclesWallet: Array<CyclesWallet> | [];
  token0Id?: string;
  token1Id?: string;
}
export interface TxnRecordDetails {
  token0Value: BalanceChange;
  counterparty: Txid;
  token1Value: BalanceChange;
  time: Time;
  priceShowType?: string;
  priceShow0?: string;
  priceShow1?: string;
}
export interface TxnRecordOrder {
  token0Value: [BalanceChange];
  token1Value: [BalanceChange];
  priceShowType?: string;
  priceShow0?: string;
  priceShow1?: string;
}
export interface TxnRecordFilled {
  token0Value: BalanceChange;
  token1Value: BalanceChange;
  priceShowType?: string;
  priceShow0?: string;
  priceShow1?: string;
}
export type TxnRecordStatus =
  | { Failed: null }
  | { Completed: null }
  | { Pending: null }
  | { Cancelled: null }
  | { PartiallyCompletedAndCancelled: null };
export type OrderType =
  | {
      FAK: null;
    }
  | {
      FOK: null;
    }
  | {
      LMT: null;
    }
  | {
      MKT: null;
    };
export class MoreTxnRecord {
  fee: { token0Fee: bigint; token1Fee: bigint } = null;
  shares: ShareChange = null;
  msgCaller: Array<Principal> | [] = [];
  data: Array<Array<number>> | [] = [];
  time: Time = null;
  txid: Txid = null;
  filled: {
    token0Value: BalanceChange;
    token1Value: BalanceChange;
  } = null;
  order: {
    token0Value: [BalanceChange];
    token1Value: [BalanceChange];
  } = null;
  status: TxnRecordStatus = null;
  orderMode: { AMM: null } | { OrderBook: null } = null;
  orderType: [OrderType] = null;
  token0: TokenType = null;
  token1: TokenType = null;
  nonce: bigint = null;
  operation: OperationType = null;
  account: AccountId = null;
  details: Array<{
    token0Value: BalanceChange;
    counterparty: Txid;
    token1Value: BalanceChange;
    time: Time;
  }> = null;
  caller: AccountId = null;
  index: bigint = null;
  cyclesWallet: Array<CyclesWallet> | [] = [];
  token0Id?: string = null;
  token1Id?: string = null;
}
export type ShareChange =
  | {
      Burn: Shares;
    }
  | {
      Mint: Shares;
    }
  | {
      NoChange: null;
    };
export type Shares = bigint;
export type BalanceChange =
  | { DebitRecord: bigint }
  | { CreditRecord: bigint }
  | { NoChange: null };
export type TokenType = { Icp: null } | { Token: TokenId } | { Cycles: null };
export type OperationType =
  | { AddLiquidity: null }
  | { Swap: null }
  | { Claim: null }
  | { RemoveLiquidity: null };
export type CyclesWallet = Principal;
export interface txnByAccountIdRes {
  total: bigint;
  data: Array<[AppId, Array<TxnResult>]>;
  totalPage: bigint;
}

export default interface Service {
  txn(appId: AppId, txid: Txid): Promise<Array<TxnResult>>;
  txnHistory(appId: AppId, txid: Txid): Promise<Array<TxnResult>>;
  txnByAccountId(
    accountId: Array<number>,
    appId: Array<AppId>,
    page: Array<number>,
    size: Array<number>
  ): Promise<txnByAccountIdRes>;
  txnByIndex(appId: AppId, index: bigint): Promise<Array<TxnResult>>;
}
