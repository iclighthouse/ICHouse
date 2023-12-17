import { Identity } from '@dfinity/agent';
import Service, { FeeStatus, CyclesFinanceLiquidity } from '@/ic/cyclesFinance/model';
import { buildService } from '@/ic/Service';
import swapIDL from './cyclesFinance.did';
import { Address } from '@/ic/common/icType';

export class CyclesFinanceService {
  private service: Service;
  constructor(swapId: string, identity?: Identity, host?: string) {
    this.service = buildService(identity, swapIDL, swapId, host);
  }
  public feeStatus = async (): Promise<FeeStatus> => {
    return await this.service.feeStatus();
  };
  public liquidity = async (
    accountId: Array<Address> = []
  ): Promise<CyclesFinanceLiquidity> => {
    return await this.service.liquidity(accountId);
  };
}
