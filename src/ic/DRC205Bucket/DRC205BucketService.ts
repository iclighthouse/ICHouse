import { Identity } from '@dfinity/agent';
import Service, { txnByAccountIdRes, TxnResult } from '@/ic/DRC205Bucket/model';
import { buildService } from '@/ic/Service';
import DRC205BucketIDL from './DRC205Bucket.did';
import { AppId } from '@/ic/DRC205Proxy/model';
import { Txid } from '@/ic/common/icType';

export class DRC205BucketService {
  private service: Service;
  constructor(DRC205BucketId: string, identity?: Identity, host?: string) {
    this.service = buildService(
      identity,
      DRC205BucketIDL,
      DRC205BucketId,
      host
    );
  }
  public txn = async (appId: AppId, txid: Txid): Promise<Array<TxnResult>> => {
    return await this.service.txn(appId, txid);
  };
  public txnHistory = async (
    appId: AppId,
    txid: Txid
  ): Promise<Array<TxnResult>> => {
    return await this.service.txnHistory(appId, txid);
  };
  public txnByAccountId = async (
    accountId: Array<number>,
    appId: Array<AppId>,
    page: Array<number>,
    size: Array<number>
  ): Promise<txnByAccountIdRes> => {
    try {
      return await this.service.txnByAccountId(accountId, appId, page, size);
    } catch (e) {
      console.error(e);
      return null;
    }
  };
  public txnByIndex = async (appId: AppId, index: bigint): Promise<Array<TxnResult>> => {
    try {
      return await this.service.txnByIndex(appId, index);
    } catch (e) {
      console.error(e);
      return null;
    }
  }
}
