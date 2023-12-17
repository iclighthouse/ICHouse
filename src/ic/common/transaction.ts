export interface TransactionsResponse {
  total_count: number;
  transactions: Array<Transactions>;
}
export interface Transactions {
  block_identifier: blockIdentifier;
  transaction: Transaction;
}
export interface blockIdentifier {
  hash: string;
  index: number;
}
export interface Transaction {
  metadata: Metadata;
  operations: Operations[];
  transaction_identifier: TransactionIdentifier;
}
export interface Metadata {
  block_height: number;
  memo: bigint;
  timestamp: bigint;
}
export interface TransactionIdentifier {
  hash: string;
}
export interface Operations {
  account: {
    address: string;
  };
  amount: Amount;
  operation_identifier: { index: number };
  status: string;
  type: string;
}
export interface Amount {
  currency: {
    decimals: number;
    symbol: string;
  };
  value: string;
}

export interface ICPTransaction {
  allowance: string;
  amount: string;
  block_hash: string;
  block_height: string;
  created_at: number;
  expected_allowance: string;
  expires_at: number;
  fee: string;
  from_account_identifier: string;
  icrc1_memo: string;
  memo: string;
  parent_hash: string;
  spender_account_identifier: string;
  to_account_identifier: string;
  transaction_hash: string;
  transfer_type: string;
}
export interface ICPTransactions {
  total: number;
  blocks: Array<ICPTransaction>;
}
