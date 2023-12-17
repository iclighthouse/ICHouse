import { Identity } from '@dfinity/agent';
import { buildService } from '@/ic/Service';
import SNSGovernanceIDL from './SNSGovernance.did';
import SNSGovernanceSNS1IDL from './SNSGovernanceSNS1.did';
import Service, { GetMetadataResponse } from '@/ic/SNSGovernance/model';

export class SNSGovernanceService {
  public getService(
    canisterId: string,
    identity?: Identity,
    host?: string
  ): Service {
    let idl = SNSGovernanceIDL;
    if (canisterId === 'zqfso-syaaa-aaaaq-aaafq-cai') {
      idl = SNSGovernanceSNS1IDL;
    }
    return buildService(identity, idl, canisterId, host);
  }
  public getMetadata = async (
    canisterId: string
  ): Promise<GetMetadataResponse> => {
    const service = this.getService(canisterId);
    try {
      return await service.get_metadata({});
    } catch (e) {
      console.error(e);
      return null;
    }
  };
}
