import { Principal } from '@dfinity/principal';
import { Icrc1Account } from '@/ic/common/icType';

export interface GetMetadataResponse {
  url: Array<string>;
  logo: Array<string>;
  name: Array<string>;
  description: Array<string>;
}
export interface ListNeurons {
  of_principal: Array<Principal>;
  limit: bigint;
  start_page_at: Array<SNSNeuronId>;
}
export interface SNSNeuronId {
  id: Array<number>;
}
export interface ListNeuronsResponse {
  neurons: Array<SNSNeuron>;
}
export interface SNSNeuron {
  id: Array<SNSNeuronId>;
  staked_maturity_e8s_equivalent: Array<bigint>;
  permissions: Array<NeuronPermission>;
  maturity_e8s_equivalent: bigint;
  cached_neuron_stake_e8s: bigint;
  created_timestamp_seconds: bigint;
  source_nns_neuron_id: Array<bigint>;
  auto_stake_maturity: Array<boolean>;
  aging_since_timestamp_seconds: bigint;
  dissolve_state: Array<DissolveState>;
  voting_power_percentage_multiplier: bigint;
  followees: Array<[bigint, Followees]>;
  neuron_fees_e8s: bigint;
  vesting_period_seconds: Array<bigint>;
  disburse_maturity_in_progress: Array<DisburseMaturityInProgress>;
  dissolveTime?: string;
  age?: string;
  status?: string;
  votingPower?: string;
}
export interface DisburseMaturityInProgress {
  timestamp_of_disbursement_seconds: bigint;
  amount_e8s: bigint;
  account_to_disburse_to: Array<Icrc1Account>;
}
export interface NeuronPermission {
  principal: Array<Principal>;
  permission_type: Array<bigint>;
}
export type DissolveState =
  | {
      DissolveDelaySeconds: bigint;
    }
  | { WhenDissolvedTimestampSeconds: bigint };
export interface Followees {
  followees: Array<SNSNeuronId>;
}
export interface SNSManageNeuron {
  subaccount: Array<number>;
  command: Array<Command>;
}
export type Command =
  | {
      Split: Split;
    }
  | {
      Follow: Follow;
    }
  | {
      DisburseMaturity: DisburseMaturity;
    }
  | {
      ClaimOrRefresh: ClaimOrRefresh;
    }
  | {
      Configure: Configure;
    }
  | {
      RegisterVote: RegisterVote;
    }
  | {
      MakeProposal: Proposal;
    }
  | {
      StakeMaturity: StakeMaturity;
    }
  | {
      RemoveNeuronPermissions: RemoveNeuronPermissions;
    }
  | {
      AddNeuronPermissions: AddNeuronPermissions;
    }
  | {
      MergeMaturity: MergeMaturity;
    }
  | {
      Disburse: Disburse;
    };
export interface Split {
  memo: bigint;
  amount_e8s: bigint;
}
export interface Follow {
  function_id: bigint;
  followees: Array<SNSNeuronId>;
}
export interface DisburseMaturity {
  to_account: Array<{owner: Array<Principal>, subaccount: Array<{subaccount: Array<number>}>}>;
  percentage_to_disburse: bigint;
}
export interface ClaimOrRefresh {
  by: Array<By>;
}
export type By =
  | { MemoAndController: MemoAndController }
  | {
      NeuronId: {};
    };
export interface MemoAndController {
  controller: Array<Principal>;
  memo: bigint;
}
export interface Configure {
  operation: Array<Operation>;
}
export type Operation =
  | { ChangeAutoStakeMaturity: ChangeAutoStakeMaturity }
  | {
      StopDissolving: {};
    }
  | {
      StartDissolving: {};
    }
  | {
      IncreaseDissolveDelay: IncreaseDissolveDelay;
    }
  | {
      SetDissolveTimestamp: SetDissolveTimestamp;
    };
export interface ChangeAutoStakeMaturity {
  requested_setting_for_auto_stake_maturity: boolean;
}
export interface IncreaseDissolveDelay {
  additional_dissolve_delay_seconds: bigint;
}
export interface SetDissolveTimestamp {
  dissolve_timestamp_seconds: bigint;
}
export interface RegisterVote {
  vote: number;
  proposal: Array<ProposalId>;
}
export interface ProposalId {
  id: bigint;
}
export interface Proposal {
  url: string;
  title: string;
  action: Array<Action>;
  summary: string;
}
export type Action =
  | {
      ManageNervousSystemParameters: NervousSystemParameters;
    }
  | {
      AddGenericNervousSystemFunction: NervousSystemFunction;
    }
  | {
      RemoveGenericNervousSystemFunction: bigint;
    }
  | {
      UpgradeSnsToNextVersion: {};
    }
  | { RegisterDappCanisters: RegisterDappCanisters }
  | {
      TransferSnsTreasuryFunds: TransferSnsTreasuryFunds;
    }
  | {
      UpgradeSnsControlledCanister: UpgradeSnsControlledCanister;
    }
  | { DeregisterDappCanisters: DeregisterDappCanisters }
  | {
      Unspecified: {};
    }
  | {
      ManageSnsMetadata: ManageSnsMetadata;
    }
  | {
      ExecuteGenericNervousSystemFunction: ExecuteGenericNervousSystemFunction;
    }
  | {
      Motion: Motion;
    };
export interface DeregisterDappCanisters {
  canister_ids: Array<Principal>;
  new_controllers: Array<Principal>;
}
export interface RegisterDappCanisters {
  canister_ids: Array<Principal>;
}
export interface NervousSystemParameters {
  default_followees: Array<DefaultFollowees>;
  max_dissolve_delay_seconds: Array<bigint>;
  max_dissolve_delay_bonus_percentage: Array<bigint>;
  max_followees_per_function: Array<bigint>;
  neuron_claimer_permissions: Array<NeuronPermissionList>;
  neuron_minimum_stake_e8s: Array<bigint>;
  max_neuron_age_for_age_bonus: Array<bigint>;
  initial_voting_period_seconds: Array<bigint>;
  neuron_minimum_dissolve_delay_to_vote_seconds: Array<bigint>;
  reject_cost_e8s: Array<bigint>;
  max_proposals_to_keep_per_action: Array<bigint>;
  wait_for_quiet_deadline_increase_seconds: Array<bigint>;
  max_number_of_neurons: Array<bigint>;
  transaction_fee_e8s: Array<bigint>;
  max_number_of_proposals_with_ballots: Array<bigint>;
  max_age_bonus_percentage: Array<bigint>;
  neuron_grantable_permissions: Array<NeuronPermissionList>;
  voting_rewards_parameters: Array<VotingRewardsParameters>;
  maturity_modulation_disabled?: Array<boolean>;
  max_number_of_principals_per_neuron: Array<bigint>;
}
export interface DefaultFollowees {
  followees: Array<[bigint, Followees]>;
}
export interface NeuronPermissionList {
  permissions: Array<bigint>;
}
export interface VotingRewardsParameters {
  final_reward_rate_basis_points: Array<bigint>;
  initial_reward_rate_basis_points: Array<bigint>;
  reward_rate_transition_duration_seconds: Array<bigint>;
  round_duration_seconds: Array<bigint>;
}
export interface NervousSystemFunction {
  id: bigint;
  name: string;
  description: Array<string>;
  function_type: Array<FunctionType>;
}
export type FunctionType =
  | {
      NativeNervousSystemFunction: {};
    }
  | {
      GenericNervousSystemFunction: GenericNervousSystemFunction;
    };
export interface GenericNervousSystemFunction {
  validator_canister_id: Array<Principal>;
  target_canister_id: Array<Principal>;
  validator_method_name: Array<string>;
  target_method_name: Array<string>;
}
export interface TransferSnsTreasuryFunds {
  from_treasury: bigint;
  to_principal: Array<Principal>;
  to_subaccount: Array<{ subaccount: Array<number> }>;
  memo: Array<bigint>;
  amount_e8s: bigint;
}
export interface UpgradeSnsControlledCanister {
  new_canister_wasm: Array<number>;
  mode: Array<bigint>;
  canister_id: Array<Principal>;
  canister_upgrade_arg: Array<Array<number>>;
}
export interface ManageSnsMetadata {
  url: Array<string>;
  logo: Array<string>;
  name: Array<string>;
  description: Array<string>;
}
export interface ExecuteGenericNervousSystemFunction {
  function_id: bigint;
  payload: Array<number>;
}
export interface Motion {
  motion_text: string;
}
export interface StakeMaturity {
  percentage_to_stake: Array<bigint>;
}
export interface RemoveNeuronPermissions {
  permissions_to_remove: Array<NeuronPermissionList>;
  principal_id: Array<Principal>;
}
export interface AddNeuronPermissions {
  permissions_to_add: Array<NeuronPermissionList>;
  principal_id: Array<Principal>;
}
export interface MergeMaturity {
  percentage_to_merge: bigint;
}
export interface Disburse {
  to_account: Array<Icrc1Account>;
  amount: Array<Amount>;
}
export interface Amount {
  e8s: bigint;
}
export interface SNSManageNeuronResponse {
  command: Array<Command_1>;
}
export type Command_1 =
  | {
      Error: GovernanceError;
    }
  | {
      Split: SplitResponse;
    }
  | {
      Follow: {};
    }
  | {
      DisburseMaturity: DisburseMaturityResponse;
    }
  | {
      ClaimOrRefresh: ClaimOrRefreshResponse;
    }
  | {
      Configure: {};
    }
  | {
      RegisterVote: {};
    }
  | {
      MakeProposal: GetProposal;
    }
  | {
      RemoveNeuronPermission: {};
    }
  | {
      StakeMaturity: StakeMaturityResponse;
    }
  | {
      MergeMaturity: MergeMaturityResponse;
    }
  | {
      Disburse: DisburseResponse;
    }
  | {
      AddNeuronPermission: {};
    };
export interface GovernanceError {
  error_message: string;
  error_type: bigint;
}
export interface SplitResponse {
  created_neuron_id: Array<SNSNeuronId>;
}
export interface DisburseMaturityResponse {
  amount_disbursed_e8s: bigint;
}
export interface ClaimOrRefreshResponse {
  refreshed_neuron_id: Array<SNSNeuronId>;
}
export interface GetProposal {
  proposal_id: Array<ProposalId>;
}
export interface StakeMaturityResponse {
  maturity_e8s: bigint;
  staked_maturity_e8s: bigint;
}
export interface MergeMaturityResponse {
  merged_maturity_e8s: bigint;
  new_stake_e8s: bigint;
}
export interface DisburseResponse {
  transfer_block_height: bigint;
}
export interface GetNeuron {
  neuron_id: Array<SNSNeuronId>;
}
export interface GetNeuronResponse {
  result: Array<GetNeuronResponseResult>;
}
export type GetNeuronResponseResult =
  | { Error: GovernanceError }
  | { Neuron: SNSNeuron };
export interface ListNervousSystemFunctionsResponse {
  reserved_ids: Array<bigint>;
  functions: Array<NervousSystemFunction>;
}
export interface ListProposals {
  include_reward_status: Array<number>;
  before_proposal: Array<ProposalId>;
  limit: bigint;
  exclude_type: Array<bigint>;
  include_status: Array<number>;
}
export interface ListProposalsResponse {
  proposals: Array<ProposalData>;
}
export interface ProposalData {
  id: Array<ProposalId>;
  payload_text_rendering: Array<string>;
  action: bigint;
  failure_reason: Array<GovernanceError>;
  ballots: Array<[string, Ballot]>;
  reward_event_round: bigint;
  failed_timestamp_seconds: bigint;
  proposal_creation_timestamp_seconds: bigint;
  initial_voting_period_seconds: bigint;
  reject_cost_e8s: bigint;
  latest_tally: Array<Tally>;
  wait_for_quiet_deadline_increase_seconds: bigint;
  decided_timestamp_seconds: bigint;
  proposal: Array<Proposal>;
  proposer: Array<SNSNeuronId>;
  wait_for_quiet_state: Array<WaitForQuietState>;
  is_eligible_for_rewards: boolean;
  executed_timestamp_seconds: bigint;
  reward_event_end_timestamp_seconds?: Array<bigint>;
}
export interface Ballot {
  vote: bigint;
  cast_timestamp_seconds: bigint;
  voting_power: bigint;
}
export interface Tally {
  no: bigint;
  yes: bigint;
  total: bigint;
  timestamp_seconds: bigint;
}
export interface WaitForQuietState {
  current_deadline_timestamp_seconds: bigint;
}
export interface GetProposalResponse {
  result: Array<Result_1>;
}
export type Result_1 =
  | { Error: GovernanceError }
  | {
      Proposal: ProposalData;
    };

export default interface Service {
  get_metadata({}): Promise<GetMetadataResponse>;
  list_neurons(request: ListNeurons): Promise<ListNeuronsResponse>;
  get_nervous_system_parameters(
    request: null
  ): Promise<NervousSystemParameters>;
  manage_neuron(request: SNSManageNeuron): Promise<SNSManageNeuronResponse>;
  get_neuron(request: GetNeuron): Promise<GetNeuronResponse>;
  list_nervous_system_functions(): Promise<ListNervousSystemFunctionsResponse>;
  list_proposals(request: ListProposals): Promise<ListProposalsResponse>;
  get_proposal(request: GetProposal): Promise<GetProposalResponse>;
}
