export const ICManagement =
  'type canister_id = principal;\n' +
  'type user_id = principal;\n' +
  'type wasm_module = blob;\n' +
  '\n' +
  'type canister_settings = record {\n' +
  '  controllers : opt vec principal;\n' +
  '  compute_allocation : opt nat;\n' +
  '  memory_allocation : opt nat;\n' +
  '  freezing_threshold : opt nat;\n' +
  '};\n' +
  '\n' +
  'type definite_canister_settings = record {\n' +
  '  controllers : vec principal;\n' +
  '  compute_allocation : nat;\n' +
  '  memory_allocation : nat;\n' +
  '  freezing_threshold : nat;\n' +
  '};\n' +
  '\n' +
  'type http_header = record { name: text; value: text };\n' +
  '\n' +
  'type http_response = record {\n' +
  '  status: nat;\n' +
  '  headers: vec http_header;\n' +
  '  body: blob;\n' +
  '};\n' +
  '\n' +
  'type ecdsa_curve = variant { secp256k1; };\n' +
  '\n' +
  'type satoshi = nat64;\n' +
  '\n' +
  'type bitcoin_network = variant {\n' +
  '  mainnet;\n' +
  '  testnet;\n' +
  '};\n' +
  '\n' +
  'type bitcoin_address = text;\n' +
  '\n' +
  'type block_hash = blob;\n' +
  '\n' +
  'type outpoint = record {\n' +
  '  txid : blob;\n' +
  '  vout : nat32\n' +
  '};\n' +
  '\n' +
  'type utxo = record {\n' +
  '  outpoint: outpoint;\n' +
  '  value: satoshi;\n' +
  '  height: nat32;\n' +
  '};\n' +
  '\n' +
  'type get_utxos_request = record {\n' +
  '  address : bitcoin_address;\n' +
  '  network: bitcoin_network;\n' +
  '  filter: opt variant {\n' +
  '    min_confirmations: nat32;\n' +
  '    page: blob;\n' +
  '  };\n' +
  '};\n' +
  '\n' +
  'type get_current_fee_percentiles_request = record {\n' +
  '  network: bitcoin_network;\n' +
  '};\n' +
  '\n' +
  'type get_utxos_response = record {\n' +
  '  utxos: vec utxo;\n' +
  '  tip_block_hash: block_hash;\n' +
  '  tip_height: nat32;\n' +
  '  next_page: opt blob;\n' +
  '};\n' +
  '\n' +
  'type get_balance_request = record {\n' +
  '  address : bitcoin_address;\n' +
  '  network: bitcoin_network;\n' +
  '  min_confirmations: opt nat32;\n' +
  '};\n' +
  '\n' +
  'type send_transaction_request = record {\n' +
  '  transaction: blob;\n' +
  '  network: bitcoin_network;\n' +
  '};\n' +
  '\n' +
  'type millisatoshi_per_byte = nat64;\n' +
  '\n' +
  'service ic : {\n' +
  '  create_canister : (record {\n' +
  '    settings : opt canister_settings\n' +
  '  }) -> (record {canister_id : canister_id});\n' +
  '  update_settings : (record {\n' +
  '    canister_id : principal;\n' +
  '    settings : canister_settings\n' +
  '  }) -> ();\n' +
  '  install_code : (record {\n' +
  '    mode : variant {install; reinstall; upgrade};\n' +
  '    canister_id : canister_id;\n' +
  '    wasm_module : wasm_module;\n' +
  '    arg : blob;\n' +
  '  }) -> ();\n' +
  '  uninstall_code : (record {canister_id : canister_id}) -> ();\n' +
  '  start_canister : (record {canister_id : canister_id}) -> ();\n' +
  '  stop_canister : (record {canister_id : canister_id}) -> ();\n' +
  '  canister_status : (record {canister_id : canister_id}) -> (record {\n' +
  '      status : variant { running; stopping; stopped };\n' +
  '      settings: definite_canister_settings;\n' +
  '      module_hash: opt blob;\n' +
  '      memory_size: nat;\n' +
  '      cycles: nat;\n' +
  '      idle_cycles_burned_per_day: nat;\n' +
  '  });\n' +
  '  delete_canister : (record {canister_id : canister_id}) -> ();\n' +
  '  deposit_cycles : (record {canister_id : canister_id}) -> ();\n' +
  '  raw_rand : () -> (blob);\n' +
  '  http_request : (record {\n' +
  '    url : text;\n' +
  '    max_response_bytes: opt nat64;\n' +
  '    method : variant { get; head; post };\n' +
  '    headers: vec http_header;\n' +
  '    body : opt blob;\n' +
  '    transform : opt record {\n' +
  '      function : func (record {response : http_response; context : blob}) -> (http_response) query;\n' +
  '      context : blob\n' +
  '    };\n' +
  '  }) -> (http_response);\n' +
  '\n' +
  '  // Threshold ECDSA signature\n' +
  '  ecdsa_public_key : (record {\n' +
  '    canister_id : opt canister_id;\n' +
  '    derivation_path : vec blob;\n' +
  '    key_id : record { curve: ecdsa_curve; name: text };\n' +
  '  }) -> (record { public_key : blob; chain_code : blob; });\n' +
  '  sign_with_ecdsa : (record {\n' +
  '    message_hash : blob;\n' +
  '    derivation_path : vec blob;\n' +
  '    key_id : record { curve: ecdsa_curve; name: text };\n' +
  '  }) -> (record { signature : blob });\n' +
  '\n' +
  '  // bitcoin interface\n' +
  '  bitcoin_get_balance: (get_balance_request) -> (satoshi);\n' +
  '  bitcoin_get_utxos: (get_utxos_request) -> (get_utxos_response);\n' +
  '  bitcoin_send_transaction: (send_transaction_request) -> ();\n' +
  '  bitcoin_get_current_fee_percentiles: (get_current_fee_percentiles_request) -> (vec millisatoshi_per_byte);\n' +
  '\n' +
  '  // provisional interfaces for the pre-ledger world\n' +
  '  provisional_create_canister_with_cycles : (record {\n' +
  '    amount: opt nat;\n' +
  '    settings : opt canister_settings\n' +
  '  }) -> (record {canister_id : canister_id});\n' +
  '  provisional_top_up_canister :\n' +
  '    (record { canister_id: canister_id; amount: nat }) -> ();\n' +
  '}\n';
