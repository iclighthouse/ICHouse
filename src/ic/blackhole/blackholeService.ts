import Service, { CanisterStatus } from '@/ic/blackhole/model';
import { Identity } from '@dfinity/agent';
import { buildService } from '@/ic/Service';
import BlackholeIdIDL from './blackhole.did';
import { Principal } from '@dfinity/principal';

export class BlackholeService {
  private service: Service;
  constructor(BlackholeId: string, identity?: Identity, host?: string) {
    this.service = buildService(identity, BlackholeIdIDL, BlackholeId, host);
  }
  public getCanisterStatus = async (
    canisterId: string
  ): Promise<CanisterStatus> => {
    return await this.service.canister_status({
      canister_id: Principal.fromText(canisterId)
    });
  };
}
