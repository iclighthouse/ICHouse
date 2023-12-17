import Service, { ETHEvent } from '@/ic/ckETHMinter/model';
import IDL from '@/ic/ckETHMinter/ckETHMinterDfi.did';
import { buildService } from '@/ic/Service';
import { CK_ETH_MINTER_CANISTER_ID } from '@/ic/utils';

export class ckETHMinterDfiService {
  private service: Service;
  constructor(host?: string, minterId = CK_ETH_MINTER_CANISTER_ID) {
    this.service = buildService(null, IDL, minterId, host);
  }
  public smart_contract_address = async (): Promise<string> => {
    try {
      return await this.service.smart_contract_address();
    } catch (e) {
      console.log(e);
      return null;
    }
  };
  public get_events = async (request: {
    start: bigint;
    length: bigint;
  }): Promise<{ total_event_count: bigint; events: Array<ETHEvent> }> => {
    try {
      return await this.service.get_events(request);
    } catch (e) {
      console.log(e);
      return null;
    }
  };
}
