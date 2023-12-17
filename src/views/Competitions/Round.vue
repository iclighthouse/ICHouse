<template>
  <div>
    <div class="competitions-round-header">
      <a-icon
        @click="jump"
        class="competitions-round-header-back"
        type="arrow-left"
      />
      <span
        v-if="
          pairInfo &&
          tokens &&
          tokens[pairInfo.token0[0].toString()] &&
          tokens[pairInfo.token1[0].toString()]
        "
        style="margin-right: 10px"
      >
      >
        <a
          :href="`http://ICDex.io/${
            tokens[pairInfo.token0[0].toString()].symbol
          }/${tokens[pairInfo.token1[0].toString()].symbol}`"
          target="_blank"
        >
          {{ tokens[pairInfo.token0[0].toString()].symbol }}/{{
            tokens[pairInfo.token1[0].toString()].symbol
          }}
        </a>
      </span>
      <span style="font-size: 20px">Current Round: {{ currentRound }}</span>
      <div class="switch-round" v-if="currentRoundInfo">
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
          @click="onChangeRoundLatest()"
          type="button"
          class="primary change-current-round"
          v-show="newRound !== Number(currentRound)"
        >
          Latest Round
        </button>
      </div>
    </div>
    <div class="competitions-round-main-title">Competition Information</div>
    <div class="competitions-round-main" v-if="compRoundInfo && currentRound">
      <div>
        <div class="competitions-round-item" v-if="compRoundInfo[currentRound]">
          <span>Name</span>
          <span>{{ compRoundInfo[currentRound].name }}</span>
        </div>
        <div class="competitions-round-item">
          <span>Round</span>
          <span>{{ currentRound }}</span>
        </div>
        <div class="competitions-round-item" v-if="compRoundInfo[currentRound]">
          <span>Start</span>
          <span>
            {{ compRoundInfo[currentRound].start | formatDateFromNanosecond }}
          </span>
        </div>
        <div class="competitions-round-item" v-if="compRoundInfo[currentRound]">
          <span>End</span>
          <span>
            {{ compRoundInfo[currentRound].end | formatDateFromNanosecond }}
          </span>
        </div>
        <div class="competitions-round-item" v-if="compRoundInfo[currentRound]">
          <span>Min Capital</span>
          <span>
            <span
              v-if="
                Object.keys(compRoundInfo[currentRound].quoteToken)[0] ===
                  'token1' &&
                tokens &&
                tokens[pairInfo.token1[0].toString()] &&
                tokens[pairInfo.token1[0].toString()].decimals
              "
            >
              {{
                compRoundInfo[currentRound].minCapital |
                  bigintToFloat(
                    tokens[pairInfo.token1[0].toString()].decimals,
                    tokens[pairInfo.token1[0].toString()].decimals
                  )
              }}
              {{ tokens[pairInfo.token1[0].toString()].symbol }}
            </span>
            <span
              v-if="
                Object.keys(compRoundInfo[currentRound].quoteToken)[0] ===
                  'token0' &&
                tokens &&
                tokens[pairInfo.token0[0].toString()] &&
                tokens[pairInfo.token0[0].toString()].decimals
              "
            >
              {{
                compRoundInfo[currentRound].minCapital |
                  bigintToFloat(
                    tokens[pairInfo.token0[0].toString()].decimals,
                    tokens[pairInfo.token0[0].toString()].decimals
                  )
              }}
              {{ tokens[pairInfo.token0[0].toString()].symbol }}
            </span>
          </span>
        </div>
      </div>
      <div>
        <div
          class="competitions-round-item"
          v-if="pairInfo && compRoundInfo[currentRound]"
        >
          <span>Quote Token</span>
          <span
            v-if="
              Object.keys(compRoundInfo[currentRound].quoteToken)[0] ===
                'token1' &&
              tokens &&
              tokens[pairInfo.token1[0].toString()]
            "
          >
            {{ tokens[pairInfo.token1[0].toString()].symbol }}
          </span>
          <span
            v-if="
              Object.keys(compRoundInfo[currentRound].quoteToken)[0] ===
                'token0' &&
              tokens &&
              tokens[pairInfo.token0[0].toString()]
            "
          >
            {{ tokens[pairInfo.token0[0].toString()].symbol }}
          </span>
        </div>
        <div class="competitions-round-item" v-if="compRoundInfo[currentRound]">
          <span>Closed Price</span>
          <span v-if="compRoundInfo[currentRound].closedPrice.length">
            {{ compRoundInfo[currentRound].closedPrice[0] }}
          </span>
          <span v-else>-</span>
        </div>
        <div class="competitions-round-item" v-if="compRoundInfo[currentRound]">
          <span>Status</span>
          <span
            class="pending-competitions"
            v-show="pendingCompetitions(compRoundInfo[currentRound])"
          >
            {{ roundStatus }}
            <a-icon type="clock-circle" />
          </span>
          <span
            class="open-competitions"
            v-show="openCompetitions(compRoundInfo[currentRound])"
          >
            {{ roundStatus }}
            <a-icon type="check-circle" />
          </span>
          <span
            class="close-competitions"
            v-show="closeCompetitions(compRoundInfo[currentRound])"
          >
            {{ roundStatus }}
            <a-icon type="lock" />
          </span>
        </div>
        <div class="competitions-round-item" v-if="compRoundInfo[currentRound]">
          <span>Settled</span>
          <span>
            {{ compRoundInfo[currentRound].isSettled }}
          </span>
        </div>
      </div>
    </div>
    <div class="competitions-round-main-title" style="margin-top: 20px">
      Competition Description
    </div>
    <div
      v-if="compRoundInfo && currentRound && compRoundInfo[currentRound]"
      class="competitions-round-main"
    >
      <span v-show="compRoundInfo[currentRound].content">
        {{ compRoundInfo[currentRound].content }}
      </span>
      <span v-show="!compRoundInfo[currentRound].content">-</span>
    </div>
    <div
      class="competitions-round-main-title competitions-round-main-title-rank"
      style="margin-top: 20px"
    >
      Ranking
      <span v-show="roundStatus === 'Opening' && updateTime">
        <a-icon type="clock-circle" /> Updated
        {{ updateTime | formatDateFromNanosecond }}
      </span>
    </div>
    <div>
      <a-spin :spinning="loading">
        <table>
          <thead>
            <tr>
              <th>Num</th>
              <th>AccountId</th>
              <th>Status</th>
              <th class="pointer" @click="onSortYield('vol')">
                <span class="sort-table-main">
                  <span>Vol</span>
                  <span v-show="updateTime" class="sort-table">
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
              <th>Basic Capital</th>
              <th>Current Equity</th>
              <th class="pointer" @click="onSortYield('yield')">
                <span class="sort-table-main">
                  <span>Yield</span>
                  <span v-show="updateTime" class="sort-table">
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
                        1. Score = YieldScore + VolScore*20%.
                      </div>
                      <div class="break-word">
                        2. YieldScore: Score based on yield ranking (The 1st
                        place score is 1000, the 2nd place 999, and so on, with
                        the final score being 0, with no negative numbers).
                      </div>
                      <div class="break-word">
                        3. VolScore: Score based on volume ranking (The 1st
                        place score is 1000, the 2nd place 999, and so on, with
                        the final score being 0, with no negative numbers).
                      </div>
                    </template>
                    <a-icon type="question-circle" />
                  </a-tooltip>
                  <span v-show="updateTime" class="sort-table">
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
                  <a-tooltip>
                    <template slot="title">Waiting for update</template>
                    <span v-show="!updateTime" class="loading-spinner"></span>
                  </a-tooltip>
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, index) in compRoundResults.slice(
                (resultPage.page - 1) * resultPage.size,
                resultPage.page * resultPage.size
              )"
              :key="index"
            >
              <td>{{ (resultPage.page - 1) * resultPage.size + index + 1 }}</td>
              <td>
                <span>{{ arrayToHexString(item[0]) | ellipsis }}</span>
                <span class="span-nbsp"></span
                ><a-icon
                  class="pointer"
                  type="copy"
                  v-clipboard:copy="arrayToHexString(item[0])"
                  v-clipboard:success="onCopy"
                />
              </td>
              <td>
                {{ Object.keys(item[1].status)[0] }}
              </td>
              <td>
                <div
                  v-if="
                    pairInfo &&
                    item[1].vol &&
                    tokens &&
                    tokens[pairInfo.token0[0].toString()] &&
                    tokens[pairInfo.token0[0].toString()].decimals &&
                    tokens[pairInfo.token1[0].toString()] &&
                    tokens[pairInfo.token1[0].toString()].decimals
                  "
                >
                  <span
                    v-if="
                      compRoundInfo[currentRound] &&
                      Object.keys(compRoundInfo[currentRound].quoteToken)[0] ===
                        'token1'
                    "
                  >
                    {{
                      item[1].vol.value1 |
                        bigintToFloat(
                          tokens[pairInfo.token1[0].toString()].decimals,
                          tokens[pairInfo.token1[0].toString()].decimals
                        )
                    }}
                    {{ tokens[pairInfo.token1[0].toString()].symbol }}
                  </span>
                  <span
                    v-if="
                      compRoundInfo[currentRound] &&
                      Object.keys(compRoundInfo[currentRound].quoteToken)[0] ===
                        'token0'
                    "
                  >
                    {{
                      item[1].vol.value0 |
                        bigintToFloat(
                          tokens[pairInfo.token0[0].toString()].decimals,
                          tokens[pairInfo.token0[0].toString()].decimals
                        )
                    }}
                    {{ tokens[pairInfo.token0[0].toString()].symbol }}
                  </span>
                </div>
              </td>
              <td>
                <span
                  class="flex-column"
                  v-if="
                    pairInfo &&
                    item[1].capital &&
                    compRoundInfo &&
                    compRoundInfo[currentRound] &&
                    tokens &&
                    tokens[
                      pairInfo[
                        Object.keys(compRoundInfo[currentRound].quoteToken)[0]
                      ][0].toString()
                    ] &&
                    tokens[
                      pairInfo[
                        Object.keys(compRoundInfo[currentRound].quoteToken)[0]
                      ][0].toString()
                    ].decimals
                  "
                >
                  <span class="light-span">
                    {{
                      item[1].capital.value0 |
                        bigintToFloat(
                          tokens[pairInfo.token0[0].toString()].decimals,
                          tokens[pairInfo.token0[0].toString()].decimals
                        )
                    }}
                    {{ tokens[pairInfo.token0[0].toString()].symbol }}
                    +
                    {{
                      item[1].capital.value1 |
                        bigintToFloat(
                          tokens[pairInfo.token1[0].toString()].decimals,
                          tokens[pairInfo.token1[0].toString()].decimals
                        )
                    }}
                    {{ tokens[pairInfo.token1[0].toString()].symbol }}
                  </span>
                  <span>
                    Total:
                    {{
                      item[1].capital.total |
                        bigintToFloat(
                          tokens[
                            pairInfo[
                              Object.keys(
                                compRoundInfo[currentRound].quoteToken
                              )[0]
                            ][0].toString()
                          ].decimals,
                          tokens[
                            pairInfo[
                              Object.keys(
                                compRoundInfo[currentRound].quoteToken
                              )[0]
                            ][0].toString()
                          ].decimals
                        )
                    }}
                    {{
                      tokens[
                        pairInfo[
                          Object.keys(compRoundInfo[currentRound].quoteToken)[0]
                        ][0].toString()
                      ].symbol
                    }}
                  </span>
                </span>
              </td>
              <td>
                <div
                  v-if="
                    pairInfo &&
                    tokens &&
                    compRoundInfo &&
                    compRoundInfo[currentRound] &&
                    tokens[
                      pairInfo[
                        Object.keys(compRoundInfo[currentRound].quoteToken)[0]
                      ][0].toString()
                    ] &&
                    tokens[
                      pairInfo[
                        Object.keys(compRoundInfo[currentRound].quoteToken)[0]
                      ][0].toString()
                    ].decimals
                  "
                >
                  <span
                    class="flex-column"
                    v-if="item[1].assetValue[0] && roundStatus === 'Closed'"
                  >
                    <span class="light-span">
                      {{
                        item[1].assetValue[0].value0 |
                          bigintToFloat(
                            tokens[pairInfo.token0[0].toString()].decimals,
                            tokens[pairInfo.token0[0].toString()].decimals
                          )
                      }}
                      {{ tokens[pairInfo.token0[0].toString()].symbol }}
                      +
                      {{
                        item[1].assetValue[0].value1 |
                          bigintToFloat(
                            tokens[pairInfo.token1[0].toString()].decimals,
                            tokens[pairInfo.token1[0].toString()].decimals
                          )
                      }}
                      {{ tokens[pairInfo.token1[0].toString()].symbol }}
                    </span>
                    <span>
                      Total:
                      {{
                        item[1].assetValue[0].total |
                          bigintToFloat(
                            tokens[
                              pairInfo[
                                Object.keys(
                                  compRoundInfo[currentRound].quoteToken
                                )[0]
                              ][0].toString()
                            ].decimals,
                            tokens[
                              pairInfo[
                                Object.keys(
                                  compRoundInfo[currentRound].quoteToken
                                )[0]
                              ][0].toString()
                            ].decimals
                          )
                      }}
                      {{
                        tokens[
                          pairInfo[
                            Object.keys(
                              compRoundInfo[currentRound].quoteToken
                            )[0]
                          ][0].toString()
                        ].symbol
                      }}
                    </span>
                  </span>
                  <span
                    class="flex-column"
                    v-if="
                      roundStatus === 'Opening' &&
                      equity[arrayToHexString(item[0])]
                    "
                  >
                    <span class="light-span">
                      {{
                        equity[arrayToHexString(item[0])].value0 |
                          bigintToFloat(
                            tokens[pairInfo.token0[0].toString()].decimals,
                            tokens[pairInfo.token0[0].toString()].decimals
                          )
                      }}
                      {{ tokens[pairInfo.token0[0].toString()].symbol }}
                      +
                      {{
                        equity[arrayToHexString(item[0])].value1 |
                          bigintToFloat(
                            tokens[pairInfo.token1[0].toString()].decimals,
                            tokens[pairInfo.token1[0].toString()].decimals
                          )
                      }}
                      {{ tokens[pairInfo.token1[0].toString()].symbol }}
                    </span>
                    <span
                      >Total:
                      {{
                        equity[arrayToHexString(item[0])].total |
                          bigintToFloat(
                            tokens[
                              pairInfo[
                                Object.keys(
                                  compRoundInfo[currentRound].quoteToken
                                )[0]
                              ][0].toString()
                            ].decimals,
                            tokens[
                              pairInfo[
                                Object.keys(
                                  compRoundInfo[currentRound].quoteToken
                                )[0]
                              ][0].toString()
                            ].decimals
                          )
                      }}
                      {{
                        tokens[
                          pairInfo[
                            Object.keys(
                              compRoundInfo[currentRound].quoteToken
                            )[0]
                          ][0].toString()
                        ].symbol
                      }}</span
                    >
                  </span>
                  <span
                    v-if="
                      roundStatus !== 'Closed' &&
                      !equity[arrayToHexString(item[0])]
                    "
                    >-</span
                  >
                </div>
              </td>
              <td>
                <span v-if="item[1].assetValue[0] && roundStatus === 'Closed'">
                  <span
                    v-if="
                      moreCapital(
                        compRoundInfo[currentRound].minCapital,
                        item[1].capital.total
                      )
                    "
                  >
                    {{
                      getYield(item[1].capital, item[1].assetValue[0]) === null
                        ? 0
                        : getYield(item[1].capital, item[1].assetValue[0])
                    }}%
                  </span>
                  <span v-else>-</span>
                </span>
                <span
                  v-if="
                    roundStatus === 'Opening' &&
                    equity[arrayToHexString(item[0])]
                  "
                >
                  <span
                    v-if="
                      moreCapital(
                        compRoundInfo[currentRound].minCapital,
                        item[1].capital.total
                      )
                    "
                  >
                    {{
                      getYield(
                        item[1].capital,
                        equity[arrayToHexString(item[0])]
                      ) === null
                        ? 0
                        : getYield(
                            item[1].capital,
                            equity[arrayToHexString(item[0])]
                          )
                    }}%
                  </span>
                  <span v-else>-</span>
                </span>
                <span
                  v-if="
                    roundStatus !== 'Closed' &&
                    !equity[arrayToHexString(item[0])]
                  "
                  >-</span
                >
              </td>
              <td>
                <span v-if="item[1].score !== null">{{ item[1].score }}</span>
                <span v-else>-</span>
              </td>
              <td>
                <div
                  class="rank-main"
                  v-if="
                    (sortYieldType === 'high' || sortYieldType === 'low') &&
                    item[1].scoreRank
                  "
                >
                  <div
                    v-if="
                      moreCapital(
                        compRoundInfo[currentRound].minCapital,
                        item[1].capital.total
                      )
                    "
                  >
                    <img
                      v-show="item[1].scoreRank === 1"
                      class="rank-img"
                      src="@/assets/img/1st.svg"
                      alt=""
                    />
                    <img
                      v-show="item[1].scoreRank === 2"
                      class="rank-img"
                      src="@/assets/img/2nd.svg"
                      alt=""
                    />
                    <img
                      v-show="item[1].scoreRank === 3"
                      class="rank-img"
                      src="@/assets/img/3rd.svg"
                      alt=""
                    />
                    <span v-show="item[1].scoreRank > 3">
                      {{ item[1].scoreRank }}
                    </span>
                  </div>
                  <span v-else>-</span>
                </div>
                <div
                  class="rank-main"
                  v-if="
                    (sortYieldType === 'volUp' ||
                      sortYieldType === 'volDown') &&
                    item[1].scoreRank
                  "
                >
                  <img
                    v-show="item[1].volRank === 1"
                    class="rank-img"
                    src="@/assets/img/1st.svg"
                    alt=""
                  />
                  <img
                    v-show="item[1].volRank === 2"
                    class="rank-img"
                    src="@/assets/img/2nd.svg"
                    alt=""
                  />
                  <img
                    v-show="item[1].volRank === 3"
                    class="rank-img"
                    src="@/assets/img/3rd.svg"
                    alt=""
                  />
                  <span v-show="item[1].volRank > 3">
                    {{ item[1].volRank }}
                  </span>
                </div>
                <div
                  class="rank-main"
                  v-if="
                    (sortYieldType === 'positive' ||
                      sortYieldType === 'reverse') &&
                    item[1].scoreRank
                  "
                >
                  <div
                    v-if="
                      moreCapital(
                        compRoundInfo[currentRound].minCapital,
                        item[1].capital.total
                      )
                    "
                  >
                    <img
                      v-show="item[1].yieldRank === 1"
                      class="rank-img"
                      src="@/assets/img/1st.svg"
                      alt=""
                    />
                    <img
                      v-show="item[1].yieldRank === 2"
                      class="rank-img"
                      src="@/assets/img/2nd.svg"
                      alt=""
                    />
                    <img
                      v-show="item[1].yieldRank === 3"
                      class="rank-img"
                      src="@/assets/img/3rd.svg"
                      alt=""
                    />
                    <span v-show="item[1].yieldRank > 3">
                      {{ item[1].yieldRank }}
                    </span>
                  </div>
                  <span v-else>-</span>
                </div>
                <span class="rank-main" v-show="!sortYieldType">-</span>
              </td>
            </tr>
            <tr v-if="!loading && !compRoundResults.length">
              <td colspan="9" style="text-align: center; font-size: 14px">
                No data
              </td>
            </tr>
          </tbody>
        </table>
        <div class="transactions-pagination-bottom">
          <a-pagination
            v-if="compRoundResults.length > resultPage.size"
            class="transactions-pagination"
            v-model="resultPage.page"
            :total="compRoundResults.length"
            :defaultPageSize="resultPage.size"
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
import {
  Address,
  CompCapital,
  CompResult,
  CompRoundResponse,
  CompRoundResultsData,
  Icrc1Account,
  PairInfo,
  PairTokenInfo,
  RoundInfo
} from '@/ic/ICDex/model';
import { ICDexService } from '@/ic/ICDex/ICDexService';
import BigNumber from 'bignumber.js';
import { principalToAccountIdentifier, toHexString } from '@/ic/converter';
import { TokenInfo } from '@/ic/common/icType';
import { DRC20TokenService } from '@/ic/DRC20Token/DRC20TokenService';
import { getCompetitionsBalance } from '@/ic/getTokenBalance';
import { Principal } from '@dfinity/principal';
import { getTokenInfo } from '@/ic/getTokenInfo';

@Component({
  name: 'Round',
  components: {}
})
export default class extends Vue {
  private currentRoundInfo: CompRoundResponse = null;
  private currentRound = '';
  private newRound: number = null;
  private changeRound: number = null;
  private compRoundInfo: { [key: string]: RoundInfo } = null;
  private compRoundResults: CompRoundResultsData = [];
  private resultPage = {
    page: 1,
    size: 100,
    total: 0
  };
  private loading = false;
  private pairInfo: PairInfo = null;
  private tokens: { [key: string]: TokenInfo };
  private equity: { [key: string]: CompCapital } = {};
  private sortYieldType:
    | 'positive'
    | 'reverse'
    | 'volUp'
    | 'volDown'
    | 'high'
    | 'low' = null;
  private updateTime = null;
  private timer = null;
  get roundStatus(): string {
    if (
      this.currentRound &&
      this.compRoundInfo &&
      this.compRoundInfo[this.currentRound]
    ) {
      console.log(this.currentRound, this.compRoundInfo);
      const round = this.compRoundInfo[this.currentRound];
      const now = new Date().getTime();
      if (new BigNumber(now).times(1000000).lt(round.start.toString(10))) {
        return 'Start';
      }
      if (
        new BigNumber(now).times(1000000).gte(round.start.toString(10)) &&
        new BigNumber(now).times(1000000).lte(round.end.toString(10))
      ) {
        return 'Opening';
      }
      if (new BigNumber(now).times(1000000).gt(round.end.toString(10))) {
        if (round.isSettled) {
          return 'Closed';
        }
        return 'Closing';
      }
    }
    return '';
  }
  created(): void {
    this.tokens = JSON.parse(localStorage.getItem('tokens')) || {};
    this.equity = {};
    if (this.$route.params.id) {
      this.getRound();
      this.getInfo().then(() => {
        if (this.$route.params.round) {
          this.currentRound = this.$route.params.round.trim();
          this.getRoundInfo([BigInt(this.$route.params.round.trim())]);
        } else {
          this.getRoundInfo();
        }
      });
    }
  }
  beforeDestroy(): void {
    window.clearTimeout(this.timer);
    this.timer = null;
  }
  private onSortYield(type: string): void {
    if (!this.updateTime) {
      return;
    }
    this.resultPage.page = 1;
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
      this.compRoundResults = this.compRoundResults.sort(
        (a: [Array<number>, CompResult], b: [Array<number>, CompResult]) => {
          if (
            new BigNumber(b[1].capital.total).lt(
              this.compRoundInfo[this.currentRound].minCapital.toString(10)
            )
          ) {
            return -1;
          }
          if (
            new BigNumber(a[1].capital.total).lt(
              this.compRoundInfo[this.currentRound].minCapital.toString(10)
            )
          ) {
            return 1;
          }
          if (
            new BigNumber(b[1].yieldRank.toString(10)).gt(
              a[1].yieldRank.toString(10)
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
      this.compRoundResults = this.compRoundResults.sort(
        (a: [Array<number>, CompResult], b: [Array<number>, CompResult]) => {
          if (
            new BigNumber(b[1].capital.total).lt(
              this.compRoundInfo[this.currentRound].minCapital.toString(10)
            )
          ) {
            return -1;
          }
          if (
            new BigNumber(a[1].capital.total).lt(
              this.compRoundInfo[this.currentRound].minCapital.toString(10)
            )
          ) {
            return 1;
          }
          if (
            new BigNumber(b[1].yieldRank.toString(10)).gt(
              a[1].yieldRank.toString(10)
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
      this.compRoundResults = this.compRoundResults.sort(
        (a: [Array<number>, CompResult], b: [Array<number>, CompResult]) => {
          if (
            new BigNumber(b[1].volRank.toString(10)).gt(
              a[1].volRank.toString(10)
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
      this.compRoundResults = this.compRoundResults.sort(
        (a: [Array<number>, CompResult], b: [Array<number>, CompResult]) => {
          if (
            new BigNumber(b[1].volRank.toString(10)).gt(
              a[1].volRank.toString(10)
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
      this.compRoundResults = this.compRoundResults.sort(
        (a: [Array<number>, CompResult], b: [Array<number>, CompResult]) => {
          if (b[1].score === null) {
            return -1;
          }
          if (a[1].score === null) {
            return 1;
          }
          if (
            new BigNumber(b[1].score.toString(10)).gt(a[1].score.toString(10))
          ) {
            return 1;
          } else {
            return -1;
          }
        }
      );
    }
    if (this.sortYieldType === 'high') {
      this.compRoundResults = this.compRoundResults.sort(
        (a: [Array<number>, CompResult], b: [Array<number>, CompResult]) => {
          if (b[1].score === null) {
            return -1;
          }
          if (a[1].score === null) {
            return 1;
          }
          if (
            new BigNumber(b[1].score.toString(10)).gt(a[1].score.toString(10))
          ) {
            return -1;
          } else {
            return 1;
          }
        }
      );
    }
  }
  private sortYield(): void {
    const roundStatus = this.roundStatus;
    this.compRoundResults = this.compRoundResults.sort(
      (a: [Array<number>, CompResult], b: [Array<number>, CompResult]) => {
        let yield0;
        let yield1;
        if (roundStatus === 'Closed') {
          yield0 = this.getYield(a[1].capital, a[1].assetValue[0]);
          yield1 = this.getYield(b[1].capital, b[1].assetValue[0]);
        } else {
          const assetValue =
            this.equity[
              this.arrayToHexString(
                JSON.parse(JSON.stringify(Array.from(a[0])))
              )
            ];
          const assetValue1 =
            this.equity[
              this.arrayToHexString(
                JSON.parse(JSON.stringify(Array.from(b[0])))
              )
            ];
          yield0 = this.getYield(a[1].capital, assetValue);
          yield1 = this.getYield(b[1].capital, assetValue1);
        }
        // console.log(yield0, yield1);
        if (yield1 === null) {
          return -1;
        }
        if (yield0 === null) {
          return 1;
        }
        return yield1 - yield0;
      }
    );
    let preYield: number = null;
    let rank = 1;
    let same = 0;
    for (let i = 0; i <= this.compRoundResults.length - 1; i++) {
      const item = this.compRoundResults[i];
      let currentYield = 0;
      if (roundStatus === 'Closed') {
        currentYield =
          this.getYield(item[1].capital, item[1].assetValue[0]) || 0;
      } else {
        const assetValue =
          this.equity[
            this.arrayToHexString(
              JSON.parse(JSON.stringify(Array.from(item[0])))
            )
          ];
        currentYield = this.getYield(item[1].capital, assetValue) || 0;
      }
      // console.log(rank, same, preYield, currentYield);
      if (preYield === null) {
        preYield = currentYield;
        item[1].yieldRank = rank;
      } else if (preYield === currentYield) {
        preYield = currentYield;
        item[1].yieldRank = rank;
        same++;
      } else {
        rank = rank + same;
        rank++;
        same = 0;
        preYield = currentYield;
        item[1].yieldRank = rank;
      }
    }
    this.compRoundResults = this.compRoundResults.sort(
      (a: [Array<number>, CompResult], b: [Array<number>, CompResult]) => {
        if (
          new BigNumber(b[1].vol.value1.toString(10)).gt(
            a[1].vol.value1.toString(10)
          )
        ) {
          return 1;
        } else {
          return -1;
        }
      }
    );
    let preVol: bigint = null;
    let volRank = 1;
    let volSame = 0;
    for (let i = 0; i <= this.compRoundResults.length - 1; i++) {
      const item = this.compRoundResults[i];
      let currentVol = item[1].vol.value1;
      // console.log(volRank);
      if (preVol === null) {
        preVol = currentVol;
        item[1].volRank = volRank;
      } else if (preVol === currentVol) {
        preVol = currentVol;
        item[1].volRank = volRank;
        volSame++;
      } else {
        volRank = volRank + volSame;
        volRank++;
        volSame = 0;
        preVol = currentVol;
        item[1].volRank = volRank;
      }
      item[1].score = this.setScore(item);
    }
    this.compRoundResults = this.compRoundResults.sort(
      (a: [Array<number>, CompResult], b: [Array<number>, CompResult]) => {
        if (b[1].score === null) {
          return -1;
        }
        if (a[1].score === null) {
          return 1;
        }
        if (
          new BigNumber(b[1].score.toString(10)).gt(a[1].score.toString(10))
        ) {
          return 1;
        } else {
          return -1;
        }
      }
    );
    let preScore: number = null;
    let scoreRank = 1;
    let scoreSame = 0;
    this.compRoundResults.forEach((item: [Array<number>, CompResult]) => {
      let currentScore = item[1].score;
      // console.log(scoreRank);
      if (preScore === null) {
        preScore = currentScore;
        item[1].scoreRank = scoreRank;
      } else if (preScore === currentScore) {
        preScore = currentScore;
        item[1].scoreRank = scoreRank;
        scoreSame++;
      } else {
        scoreRank = scoreRank + scoreSame;
        scoreRank++;
        scoreSame = 0;
        preScore = currentScore;
        item[1].scoreRank = scoreRank;
      }
    });
  }
  private setScore(val: [Array<number>, CompResult]): number {
    let initCapital = val[1].capital.total;
    if (
      this.compRoundInfo &&
      this.compRoundInfo[this.currentRound] &&
      this.compRoundInfo[this.currentRound].minCapital
    ) {
      if (
        new BigNumber(initCapital).lt(
          this.compRoundInfo[this.currentRound].minCapital.toString(10)
        )
      ) {
        return null;
      }
    }
    let score = 0;
    let volScore = 1001 - val[1].volRank;
    if (volScore < 0) {
      volScore = 0;
    }
    let yieldScore = 1001 - val[1].yieldRank;
    if (yieldScore < 0) {
      yieldScore = 0;
    }
    score = new BigNumber(volScore).times(0.2).plus(yieldScore).toNumber();
    return score;
  }
  private moreCapital(minCapital: bigint, total: string | number): boolean {
    return new BigNumber(total).gt(minCapital.toString(10));
  }
  private pageChange(page: number): void {
    if (!this.updateTime) {
      return;
    }
    this.resultPage.page = page;
  }
  private async getDecimals(token: PairTokenInfo): Promise<void> {
    const DRC20Token = new DRC20TokenService(token[0].toString());
    const std = Object.keys(token[2])[0];
    if (!this.tokens[token[0].toString()]) {
      this.tokens[token[0].toString()] = { decimals: null };
    }
    if (std && std.toLocaleLowerCase() === 'cycles') {
      this.tokens[token[0].toString()].decimals = 12;
    }
    if (std && std.toLocaleLowerCase() === 'icp') {
      this.tokens[token[0].toString()].decimals = 8;
    }
    if (std && std.toLocaleLowerCase() === 'drc20') {
      this.tokens[token[0].toString()].decimals = await DRC20Token.decimals();
    }
    if (std && std.toLocaleLowerCase() === 'icrc1') {
      this.tokens[token[0].toString()].decimals =
        await DRC20Token.icrcDecimals();
    }
    if (std && std.toLocaleLowerCase() === 'dip20') {
      const info = await DRC20Token.getMetadata();
      this.tokens[token[0].toString()].decimals = info.decimals;
    }
  }
  private async getInfo(): Promise<void> {
    const dexId = this.$route.params.id.trim();
    const currentICDexService = new ICDexService(dexId);
    this.pairInfo = await currentICDexService.info();
    console.log(this.pairInfo);
    const token0Info = this.tokens[this.pairInfo.token0[0].toString()];
    const token1Info = this.tokens[this.pairInfo.token1[0].toString()];
    if (
      !token0Info ||
      (token0Info && (!token0Info.decimals || token0Info.decimals === 0))
    ) {
      this.tokens[this.pairInfo.token0[0].toString()] = await getTokenInfo(
        Principal.fromText(this.pairInfo.token0[0].toString())
      );
    }
    if (
      !token1Info ||
      (token1Info && (!token1Info.decimals || token1Info.decimals === 0))
    ) {
      this.tokens[this.pairInfo.token1[0].toString()] = await getTokenInfo(
        Principal.fromText(this.pairInfo.token1[0].toString())
      );
    }
    this.$forceUpdate();
  }
  private getYield(capital: CompCapital, assetValue: CompCapital): number {
    if ((capital.total || capital.total === 0) && assetValue) {
      let initCapital = capital.total;
      if (
        this.compRoundInfo &&
        this.compRoundInfo[this.currentRound] &&
        this.compRoundInfo[this.currentRound].minCapital
      ) {
        if (
          new BigNumber(initCapital).lt(
            this.compRoundInfo[this.currentRound].minCapital.toString(10)
          )
        ) {
          return null;
          // initCapital =
          //   this.compRoundInfo[this.currentRound].minCapital.toString(10);
        }
      }
      return new BigNumber(assetValue.total)
        .minus(initCapital)
        .div(initCapital)
        .times(100)
        .decimalPlaces(2)
        .toNumber();
    }
    return null;
  }
  private async compResults(
    page: number,
    size: number,
    type?: string
  ): Promise<void> {
    console.log(type);
    if (!type) {
      this.loading = true;
    }
    console.time('res');
    const dexId = this.$route.params.id.trim();
    const currentICDexService = new ICDexService(dexId);
    const res = await currentICDexService.comp_results(
      [BigInt(this.currentRound)],
      page,
      size
    );
    console.log(res);
    if (res) {
      this.resultPage.total = Number(res.total);
      this.compRoundResults = this.compRoundResults.concat(res.data);
      if (page * size < Number(res.total)) {
        this.compResults(++page, size, type);
      } else {
        this.loading = false;
        this.resultPage.total = this.compRoundResults.length;
        this.getCurrentEquity();
        if (type) {
          this.sortYield();
          this.sort();
        }
      }
    }
  }
  private async getCurrentEquity(): Promise<void> {
    if (this.roundStatus !== 'Closed') {
      const MAX_CONCURRENCY = 20;
      let promiseValue = [];
      const currentPrice = await this.stats();
      for (let i = 0; i < this.compRoundResults.length; i++) {
        promiseValue.push(
          this.getEquity(this.compRoundResults[i], currentPrice)
        );
        if (promiseValue.length === MAX_CONCURRENCY) {
          console.log(promiseValue.length, i);
          console.time();
          await Promise.all(promiseValue);
          this.$forceUpdate();
          if (!this.sortYieldType) {
            this.sortYieldType = 'low';
          }
          // this.sortYield();
          // this.sort();
          console.log(i + ' timeEnd');
          console.timeEnd();
          promiseValue = [];
        }
        if (i === this.compRoundResults.length - 1 && promiseValue.length) {
          console.time();
          await Promise.all(promiseValue);
          this.$forceUpdate();
          if (!this.sortYieldType) {
            this.sortYieldType = 'low';
          }
          this.sortYield();
          this.sort();
          console.log(i + ' timeEnd');
          console.timeEnd();
          promiseValue = [];
        }
      }
    }
    console.timeEnd('res');
    console.log(this.compRoundResults);
    this.updateTime = new Date().getTime() * 1000000;
    if (!this.sortYieldType) {
      this.sortYieldType = 'low';
    }
    this.sortYield();
    this.sort();
    if (this.roundStatus !== 'Closed') {
      this.timer = window.setTimeout(() => {
        if (this.$route.params.round) {
          this.currentRound = this.$route.params.round.trim();
          this.getRoundInfo(
            [BigInt(this.$route.params.round.trim())],
            'update'
          );
        } else {
          this.getRoundInfo();
        }
      }, 5 * 60 * 1000);
    }
  }
  private async stats(): Promise<string> {
    const dexId = this.$route.params.id.trim();
    const currentICDexService = new ICDexService(dexId);
    const res = await currentICDexService.stats();
    if (res) {
      return res.price;
    }
  }
  private async getEquity(
    data: [Array<number>, CompResult],
    currentPrice: string
  ): Promise<void> {
    const type = Object.keys(data[1].status)[0];
    if (type === 'Dropout') {
      const address = this.arrayToHexString(data[0]);
      this.equity[address] = {
        total: data[1].assetValue[0].total,
        value0: data[1].assetValue[0].value0,
        value1: data[1].assetValue[0].value1
      };
    } else {
      const dexId = this.$route.params.id.trim();
      const accountData = JSON.parse(JSON.stringify(Array.from(data[0])));
      if (accountData && accountData.length) {
        if (accountData[accountData.length - 1] >= 255) {
          accountData[accountData.length - 1] = 0;
        } else {
          accountData[accountData.length - 1] += 1;
        }
      }
      const account: [Icrc1Account, Address] = [
        { owner: Principal.from(dexId), subaccount: [accountData] },
        principalToAccountIdentifier(
          Principal.from(dexId),
          new Uint8Array(accountData)
        )
      ];
      const token0Std = this.pairInfo.token0[2];
      const token0Id = this.pairInfo.token0[0].toString();
      const token1Std = this.pairInfo.token1[2];
      const token1Id = this.pairInfo.token1[0].toString();
      const address = this.arrayToHexString(data[0]);
      const promiseValue = [];
      promiseValue.push(getCompetitionsBalance(token0Std, token0Id, account));
      promiseValue.push(getCompetitionsBalance(token1Std, token1Id, account));
      const res = await Promise.all(promiseValue);
      let token0Balance = new BigNumber(res[0])
        .plus(data[1].assetValue[0].value0.toString(10))
        .toString(10);
      let token1Balance = new BigNumber(res[1])
        .plus(data[1].assetValue[0].value1.toString(10))
        .toString(10);
      console.log(currentPrice);
      const total = new BigNumber(res[0])
        .times(currentPrice)
        .plus(res[1])
        .plus(data[1].assetValue[0].total)
        .toString(10);
      this.equity[address] = {
        total: total,
        value0: BigInt(token0Balance),
        value1: BigInt(token1Balance)
      };
    }
  }
  private async getRound(): Promise<void> {
    const dexId = this.$route.params.id.trim();
    const currentICDexService = new ICDexService(dexId);
    const res = await currentICDexService.comp_round();
    this.newRound = Number(res[0]);
  }
  private onChangeRoundLatest(): void {
    this.sortYieldType = 'low';
    this.updateTime = null;
    this.equity = {};
    this.resultPage = {
      page: 1,
      size: 100,
      total: 0
    };
    this.updateTime = null;
    window.clearTimeout(this.timer);
    this.timer = null;
    this.getRoundInfo();
  }
  private async getRoundInfo(
    round: Array<bigint> = [],
    type?: string
  ): Promise<void> {
    this.changeRound = null;
    try {
      if (
        round.length &&
        this.compRoundInfo &&
        this.compRoundInfo[round[0].toString(10)] &&
        round[0] !== this.currentRoundInfo[0]
      ) {
        this.currentRound = round[0].toString(10);
        this.resultPage.total = 0;
        this.compRoundResults = [];
        this.compResults(0, 1000, type);
        if (
          Number(this.currentRound) &&
          this.currentRound !== this.$route.params.round.trim()
        ) {
          this.$router.replace(
            `/competitions/tradingComp/${this.$route.params.id.trim()}/${Number(
              this.currentRound
            )}`
          );
        }
        return;
      }
      if (round.length) {
        this.currentRound = round[0].toString(10);
        this.resultPage.total = 0;
        this.compRoundResults = [];
        this.compResults(0, 1000, type);
      }
      const dexId = this.$route.params.id.trim();
      const currentICDexService = new ICDexService(dexId);
      const res = await currentICDexService.comp_round(round);
      this.currentRound = res[0].toString(10);
      if (!round.length) {
        this.resultPage.total = 0;
        this.compRoundResults = [];
        this.compResults(0, 1000, type);
      }
      if (
        !round.length ||
        !this.currentRoundInfo ||
        round[0] === this.currentRoundInfo[0]
      ) {
        this.currentRoundInfo = res;
      }
      if (!this.compRoundInfo) {
        this.compRoundInfo = {};
      }
      if (
        Number(this.currentRound) &&
        this.currentRound !== this.$route.params.round.trim()
      ) {
        this.$router.replace(
          `/competitions/tradingComp/${this.$route.params.id.trim()}/${Number(
            this.currentRound
          )}`
        );
      }
      this.$set(this.compRoundInfo, res[0].toString(10), res[1][0]);
      console.log(this.compRoundInfo);
    } catch (e) {
      console.log(e);
    }
  }
  private onChangeRound(): void {
    if (Number(this.changeRound)) {
      if (Number(this.changeRound)) {
        this.sortYieldType = 'low';
        this.updateTime = null;
        this.equity = {};
        this.resultPage = {
          page: 1,
          size: 100,
          total: 0
        };
        this.updateTime = null;
        window.clearTimeout(this.timer);
        this.timer = null;
      }
      console.log(this.equity);
      this.getRoundInfo([BigInt(this.changeRound)]);
    }
  }
  private onCopy(): void {
    this.$message.success('Copied');
  }
  private arrayToHexString = (val: Array<number>): string => {
    return toHexString(new Uint8Array(val));
  };
  private jump(): void {
    this.$router.push('/competitions/tradingComp');
  }
  private pendingCompetitions(val: RoundInfo): boolean {
    const now = new Date().getTime();
    return new BigNumber(now).times(1000000).lt(val.start.toString(10));
  }
  private openCompetitions(val: RoundInfo): boolean {
    const now = new Date().getTime();
    return (
      new BigNumber(now).times(1000000).gte(val.start.toString(10)) &&
      new BigNumber(now).times(1000000).lte(val.end.toString(10))
    );
  }
  private closeCompetitions(val: RoundInfo): boolean {
    const now = new Date().getTime();
    return new BigNumber(now).times(1000000).gt(val.end.toString(10));
  }
}
</script>

<style scoped lang="scss">
.competitions-round-header {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 50px 0;
  font-size: 16px;
  .competitions-round-header-back {
    position: absolute;
    left: 0;
    cursor: pointer;
  }
}
.competitions-round-main {
  display: flex;
  background: #fff;
  box-shadow: 0 1px 10px 0 rgba(0, 71, 121, 0.05);
  border-radius: 4px;
  border: 1px solid #eef6fb;
  padding: 20px;
  line-height: 1.5;
  > div {
    width: 50%;
  }
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
.competitions-round-item {
  display: flex;
  align-items: center;
  line-height: 1.2;
  padding: 5px 0;
  > span {
    &:first-child {
      display: inline-block;
      width: 100px;
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
.transactions-pagination-bottom {
  display: flex;
  .transactions-pagination {
    margin: 15px 0 15px auto;
  }
}
.flex-column {
  display: flex;
  flex-direction: column;
  line-height: 1.5;
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
.rank-main {
  display: flex;
  align-items: center;
  justify-content: center;
}
.rank-img {
  width: 30px;
}
.rank-table {
  display: flex;
  align-items: center;
  justify-content: center;
}
.keep-all {
  word-break: keep-all;
}
.break-word {
  word-break: break-word;
}
.loading-spinner {
  display: inline-block;
  background-image: url('../../assets/img/loading.svg');
  background-repeat: no-repeat;
  background-size: 14px 14px;
  height: 14px;
  width: 14px;
  background-position: center;
  animation: loading-rotate 2s linear infinite;
  margin-left: 5px;
  color: #808a94;
}
@keyframes loading-rotate {
  to {
    transform: rotate(1turn);
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
.light-span {
  color: #727a87;
}
.pending-competitions,
.close-competitions {
  color: #adb3c4;
}
.open-competitions {
  color: #21c77d;
}
</style>
<style>
.yield-ant-tooltip {
  max-width: 300px !important;
  word-break: break-word;
}
</style>
