export default ({ IDL }) => {
  const AppId = IDL.Principal;
  const Txid__2 = IDL.Vec(IDL.Nat8);
  const AppInfo = IDL.Record({
    lastIndex: IDL.Nat,
    count: IDL.Nat,
    lastTxid: Txid__2
  });
  const Txid = IDL.Vec(IDL.Nat8);
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
  const Time = IDL.Int;
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
  return IDL.Service({
    appInfo: IDL.Func([AppId], [IDL.Opt(AppInfo)], ['query']),
    bucket: IDL.Func(
      [AppId, Txid, IDL.Nat, IDL.Opt(IDL.Nat8)],
      [IDL.Opt(Bucket)],
      ['query']
    ),
    bucketByIndex: IDL.Func(
      [AppId, IDL.Nat, IDL.Nat, IDL.Opt(IDL.Nat8)],
      [IDL.Opt(Bucket)],
      ['query']
    ),
    bucketList: IDL.Func([], [IDL.Vec(Bucket)], ['query']),
    changeOwner: IDL.Func([IDL.Principal], [IDL.Bool], []),
    clearStoreErrPool: IDL.Func([], [], []),
    cyclesWithdraw: IDL.Func([IDL.Principal, IDL.Nat], [], []),
    drc207: IDL.Func([], [DRC207Support], ['query']),
    fee: IDL.Func([], [IDL.Nat], ['query']),
    generateTxid: IDL.Func([AppId, AccountId__1, IDL.Nat], [Txid], ['query']),
    getCycles: IDL.Func([], [IDL.Nat], ['query']),
    getLastTxns: IDL.Func(
      [],
      [IDL.Vec(IDL.Tuple(IDL.Nat, AppId, IDL.Nat, Txid))],
      ['query']
    ),
    getOwner: IDL.Func([], [IDL.Principal], ['query']),
    location: IDL.Func(
      [
        AppId,
        IDL.Variant({
          txid: Txid,
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
    standard: IDL.Func([], [IDL.Text], ['query']),
    stats: IDL.Func(
      [],
      [
        IDL.Record({
          txnCount: IDL.Nat,
          bucketCount: IDL.Nat,
          storeErrPool: IDL.Nat,
          appCount: IDL.Nat,
          errCount: IDL.Nat
        })
      ],
      ['query']
    ),
    store: IDL.Func([TxnRecord], [], []),
    storeBatch: IDL.Func([IDL.Vec(TxnRecord)], [], []),
    storeBytes: IDL.Func([Txid, IDL.Vec(IDL.Nat8)], [], []),
    storeBytesBatch: IDL.Func(
      [IDL.Vec(IDL.Tuple(Txid, IDL.Vec(IDL.Nat8)))],
      [],
      []
    ),
    tpsStats: IDL.Func([], [IDL.Float64, IDL.Nat], ['query']),
    version: IDL.Func([], [IDL.Nat8], ['query']),
    wallet_receive: IDL.Func([], [], [])
  });
};
