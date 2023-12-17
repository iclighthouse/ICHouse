export default ({ IDL }) => {
  const Time = IDL.Int;
  const AccountId = IDL.Vec(IDL.Nat8);
  const Token = IDL.Principal;
  const Gas = IDL.Variant({
    token: IDL.Nat,
    cycles: IDL.Nat,
    noFee: IDL.Null
  });
  const Time__1 = IDL.Int;
  const Txid = IDL.Vec(IDL.Nat8);
  const Operation = IDL.Variant({
    approve: IDL.Record({ allowance: IDL.Nat }),
    lockTransfer: IDL.Record({
      locked: IDL.Nat,
      expiration: Time__1,
      decider: AccountId
    }),
    transfer: IDL.Record({
      action: IDL.Variant({
        burn: IDL.Null,
        mint: IDL.Null,
        send: IDL.Null
      })
    }),
    executeTransfer: IDL.Record({
      fallback: IDL.Nat,
      lockedTxid: Txid
    })
  });
  const Transaction = IDL.Record({
    to: AccountId,
    value: IDL.Nat,
    data: IDL.Opt(IDL.Vec(IDL.Nat8)),
    from: AccountId,
    operation: Operation
  });
  const TxnRecord = IDL.Record({
    gas: Gas,
    msgCaller: IDL.Opt(IDL.Principal),
    transaction: Transaction,
    txid: Txid,
    nonce: IDL.Nat,
    timestamp: Time__1,
    caller: AccountId,
    index: IDL.Nat
  });
  const Hex = IDL.Text;
  return IDL.Service({
    addProxy: IDL.Func([IDL.Principal, Time, IDL.Nat, IDL.Bool], [], []),
    cyclesWithdraw: IDL.Func([IDL.Principal, IDL.Nat], [], []),
    getArchivedAccountTxns: IDL.Func(
      [
        IDL.Opt(IDL.Nat),
        IDL.Nat,
        AccountId,
        IDL.Opt(Token),
        IDL.Opt(IDL.Nat32),
        IDL.Opt(IDL.Nat32)
      ],
      [
        IDL.Record({
          total: IDL.Nat,
          data: IDL.Vec(
            IDL.Tuple(IDL.Principal, IDL.Vec(IDL.Tuple(TxnRecord, Time)))
          ),
          totalPage: IDL.Nat
        })
      ],
      ['composite_query']
    ),
    getArchivedTokenTxns: IDL.Func(
      [Token, IDL.Nat, IDL.Nat],
      [IDL.Vec(TxnRecord)],
      ['composite_query']
    ),
    getArchivedTxn: IDL.Func(
      [Token, Txid],
      [IDL.Vec(IDL.Tuple(TxnRecord, Time))],
      ['composite_query']
    ),
    getArchivedTxnByIndex: IDL.Func(
      [Token, IDL.Nat],
      [IDL.Vec(IDL.Tuple(TxnRecord, Time))],
      ['composite_query']
    ),
    getArchivedTxnBytes: IDL.Func(
      [Token, Txid],
      [IDL.Vec(IDL.Tuple(IDL.Vec(IDL.Nat8), Time))],
      ['composite_query']
    ),
    getCycles: IDL.Func([], [IDL.Nat], ['query']),
    getTxnHash: IDL.Func([Token, Txid], [IDL.Vec(Hex)], ['composite_query']),
    monitor_canisters: IDL.Func(
      [],
      [IDL.Vec(IDL.Tuple(IDL.Principal, IDL.Nat))],
      ['query']
    ),
    monitor_put: IDL.Func([IDL.Principal], [], []),
    monitor_remove: IDL.Func([IDL.Principal], [], []),
    proxyList: IDL.Func(
      [],
      [
        IDL.Record({
          list: IDL.Vec(IDL.Tuple(IDL.Principal, Time, IDL.Nat)),
          root: IDL.Principal,
          current: IDL.Opt(IDL.Tuple(IDL.Principal, Time, IDL.Nat))
        })
      ],
      ['query']
    ),
    removeProxy: IDL.Func([IDL.Principal, IDL.Opt(IDL.Principal)], [], []),
    stopAndCreateNewProxy: IDL.Func([], [IDL.Principal, Time, IDL.Nat], []),
    timerStart: IDL.Func([IDL.Nat], [], []),
    timerStop: IDL.Func([], [], []),
    wallet_receive: IDL.Func([], [], [])
  });
};
