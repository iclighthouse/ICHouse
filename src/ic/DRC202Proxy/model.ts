import { Bucket, TokenId, Txid } from '@/ic/common/icType';

export interface Stats {
  txnCount: bigint;
  bucketCount: bigint;
  storeErrPool: bigint;
  errCount: bigint;
  tokenCount: bigint;
}
export type LastTxns = [Index, TokenId, IndexInToken, Txid];
export type Index = bigint;
export type IndexInToken = bigint;
export type Step = bigint;
export type Version = number;

export default interface Service {
  stats(): Promise<Stats>;
  getLastTxns(): Promise<Array<LastTxns>>;
  bucket(
    tokenId: TokenId,
    txid: Txid,
    step: Step,
    version: Array<Version>
  ): Promise<Array<Bucket>>;
  bucketList(): Promise<Array<Bucket>>;
}
