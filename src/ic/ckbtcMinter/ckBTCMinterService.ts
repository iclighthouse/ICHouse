import Service, {
  MinterEvent,
  SendingBtcStatus,
  Stats
} from '@/ic/ckbtcMinter/model';
import { buildService } from '@/ic/Service';
import IDL from './ckBTCMinter.did.js';
import { CK_BTC_MINTER_CANISTER_ID } from '@/ic/utils';

export class ckBTCMinterService {
  private service: Service;
  constructor(host?: string, minterId = CK_BTC_MINTER_CANISTER_ID) {
    this.service = buildService(null, IDL, minterId, host);
  }
  public getEvents = async (
    start: bigint,
    length: bigint
  ): Promise<Array<MinterEvent>> => {
    return await this.service.get_events({ start: start, length: length });
  };
  public stats = async (): Promise<Stats> => {
    return await this.service.stats();
  };
  public sendingLog = async (txIndex: bigint): Promise<Array<SendingBtcStatus>> => {
    return await this.service.sendingLog([txIndex]);
  };
}
