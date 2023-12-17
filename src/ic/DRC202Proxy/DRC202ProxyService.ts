import router from '@/router';
import { Identity } from '@dfinity/agent';
import Service, {
  LastTxns,
  Stats,
  Step,
  Version
} from '@/ic/DRC202Proxy/model';
import { buildService } from '@/ic/Service';
import DRC202ProxyIDL from './DRC202Proxy.did';
import {
  IC_DRC202_PROXY_CANISTER_ID,
  IC_DRC202_TEST_PROXY_CANISTER_ID
} from '@/ic/utils';
import { Bucket, TokenId, Txid } from '@/ic/common/icType';

export class DRC202ProxyService {
  private service: Service;
  constructor(identity?: Identity, host?: string) {
    let canisterId = IC_DRC202_PROXY_CANISTER_ID;
    if (router.app.$route.meta && router.app.$route.meta.type === 'Test') {
      canisterId = IC_DRC202_TEST_PROXY_CANISTER_ID;
    }
    this.service = buildService(identity, DRC202ProxyIDL, canisterId, host);
  }
  public stats = async (): Promise<Stats> => {
    return await this.service.stats();
  };
  public getLastTxns = async (): Promise<Array<LastTxns>> => {
    return await this.service.getLastTxns();
  };
  public bucket = async (
    tokenId: TokenId,
    txid: Txid,
    step: Step,
    version: Array<Version> = []
  ): Promise<Array<Bucket>> => {
    return await this.service.bucket(tokenId, txid, step, version);
  };
  public bucketList = async (): Promise<Array<Bucket>> => {
    return await this.service.bucketList();
  };
}
