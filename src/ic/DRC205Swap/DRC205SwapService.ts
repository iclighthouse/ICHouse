import Service, {
  DexInfo,
  DexSetting,
  Icrc1Account,
  KBar
} from '@/ic/DRC205Swap/model';
import { Identity } from '@dfinity/agent';
import { buildService } from '@/ic/Service';
import DRC205SwapIDL from './DRC205Swap.did';
import { Address, Txid } from '@/ic/common/icType';
import { TxnRecord } from '@/ic/DRC205Bucket/model';
import {
  FeeStatus,
  Liquidity,
  TokenStd,
  TokenType
} from '@/ic/DRC205Swap/model';

export class DRC205SwapService {
  private service: Service;
  constructor(DRC205SwapId: string, identity?: Identity, host?: string) {
    console.log(DRC205SwapId);
    this.service = buildService(identity, DRC205SwapIDL, DRC205SwapId, host);
  }
  public drc205_events = async (
    address: Array<Address> = []
  ): Promise<Array<TxnRecord>> => {
    return await this.service.drc205_events(address);
  };
  public drc205_txn = async (txid: Txid): Promise<Array<TxnRecord>> => {
    return await this.service.drc205_txn(txid);
  };
  public drc205_dexInfo = async (): Promise<DexInfo> => {
    try {
      return await this.service.drc205_dexInfo();
    } catch (e) {
      return null;
    }
  };
  public name = async (): Promise<string> => {
    try {
      return await this.service.name();
    } catch (e) {
      return '';
    }
  };
  public decimals = async (): Promise<number> => {
    try {
      return await this.service.decimals();
    } catch (e) {
      return null;
    }
  };
  public token0 = async (): Promise<[TokenType, Array<TokenStd>]> => {
    try {
      return await this.service.token0();
    } catch (e) {
      return null;
    }
  };
  public token1 = async (): Promise<[TokenType, Array<TokenStd>]> => {
    try {
      return await this.service.token1();
    } catch (e) {
      return null;
    }
  };
  public feeStatus = async (): Promise<FeeStatus> => {
    return await this.service.feeStatus();
  };
  public liquidity = async (
    address: Array<Address> = []
  ): Promise<Liquidity> => {
    return await this.service.liquidity(address);
  };
  public getQuotes = async (kInterval: bigint): Promise<Array<KBar>> => {
    return await this.service.getQuotes(kInterval);
  };
  public getConfig = async (): Promise<DexSetting> => {
    return await this.service.getConfig();
  };
  public getTxAccount = async (
    address: string
  ): Promise<[Icrc1Account, string, bigint, Txid]> => {
    return await this.service.getTxAccount(address);
  };
  public count = async (address: Array<string>): Promise<bigint> => {
    return await this.service.count(address);
  };
  public drc205_events_filter = async (
    address: Array<Address> = [],
    start: Array<bigint> = [],
    end: Array<bigint> = []
  ): Promise<Array<TxnRecord>> => {
    const res = await this.service.drc205_events_filter(address, start, end);
    if (res) {
      return res[0];
    }
  };
}
