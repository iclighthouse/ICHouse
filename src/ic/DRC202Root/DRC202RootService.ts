import { Identity } from '@dfinity/agent';
import { buildService } from '@/ic/Service';
import Service, { ArchivedAccountTxns } from '@/ic/DRC202Root/model';
import DRC202RootIDL from './DRC202Root.did';
import { IC_DRC202_ROOT_CANISTER_ID } from '@/ic/utils';
import { Principal } from '@dfinity/principal';
import { TxnRecord, TxnResult } from '@/ic/DRC202Bucket/model';

export class DRC202RootService {
  private service: Service;

  constructor(
    DRC202RootId = IC_DRC202_ROOT_CANISTER_ID,
    identity?: Identity,
    host?: string
  ) {
    this.service = buildService(identity, DRC202RootIDL, DRC202RootId, host);
  }
  public getArchivedAccountTxns = async (
    buckets_offset: Array<bigint>,
    buckets_length: bigint,
    address: Array<number>,
    tokenId: Array<Principal>,
    page: Array<bigint>,
    size: Array<bigint>
  ): Promise<ArchivedAccountTxns> => {
    try {
      return await this.service.getArchivedAccountTxns(
        buckets_offset,
        buckets_length,
        address,
        tokenId,
        page,
        size
      );
    } catch (e) {
      console.log(e);
      return null;
    }
  };
  public getArchivedTokenTxns = async (
    tokenId: Principal,
    start: bigint,
    length: bigint
  ): Promise<Array<TxnRecord>> => {
    try {
      return await this.service.getArchivedTokenTxns(tokenId, start, length);
    } catch (e) {
      console.log(e);
      return null;
    }
  };
  public getArchivedTxn = async (
    tokenId: Principal,
    txid: Array<number>
  ): Promise<Array<TxnResult>> => {
    try {
      return await this.service.getArchivedTxn(tokenId, txid);
    } catch (e) {
      console.log(e);
      return null;
    }
  };
  public getArchivedTxnByIndex = async (
    tokenId: Principal,
    index: bigint
  ): Promise<Array<TxnResult>> => {
    try {
      return await this.service.getArchivedTxnByIndex(tokenId, index);
    } catch (e) {
      console.log(e);
      return null;
    }
  };
}
