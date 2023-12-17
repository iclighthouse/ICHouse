<template>
  <div class="tx-details">
    <div class="tx-main">
      <div class="tx-main-title">Overview</div>
      <div class="tx-item">
        <div class="tx-item-left">AccountId:</div>
        <div class="tx-item-right">
          {{ accountId }}
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
        <div class="tx-item-left">Shares:</div>
        <div class="tx-item-right" v-if="liquidity && swapId && swaps[swapId]">
          <a-statistic
            :value-style="{ fontSize: '14px', fontWeight: 'normal' }"
            :value="
              onBigintToFloat(
                liquidity.shares,
                swaps[swapId].decimals,
                swaps[swapId].decimals
              )
            "
          ></a-statistic>
          <span
            v-if="
              getTokenId(
                swaps[swapId].token0[0],
                swaps[swapId].token0[1],
                'token0'
              ) === 'Cycles'
            "
            ><span class="span-nbsp"></span>({{
              liquidity.cycles | bigintToFloat(12, 12)
            }}
            TCycles
            <a-icon type="plus" />
            {{ liquidity.icpE8s | bigintToFloat(8) }} ICP)</span
          >
          <span
            v-if="
              tokens &&
              tokens[
                getTokenId(
                  swaps[swapId].token0[0],
                  swaps[swapId].token0[1],
                  'token0'
                )
              ] &&
              tokens[
                getTokenId(swaps[swapId].token1[0], swaps[swapId].token1[1])
              ]
            "
          >
            <span class="span-nbsp"></span>({{
              liquidity.value0 |
                bigintToFloat(
                  tokens[
                    getTokenId(
                      swaps[swapId].token0[0],
                      swaps[swapId].token0[1],
                      'token0'
                    )
                  ].decimals,
                  tokens[
                    getTokenId(
                      swaps[swapId].token0[0],
                      swaps[swapId].token0[1],
                      'token0'
                    )
                  ].decimals
                )
            }}
            {{
              tokens[
                getTokenId(
                  swaps[swapId].token0[0],
                  swaps[swapId].token0[1],
                  'token0'
                )
              ].symbol
            }}
            <a-icon type="plus" />
            {{
              liquidity.value1 |
                bigintToFloat(
                  tokens[
                    getTokenId(
                      swaps[swapId].token1[0],
                      swaps[swapId].token1[1],
                      'token0'
                    )
                  ].decimals,
                  tokens[
                    getTokenId(
                      swaps[swapId].token1[0],
                      swaps[swapId].token1[1],
                      'token0'
                    )
                  ].decimals
                )
            }}
            {{
              tokens[
                getTokenId(
                  swaps[swapId].token1[0],
                  swaps[swapId].token1[1],
                  'token0'
                )
              ].symbol
            }})
          </span>
        </div>
      </div>
    </div>
    <div class="address-transactions">
      <div class="address-transactions-swap">
        <span>Swap:<span class="span-nbsp"></span></span>
        <router-link :to="jumpRouter(`/swap/${swapId}`)">{{
          swapId
        }}</router-link>
        <span v-if="swaps && swaps[swapId]"
          ><span class="span-nbsp"></span>({{ swaps[swapId].name }})<span
            class="span-nbsp"
          ></span
        ></span>
      </div>
      <div class="address-transactions-title">
        Latest transactions
        <div class="search">
          <a-input-group class="search-group" compact size="large">
            <a-input
              class="search-token"
              v-model="searchSwapId"
              type="text"
              @pressEnter="search"
              allow-clear
              placeholder="AccountId/Principal"
            ></a-input>
            <a-button type="primary" size="large" @click="search"
              ><a-icon type="search" /><span
                class="testnet"
                v-if="$route.meta.menu === 'SwapsTest'"
                >(It’s testnet)</span
              ></a-button
            >
          </a-input-group>
        </div>
      </div>
      <swap-transactions
        :swap-id="swapId"
        :account-id="accountId"
        ref="transactions"
        @msgCaller="getPrincipal"
      ></swap-transactions>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { ICTokensScanService } from '@/ic/ICTokensScan/ICTokensScanService';
import { Principal } from '@dfinity/principal';
import { CYCLES_FINANCE_CANISTER_ID } from '@/ic/utils';
import {
  hexToBytes,
  toHexString,
  toPrincipalAndAccountId
} from '@/ic/converter';
import { SwapInfo, TokenId, TokenInfo, TokenStd } from '@/ic/common/icType';
import { getSwapInfo } from '@/ic/getSwapInfo';
import { CyclesFinanceService } from '@/ic/cyclesFinance/cyclesFinanceService';
import { DRC205SwapService } from '@/ic/DRC205Swap/DRC205SwapService';
import { Liquidity } from '@/ic/DRC205Swap/model';
import { CyclesFinanceLiquidity } from '@/ic/cyclesFinance/model';
import { bigintToFloat } from '@/filters';
import { TokenType } from '@/ic/DRC205Bucket/model';
import { getTokenInfo } from '@/ic/getTokenInfo';
import SwapTransactions from '@/components/swapTransactions/Index.vue';
import { SwapItem } from '@/ic/ICTokensScan/model';
import { Route } from 'vue-router';
import { fromAccountId } from '@/ic/fromAccountId';

@Component({
  name: 'Address',
  components: { SwapTransactions }
})
export default class extends Vue {
  private ICTokensScanService: ICTokensScanService;
  private accountId = '';
  private principal = '-';
  private subaccount = '';
  private id = '';
  private swapId = '';
  private searchSwapId = '';
  private swapList: SwapItem = [];
  private swaps: { [key: string]: SwapInfo } = {};
  private tokens: { [key: string]: TokenInfo } = {};
  private liquidity: Liquidity | CyclesFinanceLiquidity = null;
  @Watch('$route')
  private onRouteChange(to: Route, from: Route) {
    if (
      (to.name === 'SwapAddress' &&
        (to.params.id !== this.id || to.params.swapId !== this.swapId)) ||
      from.name === 'Home' ||
      from.name === 'Transactions'
    ) {
      this.accountId = '';
      this.principal = '-';
      this.subaccount = '';
      this.swapId = '';
      this.searchSwapId = '';
      this.liquidity = null;
      this.init();
    }
  }
  created(): void {
    this.ICTokensScanService = new ICTokensScanService();
    this.init();
    this.getSwapList();
  }
  private getPrincipal(principal: string) {
    if (!this.principal || this.principal === '-') {
      this.principal = principal;
    }
  }
  private async init(): Promise<void> {
    this.tokens = JSON.parse(localStorage.getItem('tokens')) || {};
    if (this.$route.params.id) {
      this.id = this.$route.params.id.trim();
    }
    if (this.$route.params.swapId) {
      this.swapId = this.$route.params.swapId.trim();
    }
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
    // if (validatePrincipal(this.id)) {
    //   this.principal = this.id;
    //   this.accountId = principalToAccountIdentifier(
    //     Principal.fromText(this.principal)
    //   );
    // } else if (validateAccountId(this.id)) {
    //   if (this.id.substr(0, 2) === '0x') {
    //     this.accountId = this.id.slice(2);
    //   } else {
    //     this.accountId = this.id;
    //   }
    // }
    if (this.swapId && this.accountId) {
      this.getLiquidity();
      this.$nextTick(() => {
        (this.$refs.transactions as any).init();
      });
    }
    this.swaps = JSON.parse(localStorage.getItem('swaps')) || {};
    if (this.swapId && !this.swaps[this.swapId]) {
      try {
        this.swaps[this.swapId] = await getSwapInfo(
          Principal.fromText(this.swapId)
        );
      } catch (e) {
        console.log(e);
      }
      this.$forceUpdate();
      localStorage.setItem(
        'swaps',
        JSON.stringify(this.swaps, (key, value) =>
          typeof value === 'bigint' ? value.toString() : value
        )
      );
    }
  }
  private async getLiquidity(): Promise<void> {
    if (this.swapId === CYCLES_FINANCE_CANISTER_ID) {
      const cyclesFinanceService = new CyclesFinanceService(this.swapId);
      this.liquidity = await cyclesFinanceService.liquidity([this.accountId]);
    } else {
      const swapService = new DRC205SwapService(this.swapId);
      this.liquidity = await swapService.liquidity([this.accountId]);
    }
    console.log(this.liquidity);
  }
  private async getSwapList(): Promise<void> {
    this.swapList = await this.ICTokensScanService.getSwapList();
    console.log(this.swapList);
  }
  private getTokenId(
    tokenType: TokenType,
    tokenStd: TokenStd,
    type?: string
  ): string {
    const tokenId = (tokenType as { Token: TokenId }).Token;
    if (tokenId) {
      if (!this.tokens[tokenId.toString()]) {
        this.tokens[tokenId.toString()] = {
          name: '',
          symbol: '',
          decimals: 8,
          fee: { noFee: null },
          totalSupply: null,
          maxSupply: null,
          logo: ''
        };
        getTokenInfo(tokenId, tokenStd).then((tokenInfo) => {
          this.tokens[tokenId.toString()] = tokenInfo;
          this.$forceUpdate();
        });
      }
      return tokenId.toString();
    } else {
      if (type === 'token0') {
        return 'Cycles';
      } else {
        return 'ICP';
      }
    }
  }
  private onBigintToFloat(val: bigint | string, num = 4, decimal = 8): string {
    return bigintToFloat(val, num, decimal);
  }
  private search(): void {
    const swapId = this.$route.params.swapId;
    const searchSwapId = this.$route.params.id;
    if (
      !(
        swapId.trim() === this.swapId &&
        searchSwapId === this.searchSwapId.trim()
      )
    ) {
      if (this.searchSwapId.trim()) {
        this.$router.push(
          this.jumpRouter(`/swap/address/${swapId}/${this.searchSwapId.trim()}`)
        );
      } else {
        this.$router.push(this.jumpRouter(`/swap/${swapId}`));
      }
    }
  }
  private onCopy(): void {
    this.$message.success('Copied');
  }
  private jumpRouter(url: string): string {
    if (this.$route.meta && this.$route.meta.type === 'Test') {
      url = '/swapsTest' + url;
    }
    return url;
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
  .address-transactions-swap {
    padding: 20px 0;
  }
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
.tx-item-right-column {
  align-items: flex-start !important;
  flex-direction: column;
  line-height: 22px;
}
</style>
