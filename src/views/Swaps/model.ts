import { Time } from '@/ic/common/icType';
import { TxnRecord } from '@/ic/DRC205Bucket/model';
import { AppId } from '@/ic/DRC205Proxy/model';

export type LatestTransaction = [TxnRecord, Time, bigint, AppId];
