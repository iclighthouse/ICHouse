import Service from './model';
import { Identity } from '@dfinity/agent';
import { buildService } from '@/ic/Service';
import ledgerIDL from './ledger.did';
import { LEDGER_CANISTER_ID } from '@/ic/utils';
import { ICP } from '@/ic/ledger/model';
import { hexToBytes } from '@/ic/converter';

export class LedgerService {
  private service: Service;
  constructor(identity?: Identity, host?: string) {
    this.service = buildService(identity, ledgerIDL, LEDGER_CANISTER_ID, host);
  }
  public getBalance = async (account: string): Promise<ICP> => {
    return await this.service.account_balance({
      account: hexToBytes(account)
    });
  };
}
