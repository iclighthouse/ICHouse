import { Icrc1Account, Time } from '@/ic/common/icType';
import {
  Mode,
  RetrieveBtcStatus,
  Script,
  Utxo,
  VaultUtxo
} from '@/ic/ckbtcMinter/model';
import { Principal } from '@dfinity/principal';

export interface TrieList {
  total: bigint;
  data: Array<[EventBlockHeight, icBTCEvents]>;
  totalPage: bigint;
}
export interface TrieList_1 {
  total: bigint;
  data: Array<[EventBlockHeight, RetrieveStatus]>;
  totalPage: bigint;
}
export interface TrieList_send {
  total: bigint;
  data: Array<[bigint, SendingBtcStatus]>;
  totalPage: bigint;
}
export type EventBlockHeight = bigint;
export type icBTCEvents = [icBTCEvent, Time];
export type icBTCEvent =
  | {
      received_utxos: {
        deposit_address: string;
        total_fee: bigint;
        to_account: Icrc1Account;
        utxos: Array<Utxo>;
        amount: bigint;
      };
    }
  | {
      sent_transaction: {
        change_output: Array<{ value: bigint; vout: bigint }>;
        txid: string;
        address: string;
        account: Icrc1Account;
        utxos: Array<Utxo>;
        requests: Array<bigint>;
        retrieveAccount: Icrc1Account;
      };
    }
  | {
      burn: {
        toid: Array<bigint>;
        icTokenCanisterId: Principal;
        address: string;
        account: Icrc1Account;
        amount: bigint;
        tokenBlockIndex: bigint;
      };
    }
  | {
      mint: {
        toid: Array<bigint>;
        icTokenCanisterId: Principal;
        address: string;
        account: Icrc1Account;
        amount: bigint;
      };
    }
  | {
      send: {
        to: Icrc1Account;
        toid: Array<bigint>;
        icTokenCanisterId: Principal;
        amount: bigint;
      };
    }
  | {
      changeOwner: {
        newOwner: Principal;
      };
    }
  | {
      accepted_retrieve_btc_request: {
        txi: bigint;
        icrc1_burned_txid: bigint;
        total_fee: bigint;
        address: string;
        account: Icrc1Account;
        amount: bigint;
      };
    }
  | {
      start: { message: Array<string> };
    }
  | {
      initOrUpgrade: { initArgs: icBTCInitArgs };
    }
  | {
      config: {
        setting: {
          upgradeTokenWasm:
            | {
                icTokenCanisterId: Principal;
                version: string;
                symbol: string;
              }
            | {
                setTokenWasm: { size: bigint; version: string };
              };
        };
      };
    }
  | {
      suspend: {
        message: Array<string>;
      };
    };
export interface icBTCInitArgs {
  fixed_fee: bigint;
  mode: Mode;
  retrieve_btc_min_amount: bigint;
  ledger_id: Principal;
  dex_pair: Array<Principal>;
  min_confirmations: Array<bigint>;
}
export interface RetrieveStatus {
  txIndex: bigint;
  account: Icrc1Account;
  btcAddress: string;
  burnedBlockIndex: bigint;
  amount: bigint;
  retrieveAccount: Icrc1Account;
}
export interface SendingBtcStatus {
  fee: bigint;
  status: RetrieveBtcStatus;
  toids: Array<bigint>;
  scriptSigs: Array<Script>;
  signedTx: Array<Array<number>>;
  totalAmount: bigint;
  destinations: Array<[bigint, string, bigint]>;
  utxos: Array<VaultUtxo>;
}

export default interface Service {
  get_events(page: Array<bigint>, size: Array<bigint>): Promise<TrieList>;
  retrieval_log(request: Array<bigint>): Promise<Array<RetrieveStatus>>;
  sending_log(request: Array<bigint>): Promise<Array<SendingBtcStatus>>;
  sending_log_list(page: Array<bigint>, size: Array<bigint>): Promise<TrieList_send>;
  retrieval_log_list(page: Array<bigint>, size: Array<bigint>): Promise<TrieList_1>;
  get_account_events(accountId: Array<number>): Promise<Array<icBTCEvents>>;
}
