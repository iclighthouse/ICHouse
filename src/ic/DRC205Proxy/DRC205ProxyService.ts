import { Identity } from '@dfinity/agent';
import Service, { AppId, LastTxns } from '@/ic/DRC205Proxy/model';
import { buildService } from '@/ic/Service';
import {
  IC_DRC205_PROXY_CANISTER_ID,
  IC_DRC205_TEST_PROXY_CANISTER_ID
} from '@/ic/utils';
import DRC205ProxyIDL from './DRC205Proxy.did';
import { Stats } from '@/ic/DRC205Proxy/model';
import { Bucket, Txid } from '@/ic/common/icType';
import { Step, Version } from '@/ic/DRC202Proxy/model';
import router from '@/router';

export class DRC205ProxyService {
  private service: Service;
  constructor(identity?: Identity, host?: string) {
    let canisterId = IC_DRC205_PROXY_CANISTER_ID;
    if (router.app.$route.meta && router.app.$route.meta.type === 'Test') {
      canisterId = IC_DRC205_TEST_PROXY_CANISTER_ID;
    }
    this.service = buildService(identity, DRC205ProxyIDL, canisterId, host);
  }
  public stats = async (): Promise<Stats> => {
    return await this.service.stats();
  };
  public getLastTxns = async (): Promise<Array<LastTxns>> => {
    return await this.service.getLastTxns();
  };
  public bucket = async (
    appId: AppId,
    txid: Txid,
    step: Step,
    version: Array<Version> = []
  ): Promise<Array<Bucket>> => {
    return await this.service.bucket(appId, txid, step, version);
  };
  public bucketList = async (): Promise<Array<Bucket>> => {
    try {
      return await this.service.bucketList();
    } catch (e) {
      console.error(e);
      return [];
    }
  };
}
