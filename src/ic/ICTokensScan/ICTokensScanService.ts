import Service, { SwapItem, TokenItem } from '@/ic/ICTokensScan/model';
import { Identity } from '@dfinity/agent';
import { buildService } from '@/ic/Service';
import ICTokensScanIDL from './ICTokensScan.did';
import { IC_TOKENS_SCAN_CANISTER_ID } from '@/ic/utils';
import { Address } from '@/ic/DRC20Token/model';

export class ICTokensScanService {
  private service: Service;
  constructor(identity?: Identity, host?: string) {
    this.service = buildService(
      identity,
      ICTokensScanIDL,
      IC_TOKENS_SCAN_CANISTER_ID,
      host
    );
  }
  public getTokenList = async (): Promise<Array<TokenItem>> => {
    return await this.service.getTokenList();
  };
  public getSwapList = async (): Promise<SwapItem> => {
    return await this.service.getSwapList();
  };
  public getTag = async (address: Address): Promise<Array<string>> => {
    return await this.service.getTag(address);
  };
}
