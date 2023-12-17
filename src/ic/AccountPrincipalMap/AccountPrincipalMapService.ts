import Service from '@/ic/AccountPrincipalMap/model';
import { ACCOUNT_PRINCIPAL_MAP_CANISTER_ID } from '@/ic/utils';
import { buildService } from '@/ic/Service';
import IDL from '@/ic/AccountPrincipalMap/AccountPrincipalMap.did';
import { Icrc1Account } from '@/ic/common/icType';

export class AccountPrincipalMapService {
  private service: Service;
  constructor(host?: string, minterId = ACCOUNT_PRINCIPAL_MAP_CANISTER_ID) {
    this.service = buildService(null, IDL, minterId, host);
  }
  public fromAccountId = async (
    accountId: Array<number>
  ): Promise<Array<Icrc1Account>> => {
    try {
      return await this.service.fromAccountId(accountId);
    } catch (e) {
      console.log(e);
      return null;
    }
  };
}
