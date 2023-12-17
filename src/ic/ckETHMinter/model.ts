import { Icrc1Account } from '@/ic/common/icType';
import { Principal } from '@dfinity/principal/lib/cjs';

export type EthAddress = string;
export type TxIndex = bigint;
export type Nonce = bigint;
export type Status =
  | {
      Signing: null;
    }
  | {
      Building: null;
    }
  | {
      Confirmed: null;
    }
  | {
      Sending: null;
    }
  | {
      Unknown: null;
    }
  | {
      Submitted: null;
    }
  | {
      Failure: null;
    }
  | {
      Pending: null;
    };
export type Wei = bigint;
export interface Transaction {
  EIP1559: Transaction1559;
  EIP2930: Transaction2930;
  Legacy: TransactionLegacy;
}
export interface TransactionLegacy {
  to: Array<number>;
  value: Array<number>;
  data: Array<number>;
  sign: Array<Signature>;
  chain_id: bigint;
  nonce: Array<number>;
  gas_limit: Array<number>;
  gas_price: Array<number>;
}
export interface Transaction2930 {
  to: Array<number>;
  value: Array<number>;
  data: Array<number>;
  sign: Array<Signature>;
  chain_id: bigint;
  nonce: Array<number>;
  gas_limit: Array<number>;
  access_list: Array<AccessList>;
  gas_price: Array<number>;
}
export interface Transaction1559 {
  to: Array<number>;
  value: Array<number>;
  max_priority_fee_per_gas: Array<number>;
  data: Array<number>;
  sign: Array<Signature>;
  max_fee_per_gas: Array<number>;
  chain_id: bigint;
  nonce: Array<number>;
  gas_limit: Array<number>;
  access_list: Array<AccessList>;
}
export interface AccessList {
  storage_keys: Array<Array<number>>;
  address: Array<number>;
}
export interface Signature {
  r: Array<number>;
  s: Array<number>;
  v: bigint;
  from: Array<Array<number>>;
  hash: Array<number>;
}
export interface Burn {
  icTokenCanisterId: Principal;
  address: EthAddress;
  account: Icrc1Account;
  amount: Wei;
  tokenBlockIndex: bigint;
}
export interface Withdraw {
  token: EthAddress;
  txIndex: TxIndex;
  toid: bigint;
  address: EthAddress;
  account: Icrc1Account;
  amount: Wei;
}
export interface DepositGas {
  txIndex: TxIndex;
  toid: bigint;
  address: EthAddress;
  account: Icrc1Account;
  amount: Wei;
}
export interface ETHEvent {
  timestamp: bigint;
  payload: EventPayload;
}
export type EventPayload =
  | { SkippedBlock: { block_number: bigint } }
  | {
      SignedTransaction: { raw_transaction: string; withdrawal_id: bigint };
    }
  | {
      Upgrade: UpgradeArg;
    }
  | { Init: InitArg }
  | {
      SyncedToBlock: { block_number: bigint };
    }
  | {
      AcceptedDeposit: {
        principal: Principal;
        transaction_hash: string;
        value: string;
        log_index: bigint;
        block_number: bigint;
        from_address: string;
      };
    }
  | {
      ReplacedTransaction: {
        withdrawal_id: bigint;
        transaction: UnsignedTransaction;
      };
    }
  | {
      MintedCkEth: { event_source: EventSource; mint_block_index: bigint };
    }
  | {
      ReimbursedEthWithdrawal: {
        transaction_hash: Array<string>;
        withdrawal_id: bigint;
        reimbursed_amount: bigint;
        reimbursed_in_block: bigint;
      };
    }
  | {
      CreatedTransaction: {
        withdrawal_id: bigint;
        transaction: UnsignedTransaction;
      };
    }
  | {
      InvalidDeposit: {
        event_source: EventSource;
        reason: string;
      };
    }
  | {
      AcceptedEthWithdrawalRequest: {
        ledger_burn_index: bigint;
        destination: string;
        withdrawal_amount: bigint;
        from: Principal;
        created_at: Array<bigint>;
        from_subaccount: Array<Array<number>>;
      };
    }
  | {
      FinalizedTransaction: {
        transaction_receipt: TransactionReceipt;
        withdrawal_id: bigint;
      };
    };
export interface TransactionReceipt {
  effective_gas_price: bigint;
  status: { Success: null } | { Failure: null };
  transaction_hash: string;
  block_hash: string;
  block_number: bigint;
  gas_used: bigint;
}
export interface UnsignedTransaction {
  destination: string;
  value: bigint;
  max_priority_fee_per_gas: bigint;
  data: Array<number>;
  max_fee_per_gas: bigint;
  chain_id: bigint;
  nonce: bigint;
  gas_limit: bigint;
  access_list: Array<{
    storage_keys: Array<Array<number>>;
    address: string;
  }>;
}
export interface EventSource {
  transaction_hash: string;
  log_index: bigint;
}
export interface InitArg {
  ethereum_network: EthereumNetwork;
  last_scraped_block_number: bigint;
  ecdsa_key_name: string;
  next_transaction_nonce: bigint;
  ledger_id: Principal;
  ethereum_contract_address: Array<string>;
  minimum_withdrawal_amount: bigint;
  ethereum_block_height: BlockTag;
}
export type EthereumNetwork =
  | {
      Mainnet: null;
    }
  | { Sepolia: null };
export interface UpgradeArg {
  next_transaction_nonce: Array<bigint>;
  ethereum_contract_address: Array<string>;
  minimum_withdrawal_amount: Array<string>;
  ethereum_block_height: Array<BlockTag>;
}
export type BlockTag =
  | {
      Safe: null;
    }
  | { Finalized: null }
  | { Latest: null };
export interface WithdrawalArg {
  recipient: string;
  amount: bigint;
}
export type WithdrawalResponse =
  | {
      Ok: RetrieveEthRequest;
    }
  | { Err: WithdrawalError };
export interface RetrieveEthRequest {
  block_index: bigint;
}
export type WithdrawalError =
  | { TemporarilyUnavailable: string }
  | { InsufficientAllowance: { allowance: bigint } }
  | { AmountTooLow: { min_withdrawal_amount: bigint } }
  | { InsufficientFunds: { balance: bigint } }
  | { RecipientAddressBlocked: { address: string } };
export type RetrieveEthStatus =
  | { NotFound: null }
  | { TxFinalized: TxFinalizedStatus }
  | { TxSent: EthTransaction }
  | { TxCreated: null }
  | { Pending: null };
export type TxFinalizedStatus =
  | { Success: EthTransaction }
  | {
      Reimbursed: {
        transaction_hash: string;
        reimbursed_amount: bigint;
        reimbursed_in_block: bigint;
      };
    }
  | {
      PendingReimbursement: EthTransaction;
    };
export interface EthTransaction {
  transaction_hash: string;
}

export default interface Service {
  smart_contract_address(): Promise<string>;
  get_events(request: {
    start: bigint;
    length: bigint;
  }): Promise<{ total_event_count: bigint; events: Array<ETHEvent> }>;
}
