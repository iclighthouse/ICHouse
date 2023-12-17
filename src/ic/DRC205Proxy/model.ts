import { Principal } from '@dfinity/principal';
import { Bucket, Txid } from '@/ic/common/icType';
import { Step, Version } from '@/ic/DRC202Proxy/model';

export interface Stats {
  txnCount: bigint;
  bucketCount: bigint;
  storeErrPool: bigint;
  appCount: bigint;
  errCount: bigint;
}
export type LastTxns = [Index, AppId, IndexInApp, Txid, TxidIndex?];
export type Index = bigint;
export type AppId = Principal;
export type IndexInApp = bigint;
export type TxidIndex = number;

export default interface Service {
  stats(): Promise<Stats>;
  getLastTxns(): Promise<Array<LastTxns>>;
  bucket(
    appId: AppId,
    txid: Txid,
    step: Step,
    version: Array<Version> | null
  ): Promise<Array<Bucket> | null>;
  bucketList(): Promise<Array<Bucket>>;
}
