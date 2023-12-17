export default ({ IDL }) => {
  const BucketInfo = IDL.Record({
    memory: IDL.Nat,
    heap: IDL.Nat,
    count: IDL.Nat,
    stableMemory: IDL.Nat32,
    cycles: IDL.Nat
  });
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
  const Sid = IDL.Vec(IDL.Nat8);
  const Time__1 = IDL.Int;
  const Gas = IDL.Variant({
    token: IDL.Nat,
    cycles: IDL.Nat,
    noFee: IDL.Null
  });
  const AccountId = IDL.Vec(IDL.Nat8);
  const Time = IDL.Int;
  const Txid__1 = IDL.Vec(IDL.Nat8);
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
      lockedTxid: Txid__1
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
    txid: Txid__1,
    nonce: IDL.Nat,
    timestamp: Time,
    caller: AccountId,
    index: IDL.Nat
  });
  const Token = IDL.Principal;
  const Txid = IDL.Vec(IDL.Nat8);
  const AccountId__1 = IDL.Vec(IDL.Nat8);
  const Hex = IDL.Text;
  return IDL.Service({
    bucketInfo: IDL.Func([], [BucketInfo], ['query']),
    cyclesWithdraw: IDL.Func([IDL.Principal, IDL.Nat], [], []),
    drc207: IDL.Func([], [DRC207Support], ['query']),
    last: IDL.Func([], [Sid, Time__1], ['query']),
    store: IDL.Func([Sid, TxnRecord], [], []),
    storeBatch: IDL.Func([IDL.Vec(IDL.Tuple(Sid, TxnRecord))], [], []),
    storeBytes: IDL.Func([Sid, IDL.Vec(IDL.Nat8)], [], []),
    storeBytesBatch: IDL.Func(
      [IDL.Vec(IDL.Tuple(Sid, IDL.Vec(IDL.Nat8)))],
      [],
      []
    ),
    txn: IDL.Func(
      [Token, Txid],
      [IDL.Opt(IDL.Tuple(TxnRecord, Time__1))],
      ['query']
    ),
    txnByAccountId: IDL.Func(
      [AccountId__1, IDL.Opt(Token), IDL.Opt(IDL.Nat32), IDL.Opt(IDL.Nat32)],
      [
        IDL.Record({
          total: IDL.Nat,
          data: IDL.Vec(
            IDL.Tuple(Token, IDL.Vec(IDL.Tuple(TxnRecord, Time__1)))
          ),
          totalPage: IDL.Nat
        })
      ],
      ['query']
    ),
    txnByIndex: IDL.Func(
      [Token, IDL.Nat],
      [IDL.Vec(IDL.Tuple(TxnRecord, Time__1))],
      ['query']
    ),
    txnBytes: IDL.Func(
      [Token, Txid],
      [IDL.Opt(IDL.Tuple(IDL.Vec(IDL.Nat8), Time__1))],
      ['query']
    ),
    txnBytes2: IDL.Func(
      [Sid],
      [IDL.Opt(IDL.Tuple(IDL.Vec(IDL.Nat8), Time__1))],
      ['query']
    ),
    txnBytesHash: IDL.Func([Token, Txid, IDL.Nat], [IDL.Opt(Hex)], ['query']),
    txnBytesHistory: IDL.Func(
      [Token, Txid],
      [IDL.Vec(IDL.Tuple(IDL.Vec(IDL.Nat8), Time__1))],
      ['query']
    ),
    txnHash: IDL.Func([Token, Txid, IDL.Nat], [IDL.Opt(Hex)], ['query']),
    txnHistory: IDL.Func(
      [Token, Txid],
      [IDL.Vec(IDL.Tuple(TxnRecord, Time__1))],
      ['query']
    ),
    wallet_receive: IDL.Func([], [], [])
  });
};
