export enum TabKeyEnum {
  Transactions = 'Transactions',
  Top100 = 'Top100',
  DID = 'DID'
}
export type TabKeyType = keyof typeof TabKeyEnum;

export enum CandidEnum {
  candid = 'candid',
  motoko = 'motoko',
  typescript = 'typescript',
  javascript = 'javascript'
}

export type CandidType = keyof typeof CandidEnum;
