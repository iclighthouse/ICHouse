import Service, {
  icBTCEvents,
  RetrieveStatus,
  SendingBtcStatus,
  TrieList,
  TrieList_1,
  TrieList_send
} from '@/ic/ckbtcMinter/icBTCModel';
import { IC_BTC_MINTER_CANISTER_ID } from '@/ic/utils';
import { buildService } from '@/ic/Service';
import IDL from '@/ic/ckbtcMinter/icBTCMinter.did';

export class IcBTCMinterService {
  private service: Service;
  constructor(host?: string, minterId = IC_BTC_MINTER_CANISTER_ID) {
    this.service = buildService(null, IDL, minterId, host);
  }
  public getEvents = async (
    page: Array<bigint>,
    size: Array<bigint>
  ): Promise<TrieList> => {
    try {
      return await this.service.get_events(page, size);
    } catch (e) {
      console.error(e);
      return null;
    }
  };
  public retrieveLog = async (
    request: Array<bigint> = []
  ): Promise<Array<RetrieveStatus>> => {
    try {
      return await this.service.retrieval_log(request);
    } catch (e) {
      console.error(e);
      return null;
    }
  };
  public sendingLog = async (
    request: Array<bigint> = []
  ): Promise<Array<SendingBtcStatus>> => {
    try {
      return await this.service.sending_log(request);
    } catch (e) {
      console.error(e);
      return null;
    }
  };
  public sendingLogList = async (
    page: Array<bigint>,
    size: Array<bigint>
  ): Promise<TrieList_send> => {
    try {
      return await this.service.sending_log_list(page, size);
    } catch (e) {
      console.error(e);
      return null;
    }
  };
  public retrievalLogList = async (
    page: Array<bigint>,
    size: Array<bigint>
  ): Promise<TrieList_1> => {
    try {
      return await this.service.retrieval_log_list(page, size);
    } catch (e) {
      console.error(e);
      return null;
    }
  };
  public getAccountEvents = async (
    accountId: Array<number>
  ): Promise<Array<icBTCEvents>> => {
    try {
      return await this.service.get_account_events(accountId);
    } catch (e) {
      console.error(e);
      return null;
    }
  };
}
