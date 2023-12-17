<template>
  <div class="tx-details pairs-main">
    <a-spin :spinning="pairsSpinning">
      <a-tabs :active-key="activeKey" @change="changeTab">
        <a-tab-pane key="ICDEX" tab="ICDEX">
          <div class="a-tab-content">
            <table>
              <thead>
                <tr>
                  <th>Currency</th>
                  <th>Pair</th>
                  <th class="text-right pointer" @click="onSort('price')">
                    <span class="sort-table-main">
                      <span>Price</span>
                      <span class="sort-table">
                        <a-icon
                          :class="{ active: sortType === 'priceUp' }"
                          type="caret-up"
                        />
                        <a-icon
                          :class="{ active: sortType === 'priceDown' }"
                          type="caret-down"
                        />
                      </span>
                    </span>
                  </th>
                  <th class="text-right pointer" @click="onSort('vol')">
                    <span class="sort-table-main">
                      <span>Vol</span>
                      <span class="sort-table">
                        <a-icon
                          :class="{ active: sortType === 'volUp' }"
                          type="caret-up"
                        />
                        <a-icon
                          :class="{ active: sortType === 'volDown' }"
                          type="caret-down"
                        />
                      </span>
                    </span>
                  </th>
                  <th class="text-right pointer" @click="onSort('volP')">
                    <span class="sort-table-main">
                      <span>Vol(%)</span>
                      <span class="sort-table">
                        <a-icon
                          :class="{ active: sortType === 'volPUp' }"
                          type="caret-up"
                        />
                        <a-icon
                          :class="{ active: sortType === 'volPDown' }"
                          type="caret-down"
                        />
                      </span>
                    </span>
                  </th>
                  <th class="text-right">Score</th>
                  <th class="text-right">Sponsored</th>
                  <!--<th class="text-right">Ambassadors</th>-->
                  <th class="update-time text-right">Updated</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(pair, index) in pairsDex.slice(
                    (page.currentPage - 1) * page.size,
                    page.currentPage * page.size
                  )"
                  :key="index"
                >
                  <td>
                    <div class="token-info">
                      <div class="token-logo">
                        <img
                          v-if="
                            tokens &&
                            tokens[pair[1].pair.token0[0].toString()] &&
                            tokens[pair[1].pair.token0[0].toString()].logo
                          "
                          :src="tokens[pair[1].pair.token0[0].toString()].logo"
                          alt=""
                        />
                      </div>
                      <span
                        v-if="
                          pair[1].pair.token0[0].toString() ===
                          '6nmrm-laaaa-aaaak-aacfq-cai'
                        "
                        >{{ pair[1].pair.token0[1] }}</span
                      >
                      <router-link
                        v-else
                        :to="`/token/${pair[1].pair.token0[0].toString()}`"
                      >
                        {{ pair[1].pair.token0[1] }}
                      </router-link>
                    </div>
                  </td>
                  <td>
                    <router-link
                      :to="
                        jumpRouter(
                          `/swap/${pair[1].pair.canisterId.toString()}`
                        )
                      "
                    >
                      <dl>
                        <dd>
                          <span
                            >{{ pair[1].pair.token0[1] }}/{{
                              pair[1].pair.token1[1]
                            }}</span
                          >
                        </dd>
                        <dt>
                          {{ pair[1].pair.canisterId.toString() | ellipsis(5) }}
                        </dt>
                      </dl>
                    </router-link>
                  </td>
                  <td align="right">
                    <dl
                      v-if="
                        tokens &&
                        tokens[pair[1].pair.token0[0].toString()] &&
                        tokens[pair[1].pair.token1[0].toString()]
                      "
                    >
                      <dd>
                        <span>
                          {{ pair[1] | filterPrice(tokens) | formatNum }}
                          {{ pair[1].pair.token1[1] }}
                        </span>
                      </dd>
                      <dt
                        v-if="
                          pair[1].pair.token1[1].toLocaleLowerCase() === 'icp'
                        "
                      >
                        ≈ ${{ pair[1] | filterIcpPrice(tokens, icpPrice) }}
                      </dt>
                    </dl>
                  </td>
                  <td align="right">
                    <dl
                      v-if="tokens && tokens[pair[1].pair.token1[0].toString()]"
                    >
                      <dd>
                        <span>
                          {{
                            pair[1].liquidity[0].vol.value1 |
                              bigintToFloat(
                                0,
                                tokens[pair[1].pair.token1[0].toString()]
                                  .decimals
                              ) |
                              formatNum
                          }}
                          {{ pair[1].pair.token1[1] }}
                        </span>
                      </dd>
                      <dt>
                        <span
                          v-if="
                            pair[1].pair.token1[1].toLocaleLowerCase() === 'icp'
                          "
                        >
                          ≈ ${{
                            pair[1].liquidity[0].vol.value1 |
                              filterIcpVol(
                                tokens[pair[1].pair.token1[0].toString()]
                                  .decimals,
                                icpPrice
                              ) |
                              formatNum
                          }}
                        </span>
                      </dt>
                    </dl>
                  </td>
                  <td align="right">
                    <span v-if="pair[1].liquidity[0]">
                      {{
                        pair[1] | filterVolPercent(pairTotalDexVol, icpPrice)
                      }}
                    </span>
                  </td>
                  <td align="right">
                    {{ pair[1].score }}
                  </td>
                  <td align="right">
                    <span class="table-number-color"
                      >({{ pair[1].listingReferrers.length }})&nbsp;</span
                    >
                    <span
                      v-if="pair[1].sponsored"
                      :class="{ ambassadors: pair[1].sponsored }"
                    >
                      <a-icon type="like" />
                    </span>
                    <a-icon v-else type="like" />
                  </td>
                  <!--<td align="right">
                    <a
                      :href="`https:iclight.io/ICDex/${pair[1].pair.token0[1]}/${pair[1].pair.token1[1]}?type=referrer`"
                      target="_blank"
                      >Referrer link</a
                    >
                  </td>-->
                  <td class="update-time" align="right">
                    <span v-if="pair[1].liquidity[0]">
                      {{
                        pair[1].liquidity[0].priceWeighted.updateTime |
                          formatDateFromSecondUTC
                      }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
            <div class="transactions-pagination-bottom">
              <a-pagination
                v-if="pairsDex.length > page.size"
                class="transactions-pagination"
                v-model="page.currentPage"
                :total="pairsDex.length"
                :defaultPageSize="page.size"
                :showQuickJumper="true"
                @change="pageChange"
              />
            </div>
          </div>
        </a-tab-pane>
        <a-tab-pane key="cyclesfinance" tab="cyclesfinance">
          <div class="a-tab-content">
            <table>
              <thead>
                <tr>
                  <th>Currency</th>
                  <th>Pair</th>
                  <th class="text-right">
                    <span>Price</span>
                  </th>
                  <th class="text-right">Pool</th>
                  <th class="text-right">
                    <span>Vol</span>
                  </th>
                  <th class="text-right">Score</th>
                  <th class="text-right">Sponsored</th>
                  <!--<th class="text-right">Ambassadors</th>-->
                  <th class="update-time text-right">Updated</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(pair, index) in pairsCyclesfinance" :key="index">
                  <td>
                    <div class="token-info">
                      <div class="token-logo">
                        <img
                          v-if="
                            tokens &&
                            tokens[pair[1].pair.token0[0].toString()] &&
                            tokens[pair[1].pair.token0[0].toString()].logo
                          "
                          :src="tokens[pair[1].pair.token0[0].toString()].logo"
                          alt=""
                        />
                      </div>
                      <span
                        v-if="
                          pair[1].pair.token0[0].toString() ===
                          '6nmrm-laaaa-aaaak-aacfq-cai'
                        "
                        >{{ pair[1].pair.token0[1] }}</span
                      >
                      <router-link
                        v-else
                        :to="`/token/${pair[1].pair.token0[0].toString()}`"
                      >
                        {{ pair[1].pair.token0[1] }}
                      </router-link>
                    </div>
                  </td>
                  <td>
                    <router-link
                      :to="
                        jumpRouter(
                          `/swap/${pair[1].pair.canisterId.toString()}`
                        )
                      "
                    >
                      <dl>
                        <dd>
                          <span
                            >{{ pair[1].pair.token0[1] }}/{{
                              pair[1].pair.token1[1]
                            }}</span
                          >
                        </dd>
                        <dt>
                          {{ pair[1].pair.canisterId.toString() | ellipsis(5) }}
                        </dt>
                      </dl>
                    </router-link>
                  </td>
                  <td align="right">
                    <dl
                      v-if="
                        tokens &&
                        tokens[pair[1].pair.token0[0].toString()] &&
                        tokens[pair[1].pair.token1[0].toString()]
                      "
                    >
                      <dd>
                        <span>
                          {{ pair[1] | filterPrice(tokens) | formatNum }}
                          {{ pair[1].pair.token1[1] }}
                        </span>
                      </dd>
                      <dt
                        v-if="
                          pair[1].pair.token1[1].toLocaleLowerCase() === 'icp'
                        "
                      >
                        ≈ ${{ pair[1] | filterIcpPrice(tokens, icpPrice) }}
                      </dt>
                    </dl>
                  </td>
                  <td align="right">
                    <dl
                      v-if="
                        tokens &&
                        tokens[pair[1].pair.token0[0].toString()] &&
                        tokens[pair[1].pair.token1[0].toString()]
                      "
                    >
                      <dd>
                        {{
                          pair[1].liquidity[0].value1 |
                            bigintToFloat(
                              0,
                              tokens[pair[1].pair.token1[0].toString()].decimals
                            ) |
                            formatNum
                        }}
                        {{ pair[1].pair.token1[1] }}
                      </dd>
                      <dt style="font-weight: normal">
                        {{
                          pair[1].liquidity[0].value0 |
                            bigintToFloat(
                              0,
                              tokens[pair[1].pair.token0[0].toString()].decimals
                            ) |
                            formatNum
                        }}
                        T{{ pair[1].pair.token0[1] }}
                      </dt>
                    </dl>
                  </td>
                  <td align="right">
                    <dl
                      v-if="tokens && tokens[pair[1].pair.token1[0].toString()]"
                    >
                      <dd>
                        <span>
                          {{
                            pair[1].liquidity[0].vol.value1 |
                              bigintToFloat(
                                0,
                                tokens[pair[1].pair.token1[0].toString()]
                                  .decimals
                              ) |
                              formatNum
                          }}
                          {{ pair[1].pair.token1[1] }}
                        </span>
                      </dd>
                      <dt>
                        <span
                          v-if="
                            pair[1].pair.token1[1].toLocaleLowerCase() === 'icp'
                          "
                        >
                          ≈ ${{
                            pair[1].liquidity[0].vol.value1 |
                              filterIcpVol(
                                tokens[pair[1].pair.token1[0].toString()]
                                  .decimals,
                                icpPrice
                              ) |
                              formatNum
                          }}
                        </span>
                      </dt>
                    </dl>
                  </td>
                  <td align="right">
                    {{ pair[1].score }}
                  </td>
                  <td align="right">
                    <span class="table-number-color"
                      >({{ pair[1].listingReferrers.length }})&nbsp;</span
                    >
                    <span
                      v-if="pair[1].sponsored"
                      :class="{ ambassadors: pair[1].sponsored }"
                    >
                      <a-icon type="like" />
                    </span>
                    <a-icon v-else type="like" />
                  </td>
                  <!--<td align="right">
                            <a
                              :href="`https:iclight.io/ICDex/${pair[1].pair.token0[1]}/${pair[1].pair.token1[1]}?type=referrer`"
                              target="_blank"
                              >Referrer link</a
                            >
                          </td>-->
                  <td class="update-time" align="right">
                    <span v-if="pair[1].liquidity[0]">
                      {{
                        pair[1].liquidity[0].priceWeighted.updateTime |
                          formatDateFromSecondUTC
                      }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </a-tab-pane>
        <!--<a-tab-pane key="ICSwap" tab="ICSwap">
          <div class="a-tab-content">
            <table>
              <thead>
                <tr>
                  <th>Currency</th>
                  <th>Pair</th>
                  <th class="text-right pointer" @click="onSort('price')">
                    <span class="sort-table-main">
                      <span>Price</span>
                      <span class="sort-table">
                        <a-icon
                          :class="{ active: sortType === 'priceUp' }"
                          type="caret-up"
                        />
                        <a-icon
                          :class="{ active: sortType === 'priceDown' }"
                          type="caret-down"
                        />
                      </span>
                    </span>
                  </th>
                  <th class="text-right pointer" @click="onSort('vol')">
                    <span class="sort-table-main">
                      <span>Vol</span>
                      <span class="sort-table">
                        <a-icon
                          :class="{ active: sortType === 'volUp' }"
                          type="caret-up"
                        />
                        <a-icon
                          :class="{ active: sortType === 'volDown' }"
                          type="caret-down"
                        />
                      </span>
                    </span>
                  </th>
                  <th class="text-right pointer" @click="onSort('volP')">
                    <span class="sort-table-main">
                      <span>Vol(%)</span>
                      <span class="sort-table">
                        <a-icon
                          :class="{ active: sortType === 'volPUp' }"
                          type="caret-up"
                        />
                        <a-icon
                          :class="{ active: sortType === 'volPDown' }"
                          type="caret-down"
                        />
                      </span>
                    </span>
                  </th>
                  <th class="text-right">Score</th>
                  <th class="text-right">Sponsored</th>
                  &lt;!&ndash;<th class="text-right">Ambassadors</th>&ndash;&gt;
                  <th class="update-time text-right">Updated</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(pair, index) in pairsSwap.slice(
                    (page.currentPage - 1) * page.size,
                    page.currentPage * page.size
                  )"
                  :key="index"
                >
                  <td>
                    <div class="token-info">
                      <div class="token-logo">
                        <img
                          v-if="
                            tokens &&
                            tokens[pair[1].pair.token0[0].toString()] &&
                            tokens[pair[1].pair.token0[0].toString()].logo
                          "
                          :src="tokens[pair[1].pair.token0[0].toString()].logo"
                          alt=""
                        />
                      </div>
                      <span
                        v-if="
                          pair[1].pair.token0[0].toString() ===
                          '6nmrm-laaaa-aaaak-aacfq-cai'
                        "
                        >{{ pair[1].pair.token0[1] }}</span
                      >
                      <router-link
                        v-else
                        :to="`/token/${pair[1].pair.token0[0].toString()}`"
                      >
                        {{ pair[1].pair.token0[1] }}
                      </router-link>
                    </div>
                  </td>
                  <td>
                    <router-link
                      :to="
                        jumpRouter(
                          `/swap/${pair[1].pair.canisterId.toString()}`
                        )
                      "
                    >
                      <dl>
                        <dd>
                          <span
                            >{{ pair[1].pair.token0[1] }}/{{
                              pair[1].pair.token1[1]
                            }}</span
                          >
                        </dd>
                        <dt>
                          {{ pair[1].pair.canisterId.toString() | ellipsis(5) }}
                        </dt>
                      </dl>
                    </router-link>
                  </td>
                  <td align="right">
                    <dl
                      v-if="
                        tokens &&
                        tokens[pair[1].pair.token0[0].toString()] &&
                        tokens[pair[1].pair.token1[0].toString()]
                      "
                    >
                      <dd>
                        <span>
                          {{ pair[1] | filterPrice(tokens) | formatNum }}
                          {{ pair[1].pair.token1[1] }}
                        </span>
                      </dd>
                      <dt
                        v-if="
                          pair[1].pair.token1[1].toLocaleLowerCase() === 'icp'
                        "
                      >
                        ≈ ${{ pair[1] | filterIcpPrice(tokens, icpPrice) }}
                      </dt>
                    </dl>
                  </td>
                  <td align="right">
                    <dl
                      v-if="tokens && tokens[pair[1].pair.token1[0].toString()]"
                    >
                      <dd>
                        <span>
                          {{
                            pair[1].liquidity[0].vol.value1 |
                              bigintToFloat(
                                0,
                                tokens[pair[1].pair.token1[0].toString()]
                                  .decimals
                              ) |
                              formatNum
                          }}
                          {{ pair[1].pair.token1[1] }}
                        </span>
                      </dd>
                      <dt>
                        <span
                          v-if="
                            pair[1].pair.token1[1].toLocaleLowerCase() === 'icp'
                          "
                        >
                          ≈ ${{
                            pair[1].liquidity[0].vol.value1 |
                              filterIcpVol(
                                tokens[pair[1].pair.token1[0].toString()]
                                  .decimals,
                                icpPrice
                              ) |
                              formatNum
                          }}
                        </span>
                      </dt>
                    </dl>
                  </td>
                  <td align="right">
                    <span v-if="pair[1].liquidity[0]">
                      {{
                        pair[1] | filterVolPercent(pairTotalDexVol, icpPrice)
                      }}
                    </span>
                  </td>
                  <td align="right">
                    {{ pair[1].score }}
                  </td>
                  <td align="right">
                    <span class="table-number-color"
                      >({{ pair[1].listingReferrers.length }})&nbsp;</span
                    >
                    <span
                      v-if="pair[1].sponsored"
                      :class="{ ambassadors: pair[1].sponsored }"
                    >
                      <a-icon type="like" />
                    </span>
                    <a-icon v-else type="like" />
                  </td>
                  &lt;!&ndash;<td align="right">
                          <a
                            :href="`https:iclight.io/ICDex/${pair[1].pair.token0[1]}/${pair[1].pair.token1[1]}?type=referrer`"
                            target="_blank"
                            >Referrer link</a
                          >
                        </td>&ndash;&gt;
                  <td class="update-time" align="right">
                    <span v-if="pair[1].liquidity[0]">
                      {{
                        pair[1].liquidity[0].priceWeighted.updateTime |
                          formatDateFromSecondUTC
                      }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
            <div class="transactions-pagination-bottom">
              <a-pagination
                v-if="pairsSwap.length > page.size"
                class="transactions-pagination"
                v-model="page.currentPage"
                :total="pairsSwap.length"
                :defaultPageSize="page.size"
                :showQuickJumper="true"
                @change="pageChange"
              />
            </div>
          </div>
        </a-tab-pane>-->
      </a-tabs>
    </a-spin>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { PairResponse, TrieListData } from '@/ic/ICSwapRouter/model';
import BigNumber from 'bignumber.js';
import { ICSwapRouterService } from '@/ic/ICSwapRouter/ICSwapRouterService';
import { TokenInfo } from '@/ic/common/icType';
import { getLogo, getTokenInfo } from '@/ic/getTokenInfo';
import { Principal } from '@dfinity/principal/lib/cjs';
import { TabKeyType } from '@/views/Token/model';

let tokenIds = [];

@Component({
  name: 'SwapsPairs',
  components: {},
  filters: {
    filterVolPercent(
      val: PairResponse,
      total: string,
      icpPrice: string
    ): string {
      const token1Symbol = val.pair.token1[1];
      if (token1Symbol.toLocaleLowerCase().includes('test')) {
        return '-';
      }
      let currentPrice = '1';
      if (token1Symbol.toLocaleLowerCase() === 'icp') {
        currentPrice = icpPrice;
      }
      if (total) {
        return (
          new BigNumber(val.liquidity[0].vol.value1.toString(10))
            .times(currentPrice)
            .div(total)
            .times(100)
            .decimalPlaces(2, 1)
            .toString(10) + '%'
        );
      }
    },
    filterPrice(
      val: PairResponse,
      tokens: { [key: string]: TokenInfo }
    ): string {
      if (val.liquidity.length) {
        const token0 = val.pair.token0[0].toString();
        const token1 = val.pair.token1[0].toString();
        return new BigNumber(val.liquidity[0].price.toString(10))
          .div(10 ** tokens[token1].decimals)
          .div(
            new BigNumber(val.liquidity[0].unitSize.toString(10)).div(
              10 ** tokens[token0].decimals
            )
          )
          .decimalPlaces(tokens[token0].decimals)
          .toString(10);
      }
      return '';
    },
    filterIcpPrice(
      val: PairResponse,
      tokens: { [key: string]: TokenInfo },
      icpPrice: string
    ): string {
      const token0Id = val.pair.token0[0].toString();
      const token1Id = val.pair.token1[0].toString();
      const liquidity = val.liquidity[0];
      if (liquidity) {
        return new BigNumber(liquidity.price.toString(10))
          .div(10 ** tokens[token1Id].decimals)
          .div(
            new BigNumber(liquidity.unitSize.toString(10)).div(
              10 ** tokens[token0Id].decimals
            )
          )
          .times(icpPrice)
          .decimalPlaces(tokens[token0Id].decimals)
          .toString(10);
      }
      return '';
    },
    filterIcpVol(val: bigint, decimals: number, icpPrice: string): string {
      return new BigNumber(val.toString(10))
        .div(10 ** decimals)
        .times(icpPrice)
        .decimalPlaces(0)
        .toString(10);
    }
  }
})
export default class extends Vue {
  private ICSwapRouterService: ICSwapRouterService;
  private tokens: { [key: string]: TokenInfo } = {};
  private pairsDex: Array<TrieListData> = [];
  private pairsSwap: Array<TrieListData> = [];
  private pairsCyclesfinance: Array<TrieListData> = [];
  private pairsSpinning = false;
  private icpPrice = '';
  private pairTotalDexVol = '0'; // usd
  private pairTotalSwapVol = '0'; // usd
  private activeKey = 'ICDEX';
  private sortType = '';
  private page = {
    currentPage: 1,
    size: 100,
    total: 0
  };
  mounted(): void {
    tokenIds = [];
    this.ICSwapRouterService = new ICSwapRouterService();
    this.tokens = JSON.parse(localStorage.getItem('tokens')) || {};
    this.getPairs();
  }
  private onSort(type: string): void {
    this.page.currentPage = 1;
    if (type === 'price') {
      if (this.sortType === 'priceDown') {
        this.sortType = 'priceUp';
      } else {
        this.sortType = 'priceDown';
      }
    }
    if (type === 'vol') {
      if (this.sortType === 'volDown') {
        this.sortType = 'volUp';
      } else {
        this.sortType = 'volDown';
      }
    }
    if (type === 'volP') {
      if (this.sortType === 'volPDown') {
        this.sortType = 'volPUp';
      } else {
        this.sortType = 'volPDown';
      }
    }
    this.sort();
  }
  private sort(): void {
    if (this.activeKey === 'ICDEX') {
      if (this.sortType === 'priceDown') {
        this.pairsDex.sort((a, b) => {
          const token1Symbol = a[1].pair.token1[1];
          const token1Symbol1 = b[1].pair.token1[1];
          if (token1Symbol.toLocaleLowerCase().includes('test')) {
            return 1;
          }
          if (token1Symbol1.toLocaleLowerCase().includes('test')) {
            return -1;
          }
          const USDPrice = this.getUSDPrice(a[1], this.tokens, this.icpPrice);
          const USDPrice1 = this.getUSDPrice(b[1], this.tokens, this.icpPrice);
          if (new BigNumber(USDPrice1).gt(USDPrice)) {
            return 1;
          } else {
            return -1;
          }
        });
      }
      if (this.sortType === 'priceUp') {
        this.pairsDex.sort((a, b) => {
          const token1Symbol = a[1].pair.token1[1];
          const token1Symbol1 = b[1].pair.token1[1];
          if (token1Symbol.toLocaleLowerCase().includes('test')) {
            return 1;
          }
          if (token1Symbol1.toLocaleLowerCase().includes('test')) {
            return -1;
          }
          const USDPrice = this.getUSDPrice(a[1], this.tokens, this.icpPrice);
          const USDPrice1 = this.getUSDPrice(b[1], this.tokens, this.icpPrice);
          return new BigNumber(USDPrice).minus(USDPrice1).toNumber();
        });
      }
      if (this.sortType === 'volDown' || this.sortType === 'volPDown') {
        this.pairsDex.sort((a, b) => {
          const token1Symbol = a[1].pair.token1[1];
          const token1Symbol1 = b[1].pair.token1[1];
          if (token1Symbol.toLocaleLowerCase().includes('test')) {
            return 1;
          }
          if (token1Symbol1.toLocaleLowerCase().includes('test')) {
            return -1;
          }
          const vol = this.getVol(a[1], this.tokens, this.icpPrice);
          const vol1 = this.getVol(b[1], this.tokens, this.icpPrice);
          if (new BigNumber(vol1).gt(vol)) {
            return 1;
          } else {
            return -1;
          }
        });
      }
      if (this.sortType === 'volUp' || this.sortType === 'volPUp') {
        this.pairsDex.sort((a, b) => {
          const token1Symbol = a[1].pair.token1[1];
          const token1Symbol1 = b[1].pair.token1[1];
          if (token1Symbol.toLocaleLowerCase().includes('test')) {
            return 1;
          }
          if (token1Symbol1.toLocaleLowerCase().includes('test')) {
            return -1;
          }
          const vol = this.getVol(a[1], this.tokens, this.icpPrice);
          const vol1 = this.getVol(b[1], this.tokens, this.icpPrice);
          if (new BigNumber(vol).gt(vol1)) {
            return 1;
          } else {
            return -1;
          }
        });
      }
    }
  }
  private pageChange(page: number): void {
    this.page.currentPage = page;
  }
  private getVol(
    val: PairResponse,
    tokens: { [key: string]: TokenInfo },
    icpPrice: string
  ): string {
    let currentIcpPrice = '1';
    if (val.pair.token1[1].toLocaleLowerCase() === 'icp') {
      currentIcpPrice = icpPrice;
    }
    return new BigNumber(val.liquidity[0].vol.value1.toString(10))
      .div(10 ** tokens[val.pair.token1[0].toString()].decimals)
      .times(currentIcpPrice)
      .decimalPlaces(0)
      .toString(10);
  }
  private getUSDPrice(
    val: PairResponse,
    tokens: { [key: string]: TokenInfo },
    icpPrice: string
  ): string {
    const token0Id = val.pair.token0[0].toString();
    const token1Id = val.pair.token1[0].toString();
    const liquidity = val.liquidity[0];
    let currentIcpPrice = '1';
    if (val.pair.token1[1].toLocaleLowerCase() === 'icp') {
      currentIcpPrice = icpPrice;
    }
    if (liquidity) {
      return new BigNumber(liquidity.price.toString(10))
        .div(10 ** tokens[token1Id].decimals)
        .div(
          new BigNumber(liquidity.unitSize.toString(10)).div(
            10 ** tokens[token0Id].decimals
          )
        )
        .times(currentIcpPrice)
        .decimalPlaces(8)
        .toString(10);
    }
    return '0';
  }
  private async getPairs(): Promise<void> {
    this.pairsSpinning = true;
    try {
      const fetchRes = await fetch(
        'https://pncff-zqaaa-aaaai-qnp3a-cai.raw.ic0.app/2'
      );
      if (fetchRes && fetchRes.status === 200) {
        const icpRes = await fetchRes.json();
        this.icpPrice = (icpRes as any).success[0].rate;
        console.log(this.icpPrice);
      }
      const res = await this.ICSwapRouterService.getPairs2(['icdex']);
      if (res && res.data) {
        this.pairsDex = res.data.sort((a, b) => {
          return Number(
            new BigNumber(b[1].score.toString(10)).minus(
              a[1].score.toString(10)
            )
          );
        });
        this.pairsDex.forEach((item) => {
          const token1Symbol = item[1].pair.token1[1];
          if (!token1Symbol.toLocaleLowerCase().includes('test')) {
            let currentPrice = '1';
            if (token1Symbol.toLocaleLowerCase() === 'icp') {
              currentPrice = this.icpPrice;
            }
            this.pairTotalDexVol = new BigNumber(
              item[1].liquidity[0].vol.value1.toString(10)
            )
              .times(currentPrice)
              .plus(this.pairTotalDexVol)
              .toString(10);
          }
          const token0Id = item[1].pair.token0[0];
          const token1Id = item[1].pair.token1[0];
          if (!this.tokens[token0Id.toString()]) {
            getTokenInfo(token0Id).then((tokenInfo) => {
              this.$set(this.tokens, token0Id.toString(), tokenInfo);
            });
          } else {
            this.getLogo(token0Id.toString());
          }
          if (!this.tokens[token1Id.toString()]) {
            getTokenInfo(token1Id).then((tokenInfo) => {
              this.$set(this.tokens, token1Id.toString(), tokenInfo);
            });
          } else {
            this.getLogo(token1Id.toString());
          }
        });
        console.log(this.pairTotalDexVol);
      }
      console.log(this.tokens);
      console.log(this.pairsDex);
      const swaps = await this.ICSwapRouterService.getPairs2(['icswap']);
      if (swaps && swaps.data) {
        this.pairsSwap = swaps.data.sort((a, b) => {
          return Number(
            new BigNumber(b[1].score.toString(10)).minus(
              a[1].score.toString(10)
            )
          );
        });
        this.pairsSwap.forEach((item) => {
          const token1Symbol = item[1].pair.token1[1];
          if (!token1Symbol.toLocaleLowerCase().includes('test')) {
            let currentPrice = '1';
            if (token1Symbol.toLocaleLowerCase() === 'icp') {
              currentPrice = this.icpPrice;
            }
            this.pairTotalSwapVol = new BigNumber(
              item[1].liquidity[0].vol.value1.toString(10)
            )
              .times(currentPrice)
              .plus(this.pairTotalSwapVol)
              .toString(10);
          }
          const token0Id = item[1].pair.token0[0];
          const token1Id = item[1].pair.token1[0];
          if (!this.tokens[token0Id.toString()]) {
            getTokenInfo(token0Id).then((tokenInfo) => {
              this.$set(this.tokens, token0Id.toString(), tokenInfo);
            });
          } else {
            this.getLogo(token0Id.toString());
          }
          if (!this.tokens[token1Id.toString()]) {
            getTokenInfo(token1Id).then((tokenInfo) => {
              this.$set(this.tokens, token1Id.toString(), tokenInfo);
            });
          } else {
            this.getLogo(token1Id.toString());
          }
        });
        console.log(this.pairTotalSwapVol);
      }
      const cyclesfinance = await this.ICSwapRouterService.getPairs2([
        'cyclesfinance'
      ]);
      if (cyclesfinance && cyclesfinance.data) {
        this.pairsCyclesfinance = cyclesfinance.data;
        this.pairsCyclesfinance.forEach((item) => {
          const token0Id = item[1].pair.token0[0];
          const token1Id = item[1].pair.token1[0];
          if (!this.tokens[token0Id.toString()]) {
            getTokenInfo(token0Id).then((tokenInfo) => {
              this.$set(this.tokens, token0Id.toString(), tokenInfo);
            });
          } else {
            this.getLogo(token0Id.toString());
          }
          if (!this.tokens[token1Id.toString()]) {
            getTokenInfo(token1Id).then((tokenInfo) => {
              this.$set(this.tokens, token1Id.toString(), tokenInfo);
            });
          } else {
            this.getLogo(token1Id.toString());
          }
        });
        console.log(this.pairTotalSwapVol);
      }
      console.log(this.pairsSwap);
    } catch (e) {
      console.error(e);
    }
    this.pairsSpinning = false;
  }
  private async getLogo(tokenId: string): Promise<void> {
    if (!tokenIds.includes(tokenId)) {
      tokenIds.push(tokenId);
    } else {
      return;
    }
    if (this.tokens[tokenId] && !this.tokens[tokenId].logo) {
      getLogo(Principal.fromText(tokenId), this.tokens[tokenId].tokenStd).then(
        (logo) => {
          const tokenInfo = Object.assign({}, this.tokens[tokenId], {
            logo: logo
          });
          this.$set(this.tokens, tokenId, tokenInfo);
        }
      );
    }
  }
  private changeTab(activeKey: TabKeyType) {
    this.activeKey = activeKey;
    this.sortType = '';
    this.page.currentPage = 1;
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
.pairs-main {
  background: #fff;
  line-height: 20px;
  box-shadow: 0 2px 4px 0 rgba(0, 140, 238, 0.05);
  border-radius: 4px;
}
.update-time {
  width: 200px;
}
.token-info {
  display: flex;
  align-items: center;
}
.token-logo {
  width: 30px;
  height: 30px;
  margin-right: 5px;
  img {
    width: 30px;
    height: 30px;
    border-radius: 15px;
    object-fit: contain;
    cursor: pointer;
  }
}
.text-right {
  text-align: right;
}
table {
  width: 100%;
  min-height: 200px;
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
      line-height: 1.5;
    }
    &:last-child {
      border-bottom: none;
    }
  }
  td {
    padding: 15px 0;
    vertical-align: middle;
  }
  .table-index {
    width: 100px;
  }
  .table-time {
    width: 200px;
  }
}
.sort-table-main {
  display: flex;
  align-items: center;
  justify-content: right;
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
.transactions-pagination-bottom {
  display: flex;
  .transactions-pagination {
    margin: 15px 0 15px auto;
  }
}
</style>
