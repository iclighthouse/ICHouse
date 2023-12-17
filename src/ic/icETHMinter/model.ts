import { Icrc1Account, Time } from '@/ic/common/icType';
import { Principal } from '@dfinity/principal';

export type CkToken = [EthAddress, IcTokenInfo];
export type EthAddress = string;
export type Wei = bigint;
export type TxHash = string;
export type TxIndex = bigint;
export type KytRequestId = bigint;
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
export interface IcTokenInfo {
  fee: {
    fixedFee: Wei;
    ethRatio: Wei;
    gasLimit: bigint;
  };
  std: { ETH: null } | { ERC20: null };
  decimals: number;
  dexPrice: Array<[string, Time]>;
  tokenId: EthAddress;
  minAmount: Wei;
  totalSupply: Array<Wei>;
  ckLedgerId: Principal;
  ckSymbol: string;
  symbol: string;
  dexPair: Array<Principal>;
}
export interface TrieList {
  total: bigint;
  data: Array<EventData>;
  totalPage: bigint;
}
export type EventData = [BlockHeight, [IcEvent, Time]];
export type BlockHeight = bigint;
export type IcEvent =
  | {
      depositGas: DepositGas;
    }
  | {
      withdraw: Withdraw;
    }
  | {
      keeper: Keeper;
    }
  | {
      depositResult: EventDepositResult;
    }
  | {
      burn: Burn;
    }
  | {
      init: EventInit;
    }
  | {
      mint: EventMint;
    }
  | {
      coverTransaction: CoverTransaction;
    }
  | {
      changeOwner: ChangeOwner;
    }
  | {
      deposit: EventDeposit;
    }
  | {
      start: {};
    }
  | {
      withdrawResult: WithdrawResult;
    }
  | {
      depositGasResult: DepositGasResult;
    }
  | {
      config: EventConfig;
    }
  | {
      suspend: {};
    }
  | {
      claimDeposit: ClaimDeposit;
    }
  | {
      claimDepositResult: ClaimDepositResult;
    }
  | {
      updateTokenPrice: {
        token: string;
        ethRatio: Wei;
        price: string;
      };
    };
export type ClaimDepositResult =
  | {
      ok: {
        fee: Array<Wei>;
        token: EthAddress;
        signature: string;
        from: EthAddress;
        account: Icrc1Account;
        txHash: TxHash;
        amount: Wei;
      };
    }
  | {
      err: {
        signature: string;
        error: string;
        account: Icrc1Account;
        txHash: TxHash;
      };
    };
export interface ClaimDeposit {
  signature: string;
  account: Icrc1Account;
  txHash: TxHash;
}
export interface EventConfig {
  setting:
    | {
        upgradeTokenWasm: {
          icTokenCanisterId: Principal;
          version: string;
          symbol: string;
        };
      }
    | {
        setToken: {
          token: EthAddress;
          info: IcTokenInfo;
        };
      }
    | {
        depositMethod: number;
      }
    | {
        updateRpc: {
          keeper: Icrc1Account;
          operation:
            | {
                set: { Available: null } | { Unavailable: null };
              }
            | {
                remove: null;
              };
        };
      }
    | {
        minRpcConfirmations: number;
      }
    | {
        launchToken: {
          token: EthAddress;
          icTokenCanisterId: Principal;
          symbol: string;
        };
      }
    | {
        setKeeper: {
          url: string;
          status:
            | {
                Disabled: null;
              }
            | {
                Normal: null;
              };
          name: string;
          account: Icrc1Account;
        };
      }
    | {
        dependents: {
          rpcTool: Principal;
          utilsTool: Principal;
        };
      }
    | {
        setTokenWasm: { size: bigint; version: string };
      }
    | {
        minConfirmations: bigint;
      };
}
export type DepositGasResult =
  | {
      ok: {
        token: EthAddress;
        txIndex: TxIndex;
        txid: Array<TxHash>;
        account: Icrc1Account;
        amount: Wei;
      };
    }
  | {
      err: {
        token: EthAddress;
        txIndex: TxIndex;
        account: Icrc1Account;
        amount: Wei;
      };
    };
export type WithdrawResult =
  | {
      ok: {
        token: EthAddress;
        txIndex: TxIndex;
        txid: Array<TxHash>;
        account: Icrc1Account;
        amount: Wei;
      };
    }
  | {
      err: {
        token: EthAddress;
        txIndex: TxIndex;
        txid: Array<TxHash>;
        account: Icrc1Account;
        amount: Wei;
      };
    };
export interface EventDeposit {
  fee: Array<Wei>;
  token: EthAddress;
  txIndex: TxIndex;
  toid: bigint;
  address: EthAddress;
  account: Icrc1Account;
  amount: Wei;
}
export interface ChangeOwner {
  newOwner: Principal;
}
export interface CoverTransaction {
  txIndex: TxIndex;
  preTxid: Array<TxHash>;
  toid: bigint;
  updateTx: Array<UpdateTxArgs>;
  account: Icrc1Account;
}
export interface UpdateTxArgs {
  ts: Array<Time>;
  tx: Array<Transaction>;
  fee: Array<{ gasPrice: Wei; maxFee: Wei; gasLimit: bigint }>;
  status: Array<Status>;
  toids: Array<Array<bigint>>;
  receipt: Array<string>;
  kytRequestId: Array<KytRequestId>;
  signedTx: Array<[Array<number>, Array<number>]>;
  nonce: Array<Nonce>;
  txHash: Array<TxHash>;
  rpcRequestId: Array<RpcRequestId>;
  amount: Array<Wei>;
  rawTx: Array<[Array<number>, Array<number>]>;
}
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
export type RpcRequestId = bigint;
export interface EventMint {
  toid: bigint;
  icTokenCanisterId: Principal;
  account: Icrc1Account;
  amount: Wei;
}
export interface EventInit {
  initArgs: InitArgs;
}
export interface InitArgs {
  rpc_canister_id: Principal;
  rpc_confirmations: bigint;
  utils_canister_id: Principal;
  deposit_method: number;
  min_confirmations: Array<bigint>;
}
export interface Burn {
  icTokenCanisterId: Principal;
  address: EthAddress;
  account: Icrc1Account;
  amount: Wei;
  tokenBlockIndex: bigint;
}
export type EventDepositResult =
  | {
      ok: {
        fee: Array<Wei>;
        token: EthAddress;
        txIndex: TxIndex;
        txid: Array<TxHash>;
        account: Icrc1Account;
        amount: Wei;
      };
    }
  | {
      err: {
        token: EthAddress;
        txIndex: TxIndex;
        txid: Array<TxHash>;
        account: Icrc1Account;
        amount: Wei;
      };
    };
export interface Keeper {
  operation: {
    setRpc: {
      keeper: Icrc1Account;
      operation:
        | { put: [string, { Available: null } | { Unavailable: null }] }
        | { remove: null };
    };
  };
}
export interface Withdraw {
  fee: Array<Wei>;
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
export type ChainAccount = [Chain, ChainTokenId, string];
export type Chain = string;
export type ChainTokenId = Array<number>;
export type ICAccount = [TokenCanisterId, Icrc1Account];
export type TokenCanisterId = Principal;

export default interface Service {
  get_ck_tokens(): Promise<Array<CkToken>>;
  get_events(page: Array<bigint>, pageSize: Array<bigint>): Promise<TrieList>;
  get_account_events(accountId: Array<number>): Promise<Array<[IcEvent, Time]>>;
  get_cached_account(ethAddress: string): Promise<Array<Array<ICAccount>>>;
  get_cached_address(
    accountId: Array<number>
  ): Promise<Array<Array<ChainAccount>>>;
  get_cached_tx_account(
    txHash: string
  ): Promise<Array<Array<[ChainAccount, Icrc1Account]>>>;
}
