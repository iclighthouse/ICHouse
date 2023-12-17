export interface ICP {
  e8s: BigInt;
}
export interface AccountBalanceArgsT { account: Array<number> }

export default interface Service {
  'account_balance'(request: AccountBalanceArgsT): Promise<ICP>;
}
