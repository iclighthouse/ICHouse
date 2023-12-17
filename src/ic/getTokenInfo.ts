import { Metadata, TokenId, TokenInfo, TokenStd } from '@/ic/common/icType';
import { DRC20TokenService } from '@/ic/DRC20Token/DRC20TokenService';
import { CYCLES_FINANCE_CANISTER_ID, LEDGER_CANISTER_ID } from '@/ic/utils';
import { IcrcValue } from '@/ic/DRC20Token/model';
import { Principal } from '@dfinity/principal';
import { SNSGovernanceService } from '@/ic/SNSGovernance/SNSGovernanceService';

export const getTokenInfo = async (
  tokenId: TokenId,
  tokenStd?: TokenStd
): Promise<TokenInfo> => {
  let tokenInfo: TokenInfo = {
    name: '',
    symbol: '',
    decimals: null,
    fee: { noFee: null },
    totalSupply: null,
    maxSupply: null,
    logo: '',
    tokenStd: tokenStd
  };
  if (
    tokenId.toString() === CYCLES_FINANCE_CANISTER_ID ||
    (tokenStd && (tokenStd as { cycles: null }).cycles === null)
  ) {
    tokenInfo.name = 'Cycles';
    tokenInfo.symbol = 'TCycles';
    tokenInfo.fee = BigInt(0);
    tokenInfo.decimals = 12;
    tokenInfo.logo = require('@/assets/img/cycles.png');
  } else if (
    tokenId.toString() === LEDGER_CANISTER_ID ||
    (tokenStd && (tokenStd as { icp: null }).icp === null)
  ) {
    tokenInfo.name = 'Icp';
    tokenInfo.symbol = 'ICP';
    tokenInfo.fee = BigInt(10000);
    tokenInfo.decimals = 8;
    tokenInfo.logo = require('@/assets/img/dfinity.png');
  } else if (tokenStd && (tokenStd as { drc20: null }).drc20 === null) {
    tokenInfo = await getDrc20TokenInfo(tokenId.toString(), tokenInfo);
  } else if (tokenStd && (tokenStd as { dip20: null }).dip20 === null) {
    tokenInfo = await getDip20TokenInfo(tokenId.toString(), tokenInfo);
  } else if (tokenStd && (tokenStd as { icrc1: null }).icrc1 === null) {
    tokenInfo = await getIcrc1TokenInfo(tokenId.toString(), tokenInfo);
  } else {
    const DRC20Token = new DRC20TokenService(tokenId.toString());
    try {
      const drc20Standard = await DRC20Token.standard();
      if (drc20Standard) {
        tokenInfo = await getDrc20TokenInfo(tokenId.toString(), tokenInfo);
      }
    } catch (e) {
      try {
        const icrcStandard = await DRC20Token.icrc1SupportedStandards();
        if (icrcStandard) {
          tokenInfo = await getIcrc1TokenInfo(tokenId.toString(), tokenInfo);
        }
      } catch (e) {
        tokenInfo = await getDip20TokenInfo(tokenId.toString(), tokenInfo);
      }
    }
  }
  const tokens = JSON.parse(localStorage.getItem('tokens')) || {};
  if (
    !tokens[tokenId.toString()] ||
    (tokens[tokenId.toString()] &&
      (tokens[tokenId.toString()].name !== tokenInfo.name ||
        tokens[tokenId.toString()].decimals !== tokenInfo.decimals ||
        tokens[tokenId.toString()].symbol !== tokenInfo.symbol ||
        tokens[tokenId.toString()].tokenStd !== tokenInfo.tokenStd ||
        tokens[tokenId.toString()].fee !== tokenInfo.fee ||
        tokens[tokenId.toString()].totalSupply !== tokenInfo.totalSupply ||
        tokens[tokenId.toString()].maxSupply !== tokenInfo.maxSupply))
  ) {
    tokens[tokenId.toString()] = {
      name: tokenInfo.name,
      decimals: tokenInfo.decimals,
      symbol: tokenInfo.symbol,
      price: '',
      tokenStd: tokenInfo.tokenStd,
      fee: tokenInfo.fee,
      totalSupply: tokenInfo.totalSupply,
      maxSupply: tokenInfo.maxSupply
    };
    localStorage.setItem(
      'tokens',
      JSON.stringify(tokens, (key, value) =>
        typeof value === 'bigint'
          ? value.toString()
          : key === 'logo'
          ? ''
          : value
      )
    );
  }
  return tokenInfo;
};
const getDrc20TokenInfo = async (
  tokenId: string,
  tokenInfo: TokenInfo
): Promise<TokenInfo> => {
  const DRC20Token = new DRC20TokenService(tokenId);
  const promiseAllValue = [];
  promiseAllValue.push(
    DRC20Token.name(),
    DRC20Token.symbol(),
    DRC20Token.decimals(),
    DRC20Token.gas(),
    DRC20Token.totalSupply(),
    DRC20Token.metadata(),
    DRC20Token.maxSupply()
  );
  // const token = await Promise.all(promiseAllValue);
  return Promise.all(promiseAllValue).then((token) => {
    tokenInfo.name = token[0];
    tokenInfo.symbol = token[1];
    tokenInfo.decimals = token[2];
    tokenInfo.fee = token[3];
    tokenInfo.totalSupply = token[4];
    const metadata = token[5];
    metadata.some((val: Metadata) => {
      if (val.name === 'logo') {
        tokenInfo.logo = val.content;
        return true;
      }
    });
    if (token[6] && token[6].length) {
      tokenInfo.maxSupply = token[6][0];
    }
    tokenInfo.tokenStd = { drc20: null };
    return tokenInfo;
  });
  // return tokenInfo;
};
const getDip20TokenInfo = async (
  tokenId: string,
  tokenInfo: TokenInfo
): Promise<TokenInfo> => {
  const DRC20Token = new DRC20TokenService(tokenId);
  // const info = await DRC20Token.getMetadata(tokenId);
  return DRC20Token.getMetadata().then((info) => {
    tokenInfo.name = info.name;
    tokenInfo.symbol = info.symbol;
    tokenInfo.decimals = info.decimals;
    tokenInfo.fee = info.fee;
    tokenInfo.totalSupply = info.totalSupply;
    tokenInfo.logo = info.logo;
    tokenInfo.tokenStd = { dip20: null };
    return tokenInfo;
  });
};
const getIcrc1TokenInfo = async (
  tokenId: string,
  tokenInfo: TokenInfo
): Promise<TokenInfo> => {
  const promiseAllValue = [];
  const DRC20Token = new DRC20TokenService(tokenId);
  promiseAllValue.push(
    DRC20Token.icrcName(),
    DRC20Token.icrcSymbol(),
    DRC20Token.icrcDecimals(),
    DRC20Token.icrcFee(),
    DRC20Token.icrcTotalSupply(),
    getLogo(Principal.from(tokenId), { icrc1: null })
  );
  // const token = await Promise.all(promiseAllValue);
  return Promise.all(promiseAllValue).then((token) => {
    tokenInfo.name = token[0];
    tokenInfo.symbol = token[1];
    tokenInfo.decimals = token[2];
    tokenInfo.fee = token[3];
    tokenInfo.totalSupply = token[4];
    tokenInfo.logo = token[5];
    tokenInfo.tokenStd = { icrc1: null };
    return tokenInfo;
  });
};
export const getLogo = async (
  tokenId: TokenId,
  tokenStd?: TokenStd
): Promise<string> => {
  let std = '';
  let logo = '';
  if (tokenStd) {
    std = Object.keys(tokenStd)[0];
  }
  const DRC20Token = new DRC20TokenService(tokenId.toString());
  if (tokenId.toString() === 'zfcdd-tqaaa-aaaaq-aaaga-cai') {
    logo = require('@/assets/img/sns1.png');
  } else if (
    tokenId.toString() === CYCLES_FINANCE_CANISTER_ID ||
    std === 'cycles'
  ) {
    logo = require('@/assets/img/cycles.png');
  } else if (tokenId.toString() === LEDGER_CANISTER_ID || std === 'icp') {
    logo = require('@/assets/img/dfinity.png');
  } else if (std === 'drc20') {
    const metadata = await DRC20Token.metadata();
    metadata.some((val: Metadata) => {
      if (val.name === 'logo') {
        logo = val.content;
        return true;
      }
    });
  } else if (std === 'dip20') {
    const res = await DRC20Token.getMetadata();
    logo = res.logo;
  } else if (std === 'icrc1') {
    const res = await DRC20Token.icrc1Metadata();
    res.some((val: [string, IcrcValue]) => {
      if (val[0].includes('logo')) {
        logo = (
          val[1] as {
            Text: string;
          }
        ).Text;
        return true;
      }
    });
    if (!logo) {
      const listDeployedSnses =
        JSON.parse(localStorage.getItem('deployedSnses')) || [];
      let SNSGovernance = '';
      console.log(listDeployedSnses);
      listDeployedSnses.some((item) => {
        if (
          item.ledger_canister_id.length &&
          item.ledger_canister_id[0] === tokenId.toString()
        ) {
          SNSGovernance = item.governance_canister_id[0];
          return true;
        }
      });
      if (SNSGovernance) {
        const snsGovernanceService = new SNSGovernanceService();
        const metadata = await snsGovernanceService.getMetadata(SNSGovernance);
        console.log(metadata);
        if (metadata && metadata.logo && metadata.logo.length) {
          logo = metadata.logo[0];
        }
      }
    }
  } else {
    try {
      const metadata = await DRC20Token.metadata();
      metadata.some((val: Metadata) => {
        if (val.name === 'logo') {
          logo = val.content;
          return true;
        }
      });
    } catch (e) {
      try {
        const res = await DRC20Token.getMetadata();
        logo = res.logo;
      } catch (e) {
        try {
          const res = await DRC20Token.icrc1Metadata();
          res.some((val: [string, IcrcValue]) => {
            if (val[0].toLocaleLowerCase().includes('logo')) {
              logo = (
                val[1] as {
                  Text: string;
                }
              ).Text;
              return true;
            }
          });
        } catch (e) {
          console.log(e);
        }
      }
    }
  }
  return logo;
};
