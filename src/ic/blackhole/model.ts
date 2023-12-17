import { Principal } from '@dfinity/principal';

export interface CanisterStatus {
  status: Status;
  memory_size: bigint;
  cycles: bigint;
  settings: CanisterSettings;
  module_hash: Array<Array<number>>;
}
export interface CanisterSettings {
  controllers: Array<Principal>;
  freezing_threshold: bigint;
  memory_allocation: bigint;
  compute_allocation: bigint;
}
export type Status = { stopped: null } | { stopping: null } | { running: null };

export default interface Service {
  canister_status(request: { canister_id: Principal }): Promise<CanisterStatus>;
}
