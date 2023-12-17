import { Time, TokenId } from '@/ic/common/icType';
import { TxnRecord } from '@/ic/DRC202Bucket/model';

export type LatestTransaction = [TxnRecord, Time, bigint, TokenId];
