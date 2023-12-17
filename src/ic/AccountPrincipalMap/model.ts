import { Icrc1Account } from '@/ic/common/icType';

export default interface Service {
  fromAccountId(accountId: Array<number>): Promise<Array<Icrc1Account>>;
}
