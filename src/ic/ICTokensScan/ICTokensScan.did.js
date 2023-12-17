export default ({ IDL }) => {
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
  return IDL.Service({
    canister_status: IDL.Func([], [canister_status], []),
    changeOwner: IDL.Func([IDL.Principal], [IDL.Bool], []),
    drc207: IDL.Func([], [DRC207Support], ['query']),
    getMemory: IDL.Func([], [IDL.Nat, IDL.Nat, IDL.Nat], ['query']),
    getNftList: IDL.Func(
      [],
      [
        IDL.Vec(
          IDL.Record({
            logo: IDL.Text,
            standard: IDL.Text,
            symbol: IDL.Text,
            canisterId: IDL.Principal
          })
        )
      ],
      ['query']
    ),
    getOwner: IDL.Func([], [IDL.Principal], ['query']),
    getSwapList: IDL.Func(
      [],
      [
        IDL.Vec(
          IDL.Record({
            dex: IDL.Text,
            logo: IDL.Text,
            symbol: IDL.Text,
            canisterId: IDL.Principal
          })
        )
      ],
      ['query']
    ),
    getTag: IDL.Func([IDL.Text], [IDL.Vec(IDL.Text)], ['query']),
    getTokenList: IDL.Func(
      [],
      [
        IDL.Vec(
          IDL.Record({
            logo: IDL.Text,
            standard: IDL.Text,
            symbol: IDL.Text,
            canisterId: IDL.Principal
          })
        )
      ],
      ['query']
    ),
    removeNftList: IDL.Func([IDL.Principal], [IDL.Bool], []),
    removeSwapList: IDL.Func([IDL.Principal], [IDL.Bool], []),
    removeTag: IDL.Func([IDL.Text, IDL.Text], [IDL.Bool], []),
    removeTokenList: IDL.Func([IDL.Principal], [IDL.Bool], []),
    setNftList: IDL.Func(
      [
        IDL.Record({
          logo: IDL.Text,
          standard: IDL.Text,
          symbol: IDL.Text,
          canisterId: IDL.Principal
        })
      ],
      [IDL.Bool],
      []
    ),
    setSwapList: IDL.Func(
      [
        IDL.Record({
          dex: IDL.Text,
          logo: IDL.Text,
          symbol: IDL.Text,
          canisterId: IDL.Principal
        })
      ],
      [IDL.Bool],
      []
    ),
    setTag: IDL.Func([IDL.Text, IDL.Text], [IDL.Bool], []),
    setTokenList: IDL.Func(
      [
        IDL.Record({
          logo: IDL.Text,
          standard: IDL.Text,
          symbol: IDL.Text,
          canisterId: IDL.Principal
        })
      ],
      [IDL.Bool],
      []
    ),
    wallet_receive: IDL.Func([], [], [])
  });
};
