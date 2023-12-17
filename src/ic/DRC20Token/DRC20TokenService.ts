import { Identity, HttpAgent, QueryResponse } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';
import Service, {
  Address,
  CanisterStatusToken,
  DRC207Support,
  GetTransactionsRequest,
  GetTransactionsResponse,
  Icrc1SupportedStandards,
  IcrcMetadata,
  Top100Record,
  TxnQueryRequest,
  TxnQueryResponse
} from '../DRC20Token/model';
import { buildService } from '../Service';
import DRC20IDL from './DRC20Token.did';
import OGYIDL from './OGYToken.did';
import SNSTokenIDL from './SNSToken.did';
import {
  Decimals,
  Gas,
  Icrc1Account,
  Metadata,
  TokenInfo,
  TotalSupply,
  Txid
} from '../common/icType';
import { TxnRecord } from '@/ic/DRC202Bucket/model';
import { Amount } from '@/ic/common/transaction';
import { SwapPair } from '@/ic/ICSwapRouter/model';

export class DRC20TokenService {
  private readonly service: Service;
  private readonly agent: HttpAgent;
  constructor(DRC202TokenId: string, identity?: Identity, host?: string) {
    let idl = DRC20IDL;
    if (DRC202TokenId === 'rd6wb-lyaaa-aaaaj-acvla-cai') {
      idl = OGYIDL;
    }
    this.service = buildService(identity, idl, DRC202TokenId, host);
    this.agent = new HttpAgent({
      host: 'https://ic0.app/',
      identity: identity
    });
  }
  public decimals = async (): Promise<Decimals> => {
    let decimals = null;
    try {
      decimals = await this.service.drc20_decimals();
      return decimals;
    } catch (e) {
      try {
        decimals = await this.service.decimals();
        return decimals;
      } catch (e) {
        return null;
      }
    }
  };
  public gas = async (): Promise<Gas | Amount> => {
    try {
      return await this.service.drc20_gas();
    } catch (e) {
      try {
        return await this.service.drc20_fee();
      } catch (e) {
        return null;
      }
    }
  };
  public metadata = async (): Promise<Array<Metadata>> => {
    try {
      return await this.service.drc20_metadata();
    } catch (e) {
      return null;
    }
  };
  public name = async (): Promise<string> => {
    let name = '';
    try {
      name = await this.service.drc20_name();
      return name;
    } catch (e) {
      try {
        name = await this.service.name();
        return name;
      } catch (e) {
        return null;
      }
    }
  };
  public symbol = async (): Promise<string> => {
    let symbol = '';
    try {
      symbol = await this.service.drc20_symbol();
      return symbol;
    } catch (e) {
      try {
        symbol = await this.service.symbol();
        return symbol;
      } catch (e) {
        return null;
      }
    }
  };
  public totalSupply = async (): Promise<TotalSupply> => {
    let totalSupply = null;
    try {
      totalSupply = await this.service.drc20_totalSupply();
      return totalSupply;
    } catch (e) {
      try {
        totalSupply = await this.service.totalSupply();
        return totalSupply;
      } catch (e) {
        return null;
      }
    }
  };
  public canister_status = async (): Promise<CanisterStatusToken> => {
    return await this.service.canister_status();
  };
  public txnQuery = async (
    request: TxnQueryRequest
  ): Promise<TxnQueryResponse> => {
    return await this.service.drc20_txnQuery(request);
  };
  public top100 = async (): Promise<Array<Top100Record>> => {
    return await this.service.ictokens_top100();
  };
  public getCandidInterfaceTmpHack = async (
    DRC202TokenId: string,
    methodName: string,
    args: ArrayBuffer
  ): Promise<QueryResponse> => {
    return await this.agent.query(DRC202TokenId, {
      methodName: methodName,
      arg: args
    });
  };
  public drc207 = async (): Promise<DRC207Support> => {
    return await this.service.drc207();
  };
  public drc202_events = async (
    address: Array<Address> = []
  ): Promise<Array<TxnRecord>> => {
    return await this.service.drc202_events(address);
  };
  public drc202_txn = async (txid: Txid): Promise<Array<TxnRecord>> => {
    return await this.service.drc202_txn(txid);
  };
  public drc20_balanceOf = async (account: Address): Promise<bigint> => {
    return await this.service.drc20_balanceOf(account);
  };
  public balanceOf = async (account: Principal): Promise<bigint> => {
    return await this.service.balanceOf(account);
  };
  public standard = async (): Promise<string> => {
    return await this.service.standard();
  };
  public icrc1SupportedStandards =
    async (): Promise<Icrc1SupportedStandards> => {
      return await this.service.icrc1_supported_standards();
    };
  // dip20
  public getMetadata = async (): Promise<TokenInfo> => {
    return await this.service.getMetadata();
  };
  public icrcDecimals = async (): Promise<Decimals> => {
    return await this.service.icrc1_decimals();
  };
  public icrcName = async (): Promise<string> => {
    return await this.service.icrc1_name();
  };
  public icrcSymbol = async (): Promise<string> => {
    return await this.service.icrc1_symbol();
  };
  public icrcTotalSupply = async (): Promise<TotalSupply> => {
    return await this.service.icrc1_total_supply();
  };
  public icrcFee = async (): Promise<bigint> => {
    return await this.service.icrc1_fee();
  };
  public icrc1_balance_of = async (account: Icrc1Account): Promise<bigint> => {
    return await this.service.icrc1_balance_of(account);
  };
  public icrc1Metadata = async (): Promise<IcrcMetadata> => {
    return await this.service.icrc1_metadata();
  };
  public maxSupply = async (): Promise<Array<bigint>> => {
    try {
      return await this.service.ictokens_maxSupply();
    } catch (e) {
      return null;
    }
  };
  public getSNSTokenTransactions = async (
    tokenId: string,
    transactionsRequest: GetTransactionsRequest
  ): Promise<GetTransactionsResponse> => {
    try {
      const service: Service = buildService(
        null,
        SNSTokenIDL,
        tokenId,
        'https://ic0.app/'
      );
      return await service.get_transactions(transactionsRequest);
    } catch (e) {
      return null;
    }
  };
  public drc204Pairs = async (): Promise<
    Array<[Principal, [SwapPair, bigint]]>
  > => {
    try {
      return await this.service.drc204_pairs();
    } catch (e) {
      return [];
    }
  };
}
