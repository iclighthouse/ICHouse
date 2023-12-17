<template>
  <div class="competitions-main">
    <a-spin :spinning="loading">
      <table>
        <thead>
          <tr>
            <th>Pair</th>
            <th>Canister Id</th>
            <th>Vol</th>
            <th>Price</th>
            <th>Name</th>
            <th>Round</th>
            <th>Start</th>
            <th>End</th>
          </tr>
        </thead>
        <tbody>
          <tr
            class="pointer"
            v-for="(item, index) in competitions"
            :key="index"
            @click="jump(item)"
          >
            <td>
              {{ item[1].pair.pair.token0[1] }}/{{
                item[1].pair.pair.token1[1]
              }}
            </td>
            <td>
              {{ item[1].pair.pair.canisterId.toString() }}
            </td>
            <td>
              <div class="pair-vol" v-if="item[1].pair.liquidity.length">
                <!--<div
                  v-if="
                    tokens[item[1].pair.pair.token0[0].toString()] &&
                    tokens[item[1].pair.pair.token0[0].toString()].decimals
                  "
                >
                  <span class="table-number-color">{{
                    item[1].pair.liquidity[0].vol.value0 |
                      bigintToFloat(
                        2,
                        tokens[item[1].pair.pair.token0[0].toString()].decimals
                      ) |
                      formatNum
                  }}</span>
                  {{ item[1].pair.pair.token0[1] }}
                </div>-->
                <div
                  v-if="
                    tokens[item[1].pair.pair.token1[0].toString()] &&
                    tokens[item[1].pair.pair.token1[0].toString()].decimals
                  "
                >
                  <span class="table-number-color">{{
                    item[1].pair.liquidity[0].vol.value1 |
                      bigintToFloat(
                        2,
                        tokens[item[1].pair.pair.token1[0].toString()].decimals
                      ) |
                      formatNum
                  }}</span>
                  {{ item[1].pair.pair.token1[1] }}
                </div>
              </div>
            </td>
            <td>
              <div
                v-if="
                  item[1].pair.liquidity.length &&
                  tokens[item[1].pair.pair.token0[0].toString()] &&
                  tokens[item[1].pair.pair.token0[0].toString()].decimals &&
                  tokens[item[1].pair.pair.token1[0].toString()] &&
                  tokens[item[1].pair.pair.token1[0].toString()].decimals
                "
              >
                <span class="table-number-color">{{
                  getPrice(item[1].pair.liquidity, item[1].pair.pair)
                }}</span>
                {{ item[1].pair.pair.token1[1] }}
              </div>
            </td>
            <td>
              <router-link
                :to="`/competitions/tradingComp/${item[1].pair.pair.canisterId.toString()}/${
                  item[1].round
                }`"
              >
                {{ item[1].name }}
              </router-link>
            </td>
            <td>
              <router-link
                :to="`/competitions/tradingComp/${item[1].pair.pair.canisterId.toString()}/${
                  item[1].round
                }`"
              >
                {{ item[1].round }}
                <a-icon
                  class="pending-competitions"
                  v-show="pendingCompetitions(item[1])"
                  type="clock-circle"
                />
                <a-icon
                  class="open-competitions"
                  v-show="openCompetitions(item[1])"
                  type="check-circle"
                />
                <a-icon
                  class="close-competitions"
                  v-show="closeCompetitions(item[1])"
                  type="lock"
                />
              </router-link>
            </td>
            <td>
              {{ item[1].start | formatDateFromNanosecond }}
            </td>
            <td>
              {{ item[1].end | formatDateFromNanosecond }}
            </td>
          </tr>
          <tr v-if="!loading && !competitions.length">
            <td colspan="8" style="text-align: center; font-size: 14px">
              No data
            </td>
          </tr>
        </tbody>
      </table>
    </a-spin>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { ICSwapRouterService } from '@/ic/ICSwapRouter/ICSwapRouterService';
import {
  CompetitionsData,
  PairResponse,
  SwapPair__1,
  TokenLiquidity
} from '@/ic/ICSwapRouter/model';
import { Time, TokenInfo } from '@/ic/common/icType';
import { getTokenInfo } from '@/ic/getTokenInfo';
import BigNumber from 'bignumber.js';

@Component({
  name: 'Index',
  components: {}
})
export default class extends Vue {
  private ICSwapRouterService: ICSwapRouterService = null;
  private tokens: { [key: string]: TokenInfo };
  private competitions: Array<CompetitionsData> = [];
  private loading = false;
  private page = {
    current: 1,
    pageSize: 10,
    total: 0,
    onChange: this.pageChange,
    hideOnSinglePage: true,
    showQuickJumper: true
  };
  @Watch('$route')
  private onRouteChange() {
    this.getCompetitions();
  }
  created(): void {
    this.ICSwapRouterService = new ICSwapRouterService();
    this.tokens = JSON.parse(localStorage.getItem('tokens')) || {};
    this.getCompetitions();
  }
  private getPrice(
    liquidity: Array<TokenLiquidity>,
    pair: SwapPair__1
  ): string {
    if (liquidity.length) {
      const token0 = pair.token0[0].toString();
      const token1 = pair.token1[0].toString();
      if (liquidity.length) {
        const token0 = pair.token0[0].toString();
        const token1 = pair.token1[0].toString();
        return new BigNumber(liquidity[0].price.toString(10))
          .div(10 ** this.tokens[token1].decimals)
          .div(
            new BigNumber(liquidity[0].unitSize.toString(10)).div(
              10 ** this.tokens[token0].decimals
            )
          )
          .decimalPlaces(this.tokens[token0].decimals)
          .toString(10);
      }
    }
    return '';
  }
  private pageChange(page: number): void {
    this.page.current = page;
  }
  private async getCompetitions(): Promise<void> {
    this.loading = true;
    let dexName = [];
    if (this.$route.query.type) {
      dexName = [this.$route.query.type];
    }
    const res = await this.ICSwapRouterService.getCompetitions(dexName);
    console.log(res);
    if (res) {
      this.competitions = res.data.sort((a, b) => {
        return Number(b[1].start) - Number(a[1].start);
      });
      this.page.total = Number(res.total);
    }
    this.loading = false;
    this.competitions.forEach((item) => {
      if (!this.tokens[item[1].pair.pair.token0[0].toString()]) {
        getTokenInfo(
          item[1].pair.pair.token0[0],
          item[1].pair.pair.token0[2]
        ).then((tokenInfo) => {
          this.$set(
            this.tokens,
            item[1].pair.pair.token0[0].toString(),
            tokenInfo
          );
        });
      }
      if (!this.tokens[item[1].pair.pair.token1[0].toString()]) {
        getTokenInfo(
          item[1].pair.pair.token1[0],
          item[1].pair.pair.token1[2]
        ).then((tokenInfo) => {
          this.$set(
            this.tokens,
            item[1].pair.pair.token1[0].toString(),
            tokenInfo
          );
        });
      }
    });
  }
  private jump(val: CompetitionsData): void {
    this.$router.push(
      `/competitions/tradingComp/${val[1].pair.pair.canisterId.toString()}/${
        val[1].round
      }`
    );
  }
  private pendingCompetitions(val: {
    end: Time;
    name: string;
    pair: PairResponse;
    start: Time;
    round: bigint;
  }): boolean {
    const now = new Date().getTime();
    return new BigNumber(now).times(1000000).lt(val.start.toString(10));
  }
  private openCompetitions(val: {
    end: Time;
    name: string;
    pair: PairResponse;
    start: Time;
    round: bigint;
  }): boolean {
    const now = new Date().getTime();
    return (
      new BigNumber(now).times(1000000).gte(val.start.toString(10)) &&
      new BigNumber(now).times(1000000).lte(val.end.toString(10))
    );
  }
  private closeCompetitions(val: {
    end: Time;
    name: string;
    pair: PairResponse;
    start: Time;
    round: bigint;
  }): boolean {
    const now = new Date().getTime();
    return new BigNumber(now).times(1000000).gt(val.end.toString(10));
  }
}
</script>

<style scoped lang="scss">
.competitions-main {
  padding-top: 40px;
}
table {
  width: 100%;
  min-height: 100px;
  line-height: 1.2;
  background: #fff;
  box-shadow: 0 1px 10px 0 rgba(0, 71, 121, 0.05);
  border-radius: 4px;
  border: 1px solid #eef6fb;
  padding: 0 20px;
  tr {
    border-bottom: 1px solid #e3e9ed;
    th {
      padding: 16px 16px;
      overflow-wrap: break-word;
      background: #fafafa;
      border-bottom: 1px solid #e8e8e8;
    }
    td {
      padding: 16px 16px;
      overflow-wrap: break-word;
      border-bottom: 1px solid #e8e8e8;
    }
    &:last-child {
      border-bottom: none;
    }
  }
  td {
    padding: 15px 0;
    vertical-align: middle;
  }
}
.pending-competitions,
.close-competitions {
  color: #adb3c4;
}
.open-competitions {
  color: #21c77d;
}
</style>
