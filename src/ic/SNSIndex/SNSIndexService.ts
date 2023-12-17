import Service, {
  GetAccountTransactionsArgs,
  GetTransactionsResult
} from '@/ic/SNSIndex/model';
import { Identity } from '@dfinity/agent';
import { buildService } from '@/ic/Service';
import SNSIndexIDL from './SNSIndex.did';

export class SNSIndexService {
  public getService(
    SNSIndexId: string,
    identity?: Identity,
    host?: string
  ): Service {
    return buildService(identity, SNSIndexIDL, SNSIndexId, host);
  }
  public getAccountTransactions = async (
    SNSIndexId: string,
    request: GetAccountTransactionsArgs
  ): Promise<GetTransactionsResult> => {
    const service = this.getService(SNSIndexId);
    try {
      return await service.get_account_transactions(request);
    } catch (e) {
      return null;
    }
  };
}
