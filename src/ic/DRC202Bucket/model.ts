import { TokenId, Txid, Time, AccountId, Gas } from '@/ic/common/icType';
import { Principal } from '@dfinity/principal';
import { AppId } from '@/ic/DRC205Proxy/model';
export type TxnResult = [TxnRecord, Time];
export interface TxnRecord {
  gas: Gas;
  msgCaller: Array<Principal> | [];
  transaction: Transaction;
  txid: Txid;
  nonce: bigint;
  timestamp: Time;
  caller: AccountId;
  index: bigint;
}
export class MoreTxnRecord {
  public gas: Gas = null;
  public msgCaller = [];
  public transaction: Transaction = null;
  public txid: Txid = null;
  public nonce: bigint = null;
  public timestamp: Time = null;
  public caller: AccountId = null;
  public index: bigint = null;
}

export interface Transaction {
  to: AccountId;
  value: bigint;
  data: Array<Array<number>> | [];
  from: AccountId;
  operation: Operation;
}
export type Operation =
  | {
      approve: { allowance: bigint };
    }
  | {
      lockTransfer: {
        locked: bigint;
        expiration: Time;
        decider: AccountId;
      };
    }
  | {
      transfer: {
        action:
          | {
              burn: null;
            }
          | {
              mint: null;
            }
          | {
              send: null;
            };
      };
    }
  | {
      executeTransfer: {
        fallback: bigint;
        lockedTxid: Txid;
      };
    };
export interface txnByAccountIdRes {
  total: bigint;
  data: Array<[Principal, Array<TxnResult>]>;
  totalPage: bigint;
}

export default interface Service {
  txn(tokenId: TokenId, txid: Txid): Promise<Array<TxnResult>>;
  txnByAccountId(
    accountId: Array<number>,
    appId: Array<AppId>,
    page: Array<number>,
    size: Array<number>
  ): Promise<txnByAccountIdRes>;
  txnByIndex(appId: AppId, index: bigint): Promise<Array<TxnResult>>;
}
