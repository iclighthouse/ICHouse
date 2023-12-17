import { Identity } from '@dfinity/agent';
import Service, { txnByAccountIdRes } from '@/ic/DRC202Bucket/model';
import { buildService } from '@/ic/Service';
import DRC202BucketIDL from './DRC202Bucket.did';
import { TokenId, Txid } from '@/ic/common/icType';
import { TxnResult } from '@/ic/DRC202Bucket/model';
import { AppId } from '@/ic/DRC205Proxy/model';

export class DRC202BucketService {
  private service: Service;
  constructor(DRC202BucketId: string, identity?: Identity, host?: string) {
    this.service = buildService(
      identity,
      DRC202BucketIDL,
      DRC202BucketId,
      host
    );
  }
  public txn = async (
    tokenId: TokenId,
    txid: Txid
  ): Promise<Array<TxnResult>> => {
    return await this.service.txn(tokenId, txid);
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
  };
}
