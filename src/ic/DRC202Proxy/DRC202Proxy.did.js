export default ({ IDL }) => {
  const Token = IDL.Principal;
  const Txid__1 = IDL.Vec(IDL.Nat8);
  const Bucket = IDL.Principal;
  const DRC207Support = IDL.Record({
    timer: IDL.Record({
      interval_seconds: IDL.Opt(IDL.Nat),
      enable: IDL.Bool
    }),
    monitorable_by_self: IDL.Bool,
    monitorable_by_blackhole: IDL.Record({
      canister_id: IDL.Opt(IDL.Principal),
      allowed: IDL.Bool
    }),
    cycles_receivable: IDL.Bool
  });
  const AccountId__1 = IDL.Vec(IDL.Nat8);
  const Gas = IDL.Variant({
    token: IDL.Nat,
    cycles: IDL.Nat,
    noFee: IDL.Null
  });
  const AccountId = IDL.Vec(IDL.Nat8);
  const Time = IDL.Int;
  const Txid__2 = IDL.Vec(IDL.Nat8);
  const Operation = IDL.Variant({
    approve: IDL.Record({ allowance: IDL.Nat }),
    lockTransfer: IDL.Record({
      locked: IDL.Nat,
      expiration: Time,
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
      lockedTxid: Txid__2
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
    txid: Txid__2,
    nonce: IDL.Nat,
    timestamp: Time,
    caller: AccountId,
    index: IDL.Nat
  });
  const Txid = IDL.Vec(IDL.Nat8);
  const TokenInfo = IDL.Record({
    lastIndex: IDL.Nat,
    count: IDL.Nat,
    lastTxid: Txid
  });
  return IDL.Service({
    bucket: IDL.Func(
      [Token, Txid__1, IDL.Nat, IDL.Opt(IDL.Nat8)],
      [IDL.Opt(Bucket)],
      ['query']
    ),
    bucketByIndex: IDL.Func(
      [Token, IDL.Nat, IDL.Nat, IDL.Opt(IDL.Nat8)],
      [IDL.Opt(IDL.Principal)],
      ['query']
    ),
    bucketList: IDL.Func([], [IDL.Vec(Bucket)], ['query']),
    changeOwner: IDL.Func([IDL.Principal], [IDL.Bool], []),
    clearStoreErrPool: IDL.Func([], [], []),
    cyclesWithdraw: IDL.Func([IDL.Principal, IDL.Nat], [], []),
    drc207: IDL.Func([], [DRC207Support], ['query']),
    fee: IDL.Func([], [IDL.Nat], ['query']),
    generateTxid: IDL.Func(
      [Token, AccountId__1, IDL.Nat],
      [Txid__1],
      ['query']
    ),
    getCycles: IDL.Func([], [IDL.Nat], ['query']),
    getLastTxns: IDL.Func(
      [],
      [IDL.Vec(IDL.Tuple(IDL.Nat, Token, IDL.Nat, Txid__1))],
      ['query']
    ),
    getOwner: IDL.Func([], [IDL.Principal], ['query']),
    location: IDL.Func(
      [
        Token,
        IDL.Variant({
          txid: Txid__1,
          account: AccountId__1,
          index: IDL.Nat
        }),
        IDL.Opt(IDL.Nat8)
      ],
      [IDL.Vec(Bucket)],
      ['query']
    ),
    maxBucketMemory: IDL.Func([], [IDL.Nat], ['query']),
    minInterval: IDL.Func([], [IDL.Int], ['query']),
    reStore: IDL.Func([], [], []),
    setController: IDL.Func([IDL.Principal, IDL.Bool], [], []),
    setFee: IDL.Func([IDL.Nat], [IDL.Bool], []),
    setMaxMemory: IDL.Func([IDL.Nat], [IDL.Bool], []),
    setMaxTPS: IDL.Func([IDL.Nat, IDL.Nat], [IDL.Bool], []),
    setStd: IDL.Func([IDL.Text], [], []),
    standard: IDL.Func([], [IDL.Text], ['query']),
    stats: IDL.Func(
      [],
      [
        IDL.Record({
          txnCount: IDL.Nat,
          bucketCount: IDL.Nat,
          storeErrPool: IDL.Nat,
          errCount: IDL.Nat,
          tokenCount: IDL.Nat
        })
      ],
      ['query']
    ),
    store: IDL.Func([TxnRecord], [], []),
    storeBatch: IDL.Func([IDL.Vec(TxnRecord)], [], []),
    storeBytes: IDL.Func([Txid__1, IDL.Vec(IDL.Nat8)], [], []),
    storeBytesBatch: IDL.Func(
      [IDL.Vec(IDL.Tuple(Txid__1, IDL.Vec(IDL.Nat8)))],
      [],
      []
    ),
    tokenInfo: IDL.Func(
      [Token],
      [IDL.Opt(IDL.Text), IDL.Opt(TokenInfo)],
      ['query']
    ),
    tpsStats: IDL.Func([], [IDL.Float64, IDL.Nat], ['query']),
    version: IDL.Func([], [IDL.Nat8], ['query']),
    wallet_receive: IDL.Func([], [], [])
  });
};
