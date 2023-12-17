import { Identity } from '@dfinity/agent';
import Service from '@/ic/DIDGenerate/model';
import DIDGenerateIDL from './DIDGenerate.did';
import { buildService } from '@/ic/Service';
import { DID_CANISTER_ID } from '@/ic/utils';

export class DIDGenerateService {
  private service: Service;
  constructor(identity?: Identity, host?: string) {
    this.service = buildService(
      identity,
      DIDGenerateIDL,
      DID_CANISTER_ID,
      host
    );
  }
  public binding = async (
    prog: string,
    lang: string
  ): Promise<Array<string>> => {
    try {
      return await this.service.binding(prog, lang);
    } catch (e) {
      console.log(e);
      return null;
    }
  };
  public did_to_js = async (prog: string): Promise<Array<string>> => {
    try {
      return await this.service.did_to_js(prog);
    } catch (e) {
      console.log(e);
      return null;
    }
  };
}
