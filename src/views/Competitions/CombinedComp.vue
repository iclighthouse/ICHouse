<template>
  <div>
    <div class="competitions-round-header">
      <div class="competitions-round-header-top">
        <span
          v-if="dexCompetitionResponse"
          class="competitions-round-header-title"
          >{{ dexCompetitionResponse.name }}</span
        >
        <span style="font-size: 20px" v-if="round"
          >Current Round: {{ round.toString(10) }}</span
        >
        <div class="switch-round">
          <!--<a-icon type="arrow-left" />-->
          <a-input
            @keyup.native.enter="onChangeRound"
            class="competition-round-input"
            v-only-number
            v-model="changeRound"
            placeholder="Round"
          ></a-input>
          <button
            @click="onChangeRound"
            type="button"
            class="primary"
            :disabled="!changeRound"
          >
            Go
          </button>
          <button
            @click="changeLatest"
            type="button"
            class="primary change-current-round"
            v-show="Number(round) !== Number(latestRound)"
          >
            Latest Round
          </button>
        </div>
      </div>
      <div class="competitions-round-header-info">
        <span>Hosted:</span>
        <span v-if="dexCompetitionResponse">
          {{ dexCompetitionResponse.hostedDex }}
        </span>
      </div>
      <div class="competitions-round-header-info">
        <span v-if="dexCompetitionResponse">
          Activity Period:<span class="span-nbsp"></span>{{
            dexCompetitionResponse.start | formatDateFromNanosecond
          }}
        </span>
        <span v-if="dexCompetitionResponse">
          <span class="span-nbsp"></span>-<span class="span-nbsp"></span>{{
            dexCompetitionResponse.end | formatDateFromNanosecond
          }}
        </span>
      </div>
    </div>
    <div
      v-if="dexCompetitionResponse && dexCompetitionResponse.content"
      class="competitions-round-main"
    >
      {{ dexCompetitionResponse.content }}
    </div>
    <div
      class="competitions-round-main-title competitions-round-main-title-rank"
      style="margin-top: 20px"
    >
      Ranking
      <span v-show="roundOpen && updateTime">
        A data update will occur within the next 8 hours. Last update:
        {{ updateTime | formatDateFromNanosecond }}
      </span>
    </div>
    <div>
      <a-spin :spinning="loading">
        <table>
          <thead>
            <tr>
              <th>AccountId</th>
              <th>Position</th>
              <th class="pointer" @click="onSortYield('vol')">
                <span class="sort-table-main">
                  <span>Vol</span>
                  <span class="sort-table">
                    <a-icon
                      :class="{ active: sortYieldType === 'volDown' }"
                      type="caret-up"
                    />
                    <a-icon
                      :class="{ active: sortYieldType === 'volUp' }"
                      type="caret-down"
                    />
                  </span>
                </span>
              </th>
              <th class="pointer" @click="onSortYield('yield')">
                <span class="sort-table-main">
                  <span>PNL</span>
                  <span class="sort-table">
                    <a-icon
                      :class="{ active: sortYieldType === 'reverse' }"
                      type="caret-up"
                    />
                    <a-icon
                      :class="{ active: sortYieldType === 'positive' }"
                      type="caret-down"
                    />
                  </span>
                </span>
              </th>
              <th class="pointer" @click="onSortYield('score')">
                <span class="sort-table-main">
                  <span>Score<span class="span-nbsp"></span></span>
                  <a-tooltip overlayClassName="yield-ant-tooltip">
                    <template slot="title">
                      <div class="keep-all">
                        1. Score = PNLScore + VolScore*20%.
                      </div>
                      <div class="break-word">
                        2. PNLScore: Score based on PNL ranking (The 1st place
                        score is 1000, the 2nd place 999, and so on, with the
                        final score being 0, with no negative numbers).
                      </div>
                      <div class="break-word">
                        3. VolScore: Score based on volume ranking (The 1st
                        place score is 1000, the 2nd place 999, and so on, with
                        the final score being 0, with no negative numbers).
                      </div>
                    </template>
                    <a-icon type="question-circle" />
                  </a-tooltip>
                  <span class="sort-table">
                    <a-icon
                      :class="{ active: sortYieldType === 'high' }"
                      type="caret-up"
                    />
                    <a-icon
                      :class="{ active: sortYieldType === 'low' }"
                      type="caret-down"
                    />
                  </span>
                </span>
              </th>
              <th>
                <span class="rank-table">
                  <span>Ranking</span>
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, index) in dexCompetitionTraders.slice(
                (page.currentPage - 1) * page.size,
                page.currentPage * page.size
              )"
              :key="index"
            >
              <td>
                <span>{{ arrayToHexString(item[0]) | ellipsis }}</span>
                <span class="span-nbsp"></span><a-icon
                  class="pointer"
                  type="copy"
                  v-clipboard:copy="arrayToHexString(item[0])"
                  v-clipboard:success="onCopy"
                />
              </td>
              <td>
                <ul>
                  <li
                    v-for="trade in item[1]"
                    :key="trade.pair.canisterId.toString()"
                  >
                    <span>
                      <a
                        :href="`http://ICDex.io/${trade.pair.token0[1]}/${trade.pair.token1[1]}`"
                        target="_blank"
                      >
                        {{ trade.pair.token0[1] }}/{{
                          trade.pair.token1[1]
                        }} </a
                      >:
                    </span>
                    <span
                      v-if="
                        Object.keys(trade.quoteToken)[0] === 'token1' &&
                        tokens &&
                        tokens[trade.pair.token0[0].toString()]
                      "
                    >
                      <span v-if="trade.total.length">{{
                        trade.total[0][0].position.toString(10) |
                          bigintToFloat(
                            tokens[trade.pair.token0[0].toString()].decimals,
                            tokens[trade.pair.token0[0].toString()].decimals
                          )
                      }}</span>
                      <span v-else>-</span>
                    </span>
                    <span
                      v-if="
                        Object.keys(trade.quoteToken)[0] === 'token0' &&
                        tokens &&
                        tokens[trade.pair.token1[0].toString()]
                      "
                    >
                      <span v-if="trade.total.length">
                        {{
                          trade.total[0][0].position.toString(10) |
                            bigintToFloat(
                              tokens[trade.pair.token1[0].toString()].decimals,
                              tokens[trade.pair.token1[0].toString()].decimals
                            )
                        }}
                      </span>
                      <span v-else>-</span>
                    </span>
                    <span
                      v-if="
                        Object.keys(trade.quoteToken)[0] === 'token1' &&
                        tokens &&
                        tokens[trade.pair.token1[0].toString()] &&
                        tokens[trade.pair.token0[0].toString()]
                      "
                    >
                      <span v-if="trade.total.length">
                        (AvgPrice:
                        {{
                          getAvgPrice(
                            trade.total[0][0].avgPrice,
                            tokens[trade.pair.token0[0].toString()].decimals,
                            tokens[trade.pair.token1[0].toString()].decimals
                          )
                        }})
                      </span>
                    </span>
                    <span
                      v-if="
                        Object.keys(trade.quoteToken)[0] === 'token0' &&
                        tokens &&
                        tokens[trade.pair.token1[0].toString()] &&
                        tokens[trade.pair.token0[0].toString()]
                      "
                    >
                      <span v-if="trade.total.length">
                        (AvgPrice:
                        {{
                          getAvgPrice(
                            trade.total[0][0].avgPrice,
                            tokens[trade.pair.token1[0].toString()].decimals,
                            tokens[trade.pair.token0[0].toString()].decimals
                          )
                        }})
                      </span>
                    </span>
                  </li>
                </ul>
              </td>
              <td>
                <span v-if="canSort">
                  {{ item[2].vol }}
                </span>
                <span v-else>-</span>
              </td>
              <td>
                <span v-if="canSort">
                  {{ item[2].pnl }}
                </span>
                <span v-else>-</span>
              </td>
              <td>
                <span v-if="canSort && item[2].score !== null">
                  {{ item[2].score }}
                </span>
                <span v-else>-</span>
              </td>
              <td>
                <div v-if="canSort && item[2].score !== null">
                  <div
                    class="rank-main"
                    v-if="
                      (sortYieldType === 'high' || sortYieldType === 'low') &&
                      item[2].scoreRank
                    "
                  >
                    <img
                      v-show="item[2].scoreRank === 1"
                      class="rank-img"
                      src="@/assets/img/1st.svg"
                      alt=""
                    />
                    <img
                      v-show="item[2].scoreRank === 2"
                      class="rank-img"
                      src="@/assets/img/2nd.svg"
                      alt=""
                    />
                    <img
                      v-show="item[2].scoreRank === 3"
                      class="rank-img"
                      src="@/assets/img/3rd.svg"
                      alt=""
                    />
                    <span v-show="item[2].scoreRank > 3">
                      {{ item[2].scoreRank }}
                    </span>
                  </div>
                  <div
                    class="rank-main"
                    v-if="
                      (sortYieldType === 'volUp' ||
                        sortYieldType === 'volDown') &&
                      item[2].scoreRank
                    "
                  >
                    <img
                      v-show="item[2].volRank === 1"
                      class="rank-img"
                      src="@/assets/img/1st.svg"
                      alt=""
                    />
                    <img
                      v-show="item[2].volRank === 2"
                      class="rank-img"
                      src="@/assets/img/2nd.svg"
                      alt=""
                    />
                    <img
                      v-show="item[2].volRank === 3"
                      class="rank-img"
                      src="@/assets/img/3rd.svg"
                      alt=""
                    />
                    <span v-show="item[2].volRank > 3">
                      {{ item[2].volRank }}
                    </span>
                  </div>
                  <div
                    class="rank-main"
                    v-if="
                      (sortYieldType === 'positive' ||
                        sortYieldType === 'reverse') &&
                      item[2].scoreRank
                    "
                  >
                    <img
                      v-show="item[2].pnlRank === 1"
                      class="rank-img"
                      src="@/assets/img/1st.svg"
                      alt=""
                    />
                    <img
                      v-show="item[2].pnlRank === 2"
                      class="rank-img"
                      src="@/assets/img/2nd.svg"
                      alt=""
                    />
                    <img
                      v-show="item[2].pnlRank === 3"
                      class="rank-img"
                      src="@/assets/img/3rd.svg"
                      alt=""
                    />
                    <span v-show="item[2].pnlRank > 3">
                      {{ item[2].pnlRank }}
                    </span>
                  </div>
                  <span class="rank-main" v-show="!sortYieldType">-</span>
                </div>
                <div v-else class="rank-main">-</div>
              </td>
            </tr>
            <tr v-if="!loading && !dexCompetitionTraders.length">
              <td colspan="6" style="text-align: center; font-size: 14px">
                No data
              </td>
            </tr>
          </tbody>
        </table>
        <div class="transactions-pagination-bottom">
          <a-pagination
            v-if="dexCompetitionTraders.length > page.size"
            class="transactions-pagination"
            v-model="page.currentPage"
            :total="dexCompetitionTraders.length"
            :defaultPageSize="page.size"
            :showQuickJumper="true"
            @change="pageChange"
          />
        </div>
      </a-spin>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { ICSwapRouterService } from '@/ic/ICSwapRouter/ICSwapRouterService';
import {
  AccountId,
  DexCompetitionResponse,
  TraderDataResponse
} from '@/ic/ICSwapRouter/model';
import { toHexString } from '@/ic/converter';
import { TokenInfo } from '@/ic/common/icType';
import { getTokenInfo } from '@/ic/getTokenInfo';
import { Principal } from '@dfinity/principal';
import BigNumber from 'bignumber.js';
import { CompetitionSort } from '@/views/Competitions/model';

@Component({
  name: 'combinedComp',
  components: {}
})
export default class extends Vue {
  private ICSwapRouterService: ICSwapRouterService = null;
  private round: bigint = null;
  private latestRound: bigint = null;
  private changeRound = '';
  private dexCompetitionResponse: DexCompetitionResponse = null;
  private dexCompetitionTraders: Array<
    [AccountId, Array<TraderDataResponse>, CompetitionSort?]
  > = [];
  private page = {
    currentPage: 1,
    size: 100,
    total: 0
  };
  private sortYieldType:
    | 'positive'
    | 'reverse'
    | 'volUp'
    | 'volDown'
    | 'high'
    | 'low' = null;
  private tokens: { [key: string]: TokenInfo };
  private loading = false;
  private updateTime = null;
  private roundOpen = false;
  private canSort = false;
  created(): void {
    this.sortYieldType = 'low';
    this.tokens = JSON.parse(localStorage.getItem('tokens')) || {};
    this.ICSwapRouterService = new ICSwapRouterService();
    if (this.$route.params.round) {
      this.round = BigInt(this.$route.params.round);
      this.getDexCompetitionRound().then((round: bigint) => {
        this.latestRound = round;
      });
      this.getRoundInfo();
    } else {
      this.getDexCompetitionRound().then((round: bigint) => {
        this.latestRound = this.round = round;
        this.getRoundInfo();
      });
    }
  }
  private onSortYield(type: string): void {
    this.page.currentPage = 1;
    if (type === 'yield') {
      if (this.sortYieldType) {
        if (this.sortYieldType === 'positive') {
          this.sortYieldType = 'reverse';
        } else {
          this.sortYieldType = 'positive';
        }
      } else {
        this.sortYieldType = 'positive';
      }
    }
    if (type === 'vol') {
      if (this.sortYieldType) {
        if (this.sortYieldType === 'volUp') {
          this.sortYieldType = 'volDown';
        } else {
          this.sortYieldType = 'volUp';
        }
      } else {
        this.sortYieldType = 'volUp';
      }
    }
    if (type === 'score') {
      if (this.sortYieldType) {
        if (this.sortYieldType === 'low') {
          this.sortYieldType = 'high';
        } else {
          this.sortYieldType = 'low';
        }
      } else {
        this.sortYieldType = 'low';
      }
    }
    this.sort();
  }
  private sort(): void {
    if (this.sortYieldType === 'reverse') {
      this.dexCompetitionTraders = this.dexCompetitionTraders.sort(
        (
          a: [AccountId, Array<TraderDataResponse>, CompetitionSort?],
          b: [AccountId, Array<TraderDataResponse>, CompetitionSort?]
        ) => {
          if (b[2].pnl === '-') {
            return -1;
          }
          if (a[2].pnl === '-') {
            return 1;
          }
          if (
            new BigNumber(b[2].pnlRank.toString(10)).gt(
              a[2].pnlRank.toString(10)
            )
          ) {
            return 1;
          } else {
            return -1;
          }
        }
      );
    }
    if (this.sortYieldType === 'positive') {
      this.dexCompetitionTraders = this.dexCompetitionTraders.sort(
        (
          a: [AccountId, Array<TraderDataResponse>, CompetitionSort?],
          b: [AccountId, Array<TraderDataResponse>, CompetitionSort?]
        ) => {
          if (b[2].pnl === '-') {
            return -1;
          }
          if (a[2].pnl === '-') {
            return 1;
          }
          if (
            new BigNumber(b[2].pnlRank.toString(10)).gt(
              a[2].pnlRank.toString(10)
            )
          ) {
            return -1;
          } else {
            return 1;
          }
        }
      );
    }
    if (this.sortYieldType === 'volDown') {
      this.dexCompetitionTraders = this.dexCompetitionTraders.sort(
        (
          a: [AccountId, Array<TraderDataResponse>, CompetitionSort?],
          b: [AccountId, Array<TraderDataResponse>, CompetitionSort?]
        ) => {
          if (b[2].vol === '-') {
            return -1;
          }
          if (a[2].vol === '-') {
            return 1;
          }
          if (
            new BigNumber(b[2].volRank.toString(10)).gt(
              a[2].volRank.toString(10)
            )
          ) {
            return 1;
          } else {
            return -1;
          }
        }
      );
    }
    if (this.sortYieldType === 'volUp') {
      this.dexCompetitionTraders = this.dexCompetitionTraders.sort(
        (
          a: [AccountId, Array<TraderDataResponse>, CompetitionSort?],
          b: [AccountId, Array<TraderDataResponse>, CompetitionSort?]
        ) => {
          if (b[2].vol === '-') {
            return -1;
          }
          if (a[2].vol === '-') {
            return 1;
          }
          if (
            new BigNumber(b[2].volRank.toString(10)).gt(
              a[2].volRank.toString(10)
            )
          ) {
            return -1;
          } else {
            return 1;
          }
        }
      );
    }
    if (this.sortYieldType === 'low') {
      this.dexCompetitionTraders = this.dexCompetitionTraders.sort(
        (
          a: [AccountId, Array<TraderDataResponse>, CompetitionSort?],
          b: [AccountId, Array<TraderDataResponse>, CompetitionSort?]
        ) => {
          if (b[2].score === null) {
            return -1;
          }
          if (a[2].score === null) {
            return 1;
          }
          if (
            new BigNumber(b[2].score.toString(10)).gt(a[2].score.toString(10))
          ) {
            return 1;
          } else {
            return -1;
          }
        }
      );
    }
    if (this.sortYieldType === 'high') {
      this.dexCompetitionTraders = this.dexCompetitionTraders.sort(
        (
          a: [AccountId, Array<TraderDataResponse>, CompetitionSort?],
          b: [AccountId, Array<TraderDataResponse>, CompetitionSort?]
        ) => {
          if (b[2].score === null) {
            return -1;
          }
          if (a[2].score === null) {
            return 1;
          }
          if (
            new BigNumber(b[2].score.toString(10)).gt(a[2].score.toString(10))
          ) {
            return -1;
          } else {
            return 1;
          }
        }
      );
    }
  }
  private changeLatest(): void {
    this.sortYieldType = 'low';
    this.round = BigInt(this.latestRound);
    this.dexCompetitionResponse = null;
    this.dexCompetitionTraders = [];
    this.page = {
      currentPage: 1,
      size: 100,
      total: 0
    };
    this.updateTime = null;
    this.changeRound = '';
    this.$router.replace(`/competitions/combinedComp/${Number(this.round)}`);
    this.getRoundInfo();
  }
  private onChangeRound(): void {
    if (Number(this.changeRound)) {
      this.sortYieldType = 'low';
      if (Number(this.changeRound) > Number(this.latestRound)) {
        this.changeRound = this.latestRound.toString(10);
      }
      this.round = BigInt(this.changeRound);
      this.dexCompetitionResponse = null;
      this.dexCompetitionTraders = [];
      this.page = {
        currentPage: 1,
        size: 100,
        total: 0
      };
      this.changeRound = '';
      this.updateTime = null;
      this.$router.replace(`/competitions/combinedComp/${Number(this.round)}`);
      this.getRoundInfo();
    }
  }
  private async getDexCompetitionRound(): Promise<bigint> {
    return await this.ICSwapRouterService.getDexCompetitionRound();
  }
  private getRoundInfo(): void {
    this.getDexCompetition();
  }
  private async getDexCompetition(): Promise<void> {
    this.loading = true;
    const res = await this.ICSwapRouterService.getDexCompetition(this.round);
    console.log(res);
    if (res && res.length) {
      this.dexCompetitionResponse = res[0];
      const now = new Date().getTime();
      this.roundOpen =
        new BigNumber(now)
          .times(1000000)
          .lt(this.dexCompetitionResponse.end.toString(10)) &&
        new BigNumber(now)
          .times(1000000)
          .gt(this.dexCompetitionResponse.start.toString(10));
      for (const pair of this.dexCompetitionResponse.pairs) {
        const token0Info = this.tokens[pair[1].token0[0].toString()];
        const token1Info = this.tokens[pair[1].token1[0].toString()];
        if (
          !token0Info ||
          (token0Info && (!token0Info.decimals || token0Info.decimals === 0))
        ) {
          await getTokenInfo(
            Principal.fromText(pair[1].token0[0].toString())
          ).then((res) => {
            this.$set(this.tokens, pair[1].token0[0].toString(), res);
          });
        }
        if (
          !token1Info ||
          (token1Info && (!token1Info.decimals || token1Info.decimals === 0))
        ) {
          await getTokenInfo(
            Principal.fromText(pair[1].token1[0].toString())
          ).then((res) => {
            this.$set(this.tokens, pair[1].token1[0].toString(), res);
          });
        }
      }
    }
    await this.getAllDexCompetitionTraders();
    this.loading = false;
  }
  private async getAllDexCompetitionTraders(): Promise<void> {
    await this.getDexCompetitionTraders(1, 1000);
    console.log(this.dexCompetitionTraders);
  }
  private async getDexCompetitionTraders(
    page: number,
    size: number
  ): Promise<void> {
    const res = await this.ICSwapRouterService.getDexCompetitionTraders(
      this.round,
      [page],
      [size]
    );
    console.log(res);
    if (!this.dexCompetitionTraders) {
      this.dexCompetitionTraders = [];
    }
    if (res) {
      this.dexCompetitionTraders = this.dexCompetitionTraders.concat(res.data);
    }
    if (res && Number(res.totalPage) > page) {
      page++;
      this.getDexCompetitionTraders(page, size);
    }
    if (res && Number(res.totalPage) === page) {
      // todo
      // this.dexCompetitionTraders = this.dexCompetitionTraders.concat(
      //   this.dexCompetitionTraders
      // );
      // this.dexCompetitionTraders = this.dexCompetitionTraders.concat(
      //   this.dexCompetitionTraders
      // );
      // this.dexCompetitionTraders = this.dexCompetitionTraders.concat(
      //   this.dexCompetitionTraders
      // );
      // this.dexCompetitionTraders = this.dexCompetitionTraders.concat(
      //   this.dexCompetitionTraders
      // );
      // this.dexCompetitionTraders = this.dexCompetitionTraders.concat(
      //   this.dexCompetitionTraders
      // );
      // this.dexCompetitionTraders = this.dexCompetitionTraders.concat(
      //   this.dexCompetitionTraders
      // );
      // this.dexCompetitionTraders = this.dexCompetitionTraders.concat(
      //   this.dexCompetitionTraders
      // );
      // this.dexCompetitionTraders = this.dexCompetitionTraders.concat(
      //   this.dexCompetitionTraders
      // );
      // this.dexCompetitionTraders = this.dexCompetitionTraders.concat(
      //   this.dexCompetitionTraders
      // );
      this.initSort();
    }
  }
  private initSort(): void {
    let updateTime = 0;
    this.dexCompetitionTraders.forEach(
      (item: [AccountId, Array<TraderDataResponse>, CompetitionSort?]) => {
        if (item[1][0].total && item[1][0].total.length) {
          if (!this.canSort) {
            this.canSort = true;
          }
          if (
            new BigNumber(item[1][0].total[0][0].time.toString(10)).gt(
              updateTime
            )
          ) {
            updateTime = Number(item[1][0].total[0][0].time.toString());
          }
        }
        const vol = this.getVol(item[1]);
        const pnl = this.getPNL(item[1]);
        item[2] = { vol: vol, pnl: pnl };
      }
    );
    this.updateTime = updateTime;
    this.dexCompetitionTraders = this.dexCompetitionTraders.sort(
      (
        a: [AccountId, Array<TraderDataResponse>, CompetitionSort?],
        b: [AccountId, Array<TraderDataResponse>, CompetitionSort?]
      ) => {
        if (b[2].vol === '-') {
          return -1;
        }
        if (a[2].vol === '-') {
          return 1;
        }
        if (new BigNumber(b[2].vol).gt(a[2].vol)) {
          return 1;
        } else {
          return -1;
        }
      }
    );
    let preVol: string = null;
    let volRank = 1;
    let volSame = 0;
    this.dexCompetitionTraders.forEach(
      (item: [AccountId, Array<TraderDataResponse>, CompetitionSort?]) => {
        let currentVol = item[2].vol;
        if (preVol === null) {
          preVol = currentVol;
          item[2].volRank = volRank;
        } else if (Number(preVol) === Number(currentVol)) {
          preVol = currentVol;
          item[2].volRank = volRank;
          volSame++;
        } else {
          volRank = volRank + volSame;
          volRank++;
          volSame = 0;
          preVol = currentVol;
          item[2].volRank = volRank;
        }
      }
    );
    this.dexCompetitionTraders = this.dexCompetitionTraders.sort(
      (
        a: [AccountId, Array<TraderDataResponse>, CompetitionSort?],
        b: [AccountId, Array<TraderDataResponse>, CompetitionSort?]
      ) => {
        if (b[2].pnl === '-') {
          return -1;
        }
        if (a[2].pnl === '-') {
          return 1;
        }
        if (new BigNumber(b[2].pnl).gt(a[2].pnl)) {
          return 1;
        } else {
          return -1;
        }
      }
    );
    let prePnl: string = null;
    let pnlRank = 1;
    let pnlSame = 0;
    this.dexCompetitionTraders.forEach(
      (item: [AccountId, Array<TraderDataResponse>, CompetitionSort?]) => {
        let currentPnl = item[2].pnl;
        if (prePnl === null) {
          prePnl = currentPnl;
          item[2].pnlRank = pnlRank;
        } else if (Number(prePnl) === Number(currentPnl)) {
          prePnl = currentPnl;
          item[2].pnlRank = pnlRank;
          pnlSame++;
        } else {
          pnlRank = pnlRank + pnlSame;
          pnlRank++;
          pnlSame = 0;
          prePnl = currentPnl;
          item[2].pnlRank = pnlRank;
        }
        item[2].score = this.setScore(item[2]);
      }
    );
    this.dexCompetitionTraders = this.dexCompetitionTraders.sort(
      (
        a: [AccountId, Array<TraderDataResponse>, CompetitionSort?],
        b: [AccountId, Array<TraderDataResponse>, CompetitionSort?]
      ) => {
        if (b[2].score === null) {
          return -1;
        }
        if (a[2].score === null) {
          return 1;
        }
        if (new BigNumber(b[2].score).gt(a[2].score)) {
          return 1;
        } else {
          return -1;
        }
      }
    );
    let preScore: number = null;
    let scoreRank = 1;
    let scoreSame = 0;
    this.dexCompetitionTraders.forEach(
      (item: [AccountId, Array<TraderDataResponse>, CompetitionSort?]) => {
        let currentScore = item[2].score;
        if (preScore === null) {
          preScore = currentScore;
          item[2].scoreRank = scoreRank;
        } else if (preScore === currentScore) {
          preScore = currentScore;
          item[2].scoreRank = scoreRank;
          scoreSame++;
        } else {
          scoreRank = scoreRank + scoreSame;
          scoreRank++;
          scoreSame = 0;
          preScore = currentScore;
          item[2].scoreRank = scoreRank;
        }
      }
    );
  }
  private setScore(val: CompetitionSort): number {
    if (val.vol === '-' || val.pnl === '-') {
      return null;
    }
    let score = 0;
    let volScore = 1001 - val.volRank;
    if (volScore < 0) {
      volScore = 0;
    }
    let pnlScore = 1001 - val.pnlRank;
    if (pnlScore < 0) {
      pnlScore = 0;
    }
    score = new BigNumber(volScore).times(0.2).plus(pnlScore).toNumber();
    return score;
  }
  private getAvgPrice(
    avgPrice: string,
    token0Decimals: number,
    token1Decimals: number
  ): string {
    return new BigNumber(avgPrice)
      .times(10 ** token0Decimals)
      .div(10 ** token1Decimals)
      .decimalPlaces(token1Decimals)
      .toString(10);
  }
  private getVol(val: Array<TraderDataResponse>): string {
    let vol = '0';
    val.forEach((item) => {
      if (item.total.length) {
        let decimals;
        const quoteToken = Object.keys(item.quoteToken)[0];
        const token0 = item.pair.token0[0].toString();
        const token1 = item.pair.token1[0].toString();
        if (quoteToken === 'token1') {
          decimals = this.tokens[token1].decimals;
        }
        if (quoteToken === 'token0') {
          decimals = this.tokens[token0].decimals;
        }
        vol = new BigNumber(item.total[0][0].vol.toString(10))
          .div(10 ** decimals)
          .plus(vol)
          .decimalPlaces(decimals)
          .toString(10);
      } else {
        vol = '-';
      }
    });
    return vol;
  }
  private getPNL(val: Array<TraderDataResponse>): string {
    let PNL = '0';
    val.forEach((item) => {
      if (item.total.length) {
        let decimals;
        const quoteToken = Object.keys(item.quoteToken)[0];
        const token0 = item.pair.token0[0].toString();
        const token1 = item.pair.token1[0].toString();
        if (quoteToken === 'token1') {
          decimals = this.tokens[token1].decimals;
        }
        if (quoteToken === 'token0') {
          decimals = this.tokens[token0].decimals;
        }
        PNL = new BigNumber(item.total[0][0].pnl)
          .div(10 ** decimals)
          .plus(PNL)
          .decimalPlaces(decimals)
          .toString(10);
      } else {
        PNL = '-';
      }
    });
    return PNL;
  }
  private onCopy(): void {
    this.$message.success('Copied');
  }
  private arrayToHexString = (val: Array<number>): string => {
    return toHexString(new Uint8Array(val));
  };
  private pageChange(page: number): void {
    this.page.currentPage = page;
  }
}
</script>

<style scoped lang="scss">
.competitions-round-header {
  margin: 50px 0;
  font-size: 16px;
  .competitions-round-header-top {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .competitions-round-header-info {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 10px;
    font-size: 14px;
  }
  .competitions-round-header-title {
    font-size: 22px;
    padding-right: 10px;
  }
}
.switch-round {
  display: flex;
  align-items: center;
  input {
    width: 70px;
    margin: 0 10px;
  }
  button {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 10px;
    background: #1a2a33;
    color: #b4bacd;
    border-radius: 5px;
    border: none;
    padding: 6px 12px;
    font-size: 12px;
    transition: all 0.3s;
    height: 32px;
    &.primary {
      background: #3aa8b5;
      border-color: #3aa8b5;
      color: #ffffff;
    }
  }
}
.competitions-round-main {
  display: flex;
  background: #fff;
  box-shadow: 0 1px 10px 0 rgba(0, 71, 121, 0.05);
  border-radius: 4px;
  border: 1px solid #eef6fb;
  padding: 20px;
}
.competitions-round-main-title {
  margin-top: 20px;
  margin-bottom: 10px;
  font-size: 18px;
  &.competitions-round-main-title-rank {
    display: flex;
    span {
      margin-left: auto;
      font-size: 14px;
    }
  }
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
      li {
        line-height: 1.5;
        a {
          opacity: 0.6;
        }
      }
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
.sort-table-main {
  display: flex;
  align-items: center;
}
.sort-table {
  display: flex;
  flex-direction: column;
  margin-left: 5px;
  margin-top: -5px;
  i {
    font-size: 12px;
    height: 8px;
    color: #adb3c4;
    &.active {
      color: #0862bc;
    }
  }
}
.keep-all {
  word-break: keep-all;
}
.break-word {
  word-break: break-word;
}
.rank-table {
  display: flex;
  align-items: center;
  justify-content: center;
}
.rank-main {
  display: flex;
  align-items: center;
  justify-content: center;
}
.rank-img {
  width: 30px;
}
.transactions-pagination-bottom {
  display: flex;
  .transactions-pagination {
    margin: 15px 0 15px auto;
  }
}
</style>
