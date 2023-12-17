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
  const Time = IDL.Int;
  const Status = IDL.Variant({
    Failed: IDL.Null,
    Cancelled: IDL.Null,
    PartiallyCompletedAndCancelled: IDL.Null,
    Completed: IDL.Null,
    Pending: IDL.Null
  });
  const Shares = IDL.Nat;
  const ShareChange = IDL.Variant({
    Burn: Shares,
    Mint: Shares,
    NoChange: IDL.Null
  });
  const BalanceChange = IDL.Variant({
    DebitRecord: IDL.Nat,
    CreditRecord: IDL.Nat,
    NoChange: IDL.Null
  });
  const Data = IDL.Vec(IDL.Nat8);
  const Txid__1 = IDL.Vec(IDL.Nat8);
  const TokenType = IDL.Variant({
    Icp: IDL.Null,
    Token: IDL.Principal,
    Cycles: IDL.Null
  });
  const Nonce = IDL.Nat;
  const OperationType = IDL.Variant({
    AddLiquidity: IDL.Null,
    Swap: IDL.Null,
    Claim: IDL.Null,
    RemoveLiquidity: IDL.Null
  });
  const AccountId = IDL.Vec(IDL.Nat8);
  const CyclesWallet = IDL.Principal;
  const TxnRecord = IDL.Record({
    fee: IDL.Record({ token0Fee: IDL.Int, token1Fee: IDL.Int }),
    status: Status,
    shares: ShareChange,
    msgCaller: IDL.Opt(IDL.Principal),
    order: IDL.Record({
      token0Value: IDL.Opt(BalanceChange),
      token1Value: IDL.Opt(BalanceChange)
    }),
    data: IDL.Opt(Data),
    time: Time,
    txid: Txid__1,
    orderMode: IDL.Variant({ AMM: IDL.Null, OrderBook: IDL.Null }),
    orderType: IDL.Opt(
      IDL.Variant({
        FAK: IDL.Null,
        FOK: IDL.Null,
        LMT: IDL.Null,
        MKT: IDL.Null
      })
    ),
    filled: IDL.Record({
      token0Value: BalanceChange,
      token1Value: BalanceChange
    }),
    token0: TokenType,
    token1: TokenType,
    nonce: Nonce,
    operation: OperationType,
    account: AccountId,
    details: IDL.Vec(
      IDL.Record({
        time: Time,
        token0Value: BalanceChange,
        counterparty: Txid__1,
        token1Value: BalanceChange
      })
    ),
    caller: AccountId,
    index: IDL.Nat,
    cyclesWallet: IDL.Opt(CyclesWallet)
  });
  const AppId = IDL.Principal;
  const Txid = IDL.Vec(IDL.Nat8);
  const AccountId__1 = IDL.Vec(IDL.Nat8);
  const Hex = IDL.Text;
  return IDL.Service({
    bucketInfo: IDL.Func([], [BucketInfo], ['query']),
    cyclesWithdraw: IDL.Func([IDL.Principal, IDL.Nat], [], []),
    drc207: IDL.Func([], [DRC207Support], ['query']),
    last: IDL.Func([], [Sid, Time], ['query']),
    store: IDL.Func([Sid, TxnRecord], [], []),
    storeBatch: IDL.Func([IDL.Vec(IDL.Tuple(Sid, TxnRecord))], [], []),
    storeBytes: IDL.Func([Sid, IDL.Vec(IDL.Nat8)], [], []),
    storeBytesBatch: IDL.Func(
      [IDL.Vec(IDL.Tuple(Sid, IDL.Vec(IDL.Nat8)))],
      [],
      []
    ),
    txn: IDL.Func(
      [AppId, Txid],
      [IDL.Opt(IDL.Tuple(TxnRecord, Time))],
      ['query']
    ),
    txnByAccountId: IDL.Func(
      [AccountId__1, IDL.Opt(AppId), IDL.Opt(IDL.Nat32), IDL.Opt(IDL.Nat32)],
      [
        IDL.Record({
          total: IDL.Nat,
          data: IDL.Vec(IDL.Tuple(AppId, IDL.Vec(IDL.Tuple(TxnRecord, Time)))),
          totalPage: IDL.Nat
        })
      ],
      ['query']
    ),
    txnByIndex: IDL.Func(
      [AppId, IDL.Nat],
      [IDL.Vec(IDL.Tuple(TxnRecord, Time))],
      ['query']
    ),
    txnBytes: IDL.Func(
      [AppId, Txid],
      [IDL.Opt(IDL.Tuple(IDL.Vec(IDL.Nat8), Time))],
      ['query']
    ),
    txnBytes2: IDL.Func(
      [Sid],
      [IDL.Opt(IDL.Tuple(IDL.Vec(IDL.Nat8), Time))],
      ['query']
    ),
    txnBytesHash: IDL.Func([AppId, Txid, IDL.Nat], [IDL.Opt(Hex)], ['query']),
    txnBytesHistory: IDL.Func(
      [AppId, Txid],
      [IDL.Vec(IDL.Tuple(IDL.Vec(IDL.Nat8), Time))],
      ['query']
    ),
    txnHash: IDL.Func([AppId, Txid, IDL.Nat], [IDL.Opt(Hex)], ['query']),
    txnHash2: IDL.Func([AppId, Txid, IDL.Bool], [IDL.Vec(Hex)], ['query']),
    txnHistory: IDL.Func(
      [AppId, Txid],
      [IDL.Vec(IDL.Tuple(TxnRecord, Time))],
      ['query']
    ),
    wallet_receive: IDL.Func([], [], [])
  });
};
