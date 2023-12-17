import { TokenSymbol, TokenId, SwapId } from '@/ic/common/icType';
import { Address } from '@/ic/DRC20Token/model';

export type SwapItem = Array<SwapScanInfo>;
export interface TokenItem {
  logo: string;
  standard: string;
  symbol: TokenSymbol;
  canisterId: TokenId;
}
export interface SwapScanInfo {
  dex: string;
  logo: string;
  symbol: string;
  canisterId: SwapId;
}

export default interface Service {
  getTokenList(): Promise<Array<TokenItem>>;
  getTag(address: Address): Promise<Array<string>>;
  getSwapList(): Promise<SwapItem>;
}
