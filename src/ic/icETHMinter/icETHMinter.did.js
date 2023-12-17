export default ({ IDL }) => {
  const List = IDL.Rec();
  const List_1 = IDL.Rec();
  const Wei__1 = IDL.Nat;
  const Account__1 = IDL.Record({
    owner: IDL.Principal,
    subaccount: IDL.Opt(IDL.Vec(IDL.Nat8))
  });
  const TxHash__1 = IDL.Text;
  const BlockHeight = IDL.Nat;
  const ResultError = IDL.Variant({
    GenericError: IDL.Record({ code: IDL.Nat64, message: IDL.Text })
  });
  const RpcId__1 = IDL.Nat;
  const RpcRequestId__1 = IDL.Nat;
  const TxIndex__1 = IDL.Nat;
  const definite_canister_settings = IDL.Record({
    freezing_threshold: IDL.Nat,
    controllers: IDL.Vec(IDL.Principal),
    memory_allocation: IDL.Nat,
    compute_allocation: IDL.Nat
  });
  const canister_status = IDL.Record({
    status: IDL.Variant({
      stopped: IDL.Null,
      stopping: IDL.Null,
      running: IDL.Null
    }),
    memory_size: IDL.Nat,
    cycles: IDL.Nat,
    settings: definite_canister_settings,
    module_hash: IDL.Opt(IDL.Vec(IDL.Nat8))
  });
  const EthAddress__1 = IDL.Text;
  const Nonce__1 = IDL.Nat;
  const Status__4 = IDL.Variant({
    Signing: IDL.Null,
    Building: IDL.Null,
    Confirmed: IDL.Null,
    Sending: IDL.Null,
    Unknown: IDL.Null,
    Submitted: IDL.Null,
    Failure: IDL.Null,
    Pending: IDL.Null
  });
  const EthAddress = IDL.Text;
  const Wei = IDL.Nat;
  const TokenTxn = IDL.Record({
    to: EthAddress,
    token: EthAddress,
    value: Wei,
    from: EthAddress
  });
  const AccountId__1 = IDL.Vec(IDL.Nat8);
  const Signature = IDL.Record({
    r: IDL.Vec(IDL.Nat8),
    s: IDL.Vec(IDL.Nat8),
    v: IDL.Nat64,
    from: IDL.Opt(IDL.Vec(IDL.Nat8)),
    hash: IDL.Vec(IDL.Nat8)
  });
  const AccessList = IDL.Record({
    storage_keys: IDL.Vec(IDL.Vec(IDL.Nat8)),
    address: IDL.Vec(IDL.Nat8)
  });
  const Transaction1559 = IDL.Record({
    to: IDL.Vec(IDL.Nat8),
    value: IDL.Vec(IDL.Nat8),
    max_priority_fee_per_gas: IDL.Vec(IDL.Nat8),
    data: IDL.Vec(IDL.Nat8),
    sign: IDL.Opt(Signature),
    max_fee_per_gas: IDL.Vec(IDL.Nat8),
    chain_id: IDL.Nat64,
    nonce: IDL.Vec(IDL.Nat8),
    gas_limit: IDL.Vec(IDL.Nat8),
    access_list: IDL.Vec(AccessList)
  });
  const Transaction2930 = IDL.Record({
    to: IDL.Vec(IDL.Nat8),
    value: IDL.Vec(IDL.Nat8),
    data: IDL.Vec(IDL.Nat8),
    sign: IDL.Opt(Signature),
    chain_id: IDL.Nat64,
    nonce: IDL.Vec(IDL.Nat8),
    gas_limit: IDL.Vec(IDL.Nat8),
    access_list: IDL.Vec(AccessList),
    gas_price: IDL.Vec(IDL.Nat8)
  });
  const TransactionLegacy = IDL.Record({
    to: IDL.Vec(IDL.Nat8),
    value: IDL.Vec(IDL.Nat8),
    data: IDL.Vec(IDL.Nat8),
    sign: IDL.Opt(Signature),
    chain_id: IDL.Nat64,
    nonce: IDL.Vec(IDL.Nat8),
    gas_limit: IDL.Vec(IDL.Nat8),
    gas_price: IDL.Vec(IDL.Nat8)
  });
  const Transaction = IDL.Variant({
    EIP1559: Transaction1559,
    EIP2930: Transaction2930,
    Legacy: TransactionLegacy
  });
  const Status = IDL.Variant({
    Signing: IDL.Null,
    Building: IDL.Null,
    Confirmed: IDL.Null,
    Sending: IDL.Null,
    Unknown: IDL.Null,
    Submitted: IDL.Null,
    Failure: IDL.Null,
    Pending: IDL.Null
  });
  const KytRequestId = IDL.Nat;
  const Nonce = IDL.Nat;
  const Account = IDL.Record({
    owner: IDL.Principal,
    subaccount: IDL.Opt(IDL.Vec(IDL.Nat8))
  });
  const TxHash = IDL.Text;
  const RpcRequestId = IDL.Nat;
  const TxStatus = IDL.Record({
    to: EthAddress,
    tx: IDL.Opt(Transaction),
    fee: IDL.Record({
      gasPrice: Wei,
      maxFee: Wei,
      gasLimit: IDL.Nat
    }),
    status: Status,
    toids: IDL.Vec(IDL.Nat),
    tokenId: EthAddress,
    receipt: IDL.Opt(IDL.Text),
    kytRequestId: IDL.Opt(KytRequestId),
    from: EthAddress,
    signedTx: IDL.Opt(IDL.Tuple(IDL.Vec(IDL.Nat8), IDL.Vec(IDL.Nat8))),
    nonce: IDL.Opt(Nonce),
    account: Account,
    txHash: IDL.Vec(TxHash),
    txType: IDL.Variant({
      Withdraw: IDL.Null,
      DepositGas: IDL.Null,
      Deposit: IDL.Null
    }),
    rpcRequestId: IDL.Opt(RpcRequestId),
    amount: Wei,
    rawTx: IDL.Opt(IDL.Tuple(IDL.Vec(IDL.Nat8), IDL.Vec(IDL.Nat8)))
  });
  const Result_1 = IDL.Variant({ ok: TxHash__1, err: IDL.Text });
  const Transaction__1 = IDL.Variant({
    EIP1559: Transaction1559,
    EIP2930: Transaction2930,
    Legacy: TransactionLegacy
  });
  const Result_2 = IDL.Variant({ Ok: Transaction__1, Err: IDL.Text });
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
  const TxIndex = IDL.Nat;
  const Timestamp__1 = IDL.Nat;
  const UpdateTxArgs = IDL.Record({
    ts: IDL.Opt(Timestamp__1),
    tx: IDL.Opt(Transaction),
    fee: IDL.Opt(IDL.Record({ gasPrice: Wei, maxFee: Wei, gasLimit: IDL.Nat })),
    status: IDL.Opt(Status),
    toids: IDL.Opt(IDL.Vec(IDL.Nat)),
    receipt: IDL.Opt(IDL.Text),
    kytRequestId: IDL.Opt(KytRequestId),
    signedTx: IDL.Opt(IDL.Tuple(IDL.Vec(IDL.Nat8), IDL.Vec(IDL.Nat8))),
    nonce: IDL.Opt(Nonce),
    txHash: IDL.Opt(TxHash),
    rpcRequestId: IDL.Opt(RpcRequestId),
    amount: IDL.Opt(Wei),
    rawTx: IDL.Opt(IDL.Tuple(IDL.Vec(IDL.Nat8), IDL.Vec(IDL.Nat8)))
  });
  const InitArgs = IDL.Record({
    rpc_confirmations: IDL.Nat,
    utils_canister_id: IDL.Principal,
    deposit_method: IDL.Nat8,
    min_confirmations: IDL.Opt(IDL.Nat)
  });
  const TokenInfo__1 = IDL.Record({
    fee: IDL.Record({
      fixedFee: Wei,
      ethRatio: Wei,
      gasLimit: IDL.Nat
    }),
    std: IDL.Variant({ ETH: IDL.Null, ERC20: IDL.Null }),
    decimals: IDL.Nat8,
    dexPrice: IDL.Opt(IDL.Tuple(IDL.Float64, Timestamp__1)),
    tokenId: EthAddress,
    minAmount: Wei,
    totalSupply: IDL.Opt(Wei),
    ckLedgerId: IDL.Principal,
    ckSymbol: IDL.Text,
    dexPair: IDL.Opt(IDL.Principal),
    symbol: IDL.Text
  });
  const Event = IDL.Variant({
    depositGas: IDL.Record({
      txIndex: TxIndex,
      toid: IDL.Nat,
      address: EthAddress,
      account: Account,
      amount: Wei
    }),
    withdraw: IDL.Record({
      fee: IDL.Opt(Wei),
      token: EthAddress,
      txIndex: TxIndex,
      toid: IDL.Nat,
      address: EthAddress,
      account: Account,
      amount: Wei
    }),
    keeper: IDL.Record({
      operation: IDL.Variant({
        setRpc: IDL.Record({
          keeper: Account,
          operation: IDL.Variant({
            put: IDL.Tuple(
              IDL.Text,
              IDL.Variant({ Available: IDL.Null, Unavailable: IDL.Null })
            ),
            remove: IDL.Null
          })
        })
      })
    }),
    continueTransaction: IDL.Record({
      txIndex: TxIndex,
      preTxid: IDL.Vec(TxHash),
      toid: IDL.Nat,
      updateTx: IDL.Opt(UpdateTxArgs),
      account: Account
    }),
    depositResult: IDL.Variant({
      ok: IDL.Record({
        fee: IDL.Opt(Wei),
        token: EthAddress,
        txIndex: TxIndex,
        txid: IDL.Vec(TxHash),
        account: Account,
        amount: Wei
      }),
      err: IDL.Record({
        token: EthAddress,
        txIndex: TxIndex,
        txid: IDL.Vec(TxHash),
        account: Account,
        amount: Wei
      })
    }),
    burn: IDL.Record({
      toid: IDL.Opt(IDL.Nat),
      icTokenCanisterId: IDL.Principal,
      address: EthAddress,
      account: Account,
      amount: Wei,
      tokenBlockIndex: IDL.Nat
    }),
    init: IDL.Record({ initArgs: InitArgs }),
    mint: IDL.Record({
      toid: IDL.Nat,
      icTokenCanisterId: IDL.Principal,
      account: Account,
      amount: Wei
    }),
    send: IDL.Record({
      to: Account,
      toid: IDL.Opt(IDL.Nat),
      icTokenCanisterId: IDL.Principal,
      amount: Wei
    }),
    coverTransaction: IDL.Record({
      txIndex: TxIndex,
      preTxid: IDL.Vec(TxHash),
      toid: IDL.Nat,
      updateTx: IDL.Opt(UpdateTxArgs),
      account: Account
    }),
    claimDepositResult: IDL.Variant({
      ok: IDL.Record({
        fee: IDL.Opt(Wei),
        token: EthAddress,
        signature: IDL.Text,
        from: EthAddress,
        account: Account,
        txHash: TxHash,
        amount: Wei
      }),
      err: IDL.Record({
        signature: IDL.Text,
        error: IDL.Text,
        account: Account,
        txHash: TxHash
      })
    }),
    changeOwner: IDL.Record({ newOwner: IDL.Principal }),
    deposit: IDL.Record({
      fee: IDL.Opt(Wei),
      token: EthAddress,
      txIndex: TxIndex,
      toid: IDL.Nat,
      address: EthAddress,
      account: Account,
      amount: Wei
    }),
    start: IDL.Record({ message: IDL.Opt(IDL.Text) }),
    updateTokenPrice: IDL.Record({
      token: EthAddress,
      ethRatio: Wei,
      price: IDL.Float64
    }),
    withdrawResult: IDL.Variant({
      ok: IDL.Record({
        token: EthAddress,
        txIndex: TxIndex,
        txid: IDL.Vec(TxHash),
        account: Account,
        amount: Wei
      }),
      err: IDL.Record({
        token: EthAddress,
        txIndex: TxIndex,
        txid: IDL.Vec(TxHash),
        account: Account,
        amount: Wei
      })
    }),
    depositGasResult: IDL.Variant({
      ok: IDL.Record({
        token: EthAddress,
        txIndex: TxIndex,
        txid: IDL.Vec(TxHash),
        account: Account,
        amount: Wei
      }),
      err: IDL.Record({
        token: EthAddress,
        txIndex: TxIndex,
        account: Account,
        amount: Wei
      })
    }),
    claimDeposit: IDL.Record({
      signature: IDL.Text,
      account: Account,
      txHash: TxHash
    }),
    config: IDL.Record({
      setting: IDL.Variant({
        upgradeTokenWasm: IDL.Record({
          icTokenCanisterId: IDL.Principal,
          version: IDL.Text,
          symbol: IDL.Text
        }),
        setToken: IDL.Record({
          token: EthAddress,
          info: TokenInfo__1
        }),
        depositMethod: IDL.Nat8,
        setDexPair: IDL.Record({
          token: EthAddress,
          dexPair: IDL.Opt(IDL.Principal)
        }),
        updateRpc: IDL.Record({
          keeper: Account,
          operation: IDL.Variant({
            set: IDL.Variant({
              Available: IDL.Null,
              Unavailable: IDL.Null
            }),
            remove: IDL.Null
          })
        }),
        minRpcConfirmations: IDL.Nat,
        launchToken: IDL.Record({
          token: EthAddress,
          icTokenCanisterId: IDL.Principal,
          symbol: IDL.Text
        }),
        setKeeper: IDL.Record({
          url: IDL.Text,
          status: IDL.Variant({
            Disabled: IDL.Null,
            Normal: IDL.Null
          }),
          name: IDL.Text,
          account: Account
        }),
        dependents: IDL.Record({ utilsTool: IDL.Principal }),
        setTokenWasm: IDL.Record({ size: IDL.Nat, version: IDL.Text }),
        minConfirmations: IDL.Nat
      })
    }),
    suspend: IDL.Record({ message: IDL.Opt(IDL.Text) })
  });
  const Timestamp = IDL.Nat;
  const Address = IDL.Text;
  const TokenCanisterId = IDL.Principal;
  const Account__3 = IDL.Record({
    owner: IDL.Principal,
    subaccount: IDL.Opt(IDL.Vec(IDL.Nat8))
  });
  const ICAccount = IDL.Tuple(TokenCanisterId, Account__3);
  const AccountId__2 = IDL.Vec(IDL.Nat8);
  const Chain = IDL.Text;
  const TokenId = IDL.Vec(IDL.Nat8);
  const ChainAccount = IDL.Tuple(Chain, TokenId, Address);
  const TxHash__2 = IDL.Text;
  const TokenInfo = IDL.Record({
    fee: IDL.Record({
      fixedFee: Wei,
      ethRatio: Wei,
      gasLimit: IDL.Nat
    }),
    std: IDL.Variant({ ETH: IDL.Null, ERC20: IDL.Null }),
    decimals: IDL.Nat8,
    dexPrice: IDL.Opt(IDL.Tuple(IDL.Float64, Timestamp__1)),
    tokenId: EthAddress,
    minAmount: Wei,
    totalSupply: IDL.Opt(Wei),
    ckLedgerId: IDL.Principal,
    ckSymbol: IDL.Text,
    dexPair: IDL.Opt(IDL.Principal),
    symbol: IDL.Text
  });
  const ListPage = IDL.Nat;
  const ListSize = IDL.Nat;
  const TrieList_4 = IDL.Record({
    total: IDL.Nat,
    data: IDL.Vec(IDL.Tuple(BlockHeight, IDL.Tuple(Event, Timestamp))),
    totalPage: IDL.Nat
  });
  const Keeper = IDL.Record({
    url: IDL.Text,
    status: IDL.Variant({ Disabled: IDL.Null, Normal: IDL.Null }),
    balance: IDL.Nat,
    name: IDL.Text,
    account: Account
  });
  const TrieList_3 = IDL.Record({
    total: IDL.Nat,
    data: IDL.Vec(IDL.Tuple(AccountId__1, Keeper)),
    totalPage: IDL.Nat
  });
  const BlockHeight__1 = IDL.Nat;
  const MinterInfo = IDL.Record({
    decimals: IDL.Nat8,
    gasPrice: Wei,
    totalRetrievalAmount: Wei,
    owner: IDL.Principal,
    depositMethod: IDL.Nat8,
    totalMintingAmount: Wei,
    blockSlot: IDL.Nat,
    pendingRetrievals: IDL.Nat,
    network: IDL.Text,
    countRetrieval: IDL.Nat,
    isDebug: IDL.Bool,
    syncBlockNumber: BlockHeight__1,
    version: IDL.Text,
    minRpcConfirmations: IDL.Nat,
    pendingDeposits: IDL.Nat,
    address: EthAddress,
    chainId: IDL.Nat,
    minConfirmations: IDL.Nat,
    countMinting: IDL.Nat,
    symbol: IDL.Text,
    paused: IDL.Bool
  });
  const DepositTxn__1 = IDL.Record({
    status: Status,
    signature: IDL.Vec(IDL.Nat8),
    claimingTime: Timestamp__1,
    confirmedTime: IDL.Opt(Timestamp__1),
    error: IDL.Opt(IDL.Text),
    account: Account,
    txHash: TxHash,
    transfer: IDL.Opt(TokenTxn)
  });
  const DepositTxn = IDL.Record({
    status: Status,
    signature: IDL.Vec(IDL.Nat8),
    claimingTime: Timestamp__1,
    confirmedTime: IDL.Opt(Timestamp__1),
    error: IDL.Opt(IDL.Text),
    account: Account,
    txHash: TxHash,
    transfer: IDL.Opt(TokenTxn)
  });
  const PendingDepositTxn = IDL.Tuple(
    TxHash,
    Account,
    IDL.Vec(IDL.Nat8),
    IDL.Bool,
    Timestamp__1
  );
  const ICRC1BlockHeight = IDL.Nat;
  const RetrieveStatus = IDL.Record({
    ethAddress: EthAddress,
    txIndex: TxIndex,
    account: Account,
    burnedBlockIndex: ICRC1BlockHeight,
    amount: Wei,
    retrieveAccount: Account
  });
  const RpcLog = IDL.Record({
    err: IDL.Opt(IDL.Text),
    url: IDL.Text,
    result: IDL.Opt(IDL.Text),
    time: Timestamp__1,
    input: IDL.Text
  });
  const TrieList_2 = IDL.Record({
    total: IDL.Nat,
    data: IDL.Vec(IDL.Tuple(RpcId__1, RpcLog)),
    totalPage: IDL.Nat
  });
  const AccountId = IDL.Vec(IDL.Nat8);
  const Healthiness = IDL.Record({
    recentPersistentErrors: IDL.Opt(IDL.Nat),
    calls: IDL.Nat,
    time: Timestamp__1,
    errors: IDL.Nat
  });
  const RpcProvider = IDL.Record({
    url: IDL.Text,
    status: IDL.Variant({
      Available: IDL.Null,
      Unavailable: IDL.Null
    }),
    keeper: AccountId,
    calls: IDL.Nat,
    name: IDL.Text,
    errors: IDL.Nat,
    latestCall: Timestamp__1,
    healthCheck: Healthiness,
    preHealthCheck: Healthiness
  });
  const TrieList_1 = IDL.Record({
    total: IDL.Nat,
    data: IDL.Vec(IDL.Tuple(AccountId__1, RpcProvider)),
    totalPage: IDL.Nat
  });
  const Value = IDL.Variant({
    Int: IDL.Int,
    Nat: IDL.Nat,
    Raw: IDL.Vec(IDL.Nat8),
    Empty: IDL.Null,
    Bool: IDL.Bool,
    Text: IDL.Text,
    Float: IDL.Float64
  });
  const RpcRequestStatus = IDL.Variant({
    ok: IDL.Vec(Value),
    err: IDL.Text,
    pending: IDL.Null
  });
  const RpcId = IDL.Nat;
  const RpcFetchLog = IDL.Record({
    id: RpcId,
    status: RpcRequestStatus,
    result: IDL.Text,
    keeper: AccountId,
    time: Timestamp__1
  });
  const RpcRequestConsensus = IDL.Record({
    status: RpcRequestStatus,
    requests: IDL.Vec(RpcFetchLog),
    confirmed: IDL.Nat
  });
  const TrieList = IDL.Record({
    total: IDL.Nat,
    data: IDL.Vec(IDL.Tuple(RpcRequestId__1, RpcRequestConsensus)),
    totalPage: IDL.Nat
  });
  const Toid = IDL.Nat;
  const Ttid = IDL.Nat;
  const Subaccount = IDL.Vec(IDL.Nat8);
  const Account__2 = IDL.Record({
    owner: IDL.Principal,
    subaccount: IDL.Opt(Subaccount)
  });
  const Timestamp__2 = IDL.Nat64;
  const TransferArgs = IDL.Record({
    to: Account__2,
    fee: IDL.Opt(IDL.Nat),
    memo: IDL.Opt(IDL.Vec(IDL.Nat8)),
    from_subaccount: IDL.Opt(Subaccount),
    created_at_time: IDL.Opt(Timestamp__2),
    amount: IDL.Nat
  });
  const CallType__1 = IDL.Variant({
    __block: IDL.Null,
    ICRC1: IDL.Variant({
      icrc1_balance_of: Account__2,
      icrc1_transfer: TransferArgs
    }),
    This: IDL.Variant({
      createTx: IDL.Nat,
      sendTx: IDL.Nat,
      createTx_comp: IDL.Nat,
      signTx: IDL.Nat,
      getNonce: IDL.Tuple(IDL.Nat, IDL.Opt(IDL.Vec(IDL.Nat)))
    }),
    __skip: IDL.Null
  });
  const OrderStatus = IDL.Variant({
    Done: IDL.Null,
    Todo: IDL.Null,
    Doing: IDL.Null,
    Recovered: IDL.Null,
    Compensating: IDL.Null,
    Blocking: IDL.Null
  });
  const CalleeStatus = IDL.Record({
    continuousFailure: IDL.Nat,
    successCount: IDL.Nat,
    failureCount: IDL.Nat
  });
  const Status__3 = IDL.Variant({
    Error: IDL.Null,
    Done: IDL.Null,
    Todo: IDL.Null,
    Doing: IDL.Null,
    Unknown: IDL.Null
  });
  const Ttid__1 = IDL.Nat;
  const Time = IDL.Int;
  const Toid__1 = IDL.Nat;
  const CallType = IDL.Variant({
    __block: IDL.Null,
    ICRC1: IDL.Variant({
      icrc1_balance_of: Account__2,
      icrc1_transfer: TransferArgs
    }),
    This: IDL.Variant({
      createTx: IDL.Nat,
      sendTx: IDL.Nat,
      createTx_comp: IDL.Nat,
      signTx: IDL.Nat,
      getNonce: IDL.Tuple(IDL.Nat, IDL.Opt(IDL.Vec(IDL.Nat)))
    }),
    __skip: IDL.Null
  });
  const Attempts = IDL.Nat;
  const Callee = IDL.Principal;
  const Compensation = IDL.Record({
    preTtid: IDL.Vec(Ttid__1),
    data: IDL.Opt(IDL.Vec(IDL.Nat8)),
    time: Time,
    toid: IDL.Opt(Toid__1),
    callType: CallType,
    cycles: IDL.Nat,
    recallInterval: IDL.Int,
    attemptsMax: Attempts,
    callee: Callee,
    forTtid: IDL.Opt(Ttid__1)
  });
  const Task__1 = IDL.Record({
    preTtid: IDL.Vec(Ttid__1),
    data: IDL.Opt(IDL.Vec(IDL.Nat8)),
    time: Time,
    toid: IDL.Opt(Toid__1),
    callType: CallType,
    cycles: IDL.Nat,
    recallInterval: IDL.Int,
    attemptsMax: Attempts,
    callee: Callee,
    forTtid: IDL.Opt(Ttid__1)
  });
  const SagaTask = IDL.Record({
    status: Status__3,
    comp: IDL.Opt(Compensation),
    task: Task__1,
    ttid: Ttid
  });
  List_1.fill(IDL.Opt(IDL.Tuple(SagaTask, List_1)));
  const Tcid = IDL.Nat;
  const CompTask = IDL.Record({
    status: Status__3,
    comp: Compensation,
    tcid: Tcid,
    forTtid: Ttid
  });
  List.fill(IDL.Opt(IDL.Tuple(CompTask, List)));
  const CompStrategy = IDL.Variant({
    Backward: IDL.Null,
    Forward: IDL.Null
  });
  const Order = IDL.Record({
    status: OrderStatus,
    tasks: List_1,
    callbackStatus: IDL.Opt(Status__3),
    data: IDL.Opt(IDL.Vec(IDL.Nat8)),
    name: IDL.Text,
    comps: List,
    time: Time,
    compStrategy: CompStrategy,
    allowPushing: IDL.Variant({ Opening: IDL.Null, Closed: IDL.Null })
  });
  const Status__2 = IDL.Variant({
    Error: IDL.Null,
    Done: IDL.Null,
    Todo: IDL.Null,
    Doing: IDL.Null,
    Unknown: IDL.Null
  });
  const TransferError = IDL.Variant({
    GenericError: IDL.Record({
      message: IDL.Text,
      error_code: IDL.Nat
    }),
    TemporarilyUnavailable: IDL.Null,
    BadBurn: IDL.Record({ min_burn_amount: IDL.Nat }),
    Duplicate: IDL.Record({ duplicate_of: IDL.Nat }),
    BadFee: IDL.Record({ expected_fee: IDL.Nat }),
    CreatedInFuture: IDL.Record({ ledger_time: IDL.Nat64 }),
    TooOld: IDL.Null,
    InsufficientFunds: IDL.Record({ balance: IDL.Nat })
  });
  const Result = IDL.Variant({ ok: TxHash, err: IDL.Text });
  const Receipt = IDL.Variant({
    __block: IDL.Null,
    ICRC1: IDL.Variant({
      icrc1_balance_of: IDL.Nat,
      icrc1_transfer: IDL.Variant({ Ok: IDL.Nat, Err: TransferError })
    }),
    This: IDL.Variant({
      createTx: IDL.Record({
        txi: IDL.Nat,
        txHash: TxHash,
        rawTx: IDL.Vec(IDL.Nat8)
      }),
      sendTx: IDL.Record({
        txi: IDL.Nat,
        result: Result,
        rpcId: RpcId
      }),
      createTx_comp: IDL.Null,
      signTx: IDL.Record({
        txi: IDL.Nat,
        signature: IDL.Vec(IDL.Nat8),
        txHash: TxHash,
        rawTx: IDL.Vec(IDL.Nat8)
      }),
      getNonce: IDL.Record({
        txi: IDL.Nat,
        address: EthAddress,
        nonce: Nonce
      })
    }),
    __skip: IDL.Null
  });
  const ErrorCode = IDL.Variant({
    canister_error: IDL.Null,
    call_error: IDL.Record({ err_code: IDL.Nat32 }),
    system_transient: IDL.Null,
    future: IDL.Nat32,
    canister_reject: IDL.Null,
    destination_invalid: IDL.Null,
    system_fatal: IDL.Null
  });
  const Err = IDL.Record({ code: ErrorCode, message: IDL.Text });
  const TaskResult = IDL.Tuple(Status__2, IDL.Opt(Receipt), IDL.Opt(Err));
  const Status__1 = IDL.Variant({
    Error: IDL.Null,
    Done: IDL.Null,
    Todo: IDL.Null,
    Doing: IDL.Null,
    Unknown: IDL.Null
  });
  const Task = IDL.Record({
    preTtid: IDL.Vec(Ttid__1),
    data: IDL.Opt(IDL.Vec(IDL.Nat8)),
    time: Time,
    toid: IDL.Opt(Toid__1),
    callType: CallType,
    cycles: IDL.Nat,
    recallInterval: IDL.Int,
    attemptsMax: Attempts,
    callee: Callee,
    forTtid: IDL.Opt(Ttid__1)
  });
  const TaskEvent = IDL.Record({
    result: TaskResult,
    callbackStatus: IDL.Opt(Status__1),
    task: Task,
    time: Time,
    toid: IDL.Opt(Toid__1),
    ttid: Ttid__1,
    attempts: Attempts,
    txHash: IDL.Vec(IDL.Nat8)
  });
  const ErrorLog = IDL.Record({
    result: IDL.Opt(TaskResult),
    time: Time,
    ttid: Ttid__1,
    callee: IDL.Opt(Callee)
  });
  const Sa = IDL.Vec(IDL.Nat8);
  const RetrieveResult = IDL.Record({
    txIndex: TxIndex,
    toid: IDL.Nat,
    blockIndex: IDL.Nat,
    amount: Wei,
    retrieveFee: Wei
  });
  const HttpHeader = IDL.Record({ value: IDL.Text, name: IDL.Text });
  const HttpResponsePayload = IDL.Record({
    status: IDL.Nat,
    body: IDL.Vec(IDL.Nat8),
    headers: IDL.Vec(HttpHeader)
  });
  const TransformArgs = IDL.Record({
    context: IDL.Vec(IDL.Nat8),
    response: HttpResponsePayload
  });
  const BalanceStats = IDL.Record({
    feeBalance: Wei,
    totalSupply: Wei,
    minterBalance: Wei,
    nativeBalance: Wei
  });
  const UpdateBalanceResult = IDL.Record({
    txIndex: TxIndex,
    toid: IDL.Nat,
    blockIndex: IDL.Nat,
    amount: Wei
  });
  return IDL.Service({
    allocateRewards: IDL.Func(
      [
        IDL.Vec(
          IDL.Record({
            _value: Wei__1,
            _sendRetainedBalance: IDL.Bool,
            _account: Account__1
          })
        )
      ],
      [IDL.Vec(IDL.Tuple(Account__1, IDL.Bool))],
      []
    ),
    changeOwner: IDL.Func([IDL.Principal], [IDL.Bool], []),
    claim: IDL.Func(
      [Account__1, TxHash__1, IDL.Vec(IDL.Nat8)],
      [IDL.Variant({ Ok: BlockHeight, Err: ResultError })],
      []
    ),
    clearEvents: IDL.Func([BlockHeight, BlockHeight], [], []),
    clearRpcLogs: IDL.Func([RpcId__1, RpcId__1], [], []),
    clearRpcRequests: IDL.Func([RpcRequestId__1, RpcRequestId__1], [], []),
    confirmRetrievalTx: IDL.Func([TxIndex__1], [IDL.Bool], []),
    cover_tx: IDL.Func(
      [TxIndex__1, IDL.Opt(IDL.Vec(IDL.Nat8))],
      [IDL.Opt(BlockHeight)],
      []
    ),
    debug_canister_status: IDL.Func([IDL.Principal], [canister_status], []),
    debug_convertFees: IDL.Func([], [], []),
    debug_fetchPairPrice: IDL.Func([IDL.Principal], [IDL.Float64], []),
    debug_fetch_balance: IDL.Func(
      [IDL.Opt(EthAddress__1), EthAddress__1, IDL.Bool],
      [IDL.Nat],
      []
    ),
    debug_fetch_nonce: IDL.Func(
      [IDL.Variant({ pending: IDL.Null, latest: IDL.Null })],
      [Nonce__1],
      []
    ),
    debug_fetch_receipt: IDL.Func(
      [TxHash__1],
      [IDL.Bool, BlockHeight, Status__4, IDL.Opt(IDL.Vec(IDL.Text))],
      []
    ),
    debug_fetch_token_metadata: IDL.Func(
      [EthAddress__1],
      [IDL.Record({ decimals: IDL.Nat8, symbol: IDL.Text })],
      []
    ),
    debug_fetch_txn: IDL.Func(
      [TxHash__1],
      [
        IDL.Bool,
        IDL.Opt(TokenTxn),
        BlockHeight,
        Status__4,
        IDL.Opt(IDL.Nat),
        IDL.Opt(IDL.Vec(IDL.Text))
      ],
      []
    ),
    debug_get_address: IDL.Func([Account__1], [EthAddress__1, Nonce__1], []),
    debug_get_rpc: IDL.Func([IDL.Nat], [AccountId__1, IDL.Text, IDL.Nat], []),
    debug_get_tx: IDL.Func([TxIndex__1], [IDL.Opt(TxStatus)], []),
    debug_local_createTx: IDL.Func(
      [TxIndex__1],
      [
        IDL.Record({
          txi: IDL.Nat,
          txHash: TxHash__1,
          rawTx: IDL.Vec(IDL.Nat8)
        })
      ],
      []
    ),
    debug_local_getNonce: IDL.Func(
      [TxIndex__1],
      [
        IDL.Record({
          txi: IDL.Nat,
          address: EthAddress__1,
          nonce: Nonce__1
        })
      ],
      []
    ),
    debug_local_sendTx: IDL.Func(
      [TxIndex__1],
      [
        IDL.Record({
          txi: IDL.Nat,
          result: Result_1,
          rpcId: RpcId__1
        })
      ],
      []
    ),
    debug_local_signTx: IDL.Func(
      [TxIndex__1],
      [
        IDL.Record({
          txi: IDL.Nat,
          signature: IDL.Vec(IDL.Nat8),
          txHash: TxHash__1,
          rawTx: IDL.Vec(IDL.Nat8)
        })
      ],
      []
    ),
    debug_monitor: IDL.Func([], [], []),
    debug_new_tx: IDL.Func(
      [
        IDL.Variant({
          Withdraw: IDL.Null,
          DepositGas: IDL.Null,
          Deposit: IDL.Null
        }),
        Account__1,
        IDL.Opt(EthAddress__1),
        EthAddress__1,
        EthAddress__1,
        Wei__1
      ],
      [TxIndex__1],
      []
    ),
    debug_outcall: IDL.Func(
      [IDL.Text, IDL.Text, IDL.Nat64],
      [IDL.Nat, IDL.Vec(IDL.Nat8), IDL.Text],
      []
    ),
    debug_parse_tx: IDL.Func([IDL.Vec(IDL.Nat8)], [Result_2], []),
    debug_reconciliation: IDL.Func([], [], []),
    debug_removeDepositingTxi: IDL.Func([AccountId__1, TxIndex__1], [], []),
    debug_removePendingDepositTxn: IDL.Func([TxHash__1], [], []),
    debug_removeRetrievingTxi: IDL.Func([TxIndex__1], [], []),
    debug_send_to: IDL.Func(
      [IDL.Principal, EthAddress__1, EthAddress__1, Wei__1],
      [TxIndex__1],
      []
    ),
    debug_sha3: IDL.Func([IDL.Text], [IDL.Text], []),
    debug_sync_tx: IDL.Func([TxIndex__1], [], []),
    debug_updataBalanceForMode2: IDL.Func([], [], []),
    debug_updateBalance: IDL.Func([], [], []),
    debug_updateRetrievals: IDL.Func([], [], []),
    debug_updateTokenEthRatio: IDL.Func([], [], []),
    debug_updateTokenPrice: IDL.Func([EthAddress__1], [], []),
    debug_verify_sign: IDL.Func(
      [EthAddress__1, Account__1, TxHash__1, IDL.Vec(IDL.Nat8)],
      [
        IDL.Text,
        IDL.Record({
          r: IDL.Vec(IDL.Nat8),
          s: IDL.Vec(IDL.Nat8),
          v: IDL.Nat64
        }),
        EthAddress__1
      ],
      []
    ),
    drc207: IDL.Func([], [DRC207Support], ['query']),
    getCkTokenWasmHistory: IDL.Func(
      [],
      [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Nat))],
      ['query']
    ),
    getCkTokenWasmVersion: IDL.Func([], [IDL.Text, IDL.Nat], ['query']),
    getOwner: IDL.Func([], [IDL.Principal], ['query']),
    get_account_events: IDL.Func(
      [AccountId__1],
      [IDL.Vec(IDL.Tuple(Event, Timestamp))],
      ['query']
    ),
    get_cached_account: IDL.Func(
      [Address],
      [IDL.Opt(IDL.Vec(ICAccount))],
      ['query']
    ),
    get_cached_address: IDL.Func(
      [AccountId__2],
      [IDL.Opt(IDL.Vec(ChainAccount))],
      ['query']
    ),
    get_cached_tx_account: IDL.Func(
      [TxHash__2],
      [IDL.Opt(IDL.Vec(IDL.Tuple(ChainAccount, ICAccount)))],
      ['query']
    ),
    get_ck_tokens: IDL.Func(
      [],
      [IDL.Vec(IDL.Tuple(EthAddress__1, TokenInfo))],
      ['query']
    ),
    get_deposit_address: IDL.Func([Account__1], [EthAddress__1], []),
    get_depositing_all: IDL.Func(
      [
        IDL.Variant({
          all: IDL.Null,
          eth: IDL.Null,
          token: EthAddress__1
        }),
        IDL.Opt(Account__1)
      ],
      [IDL.Vec(IDL.Tuple(Wei__1, IDL.Opt(TxIndex__1), IDL.Opt(TxStatus)))],
      ['query']
    ),
    get_event: IDL.Func(
      [BlockHeight],
      [IDL.Opt(IDL.Tuple(Event, Timestamp))],
      ['query']
    ),
    get_event_count: IDL.Func([], [IDL.Nat], ['query']),
    get_event_first_index: IDL.Func([], [BlockHeight], ['query']),
    get_events: IDL.Func(
      [IDL.Opt(ListPage), IDL.Opt(ListSize)],
      [TrieList_4],
      ['query']
    ),
    get_fee_balance: IDL.Func([IDL.Opt(EthAddress__1)], [Wei__1], ['query']),
    get_keepers: IDL.Func([], [TrieList_3], ['query']),
    get_minter_address: IDL.Func([], [EthAddress__1, Nonce__1], ['query']),
    get_minter_info: IDL.Func([], [MinterInfo], ['query']),
    get_mode2_deposit_txn: IDL.Func(
      [TxHash__1],
      [IDL.Opt(IDL.Tuple(DepositTxn__1, Timestamp))],
      ['query']
    ),
    get_mode2_pending_all: IDL.Func(
      [
        IDL.Variant({
          all: IDL.Null,
          eth: IDL.Null,
          token: EthAddress__1
        }),
        IDL.Opt(Account__1)
      ],
      [IDL.Vec(IDL.Tuple(DepositTxn, Timestamp, IDL.Bool))],
      ['query']
    ),
    get_mode2_pending_deposit_txn: IDL.Func(
      [TxHash__1],
      [IDL.Opt(PendingDepositTxn)],
      ['query']
    ),
    get_pool_balance: IDL.Func([IDL.Opt(EthAddress__1)], [Wei__1], ['query']),
    get_retrieval: IDL.Func([TxIndex__1], [IDL.Opt(RetrieveStatus)], ['query']),
    get_retrieval_list: IDL.Func(
      [Account__1],
      [IDL.Vec(RetrieveStatus)],
      ['query']
    ),
    get_retrieving_all: IDL.Func(
      [
        IDL.Variant({
          all: IDL.Null,
          eth: IDL.Null,
          token: EthAddress__1
        }),
        IDL.Opt(Account__1)
      ],
      [IDL.Vec(IDL.Tuple(TxIndex__1, TxStatus, Timestamp))],
      ['query']
    ),
    get_rpc_log: IDL.Func([RpcId__1], [IDL.Opt(RpcLog)], ['query']),
    get_rpc_logs: IDL.Func(
      [IDL.Opt(ListPage), IDL.Opt(ListSize)],
      [TrieList_2],
      ['query']
    ),
    get_rpc_providers: IDL.Func([], [TrieList_1], ['query']),
    get_rpc_request: IDL.Func(
      [RpcRequestId__1],
      [IDL.Opt(RpcRequestConsensus)],
      ['query']
    ),
    get_rpc_requests: IDL.Func(
      [IDL.Opt(ListPage), IDL.Opt(ListSize)],
      [TrieList],
      ['query']
    ),
    get_tx: IDL.Func([TxIndex__1], [IDL.Opt(TxStatus)], ['query']),
    get_withdrawal_account: IDL.Func([Account__1], [Account], ['query']),
    ictc_TM: IDL.Func([], [IDL.Text], ['query']),
    ictc_addAdmin: IDL.Func([IDL.Principal], [], []),
    ictc_appendTT: IDL.Func(
      [
        IDL.Opt(IDL.Vec(IDL.Nat8)),
        Toid,
        IDL.Opt(Ttid),
        IDL.Principal,
        CallType__1,
        IDL.Vec(Ttid)
      ],
      [Ttid],
      []
    ),
    ictc_blockTO: IDL.Func([Toid], [IDL.Opt(Toid)], []),
    ictc_clearLog: IDL.Func([IDL.Opt(IDL.Int), IDL.Bool], [], []),
    ictc_clearTTPool: IDL.Func([], [], []),
    ictc_completeTO: IDL.Func([Toid, OrderStatus], [IDL.Bool], []),
    ictc_doneTO: IDL.Func([Toid, OrderStatus, IDL.Bool], [IDL.Bool], []),
    ictc_doneTT: IDL.Func([Toid, Ttid, IDL.Bool], [IDL.Opt(Ttid)], []),
    ictc_getAdmins: IDL.Func([], [IDL.Vec(IDL.Principal)], ['query']),
    ictc_getCalleeStatus: IDL.Func(
      [IDL.Principal],
      [IDL.Opt(CalleeStatus)],
      ['query']
    ),
    ictc_getTO: IDL.Func([Toid], [IDL.Opt(Order)], ['query']),
    ictc_getTOCount: IDL.Func([], [IDL.Nat], ['query']),
    ictc_getTOPool: IDL.Func(
      [],
      [IDL.Vec(IDL.Tuple(Toid, IDL.Opt(Order)))],
      ['query']
    ),
    ictc_getTOs: IDL.Func(
      [IDL.Nat, IDL.Nat],
      [
        IDL.Record({
          total: IDL.Nat,
          data: IDL.Vec(IDL.Tuple(Toid, Order)),
          totalPage: IDL.Nat
        })
      ],
      ['query']
    ),
    ictc_getTT: IDL.Func([Ttid], [IDL.Opt(TaskEvent)], ['query']),
    ictc_getTTByTO: IDL.Func([Toid], [IDL.Vec(TaskEvent)], ['query']),
    ictc_getTTErrors: IDL.Func(
      [IDL.Nat, IDL.Nat],
      [
        IDL.Record({
          total: IDL.Nat,
          data: IDL.Vec(IDL.Tuple(IDL.Nat, ErrorLog)),
          totalPage: IDL.Nat
        })
      ],
      ['query']
    ),
    ictc_getTTPool: IDL.Func(
      [],
      [IDL.Vec(IDL.Tuple(Ttid, Task__1))],
      ['query']
    ),
    ictc_getTTs: IDL.Func(
      [IDL.Nat, IDL.Nat],
      [
        IDL.Record({
          total: IDL.Nat,
          data: IDL.Vec(IDL.Tuple(Ttid, TaskEvent)),
          totalPage: IDL.Nat
        })
      ],
      ['query']
    ),
    ictc_redoTT: IDL.Func([Toid, Ttid], [IDL.Opt(Ttid)], []),
    ictc_removeAdmin: IDL.Func([IDL.Principal], [], []),
    ictc_runTO: IDL.Func([Toid], [IDL.Opt(OrderStatus)], []),
    ictc_runTT: IDL.Func([], [IDL.Bool], []),
    keeper_setRpc: IDL.Func(
      [
        IDL.Variant({
          put: IDL.Tuple(
            IDL.Text,
            IDL.Text,
            IDL.Variant({ Available: IDL.Null, Unavailable: IDL.Null })
          ),
          remove: IDL.Null
        }),
        IDL.Opt(Sa)
      ],
      [IDL.Bool],
      []
    ),
    launchToken: IDL.Func(
      [
        IDL.Opt(EthAddress__1),
        IDL.Opt(IDL.Text),
        IDL.Record({
          minAmount: Wei__1,
          fixedFee: Wei__1,
          totalSupply: IDL.Opt(Wei__1),
          ethRatio: Wei__1,
          ckTokenFee: Wei__1,
          gasLimit: IDL.Nat
        })
      ],
      [IDL.Principal],
      []
    ),
    monitor_canisters: IDL.Func(
      [],
      [IDL.Vec(IDL.Tuple(IDL.Principal, IDL.Nat))],
      ['query']
    ),
    monitor_put: IDL.Func([IDL.Principal], [], []),
    monitor_remove: IDL.Func([IDL.Principal], [], []),
    rebuildAndContinue: IDL.Func(
      [
        TxIndex__1,
        Toid,
        IDL.Variant({
          Remain: IDL.Null,
          Reset: IDL.Record({ spentTxHash: TxHash__1 })
        })
      ],
      [IDL.Opt(BlockHeight)],
      []
    ),
    rebuildAndResend: IDL.Func(
      [
        TxIndex__1,
        IDL.Variant({
          Remain: IDL.Null,
          Reset: IDL.Record({ spentTxHash: TxHash__1 })
        }),
        IDL.Bool,
        Wei__1,
        IDL.Bool
      ],
      [IDL.Opt(BlockHeight)],
      []
    ),
    removeToken: IDL.Func([IDL.Opt(EthAddress__1)], [], []),
    resetNonce: IDL.Func(
      [IDL.Variant({ pending: IDL.Null, latest: IDL.Null })],
      [Nonce__1],
      []
    ),
    retrieve: IDL.Func(
      [
        IDL.Opt(EthAddress__1),
        EthAddress__1,
        Wei__1,
        IDL.Opt(IDL.Vec(IDL.Nat8))
      ],
      [IDL.Variant({ Ok: RetrieveResult, Err: ResultError })],
      []
    ),
    rpc_call_transform: IDL.Func(
      [TransformArgs],
      [HttpResponsePayload],
      ['query']
    ),
    sendBlankTx: IDL.Func([IDL.Nat], [Toid], []),
    setCkTokenWasm: IDL.Func([IDL.Vec(IDL.Nat8), IDL.Text], [], []),
    setDependents: IDL.Func([IDL.Principal], [IDL.Bool], []),
    setDepositMethod: IDL.Func([IDL.Nat8], [IDL.Bool], []),
    setKeeper: IDL.Func(
      [
        Account__1,
        IDL.Opt(IDL.Text),
        IDL.Opt(IDL.Text),
        IDL.Variant({ Disabled: IDL.Null, Normal: IDL.Null })
      ],
      [IDL.Bool],
      []
    ),
    setMinConfirmations: IDL.Func([IDL.Nat], [IDL.Bool], []),
    setMinRpcConfirmations: IDL.Func([IDL.Nat], [IDL.Bool], []),
    setPause: IDL.Func([IDL.Bool], [IDL.Bool], []),
    setTokenDexPair: IDL.Func(
      [
        IDL.Variant({
          ETH: IDL.Record({
            dexPair: IDL.Principal,
            quoteToken: EthAddress__1
          }),
          ERC20: IDL.Record({
            tokenId: EthAddress__1,
            dexPair: IDL.Principal
          })
        })
      ],
      [IDL.Bool],
      []
    ),
    setTokenFees: IDL.Func(
      [
        IDL.Opt(EthAddress__1),
        IDL.Record({
          minAmount: Wei__1,
          fixedFee: Wei__1,
          totalSupply: IDL.Opt(IDL.Nat),
          ethRatio: IDL.Opt(Wei__1),
          gasLimit: IDL.Nat
        })
      ],
      [IDL.Bool],
      []
    ),
    setTokenInfo: IDL.Func([IDL.Opt(EthAddress__1), TokenInfo], [], []),
    setTokenLogo: IDL.Func([IDL.Principal, IDL.Text], [IDL.Bool], []),
    sync: IDL.Func([], [IDL.Nat, IDL.Nat, IDL.Nat, IDL.Text, IDL.Nat], []),
    timerStart: IDL.Func([IDL.Nat, IDL.Nat], [], []),
    timerStop: IDL.Func([], [], []),
    updateMinterBalance: IDL.Func(
      [IDL.Opt(EthAddress__1), IDL.Bool],
      [
        IDL.Record({
          pre: BalanceStats,
          post: BalanceStats,
          shortfall: Wei__1
        })
      ],
      []
    ),
    updateRpc: IDL.Func(
      [
        Account__1,
        IDL.Variant({
          set: IDL.Variant({
            Available: IDL.Null,
            Unavailable: IDL.Null
          }),
          remove: IDL.Null
        })
      ],
      [IDL.Bool],
      []
    ),
    update_balance: IDL.Func(
      [IDL.Opt(EthAddress__1), Account__1],
      [IDL.Variant({ Ok: UpdateBalanceResult, Err: ResultError })],
      []
    ),
    update_claims: IDL.Func([], [], []),
    update_retrievals: IDL.Func(
      [],
      [IDL.Vec(IDL.Tuple(TxStatus, Timestamp))],
      []
    ),
    upgradeToken: IDL.Func([IDL.Principal, IDL.Text], [IDL.Text], []),
    wallet_receive: IDL.Func([], [], [])
  });
};
