import { Principal } from '@dfinity/principal';
import { PrincipalType } from '@/ic/common/icType';

const IC_MANAGEMENT_CANISTER_ID = 'aaaaa-aa';
const IC_TOKENS_SCAN_CANISTER_ID = 'ytcww-qyaaa-aaaak-aacra-cai';
const IC_DRC202_PROXY_CANISTER_ID = 'y5a36-liaaa-aaaak-aacqa-cai';
const IC_DRC205_PROXY_CANISTER_ID = '6ylab-kiaaa-aaaak-aacga-cai';
const IC_DRC202_ROOT_CANISTER_ID = 'bffvb-aiaaa-aaaak-ae3ba-cai';
const LEDGER_CANISTER_ID = 'ryjl3-tyaaa-aaaaa-aaaba-cai';
const IC_BLACK_HOLE = '7hdtw-jqaaa-aaaak-aaccq-cai';
const CYCLES_FINANCE_CANISTER_ID = '6nmrm-laaaa-aaaak-aacfq-cai';
const IC_DRC202_TEST_PROXY_CANISTER_ID = 'iq2ev-rqaaa-aaaak-aagba-cai';
const IC_DRC205_TEST_PROXY_CANISTER_ID = 'ix3cb-4iaaa-aaaak-aagbq-cai';
const SNS_WASM_CANISTER_ID = 'qaa6y-5yaaa-aaaaa-aaafa-cai';
const CK_BTC_MINTER_CANISTER_ID = 'mqygn-kiaaa-aaaar-qaadq-cai';
const CK_BTC_CANISTER_ID = 'mxzaz-hqaaa-aaaar-qaada-cai';
const IC_BTC_MINTER_CANISTER_ID = '36tsk-fqaaa-aaaak-adzaq-cai';
// const IC_BTC_MINTER_CANISTER_ID = '3xqzw-tyaaa-aaaak-adzba-cai';
const IC_BTC_CANISTER_ID = '3fwop-7iaaa-aaaak-adzca-cai';
const IC_SWAP_ROUTER_CANISTER_ID = 'j4d4d-pqaaa-aaaak-aanxq-cai';
// const IC_SWAP_ROUTER_CANISTER_ID = 'pwokq-miaaa-aaaak-act6a-cai';
const IC_SWAP_TEST_ROUTER_CANISTER_ID = 'pwokq-miaaa-aaaak-act6a-cai';
const IC_ETH_MINTER_CANISTER_ID = 'nhgv3-fiaaa-aaaak-aer5q-cai';
const ACCOUNT_PRINCIPAL_MAP_CANISTER_ID = 'gpapk-hqaaa-aaaak-aex4q-cai';
const DID_CANISTER_ID = 'a4gq6-oaaaa-aaaab-qaa4q-cai';
const CK_ETH_MINTER_CANISTER_ID = 'sv3dd-oaaaa-aaaar-qacoa-cai';
const CK_ETH_LEDGER_CANISTER_ID = 'ss2fx-dyaaa-aaaar-qacoq-cai';
const validatePrincipal = (principal: string): boolean => {
  try {
    return principal === Principal.fromText(principal).toText();
  } catch (e) {
    return false;
  }
};
const validateAccount = (a: any): boolean => {
  return isHex(a) && a.length === 64;
};
const validateAccountId = (a: any): boolean => {
  if (a.substr(0, 2) === '0x') {
    return isHexString(a) && a.length === 66;
  } else {
    return validateAccount(a);
  }
};
const isHexString = (value: any): boolean => {
  if (value.substr(0, 2) === '0x') {
    value = value.replace(/^0x/i, '');
  }
  return isHex(value);
};
const isHex = (h: any): boolean => {
  const regexp = /^[0-9a-fA-F]+$/;
  return regexp.test(h);
};
const getPrincipalType = (principalId: string): PrincipalType | null => {
  if (!principalId) return null;

  let principalRaw;
  try {
    principalRaw = Principal.fromText(principalId).toUint8Array();
  } catch (error) {
    console.warn(error);
    return null;
  }

  switch (principalRaw.slice(-1)[0]) {
    case 1:
      return 'Canister';
    case 2:
      return 'User';
    case 3:
      return 'Derived';
    case 4:
      return 'Anonymous';
  }
  return 'Unknown';
};
const rosettaTokens = {
  'jwcfb-hyaaa-aaaaj-aac4q-cai': {
    url: 'https://rosetta-ogy.origyn.network/',
    blockchain: 'ORIGYN Foundation'
  },
  'rd6wb-lyaaa-aaaaj-acvla-cai': {
    url: 'https://rosetta-ogy.origyn.network/',
    blockchain: 'ORIGYN Foundation'
  }
};

export {
  IC_MANAGEMENT_CANISTER_ID,
  IC_TOKENS_SCAN_CANISTER_ID,
  IC_DRC202_PROXY_CANISTER_ID,
  IC_BLACK_HOLE,
  LEDGER_CANISTER_ID,
  IC_DRC205_PROXY_CANISTER_ID,
  CYCLES_FINANCE_CANISTER_ID,
  IC_DRC202_TEST_PROXY_CANISTER_ID,
  IC_DRC205_TEST_PROXY_CANISTER_ID,
  SNS_WASM_CANISTER_ID,
  CK_BTC_MINTER_CANISTER_ID,
  IC_BTC_MINTER_CANISTER_ID,
  CK_BTC_CANISTER_ID,
  IC_BTC_CANISTER_ID,
  rosettaTokens,
  IC_SWAP_ROUTER_CANISTER_ID,
  IC_ETH_MINTER_CANISTER_ID,
  ACCOUNT_PRINCIPAL_MAP_CANISTER_ID,
  IC_SWAP_TEST_ROUTER_CANISTER_ID,
  DID_CANISTER_ID,
  CK_ETH_MINTER_CANISTER_ID,
  CK_ETH_LEDGER_CANISTER_ID,
  IC_DRC202_ROOT_CANISTER_ID,
  validatePrincipal,
  validateAccount,
  validateAccountId,
  getPrincipalType
};
