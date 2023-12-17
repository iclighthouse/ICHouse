<template>
  <div class="tx-details">
    <div class="tx-main">
      <div class="tx-main-title">Overview</div>
      <div class="tx-item">
        <div class="tx-item-left">AccountId:</div>
        <div class="tx-item-right">
          {{ accountId }} <span v-if="tag">({{ tag }})</span>
          <span class="span-nbsp"></span
          ><a-icon
            type="copy"
            v-clipboard:copy="accountId"
            v-clipboard:success="onCopy"
          />
        </div>
      </div>
      <div class="tx-item">
        <div class="tx-item-left">Principal:</div>
        <div class="tx-item-right tx-item-right-column" v-if="principal">
          <div>
            {{ principal }}
            <span class="span-nbsp"></span
            ><a-icon
              v-if="principal !== '-'"
              type="copy"
              v-clipboard:copy="principal"
              v-clipboard:success="onCopy"
            />
          </div>
          <div v-show="subaccount">(subaccount: {{ subaccount }})</div>
        </div>
      </div>
      <div class="tx-item">
        <div class="tx-item-left">Token Balance:</div>
        <div class="tx-item-right" v-if="tokens && tokens[tokenId]">
          {{
            balance |
              bigintToFloat(
                tokens[tokenId].decimals,
                tokens[tokenId].decimals
              ) |
              formatNum
          }}
          {{ tokens[tokenId].symbol }}
        </div>
        <div class="tx-item-right" v-else>-</div>
        <div
          v-if="
            tokens &&
            tokens[tokenId] &&
            tokens[tokenId].tokenStd &&
            (!principal || principal === '-') &&
            Object.keys(tokens[tokenId].tokenStd)[0].toLocaleLowerCase() ===
              'icrc1' &&
            !rosettaTokens[tokenId]
          "
        >
          <span class="span-nbsp"></span>(The balance can only be checked by
          principal.)
        </div>
      </div>
    </div>
    <div class="address-transactions">
      <div class="address-transactions-token">
        <span>Token:<span class="span-nbsp"></span></span>
        <div v-if="tokens && tokens[tokenId]">
          <img
            v-if="tokens[tokenId].logo"
            :src="tokens[tokenId].logo"
            alt=""
          />{{ tokens[tokenId].symbol }}<span class="span-nbsp"></span>({{
            tokens[tokenId].name
          }})<span class="span-nbsp"></span>
        </div>
        <router-link :to="jumpRouter(`/token/${tokenId}`)">{{
          tokenId
        }}</router-link>
        <span
          v-show="showSearchByNonce && !isSearchByNonce"
          class="search-by-nonce pointer"
          @click="searchByNonce"
          >SearchByNonce</span
        >
        <span
          v-show="showSearchByNonce && isSearchByNonce"
          class="search-by-nonce pointer"
          @click="isSearchByNonce = false"
        >
          Back
        </span>
      </div>
      <div class="address-transactions-title">
        Latest transactions
        <div class="search">
          <a-input-group class="search-group" compact size="large">
            <a-input
              v-model="searchTokenId"
              class="search-token"
              type="text"
              @pressEnter="search"
              allow-clear
              placeholder="AccountId/Principal"
            ></a-input>
            <a-button type="primary" size="large" @click="search"
              ><a-icon type="search" /><span
                class="testnet"
                v-if="$route.meta.menu === 'TokensTest'"
                >(It’s testnet)</span
              ></a-button
            >
          </a-input-group>
        </div>
      </div>
      <transactions
        :id="id"
        :token-id="tokenId"
        :account-id="accountId"
        :principal="principal"
        :subaccount="subaccount"
        :search-by-nonce="isSearchByNonce"
        @msgCaller="getPrincipal"
        ref="transactions"
      ></transactions>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { LedgerService } from '@/ic/ledger/ledgerService';
import { ICTokensScanService } from '@/ic/ICTokensScan/ICTokensScanService';
import { DRC20TokenService } from '@/ic/DRC20Token/DRC20TokenService';
import { Principal } from '@dfinity/principal';
import BigNumber from 'bignumber.js';
import { rosettaTokens } from '@/ic/utils';
import {
  hexToBytes,
  toHexString,
  toPrincipalAndAccountId
} from '@/ic/converter';
import { TokenItem } from '@/ic/ICTokensScan/model';
import Transactions from '@/components/transactions/Address.vue';
import { TokenInfo } from '@/ic/common/icType';
import { getLogo, getTokenInfo } from '@/ic/getTokenInfo';
import RosettaApi from '@/ic/RosettaApi';
import { Route } from 'vue-router';
import { fromAccountId } from '@/ic/fromAccountId';

@Component({
  name: 'Index',
  components: {
    Transactions
  }
})
export default class extends Vue {
  private ICTokensScanService: ICTokensScanService;
  private ledgerService: LedgerService;
  private rosettaTokens = rosettaTokens;
  private tokens: { [key: string]: TokenInfo };
  private principal = '-';
  private subaccount = '';
  private accountId = '';
  private id = '';
  private tokenId = '';
  private logo = '';
  private tag = '';
  private searchTokenId = '';
  private tokenList: Array<TokenItem> = [];
  private icp = '';
  private balance: BigInt = null;
  public decimals = 8;
  private isSearchByNonce = false;
  @Watch('$route')
  private onRouteChange(to: Route, from: Route) {
    if (
      (to.name === 'Address' &&
        (to.params.id !== this.id ||
          to.params.tokenId !== this.tokenId ||
          to.params.subaccount !== this.subaccount)) ||
      from.name === 'Swaps' ||
      from.name === 'SwapTransactions'
    ) {
      this.tag = '';
      this.icp = '';
      this.balance = null;
      this.principal = '-';
      this.accountId = '';
      this.subaccount = '';
      this.tokenId = '';
      this.searchTokenId = '';
      this.tokenList = [];
      this.logo = '';
      this.isSearchByNonce = false;
      this.init();
    }
  }
  get showSearchByNonce(): boolean {
    if (
      this.tokens &&
      this.tokens[this.tokenId] &&
      this.tokens[this.tokenId].tokenStd
    ) {
      const std = Object.keys(this.tokens[this.tokenId].tokenStd)[0];
      if (std) {
        return std.toLocaleLowerCase() === 'drc20';
      }
    }
    return false;
  }
  created(): void {
    this.ledgerService = new LedgerService();
    this.ICTokensScanService = new ICTokensScanService();
    this.init();
  }
  private searchByNonce(): void {
    this.isSearchByNonce = true;
  }
  private async init(): Promise<void> {
    if (this.$route.params.id) {
      this.id = this.$route.params.id.trim();
    }
    if (this.$route.params.tokenId) {
      this.tokenId = this.$route.params.tokenId.trim();
    }
    // this.subaccount = this.$route.params.subaccount;
    this.tokens = JSON.parse(localStorage.getItem('tokens')) || {};
    console.log(217);
    console.log(this.tokens);
    const res = toPrincipalAndAccountId(this.id);
    console.log(res);
    this.accountId = res.accountId;
    this.principal = res.principal;
    this.subaccount = res.subaccount;
    if (this.accountId && !this.principal) {
      const account = await fromAccountId(hexToBytes(this.accountId));
      if (account) {
        this.principal = account.owner.toString();
        if (account.subaccount && account.subaccount.length) {
          this.subaccount = toHexString(new Uint8Array(account.subaccount[0]));
        }
      } else {
        this.principal = '-';
      }
    }
    if (this.accountId) {
      this.getIcp();
      this.getBalance();
      this.getTag();
      this.$nextTick(() => {
        (this.$refs.transactions as any).init();
      });
    }
    this.getTokenList();
    if (this.tokenId && !this.tokens[this.tokenId]) {
      this.tokens[this.tokenId] = {
        name: '',
        symbol: '',
        decimals: 8,
        fee: { noFee: null },
        totalSupply: null,
        maxSupply: null,
        logo: '',
        tokenStd: null
      };
      getTokenInfo(Principal.fromText(this.tokenId)).then(async (tokenInfo) => {
        this.tokens[this.tokenId] = tokenInfo;
        await this.getLogo(this.tokenId);
        this.$forceUpdate();
      });
    } else {
      this.getLogo(this.tokenId);
    }
    console.log(this.tokens[this.tokenId]);
  }
  private async getBalance(): Promise<void> {
    if (rosettaTokens[this.tokenId]) {
      const rosettaApi = new RosettaApi(
        rosettaTokens[this.tokenId].url,
        rosettaTokens[this.tokenId].blockchain
      );
      const res = await rosettaApi.getAccountBalance(this.accountId);
      console.log(res.toString(10));
      this.balance = BigInt(res.toString(10));
    } else {
      const currentDRC20TokenService = new DRC20TokenService(this.tokenId);
      try {
        this.balance = await currentDRC20TokenService.drc20_balanceOf(
          this.accountId
        );
      } catch (e) {
        console.log(e);
        try {
          if (this.principal && this.principal !== '-') {
            this.balance = await currentDRC20TokenService.balanceOf(
              Principal.fromText(this.principal)
            );
            console.log(this.balance);
          }
        } catch (e) {
          console.log(e);
          if (this.principal && this.principal !== '-') {
            let subaccount = [];
            if (this.subaccount) {
              subaccount = [hexToBytes(this.subaccount)];
            }
            this.balance = await currentDRC20TokenService.icrc1_balance_of({
              owner: Principal.fromText(this.principal),
              subaccount: subaccount
            });
          }
        }
      }
    }
  }
  private async getLogo(tokenId: string): Promise<void> {
    let logo = '';
    if (this.tokens[tokenId] && !this.tokens[tokenId].logo) {
      logo = await getLogo(
        Principal.fromText(tokenId),
        this.tokens[tokenId].tokenStd
      );
      this.$set(this.tokens[tokenId], 'logo', logo);
    }
  }
  private search(): void {
    const id = this.$route.params.id;
    const tokenId = this.$route.params.tokenId;
    if (!(this.searchTokenId.trim() === id && this.tokenId === tokenId)) {
      if (this.searchTokenId.trim()) {
        this.$router.push(
          this.jumpRouter(`/address/${tokenId}/${this.searchTokenId.trim()}`)
        );
      } else {
        this.$router.push(this.jumpRouter(`/token/${tokenId}`));
      }
    }
  }
  private getPrincipal(principal: string) {
    if (!this.principal || this.principal === '-') {
      this.principal = principal;
    }
  }
  private jumpRouter(url: string): string {
    if (this.$route.meta && this.$route.meta.type === 'Test') {
      url = '/tokensTest' + url;
    }
    return url;
  }
  private async getTag(): Promise<void> {
    try {
      const res = await this.ICTokensScanService.getTag(this.accountId);
      if (res && res[0]) {
        this.tag = res[0];
      }
    } catch (e) {
      console.log(e);
    }
  }
  private async getTokenList(): Promise<void> {
    this.tokenList = await this.ICTokensScanService.getTokenList();
    console.log(this.tokenList);
  }
  private async getIcp(): Promise<void> {
    const balanceRes = await this.ledgerService.getBalance(this.accountId);
    console.log(balanceRes);
    if (balanceRes?.e8s || Number(balanceRes?.e8s) === 0) {
      this.icp =
        new BigNumber(balanceRes?.e8s.toString())
          .div(10 ** this.decimals)
          .toString(10) + ' ICP';
    } else {
      this.icp = '-';
    }
  }
  private onCopy(): void {
    this.$message.success('Copied');
  }
}
</script>

<style scoped lang="scss">
.address-transactions {
  background: #fff;
  line-height: 20px;
  box-shadow: 0 2px 4px 0 rgba(0, 140, 238, 0.05);
  border-radius: 4px;
  padding: 10px 20px;
}
.address-transactions-title {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  font-weight: bold;
}
.search {
  max-width: calc(100vw - 170px);
  margin-left: auto;
}
.search-group {
  display: flex !important;
  .search-token {
    width: 400px;
  }
}
.address-transactions-token {
  display: flex;
  align-items: center;
  padding: 20px 0;
  span {
    font-weight: bold;
  }
  img {
    width: 20px;
    height: 20px;
    margin-right: 5px;
    border-radius: 10px;
    object-fit: contain;
  }
  .search-by-nonce {
    margin-left: auto;
    color: #1890ff;
    font-weight: normal;
  }
}
.tx-item-right-column {
  align-items: flex-start !important;
  flex-direction: column;
  line-height: 22px;
}
</style>
