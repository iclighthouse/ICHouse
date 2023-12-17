import Service, {
  DexCompetitionResponse,
  DexName,
  TrieList,
  TrieList_2,
  TrieList_3
} from '@/ic/ICSwapRouter/model';
import {
  IC_SWAP_ROUTER_CANISTER_ID,
  IC_SWAP_TEST_ROUTER_CANISTER_ID
} from '@/ic/utils';
import ICSwapRouterIDL from './ICSwapRouter.did';
import { buildService } from '@/ic/Service';
import { Identity } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';
import router from '@/router';

export class ICSwapRouterService {
  private service: Service;
  constructor(identity?: Identity, host?: string) {
    let canisterId = IC_SWAP_ROUTER_CANISTER_ID;
    if (router.app.$route.meta && router.app.$route.meta.type === 'Test') {
      canisterId = IC_SWAP_TEST_ROUTER_CANISTER_ID;
    }
    this.service = buildService(identity, ICSwapRouterIDL, canisterId, host);
  }
  public getCompetitions = async (
    dexName: Array<DexName>,
    page: Array<number> = [],
    size: Array<number> = []
  ): Promise<TrieList_2> => {
    try {
      return await this.service.getCompetitions(dexName, page, size);
    } catch (e) {
      console.log(e);
      return null;
    }
  };
  public getDexCompetitionRound = async (): Promise<bigint> => {
    try {
      return await this.service.getDexCompetitionRound();
    } catch (e) {
      console.error(e);
      return null;
    }
  };
  public getDexCompetition = async (
    round: bigint
  ): Promise<Array<DexCompetitionResponse>> => {
    try {
      return await this.service.getDexCompetition(round);
    } catch (e) {
      console.error(e);
      return null;
    }
  };
  public getDexCompetitionTraders = async (
    round: bigint,
    page: Array<number> = [],
    size: Array<number> = []
  ): Promise<TrieList_3> => {
    try {
      return await this.service.getDexCompetitionTraders(round, page, size);
    } catch (e) {
      console.error(e);
      return null;
    }
  };
  public getPairs2 = async (
    dexName: Array<string> = [],
    principal: Array<Principal> = [],
    page: Array<bigint> = [],
    pageSize: Array<bigint> = []
  ): Promise<TrieList> => {
    try {
      return await this.service.getPairs2(dexName, principal, page, pageSize);
    } catch (e) {
      console.log(e);
      return null;
    }
  };
}
