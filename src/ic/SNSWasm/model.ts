import { Principal } from '@dfinity/principal';

export interface ListDeployedSnsesResponse {
  instances: Array<DeployedSns>;
}
export interface DeployedSns {
  root_canister_id: Array<Principal>;
  governance_canister_id: Array<Principal>;
  index_canister_id: Array<Principal>;
  swap_canister_id: Array<Principal>;
  ledger_canister_id: Array<Principal>;
}

export default interface Service {
  list_deployed_snses(request: {}): Promise<ListDeployedSnsesResponse>;
}
