import Service, { DeployedSns } from '@/ic/SNSWasm/model';
import { buildService } from '@/ic/Service';
import { SNS_WASM_CANISTER_ID } from '@/ic/utils';
import { Identity } from '@dfinity/agent';
import SNSWasmIDL from './SNSWasm.did';

export class SNSWasmService {
  private service: Service;
  constructor(identity?: Identity, host?: string) {
    this.service = buildService(
      identity,
      SNSWasmIDL,
      SNS_WASM_CANISTER_ID,
      host
    );
  }
  public listDeployedSnses = async (): Promise<Array<DeployedSns>> => {
    try {
      const res = await this.service.list_deployed_snses({});
      if (res) {
        return res.instances;
      }
    } catch (e) {
      console.log(e);
      return [];
    }
  };
}
