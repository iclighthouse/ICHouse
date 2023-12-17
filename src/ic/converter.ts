import { Principal } from '@dfinity/principal';
import { sha224 } from '@noble/hashes/sha256';
import crc from 'crc';
import { validateAccount, validatePrincipal } from '@/ic/utils';

const toHexString = (bytes: Uint8Array) => {
  return bytes.reduce(
    (str, byte) => str + byte.toString(16).padStart(2, '0'),
    ''
  );
};
const hexToBytes = (hex: string): number[] => {
  if (hex.substr(0, 2) === '0x') {
    hex = hex.replace(/^0x/i, '');
  }
  const bytes = [];
  for (let c = 0; c < hex.length; c += 2) {
    bytes.push(parseInt(hex.substr(c, 2), 16));
  }
  return bytes;
};
const principalToAccountIdentifier = (
  principal: Principal,
  subAccount?: Uint8Array
): string => {
  // convert to a hex string
  const bytes = new Uint8Array(principalToAccount(principal, subAccount));
  return toHexString(bytes);
};
const principalToAccount = (
  principal: Principal,
  subAccount?: Uint8Array
): Array<number> => {
  // Hash (sha224) the principal, the subAccount and some padding
  const padding = asciiStringToByteArray('\x0Aaccount-id');
  const shaObj = sha224.create();
  shaObj.update(new Uint8Array([
    ...padding,
    ...principal.toUint8Array(),
    ...(subAccount ?? Array(32).fill(0))
  ]));
  const hash = new Uint8Array(shaObj.digest());

  // Prepend the checksum of the hash
  const checksum = calculateCrc32(hash);
  return [...checksum, ...hash];
};
const asciiStringToByteArray = (text: string): Array<number> => {
  return Array.from(text).map((c) => c.charCodeAt(0));
};
// 4 bytes
const calculateCrc32 = (bytes: Uint8Array): Uint8Array => {
  const checksumArrayBuf = new ArrayBuffer(4);
  const view = new DataView(checksumArrayBuf);
  view.setUint32(0, crc.crc32(Buffer.from(bytes)), false);
  return Buffer.from(checksumArrayBuf);
};
const generateTxid = (
  token: string,
  _caller: string,
  _nonce: number
): Array<number> => {
  const nonce = arrayBufferToArrayOfNumber(
    numberToArrayBuffer(Number(_nonce), 4)
  );
  const shaObj = sha224.create();
  shaObj.update(new Uint8Array([
    ...Principal.fromText(token).toUint8Array(),
    ...new Uint8Array(hexToBytes(_caller)),
    ...nonce
  ]));
  const hash = new Uint8Array(shaObj.digest());
  return nonce.concat(Array.from(hash));
};
const generateSwapTxid = (
  appId: string,
  _caller: string,
  _nonce: number
): Array<number> => {
  const appType = [83, 87, 65, 80]; //SWAP
  const nonce = arrayBufferToArrayOfNumber(numberToArrayBuffer(_nonce, 4));
  const shaObj = sha224.create();
  shaObj.update(new Uint8Array([
    ...appType,
    ...Principal.fromText(appId).toUint8Array(),
    ...new Uint8Array(hexToBytes(_caller)),
    ...nonce
  ]));
  const hash = new Uint8Array(shaObj.digest());
  return nonce.concat(Array.from(hash));
};

const arrayBufferToArrayOfNumber = (buffer: ArrayBuffer): Array<number> => {
  const typedArray = new Uint8Array(buffer);
  return Array.from(typedArray);
};
const numberToArrayBuffer = (
  value: number,
  byteLength: number
): ArrayBuffer => {
  const buffer = new ArrayBuffer(byteLength);
  new DataView(buffer).setUint32(byteLength - 4, value);
  return buffer;
};
const isHex = (h: any): boolean => {
  const regexp = /^[0-9a-fA-F]+$/;
  return regexp.test(h);
};
const blobToHexBytes = (str: string): Array<number> => {
  console.time();
  str = str.trim();
  // escape sequence
  const escape = toHexString(new Uint8Array(asciiStringToByteArray('\\')));
  let flag = true;
  if (str.substr(0, 1) !== '\\') {
    flag = false;
  }
  const newStr = str.replace(/\\x/g, '\\').split('\\');
  let ch;
  const re = [];
  for (let i = 0; i < newStr.length; i++) {
    if (i === 0 && !newStr[i]) {
      //
    } else {
      if (!flag && i === 0) {
        ch = toHexString(
          new Uint8Array(asciiStringToByteArray(newStr[i].slice(0)))
        );
        re.push(ch);
      } else {
        if (isHex(newStr[i].slice(0, 2))) {
          if (newStr[i].length >= 2) {
            re.push(...newStr[i].slice(0, 2));
            ch = toHexString(
              new Uint8Array(asciiStringToByteArray(newStr[i].slice(2)))
            );
            re.push(ch);
          } else if (newStr[i].length === 1) {
            ch = toHexString(new Uint8Array(asciiStringToByteArray(newStr[i])));
            re.push(ch);
          }
        } else {
          // escape sequence
          re.push(escape);
          ch = toHexString(new Uint8Array(asciiStringToByteArray(newStr[i])));
          re.push(ch);
        }
      }
    }
  }
  console.timeEnd();
  return re;
};

const vecToBlob = (wasm: Array<number>): string => {
  const arr = [];
  for (let i = 0; i < wasm.length; i++) {
    const num = wasm[i];
    if (
      num >= 32 &&
      num < 127 &&
      num !== 34 &&
      num !== 39 &&
      num !== 92 &&
      num !== 96
    ) {
      // "" is 34, '' is 39 and 96, \ is 92
      const hexStr = String.fromCharCode(num);
      arr.push(hexStr);
    } else {
      const hexStr = toHexString(new Uint8Array([num]));
      arr.push('\\' + hexStr);
    }
  }
  return arr.join('');
};
const hexToBlob = (str) => {
  if (str.length % 2 != 0) {
    return '';
  }
  let num;
  const arr = [];
  for (let i = 0; i < str.length; i = i + 2) {
    const hex = str.substr(i, 2);
    num = parseInt(hex, 16);
    if (
      num >= 32 &&
      num < 127 &&
      num !== 34 &&
      num !== 39 &&
      num !== 92 &&
      num !== 96
    ) {
      // "" is 34, '' is 39 and 96, \ is 92
      const hexStr = String.fromCharCode(num);
      arr.push(hexStr);
    } else {
      const hexStr = toHexString(new Uint8Array([num]));
      arr.push('\\' + hexStr);
    }
  }
  return arr.join('');
};
const generateToolTxid = (
  pairId: string,
  _caller: string,
  _nonce: bigint,
  subAccount?: Uint8Array
): Array<number> => {
  const appType = [83, 87, 65, 80]; //SWAP
  const nonce = arrayBufferToArrayOfNumber(
    numberToArrayBuffer(Number(_nonce), 4)
  );
  const shaObj = sha224.create();
  shaObj.update(new Uint8Array([
    ...appType,
    ...Principal.fromText(pairId).toUint8Array(),
    ...new Uint8Array(
      principalToAccount(Principal.fromText(_caller), subAccount)
    ),
    ...nonce
  ]));
  const hash = new Uint8Array(shaObj.digest());
  return nonce.concat(Array.from(hash));
};
export type SubAccount = Uint8Array;
const generateToolTokenTxid = (
  token: string,
  _caller: string,
  _nonce: bigint,
  subAccount?: Uint8Array
): Array<number> => {
  const nonce = arrayBufferToArrayOfNumber(
    numberToArrayBuffer(Number(_nonce), 4)
  );
  const shaObj = sha224.create();
  shaObj.update(new Uint8Array([
    ...Principal.fromText(token).toUint8Array(),
    ...new Uint8Array(
      principalToAccount(Principal.fromText(_caller), subAccount)
    ),
    ...nonce
  ]));
  const hash = new Uint8Array(shaObj.digest());
  return nonce.concat(Array.from(hash));
};
const toAccountId = (val: string): string => {
  if (!val) {
    return null;
  }
  try {
    if (val.includes('|') || val.includes('.')) {
      let account;
      if (val.includes('|')) {
        account = val.split('|');
      } else {
        account = val.split('.');
      }
      const principal = account[0].trim();
      let subaccount = hexToBytes(account[1].trim());
      const flag = subaccount.every((item) => {
        return item === 0;
      });
      if (!subaccount || flag) {
        return null;
      }
      subaccount = new Array(32 - subaccount.length).fill(0).concat(subaccount);
      if (validatePrincipal(principal)) {
        return principalToAccountIdentifier(
          Principal.from(principal),
          new Uint8Array(subaccount)
        );
      } else {
        return null;
      }
    } else {
      if (validatePrincipal(val)) {
        return principalToAccountIdentifier(Principal.from(val));
      } else if (validateAccount(val)) {
        return val;
      }
      return null;
    }
  } catch (e) {
    console.error(e);
    return null;
  }
};
const toPrincipalAndAccountId = (
  val: string
): { principal: string; subaccount: string; accountId: string } => {
  if (!val) {
    return {
      principal: null,
      subaccount: null,
      accountId: null
    };
  }
  try {
    if (val.includes('|') || val.includes('.')) {
      let account;
      if (val.includes('|')) {
        account = val.split('|');
      } else {
        account = val.split('.');
      }
      const principal = account[0].trim();
      let subaccount = hexToBytes(account[1].trim());
      const flag = subaccount.every((item) => {
        return item === 0;
      });
      if (!subaccount || flag) {
        return {
          principal: principal,
          subaccount: null,
          accountId: principalToAccountIdentifier(Principal.from(principal))
        };
      }
      subaccount = new Array(32 - subaccount.length).fill(0).concat(subaccount);
      if (validatePrincipal(principal)) {
        return {
          principal: principal,
          subaccount: toHexString(new Uint8Array(subaccount)),
          accountId: principalToAccountIdentifier(
            Principal.from(principal),
            new Uint8Array(subaccount)
          )
        };
      } else {
        return {
          principal: null,
          subaccount: null,
          accountId: null
        };
      }
    } else {
      if (validatePrincipal(val)) {
        return {
          principal: val,
          subaccount: null,
          accountId: principalToAccountIdentifier(Principal.from(val))
        };
      } else if (validateAccount(val)) {
        return {
          principal: null,
          subaccount: null,
          accountId: val
        };
      }
      return {
        principal: null,
        subaccount: null,
        accountId: null
      };
    }
  } catch (e) {
    console.error(e);
    return {
      principal: null,
      subaccount: null,
      accountId: null
    };
  }
};
const formatDateToDay = (date: Date): string => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return year + '-' + Appendzero(month) + '-' + Appendzero(day);
};
const formatDateToMinute = (date: Date): string => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();

  return (
    year +
    '-' +
    Appendzero(month) +
    '-' +
    Appendzero(day) +
    ' ' +
    Appendzero(hour) +
    ':' +
    Appendzero(minute)
  );
};
/**
 * @return {string}
 */
function Appendzero(obj: number) {
  if (obj < 10) {
    return '0' + obj;
  } else {
    return obj;
  }
}

export {
  toHexString,
  hexToBytes,
  principalToAccount,
  principalToAccountIdentifier,
  asciiStringToByteArray,
  calculateCrc32,
  generateTxid,
  generateSwapTxid,
  generateToolTxid,
  generateToolTokenTxid,
  blobToHexBytes,
  hexToBlob,
  vecToBlob,
  toAccountId,
  toPrincipalAndAccountId,
  formatDateToDay,
  formatDateToMinute
};
