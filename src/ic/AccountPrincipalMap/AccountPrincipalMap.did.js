export default ({ IDL }) => {
  const AccountId = IDL.Vec(IDL.Nat8);
  const Account = IDL.Record({
    owner: IDL.Principal,
    subaccount: IDL.Opt(IDL.Vec(IDL.Nat8))
  });
  return IDL.Service({
    fromAccountId: IDL.Func([AccountId], [IDL.Opt(Account)], ['query']),
    put: IDL.Func([IDL.Vec(Account)], [], []),
    toAccountId: IDL.Func([Account], [AccountId], ['query']),
    wallet_receive: IDL.Func([], [], [])
  });
};
