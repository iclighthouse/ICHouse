import { Time, TokenStd, Txid } from '@/ic/common/icType';
import { Amount } from '@/ic/ICSwapRouter/model';
import { Principal } from '@dfinity/principal';

export type CompRoundResponse = [Round, Array<RoundInfo>];
export type Round = bigint;
export interface RoundInfo {
  end: Time;
  content: string;
  isSettled: boolean;
  name: string;
  start: Time;
  minCapital: bigint;
  closedPrice: Array<string>;
  quoteToken: { token0: null } | { token1: null };
}
export interface CompRoundResults {
  total: number;
  page: number;
  data: CompRoundResultsData;
}
export type CompRoundResultsData = Array<[Array<number>, CompResult]>;
export interface CompResult {
  vol: Vol;
  status: { Active: null } | { Dropout: null };
  capital: CompCapital;
  assetValue: Array<CompCapital>;
  yield?: string;
  volRank?: number;
  yieldRank?: number;
  score?: number;
  scoreRank?: number;
}
export interface Vol {
  value0: Amount;
  value1: Amount;
}
export interface CompCapital {
  total: string | number;
  value0: bigint;
  value1: bigint;
}
export interface PairInfo {
  decimals: number;
  setting: DexSetting;
  owner: Principal;
  name: string;
  version: string;
  token0: PairTokenInfo;
  token1: PairTokenInfo;
  paused: boolean;
}
export interface DexSetting {
  MAX_TPS: number;
  ICTC_RUN_INTERVAL: number;
  MAKER_BONUS_RATE: number;
  MAX_PENDINGS: number;
  TRADING_FEE: number;
  UNIT_SIZE: number;
  STORAGE_INTERVAL: number;
  ICP_FEE: number;
}
export type PairTokenInfo = [Principal, string, TokenStd];
export type Address = string;
export interface CompDepositAccount {
  depositing: [Icrc1Account, Address];
  balance: [Icrc1Account, Address];
}
export interface Icrc1Account {
  owner: Principal;
  subaccount: Array<Array<number>>;
}
export interface TrieList {
  total: bigint;
  data: Array<PendingList>;
  totalPage: bigint;
}
export type PendingList = [Txid, TradingOrder];
export interface TradingOrder {
  fee: { fee0: bigint; fee1: bigint };
  gas: { gas0: bigint; gas1: bigint };
  status: TradingStatus;
  toids: Array<Toid>;
  data: Array<Array<number>>;
  time: Time;
  txid: Txid;
  icrc1Account: Array<Icrc1Account>;
  orderType: OrderType;
  filled: Array<OrderFilled>;
  expiration: Time;
  nonce: bigint;
  account: Array<number>;
  remaining: OrderPrice;
  index: bigint;
  orderPrice: OrderPrice;
  refund: [bigint, bigint, bigint];
  orderStatus?: OrderStatus;
}
export interface OrderPrice {
  quantity:
    | {
        Buy: [tokenAmount, icpPrice];
      }
    | {
        Sell: bigint;
      };
  price: bigint;
}
export type OrderStatus =
  | {
      Done: null;
    }
  | {
      Todo: null;
    }
  | {
      Doing: null;
    }
  | {
      Recovered: null;
    }
  | {
      Compensating: null;
    }
  | {
      Blocking: null;
    }
  | {};
export type icpPrice = bigint;
export type tokenAmount = bigint;
export interface OrderFilled {
  token0Value: BalanceChange;
  counterparty: Txid;
  token1Value: BalanceChange;
  time: Time;
}
export interface BalanceChange {
  DebitRecord: bigint;
  CreditRecord: bigint;
  NoChange: null;
}
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
export type Toid = bigint;
export type TradingStatus =
  | {
      Prepared: null;
    }
  | {
      Todo: null;
    }
  | {
      Closed: null;
    }
  | {
      Cancelled: null;
    }
  | {
      Pending: null;
    }
  | {
      Fail: null;
    }
  | {};
export interface Stats {
  change24h: string;
  vol24h: Vol;
  totalVol: Vol;
  price: string;
}

export default interface Service {
  comp_round(round: Array<Round>): Promise<CompRoundResponse>;
  comp_results(
    round: Array<Round>,
    page: number,
    size: number
  ): Promise<CompRoundResults>;
  info(): Promise<PairInfo>;
  comp_getDepositAccount(address: Address): Promise<CompDepositAccount>;
  pending(
    address: Array<Address>,
    page: Array<number>,
    size: Array<number>
  ): Promise<TrieList>;
  stats(): Promise<Stats>;
}
