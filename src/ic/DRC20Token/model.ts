import { Principal } from '@dfinity/principal';
import {
  Decimals,
  Gas,
  Metadata,
  TotalSupply,
  PrincipalString,
  Txid,
  Icrc1Account,
  TokenInfo
} from '@/ic/common/icType';
import { TxnRecord } from '@/ic/DRC202Bucket/model';
import { Amount } from '@/ic/common/transaction';
import { SwapPair } from '@/ic/ICSwapRouter/model';

export interface CanisterStatusToken {
  status?: Status;
  memory_size?: bigint;
  cycles?: bigint;
  settings?: {
    freezing_threshold: bigint;
    controllers: Array<Principal>;
    memory_allocation: bigint;
    compute_allocation: bigint;
  };
  module_hash?: Array<Array<number>>;
}
export type Status = { stopped: null } | { stopping: null } | { running: null };
export type TxnQueryRequest =
  | {
      getEvents: { owner: Array<PrincipalString> };
    }
  | { txnCount: { owner: PrincipalString } }
  | { lockedTxns: { owner: PrincipalString } }
  | { lastTxids: { owner: PrincipalString } }
  | { lastTxidsGlobal: null }
  | { getTxn: { txid: Txid } }
  | { txnCountGlobal: null };

export type TxnQueryResponse =
  | { getEvents: Array<TxnRecord> }
  | {
      txnCount: bigint;
    }
  | {
      lockedTxns: {
        txns: Array<TxnRecord>;
        lockedBalance: bigint;
      };
    }
  | {
      lastTxids: Array<Txid>;
    }
  | { lastTxidsGlobal: Array<TxnRecord> }
  | { getTxn: Array<TxnRecord> }
  | { txnCountGlobal: number };
export type Top100Record = [Address, bigint];
export type Address = string;
export interface DRC207Support {
  timer: {
    interval_seconds: Array<bigint>;
    enable: boolean;
  };
  monitorable_by_self: boolean;
  monitorable_by_blackhole: {
    canister_id: Array<Principal>;
    allowed: boolean;
  };
  cycles_receivable: boolean;
}
export interface TransferArgs {
  to: Icrc1Account;
  fee: Array<bigint>;
  memo: Array<Array<number>>;
  from_subaccount: Array<Array<number>>;
  created_at_time: Array<bigint>;
  amount: bigint;
}

export type IcrcReceipt = { Ok: bigint } | { Err: IcrcTransferError };
export type IcrcTransferError =
  | {
      GenericError: {
        message: string;
        error_code: bigint;
      };
    }
  | {
      TemporarilyUnavailable: null;
    }
  | {
      BadBurn: { min_burn_amount: bigint };
    }
  | {
      Duplicate: { duplicate_of: bigint };
    }
  | {
      BadFee: { expected_fee: bigint };
    }
  | {
      CreatedInFuture: null;
    }
  | {
      TooOld: { allowed_window_nanos: Duration };
    }
  | {
      InsufficientFunds: { balance: bigint };
    };
export type Duration = bigint;
export type IcrcMetadata = Array<[string, IcrcValue]>;
export type IcrcValue =
  | {
      Int: bigint;
    }
  | {
      Nat: bigint;
    }
  | {
      Blob: Array<number>;
    }
  | {
      Text: string;
    };
export interface Icrc1SupportedStandards {
  url: string;
  name: string;
}
export interface GetTransactionsRequest {
  start: bigint;
  length: bigint;
}
export interface GetTransactionsResponse {
  first_index: bigint;
  log_length: bigint;
  transactions: Array<Transaction2>;
  archived_transactions: Array<ArchivedTransactionRange>;
}
export interface Transaction2 {
  burn: Array<Burn>;
  kind: string;
  mint: Array<Mint>;
  timestamp: bigint;
  transfer: Array<Transfer>;
  approve: Array<Approve>;
}
export interface Approve {
  fee: Array<bigint>;
  from: Icrc1Account;
  memo: Array<Array<number>>;
  created_at_time: Array<bigint>;
  amount: bigint;
  expected_allowance: Array<bigint>;
  expires_at: Array<bigint>;
  spender: Icrc1Account
}
export interface Burn {
  from: Icrc1Account;
  memo: Array<Array<number>>;
  created_at_time: Array<bigint>;
  amount: bigint;
  spender: Array<Icrc1Account>;
}
export interface Mint {
  to: Icrc1Account;
  memo: Array<Array<number>>;
  created_at_time: Array<bigint>;
  amount: bigint;
}
export interface Transfer {
  to: Icrc1Account;
  fee: Array<bigint>;
  from: Icrc1Account;
  memo: Array<Array<number>>;
  created_at_time: Array<bigint>;
  amount: bigint;
  spender: Array<Icrc1Account>;
}
export interface ArchivedTransactionRange {
  callback: [
    GetTransactionsRequest,
    { transactions: Array<Transaction2> },
    'query'
  ];
  start: bigint;
  length: bigint;
}

export default interface Service {
  drc20_decimals(): Promise<Decimals>;
  decimals(): Promise<Decimals>;
  drc20_gas(): Promise<Gas>;
  drc20_fee(): Promise<Amount>;
  drc20_metadata(): Promise<Array<Metadata>>;
  drc20_name(): Promise<string>;
  name(): Promise<string>;
  drc20_symbol(): Promise<string>;
  symbol(): Promise<string>;
  drc20_totalSupply(): Promise<TotalSupply>;
  totalSupply(): Promise<TotalSupply>;
  canister_status(): Promise<CanisterStatusToken>;
  drc20_txnQuery(request: TxnQueryRequest): Promise<TxnQueryResponse>;
  ictokens_top100(): Promise<Array<Top100Record>>;
  drc207(): Promise<DRC207Support>;
  drc202_events(address: Array<Address>): Promise<Array<TxnRecord>>;
  drc202_txn(txid: Txid): Promise<Array<TxnRecord>>;
  drc20_balanceOf(account: Address): Promise<bigint>;
  balanceOf(account: Principal): Promise<bigint>;
  getMetadata(): Promise<TokenInfo>;
  standard(): Promise<string>;
  icrc1_supported_standards(): Promise<Icrc1SupportedStandards>;
  icrc1_transfer(transferArgs: TransferArgs): Promise<IcrcReceipt>;
  icrc1_metadata(): Promise<IcrcMetadata>;
  icrc1_decimals(): Promise<number>;
  icrc1_fee(): Promise<bigint>;
  icrc1_name(): Promise<string>;
  icrc1_symbol(): Promise<string>;
  icrc1_total_supply(): Promise<bigint>;
  icrc1_balance_of(to: Icrc1Account): Promise<bigint>;
  ictokens_maxSupply(): Promise<Array<bigint>>;
  get_transactions(
    transactionsRequest: GetTransactionsRequest
  ): Promise<GetTransactionsResponse>;
  drc204_pairs(): Promise<Array<[Principal, [SwapPair, bigint]]>>;
}
