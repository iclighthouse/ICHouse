import Service, {
  Address, CompDepositAccount,
  CompRoundResponse,
  CompRoundResults, PairInfo,
  Round, Stats, TrieList
} from '@/ic/ICDex/model';
import ICDexIDL from './ICDex.did';
import { buildService } from '@/ic/Service';
import { Identity } from '@dfinity/agent';

export class ICDexService {
  private service: Service;

  constructor(id: string, identity?: Identity, host?: string) {
    this.service = buildService(identity, ICDexIDL, id, host);
  }
  public comp_round = async (
    round: Array<Round> = []
  ): Promise<CompRoundResponse> => {
    try {
      return await this.service.comp_round(round);
    } catch (e) {
      console.log(e);
      return null;
    }
  };
  public comp_results = async (
    round: Array<Round>,
    page: number,
    size: number
  ): Promise<CompRoundResults> => {
    try {
      return await this.service.comp_results(round, page, size);
    } catch (e) {
      console.log(e);
      return null;
    }
  };
  public info = async (): Promise<PairInfo> => {
    try {
      return await this.service.info();
    } catch (e) {
      console.log(e);
      return null;
    }
  };
  public comp_getDepositAccount = async (
    canisterId: string,
    address: Address
  ): Promise<CompDepositAccount> => {
    try {
      return await this.service.comp_getDepositAccount(address);
    } catch (e) {
      console.log(e);
      return null
    }
  };
  public pending = async (
    address: Array<Address>,
    page: Array<number> = [],
    size: Array<number> = []
  ): Promise<TrieList> => {
    try {
      return await this.service.pending(address, page, size);
    } catch (e) {
      console.log(e);
      return null
    }
  };
  public stats = async (): Promise<Stats> => {
    try {
      return await this.service.stats();
    } catch (e) {
      console.log(e);
      return null
    }
  };
}
