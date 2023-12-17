import Service, { ChainAccount, CkToken, ICAccount, IcEvent, TrieList } from '@/ic/icETHMinter/model';
import { buildService } from '@/ic/Service';
import IDL from '@/ic/icETHMinter/icETHMinter.did';
import { IC_ETH_MINTER_CANISTER_ID } from '@/ic/utils';
import { Icrc1Account, Time } from '@/ic/common/icType';

export class icETHMinterService {
  private service: Service;
  constructor(host?: string, minterId = IC_ETH_MINTER_CANISTER_ID) {
    this.service = buildService(null, IDL, minterId, host);
  }
  public getCkTokens = async (): Promise<Array<CkToken>> => {
    try {
      return await this.service.get_ck_tokens();
    } catch (e) {
      console.error(e);
      return null;
    }
  };
  public getEvents = async (
    page: Array<bigint>,
    pageSize: Array<bigint>
  ): Promise<TrieList> => {
    try {
      return await this.service.get_events(page, pageSize);
    } catch (e) {
      console.error(e);
      return null;
    }
  };
  public getAccountEvents = async (
    accountId: Array<number>
  ): Promise<Array<[IcEvent, Time]>> => {
    try {
      return await this.service.get_account_events(accountId);
    } catch (e) {
      console.error(e);
      return null;
    }
  };
  public getCachedAccount = async (
    ethAddress: string
  ): Promise<Array<Array<ICAccount>>> => {
    try {
      return await this.service.get_cached_account(ethAddress);
    } catch (e) {
      console.error(e);
      return null;
    }
  };
  public getCachedAddress = async (
    accountId: Array<number>
  ): Promise<Array<Array<ChainAccount>>> => {
    try {
      return await this.service.get_cached_address(accountId);
    } catch (e) {
      console.error(e);
      return null;
    }
  };
  public getCachedTxAccount = async (
    txHash: string
  ): Promise<Array<Array<[ChainAccount, Icrc1Account]>>> => {
    try {
      return await this.service.get_cached_tx_account(txHash);
    } catch (e) {
      console.error(e);
      return null;
    }
  };
}
