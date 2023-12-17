import { Principal } from '@dfinity/principal';

export type MinterEvent =
  | {
      received_utxos: {
        to_account: Account;
        mint_txid: Array<bigint>;
        utxos: Array<Utxo>;
      };
    }
  | {
      schedule_deposit_reimbursement: {
        burn_block_index: bigint;
        account: Account;
        amount: bigint;
        reason: ReimbursementReason;
      };
    }
  | {
      sent_transaction: {
        fee: Array<bigint>;
        change_output: Array<{ value: bigint; vout: bigint }>;
        txid: Uint8Array;
        utxos: Array<Utxo>;
        requests: Array<bigint>;
        submitted_at: bigint;
      };
    }
  | {
      distributed_kyt_fee: {
        block_index: bigint;
        amount: bigint;
        kyt_provider: Principal;
      };
    }
  | {
      init: InitArgs;
    }
  | {
      upgrade: UpgradeArgs;
    }
  | {
      retrieve_btc_kyt_failed: {
        block_index: bigint;
        owner: Principal;
        uuid: string;
        address: string;
        amount: bigint;
        kyt_provider: Principal;
      };
    }
  | {
      accepted_retrieve_btc_request: {
        received_at: bigint;
        block_index: bigint;
        address: BitcoinAddress;
        amount: bigint;
        kyt_provider: Array<Principal>;
      };
    }
  | {
      checked_utxo: {
        clean: boolean;
        utxo: Utxo;
        uuid: string;
        kyt_provider: Array<Principal>;
      };
    }
  | { removed_retrieve_btc_request: { block_index: bigint } }
  | { confirmed_transaction: { txid: Uint8Array } }
  | {
      replaced_transaction: {
        fee: bigint;
        change_output: { value: bigint; vout: bigint };
        old_txid: Uint8Array;
        new_txid: Uint8Array;
        submitted_at: bigint;
      };
    }
  | { ignored_utxo: { utxo: Utxo } };
export type ReimbursementReason =
  | {
      CallFailed: null;
    }
  | {
      TaintedDestination: {
        kyt_fee: bigint;
        kyt_provider: Principal;
      };
    };
export type BitcoinAddress =
  | {
      p2wsh_v0: Uint8Array;
    }
  | {
      p2tr_v1: Uint8Array;
    }
  | {
      p2sh: Uint8Array;
    }
  | {
      p2wpkh_v0: Uint8Array;
    }
  | {
      p2pkh: Uint8Array;
    };
export interface UpgradeArgs {
  mode: Array<Mode>;
  kyt_principal: Array<Principal>;
  retrieve_btc_min_amount: Array<bigint>;
  max_time_in_queue_nanos: Array<bigint>;
  min_confirmations: Array<bigint>;
  kyt_fee: Array<bigint>;
}
export interface Account {
  owner: Principal;
  subaccount: Array<Uint8Array>;
}
export interface Utxo {
  height: bigint;
  value: bigint;
  outpoint: { txid: Uint8Array; vout: bigint };
}
export interface InitArgs {
  kyt_principal: Array<Principal>;
  ecdsa_key_name: string;
  mode: Mode;
  retrieve_btc_min_amount: bigint;
  ledger_id: Principal;
  max_time_in_queue_nanos: bigint;
  btc_network: BtcNetwork;
  min_confirmations: Array<bigint>;
  kyt_fee: Array<bigint>;
}
export type Mode =
  | {
      RestrictedTo: Array<Principal>;
    }
  | {
      ReadOnly: null;
    }
  | {
      GeneralAvailability: null;
    };
export type BtcNetwork =
  | {
      Mainnet: null;
    }
  | {
      Regtest: null;
    }
  | {
      Testnet: null;
    };
export interface Stats {
  totalBtcFee: bigint;
  countRejections: bigint;
  txIndex: bigint;
  totalBtcSent: bigint;
  totalBtcReceiving: bigint;
  blockIndex: bigint;
  vaultRemainingBalance: bigint;
  countAsyncMessage: bigint;
}
export interface SendingBtcStatus {
  fee: bigint;
  status: RetrieveBtcStatus;
  toids: Array<bigint>;
  scriptSigs: Array<Script>;
  signedTx: Array<Uint8Array>;
  totalAmount: bigint;
  destinations: Array<[bigint, string, bigint]>;
  utxos: Array<VaultUtxo>;
}
export type VaultUtxo = [string, PubKey, DerivationPath, ICUtxo];
export type PubKey = Uint8Array;
export type DerivationPath = Array<Uint8Array>;
export interface ICUtxo {
  height: bigint;
  value: Satoshi;
  outpoint: OutPoint;
}
export type Satoshi = bigint;
export interface OutPoint {
  txid: Uint8Array;
  vout: bigint;
}
export type RetrieveBtcStatus =
  | {
      Signing: null;
    }
  | {
      Confirmed: { txid: Uint8Array };
    }
  | {
      Sending: { txid: Uint8Array };
    }
  | {
      AmountTooLow: null;
    }
  | {
      Unknown: null;
    }
  | {
      Submitted: { txid: Uint8Array };
    }
  | {
      Pending: null;
    };

export type Script = Array<Instruction>;
export interface Instruction {
  opcode: Opcode;
  data: Uint8Array;
}
export type Opcode =
  | {
      OP_NUMEQUALVERIFY: null;
    }
  | {
      OP_RIGHT: null;
    }
  | {
      OP_CODESEPARATOR: null;
    }
  | {
      OP_LESSTHANOREQUAL: null;
    }
  | {
      OP_CHECKMULTISIGVERIFY: null;
    }
  | {
      OP_EQUALVERIFY: null;
    }
  | {
      OP_NUMEQUAL: null;
    }
  | {
      OP_FALSE: null;
    }
  | {
      OP_INVALIDOPCODE: null;
    }
  | {
      OP_RETURN: null;
    }
  | {
      OP_HASH160: null;
    }
  | {
      OP_HASH256: null;
    }
  | {
      OP_CHECKSIG: null;
    }
  | {
      OP_RSHIFT: null;
    }
  | {
      OP_FROMALTSTACK: null;
    }
  | {
      OP_0: null;
    }
  | {
      OP_1: null;
    }
  | {
      OP_2: null;
    }
  | {
      OP_3: null;
    }
  | {
      OP_4: null;
    }
  | {
      OP_5: null;
    }
  | {
      OP_6: null;
    }
  | {
      OP_7: null;
    }
  | {
      OP_8: null;
    }
  | {
      OP_9: null;
    }
  | {
      OP_SHA256: null;
    }
  | {
      OP_0NOTEQUAL: null;
    }
  | {
      OP_CHECKSEQUENCEVERIFY: null;
    }
  | {
      OP_VERIF: null;
    }
  | {
      OP_RESERVED1: null;
    }
  | {
      OP_RESERVED2: null;
    }
  | {
      OP_GREATERTHANOREQUAL: null;
    }
  | {
      OP_PUSHDATA1: null;
    }
  | {
      OP_PUSHDATA2: null;
    }
  | {
      OP_PUSHDATA4: null;
    }
  | {
      OP_CHECKLOCKTIMEVERIFY: null;
    }
  | {
      OP_WITHIN: null;
    }
  | {
      OP_VERNOTIF: null;
    }
  | {
      OP_BOOLAND: null;
    }
  | {
      OP_BOOLOR: null;
    }
  | {
      OP_CHECKSIGADD: null;
    }
  | {
      OP_NEGATE: null;
    }
  | {
      OP_LESSTHAN: null;
    }
  | {
      OP_1NEGATE: null;
    }
  | {
      OP_TOALTSTACK: null;
    }
  | {
      OP_ENDIF: null;
    }
  | {
      OP_EQUAL: null;
    }
  | {
      OP_2DROP: null;
    }
  | {
      OP_NUMNOTEQUAL: null;
    }
  | {
      OP_2OVER: null;
    }
  | {
      OP_2SWAP: null;
    }
  | {
      OP_1ADD: null;
    }
  | {
      OP_1SUB: null;
    }
  | {
      OP_2DIV: null;
    }
  | {
      OP_2DUP: null;
    }
  | {
      OP_2MUL: null;
    }
  | {
      OP_2ROT: null;
    }
  | {
      OP_GREATERTHAN: null;
    }
  | {
      OP_3DUP: null;
    }
  | {
      OP_10: null;
    }
  | {
      OP_11: null;
    }
  | {
      OP_12: null;
    }
  | {
      OP_13: null;
    }
  | {
      OP_14: null;
    }
  | {
      OP_15: null;
    }
  | {
      OP_16: null;
    }
  | {
      OP_IF: null;
    }
  | {
      OP_OR: null;
    }
  | {
      OP_DROP: null;
    }
  | {
      OP_ELSE: null;
    }
  | {
      OP_SUBSTR: null;
    }
  | {
      OP_LEFT: null;
    }
  | {
      OP_NOP1: null;
    }
  | {
      OP_NOP2: null;
    }
  | {
      OP_NOP3: null;
    }
  | {
      OP_NOP4: null;
    }
  | {
      OP_NOP5: null;
    }
  | {
      OP_NOP6: null;
    }
  | {
      OP_NOP7: null;
    }
  | {
      OP_NOP8: null;
    }
  | {
      OP_NOP9: null;
    }
  | {
      OP_INVERT: null;
    }
  | {
      OP_OVER: null;
    }
  | {
      OP_PICK: null;
    }
  | {
      OP_VERIFY: null;
    }
  | {
      OP_ROLL: null;
    }
  | {
      OP_SHA1: null;
    }
  | {
      OP_SIZE: null;
    }
  | {
      OP_SWAP: null;
    }
  | {
      OP_TRUE: null;
    }
  | {
      OP_TUCK: null;
    }
  | {
      OP_NOP10: null;
    }
  | {
      OP_NOTIF: null;
    }
  | {
      OP_LSHIFT: null;
    }
  | {
      OP_RESERVED: null;
    }
  | {
      OP_CHECKMULTISIG: null;
    }
  | {
      OP_IFDUP: null;
    }
  | {
      OP_CHECKSIGVERIFY: null;
    }
  | {
      OP_RIPEMD160: null;
    }
  | {
      OP_ABS: null;
    }
  | {
      OP_ADD: null;
    }
  | {
      OP_AND: null;
    }
  | {
      OP_CAT: null;
    }
  | {
      OP_DIV: null;
    }
  | {
      OP_DUP: null;
    }
  | {
      OP_MAX: null;
    }
  | {
      OP_MIN: null;
    }
  | {
      OP_MOD: null;
    }
  | {
      OP_MUL: null;
    }
  | {
      OP_NIP: null;
    }
  | {
      OP_NOP: null;
    }
  | {
      OP_NOT: null;
    }
  | {
      OP_ROT: null;
    }
  | {
      OP_SUB: null;
    }
  | {
      OP_VER: null;
    }
  | {
      OP_XOR: null;
    }
  | {
      OP_DEPTH: null;
    };

export default interface Service {
  get_events(request: {
    start: bigint;
    length: bigint;
  }): Promise<Array<MinterEvent>>;
  stats(): Promise<Stats>;
  sendingLog(request: Array<bigint>): Promise<Array<SendingBtcStatus>>;
}
