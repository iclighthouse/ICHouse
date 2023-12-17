import { Principal } from '@dfinity/principal';
import { TxnRecord, TxnResult } from '@/ic/DRC202Bucket/model';

export interface ArchivedAccountTxns {
  total: bigint;
  totalPage: bigint;
  data: Array<[Principal, Array<TxnResult>]>;
}

export default interface Service {
  getArchivedAccountTxns(
    buckets_offset: Array<bigint>,
    buckets_length: bigint,
    address: Array<number>,
    tokenId: Array<Principal>,
    page: Array<bigint>,
    size: Array<bigint>
  ): Promise<ArchivedAccountTxns>;
  getArchivedTokenTxns(
    tokenId: Principal,
    start: bigint,
    length: bigint
  ): Promise<Array<TxnRecord>>;
  getArchivedTxn(
    tokenId: Principal,
    txid: Array<number>
  ): Promise<Array<TxnResult>>;
  getArchivedTxnByIndex(
    tokenId: Principal,
    index: bigint
  ): Promise<Array<TxnResult>>;
}
