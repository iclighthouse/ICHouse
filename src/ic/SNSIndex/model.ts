import { Icrc1Account } from '@/ic/common/icType';
import { Burn, Mint, Transfer } from '@/ic/DRC20Token/model';

export interface GetAccountTransactionsArgs {
  max_results: bigint;
  start: Array<bigint>;
  account: Icrc1Account;
}
export type GetTransactionsResult =
  | { Ok: GetTransaction }
  | { Err: GetTransactionsErr };
export interface GetTransaction {
  transactions: Array<TransactionWithId>;
  oldest_tx_id: Array<bigint>;
}
export interface TransactionWithId {
  id: bigint;
  transaction: Transaction;
}
export interface Transaction {
  burn: Array<Burn>;
  kind: string;
  mint: Array<Mint>;
  timestamp: bigint;
  transfer: Array<Transfer>;
}
export interface GetTransactionsErr {
  message: string;
}

export default interface Service {
  get_account_transactions(
    request: GetAccountTransactionsArgs
  ): Promise<GetTransactionsResult>;
}
