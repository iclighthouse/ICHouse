<template>
  <div class="swaps">
    <div class="stats">
      <div class="stats-item">
        <dl>
          <dt>Buckets</dt>
          <dd>
            <a-statistic
              v-if="stats"
              :value-style="{ color: '#008CEE' }"
              :value="stats.bucketCount.toString()"
            ></a-statistic>
            <span v-else class="stats-item-span">-</span>
          </dd>
        </dl>
      </div>
      <div class="stats-item">
        <dl>
          <dt>Apps</dt>
          <dd>
            <router-link v-if="stats" :to="jumpRouter('/swaps/pairs')">
              <a-statistic
                :value-style="{ color: '#008CEE' }"
                :value="stats.appCount.toString()"
              ></a-statistic>
            </router-link>
            <span v-else class="stats-item-span">-</span>
          </dd>
        </dl>
      </div>
      <div class="stats-item">
        <dl>
          <dt>Transactions</dt>
          <dd>
            <a-statistic
              v-if="stats"
              :value-style="{ color: '#008CEE' }"
              :value="stats.txnCount.toString()"
            ></a-statistic>
            <span v-else class="stats-item-span">-</span>
          </dd>
        </dl>
      </div>
      <div class="stats-item">
        <dl>
          <dt>Errors</dt>
          <dd>
            <a-tooltip v-if="stats" placement="bottom">
              <template slot="title">
                <span>errCount(storeErrPool)</span>
              </template>
              <a-statistic
                :value-style="{ color: '#008CEE' }"
                :value="`${stats.errCount.toString()}(${stats.storeErrPool.toString()})`"
              ></a-statistic>
            </a-tooltip>
            <span v-else class="stats-item-span">-</span>
          </dd>
        </dl>
      </div>
    </div>
    <div class="latest">
      <div class="latest-transactions">
        <div class="latest-header">Swapping Pairs</div>
        <div class="latest-transactions-main latest-transactions-main-pairs">
          <a-spin :spinning="pairsSpinning">
            <table>
              <thead>
                <tr>
                  <th>Currency</th>
                  <th>Pair</th>
                  <th class="text-right">Price</th>
                  <th class="text-right">Vol</th>
                  <th class="text-right">Vol(%)</th>
                  <th class="update-time text-right">Updated</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(pair, index) in pairs" :key="index">
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
                          <span>{{ pair[1].pair.dexName }}: </span>
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
                      {{ pair[1] | filterVolPercent(pairTotalVol, icpPrice) }}
                    </span>
                  </td>
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
          </a-spin>
        </div>
        <div class="view-all">
          <router-link :to="jumpRouter('/swaps/pairs')">
            <a-button type="primary">View more pairs</a-button>
          </router-link>
        </div>
      </div>
    </div>
    <div class="latest">
      <div class="latest-transactions">
        <div class="latest-header">Latest Transactions</div>
        <div class="latest-transactions-main">
          <a-spin :spinning="spinning">
            <table>
              <tbody>
                <tr
                  v-for="(transaction, index) in latestTransactions"
                  :key="index"
                >
                  <td class="transaction-type">
                    <dl v-if="transaction.length">
                      <dd>
                        <span>{{ transaction[2].toString() }}</span>
                      </dd>
                      <dt>
                        <span>{{
                          Object.keys(transaction[0].operation)[0]
                        }}</span>
                      </dt>
                    </dl>
                  </td>
                  <td>
                    <router-link
                      v-if="
                        transaction.length && swaps[transaction[3].toString()]
                      "
                      :to="jumpRouter(`/swap/${transaction[3].toString()}`)"
                    >
                      <dl>
                        <dt>
                          {{ swaps[transaction[3].toString()].name }}
                        </dt>
                        <dd>{{ transaction[3].toString() | ellipsis(5) }}</dd>
                      </dl>
                    </router-link>
                  </td>
                  <td>
                    <dl v-if="transaction.length">
                      <dt>
                        <router-link
                          :to="
                            jumpRouter(
                              `/swap/${transaction[3].toString()}/${txidToHexString(
                                transaction[0].txid
                              )}`
                            )
                          "
                          >{{
                            transaction[0].txid |
                              txidToHex |
                              ellipsis(ellipsisNumber)
                          }}
                        </router-link>
                      </dt>
                      <dd>
                        <span class="time">{{
                          transaction[0].time | formatDateFromNanosecond
                        }}</span>
                      </dd>
                    </dl>
                  </td>
                  <td>
                    <dl v-if="transaction.length">
                      <dt>Account</dt>
                      <dd>
                        <router-link
                          :to="
                            jumpRouter(
                              `/swap/address/${transaction[3].toString()}/${txidToHexString(
                                transaction[0].account
                              )}`
                            )
                          "
                        >
                          {{
                            transaction[0].account |
                              txidToHex |
                              ellipsis(ellipsisNumber)
                          }}
                        </router-link>
                      </dd>
                    </dl>
                  </td>
                  <td>
                    <div v-if="transaction && transaction[0]" class="nowrap">
                      <div
                        v-if="
                          Object.keys(transaction[0].status)[0] ===
                            'Cancelled' ||
                          Object.keys(transaction[0].status)[0] ===
                            'PartiallyCompletedAndCancelled' ||
                          Object.keys(transaction[0].status)[0] === 'Failed'
                        "
                      >
                        {{ Object.keys(transaction[0].status)[0] }}
                      </div>
                      <div v-else>
                        <a-tooltip
                          v-if="
                            getOrderMode(transaction[0].orderMode) ===
                            'OrderBook'
                          "
                          placement="topLeft"
                          :overlay-style="{
                            whiteSpace: 'nowrap',
                            maxWidth: 'max-content'
                          }"
                        >
                          <template slot="title">
                            <div
                              class="swap-info"
                              v-if="
                                Object.keys(transaction[0].operation)[0] ===
                                'Swap'
                              "
                            >
                              <div
                                v-if="
                                  getStatus(transaction[0]) === 'Open' &&
                                  transaction[0].order.token0Value.length &&
                                  Object.keys(
                                    transaction[0].order.token0Value[0]
                                  )[0] === 'DebitRecord' &&
                                  tokens &&
                                  tokens[transaction[0].token0Id]
                                "
                              >
                                {{
                                  Object.values(
                                    transaction[0].order.token0Value[0]
                                  )[0] |
                                    bigintToFloat(
                                      tokens[transaction[0].token0Id].decimals,
                                      tokens[transaction[0].token0Id].decimals
                                    )
                                }}<span class="span-nbsp"></span
                                >{{ tokens[transaction[0].token0Id].symbol }}
                              </div>
                              <div
                                v-if="
                                  getStatus(transaction[0]) === 'Open' &&
                                  transaction[0].order.token1Value.length &&
                                  Object.keys(
                                    transaction[0].order.token1Value[0]
                                  )[0] === 'DebitRecord' &&
                                  tokens &&
                                  tokens[transaction[0].token1Id]
                                "
                              >
                                {{
                                  Object.values(
                                    transaction[0].order.token1Value[0]
                                  )[0] |
                                    bigintToFloat(
                                      tokens[transaction[0].token1Id].decimals,
                                      tokens[transaction[0].token1Id].decimals
                                    )
                                }}<span class="span-nbsp"></span
                                >{{ tokens[transaction[0].token1Id].symbol }}
                              </div>
                              <div
                                v-if="
                                  getStatus(transaction[0]) === 'Filled' &&
                                  Object.keys(transaction[0].orderMode)[0] ===
                                    'OrderBook' &&
                                  transaction[0].details.length &&
                                  Object.keys(
                                    transaction[0].details[0].token0Value
                                  )[0] === 'DebitRecord' &&
                                  tokens &&
                                  tokens[transaction[0].token0Id]
                                "
                              >
                                {{
                                  Object.values(
                                    transaction[0].details[
                                      transaction[0].details.length - 1
                                    ].token0Value
                                  )[0] |
                                    bigintToFloat(
                                      tokens[transaction[0].token0Id].decimals,
                                      tokens[transaction[0].token0Id].decimals
                                    )
                                }}<span class="span-nbsp"></span
                                >{{ tokens[transaction[0].token0Id].symbol }}
                              </div>
                              <div
                                v-if="
                                  getStatus(transaction[0]) === 'Filled' &&
                                  Object.keys(transaction[0].orderMode)[0] ===
                                    'OrderBook' &&
                                  transaction[0].details.length &&
                                  Object.keys(
                                    transaction[0].details[0].token1Value
                                  )[0] === 'DebitRecord' &&
                                  tokens &&
                                  tokens[transaction[0].token0Id]
                                "
                              >
                                {{
                                  Object.values(
                                    transaction[0].details[
                                      transaction[0].details.length - 1
                                    ].token1Value
                                  )[0] |
                                    bigintToFloat(
                                      tokens[transaction[0].token1Id].decimals,
                                      tokens[transaction[0].token1Id].decimals
                                    )
                                }}<span class="span-nbsp"></span
                                >{{ tokens[transaction[0].token1Id].symbol }}
                              </div>
                              <span class="span-nbsp"></span>-><span
                                class="span-nbsp"
                              ></span>
                              <div
                                v-if="
                                  getStatus(transaction[0]) === 'Open' &&
                                  transaction[0].order.token0Value.length &&
                                  Object.keys(
                                    transaction[0].order.token0Value[0]
                                  )[0] === 'CreditRecord' &&
                                  tokens &&
                                  tokens[transaction[0].token0Id]
                                "
                              >
                                {{
                                  Object.values(
                                    transaction[0].order.token0Value[0]
                                  )[0] |
                                    bigintToFloat(
                                      tokens[transaction[0].token0Id].decimals,
                                      tokens[transaction[0].token0Id].decimals
                                    )
                                }}<span class="span-nbsp"></span
                                >{{ tokens[transaction[0].token0Id].symbol }}
                              </div>
                              <div
                                v-if="
                                  getStatus(transaction[0]) === 'Open' &&
                                  transaction[0].order.token1Value.length &&
                                  Object.keys(
                                    transaction[0].order.token1Value[0]
                                  )[0] === 'CreditRecord' &&
                                  tokens &&
                                  tokens[transaction[0].token1Id]
                                "
                              >
                                {{
                                  Object.values(
                                    transaction[0].order.token1Value[0]
                                  )[0] |
                                    bigintToFloat(
                                      tokens[transaction[0].token1Id].decimals,
                                      tokens[transaction[0].token1Id].decimals
                                    )
                                }}<span class="span-nbsp"></span
                                >{{ tokens[transaction[0].token1Id].symbol }}
                              </div>
                              <div
                                v-if="
                                  getStatus(transaction[0]) === 'Filled' &&
                                  Object.keys(transaction[0].orderMode)[0] ===
                                    'OrderBook' &&
                                  transaction[0].details.length &&
                                  Object.keys(
                                    transaction[0].details[0].token0Value
                                  )[0] === 'CreditRecord' &&
                                  tokens &&
                                  tokens[transaction[0].token0Id]
                                "
                              >
                                {{
                                  Object.values(
                                    transaction[0].details[
                                      transaction[0].details.length - 1
                                    ].token0Value
                                  )[0] |
                                    bigintToFloat(
                                      tokens[transaction[0].token0Id].decimals,
                                      tokens[transaction[0].token0Id].decimals
                                    )
                                }}<span class="span-nbsp"></span
                                >{{ tokens[transaction[0].token0Id].symbol }}
                              </div>
                              <div
                                v-if="
                                  getStatus(transaction[0]) === 'Filled' &&
                                  Object.keys(transaction[0].orderMode)[0] ===
                                    'OrderBook' &&
                                  transaction[0].details.length &&
                                  Object.keys(
                                    transaction[0].details[0].token1Value
                                  )[0] === 'CreditRecord' &&
                                  tokens &&
                                  tokens[transaction[0].token0Id]
                                "
                              >
                                {{
                                  Object.values(
                                    transaction[0].details[
                                      transaction[0].details.length - 1
                                    ].token1Value
                                  )[0] |
                                    bigintToFloat(
                                      tokens[transaction[0].token1Id].decimals,
                                      tokens[transaction[0].token1Id].decimals
                                    )
                                }}<span class="span-nbsp"></span
                                >{{ tokens[transaction[0].token1Id].symbol }}
                              </div>
                            </div>
                          </template>
                          <div
                            class="swap-info"
                            v-if="
                              Object.keys(transaction[0].operation)[0] ===
                              'Swap'
                            "
                          >
                            <span>{{ getStatus(transaction[0]) }}:&nbsp;</span>
                            <div
                              v-if="
                                getStatus(transaction[0]) === 'Open' &&
                                transaction[0].order.token0Value.length &&
                                Object.keys(
                                  transaction[0].order.token0Value[0]
                                )[0] === 'DebitRecord' &&
                                tokens &&
                                tokens[transaction[0].token0Id]
                              "
                            >
                              {{
                                Object.values(
                                  transaction[0].order.token0Value[0]
                                )[0] |
                                  bigintToFloat(
                                    4,
                                    tokens[transaction[0].token0Id].decimals
                                  )
                              }}<span class="span-nbsp"></span
                              >{{ tokens[transaction[0].token0Id].symbol }}
                            </div>
                            <div
                              v-if="
                                getStatus(transaction[0]) === 'Open' &&
                                transaction[0].order.token1Value.length &&
                                Object.keys(
                                  transaction[0].order.token1Value[0]
                                )[0] === 'DebitRecord' &&
                                tokens &&
                                tokens[transaction[0].token1Id]
                              "
                            >
                              {{
                                Object.values(
                                  transaction[0].order.token1Value[0]
                                )[0] |
                                  bigintToFloat(
                                    4,
                                    tokens[transaction[0].token1Id].decimals
                                  )
                              }}<span class="span-nbsp"></span
                              >{{ tokens[transaction[0].token1Id].symbol }}
                            </div>
                            <div
                              v-if="
                                getStatus(transaction[0]) === 'Filled' &&
                                Object.keys(transaction[0].orderMode)[0] ===
                                  'OrderBook' &&
                                transaction[0].details.length &&
                                Object.keys(
                                  transaction[0].details[0].token0Value
                                )[0] === 'DebitRecord' &&
                                tokens &&
                                tokens[transaction[0].token0Id]
                              "
                            >
                              {{
                                Object.values(
                                  transaction[0].details[
                                    transaction[0].details.length - 1
                                  ].token0Value
                                )[0] |
                                  bigintToFloat(
                                    4,
                                    tokens[transaction[0].token0Id].decimals
                                  )
                              }}<span class="span-nbsp"></span
                              >{{ tokens[transaction[0].token0Id].symbol }}
                            </div>
                            <div
                              v-if="
                                getStatus(transaction[0]) === 'Filled' &&
                                Object.keys(transaction[0].orderMode)[0] ===
                                  'OrderBook' &&
                                transaction[0].details.length &&
                                Object.keys(
                                  transaction[0].details[0].token1Value
                                )[0] === 'DebitRecord' &&
                                tokens &&
                                tokens[transaction[0].token0Id]
                              "
                            >
                              {{
                                Object.values(
                                  transaction[0].details[
                                    transaction[0].details.length - 1
                                  ].token1Value
                                )[0] |
                                  bigintToFloat(
                                    4,
                                    tokens[transaction[0].token1Id].decimals
                                  )
                              }}<span class="span-nbsp"></span
                              >{{ tokens[transaction[0].token1Id].symbol }}
                            </div>
                            <span class="span-nbsp"></span>-><span
                              class="span-nbsp"
                            ></span>
                            <div
                              v-if="
                                getStatus(transaction[0]) === 'Open' &&
                                transaction[0].order.token0Value.length &&
                                Object.keys(
                                  transaction[0].order.token0Value[0]
                                )[0] === 'CreditRecord' &&
                                tokens &&
                                tokens[transaction[0].token0Id]
                              "
                            >
                              {{
                                Object.values(
                                  transaction[0].order.token0Value[0]
                                )[0] |
                                  bigintToFloat(
                                    4,
                                    tokens[transaction[0].token0Id].decimals
                                  )
                              }}<span class="span-nbsp"></span
                              >{{ tokens[transaction[0].token0Id].symbol }}
                            </div>
                            <div
                              v-if="
                                getStatus(transaction[0]) === 'Open' &&
                                transaction[0].order.token1Value.length &&
                                Object.keys(
                                  transaction[0].order.token1Value[0]
                                )[0] === 'CreditRecord' &&
                                tokens &&
                                tokens[transaction[0].token1Id]
                              "
                            >
                              {{
                                Object.values(
                                  transaction[0].order.token1Value[0]
                                )[0] |
                                  bigintToFloat(
                                    4,
                                    tokens[transaction[0].token1Id].decimals
                                  )
                              }}<span class="span-nbsp"></span
                              >{{ tokens[transaction[0].token1Id].symbol }}
                            </div>
                            <div
                              v-if="
                                getStatus(transaction[0]) === 'Filled' &&
                                Object.keys(transaction[0].orderMode)[0] ===
                                  'OrderBook' &&
                                transaction[0].details.length &&
                                Object.keys(
                                  transaction[0].details[0].token0Value
                                )[0] === 'CreditRecord' &&
                                tokens &&
                                tokens[transaction[0].token0Id]
                              "
                            >
                              {{
                                Object.values(
                                  transaction[0].details[
                                    transaction[0].details.length - 1
                                  ].token0Value
                                )[0] |
                                  bigintToFloat(
                                    4,
                                    tokens[transaction[0].token0Id].decimals
                                  )
                              }}<span class="span-nbsp"></span
                              >{{ tokens[transaction[0].token0Id].symbol }}
                            </div>
                            <div
                              v-if="
                                getStatus(transaction[0]) === 'Filled' &&
                                Object.keys(transaction[0].orderMode)[0] ===
                                  'OrderBook' &&
                                transaction[0].details.length &&
                                Object.keys(
                                  transaction[0].details[0].token1Value
                                )[0] === 'CreditRecord' &&
                                tokens &&
                                tokens[transaction[0].token0Id]
                              "
                            >
                              {{
                                Object.values(
                                  transaction[0].details[
                                    transaction[0].details.length - 1
                                  ].token1Value
                                )[0] |
                                  bigintToFloat(
                                    4,
                                    tokens[transaction[0].token1Id].decimals
                                  )
                              }}<span class="span-nbsp"></span
                              >{{ tokens[transaction[0].token1Id].symbol }}
                            </div>
                          </div>
                        </a-tooltip>
                        <a-tooltip
                          v-else
                          placement="topLeft"
                          :overlay-style="{
                            whiteSpace: 'nowrap',
                            maxWidth: 'max-content'
                          }"
                        >
                          <template slot="title">
                            <div
                              class="swap-info"
                              v-if="
                                Object.keys(transaction[0].operation)[0] ===
                                'Swap'
                              "
                            >
                              <div
                                v-if="
                                  Object.keys(
                                    transaction[0].filled.token0Value
                                  )[0] === 'DebitRecord' &&
                                  tokens &&
                                  tokens[transaction[0].token0Id]
                                "
                              >
                                <span class="span-nbsp"></span
                                >{{
                                  Object.values(
                                    transaction[0].filled.token0Value
                                  )[0] |
                                    bigintToFloat(
                                      tokens[transaction[0].token0Id].decimals,
                                      tokens[transaction[0].token0Id].decimals
                                    )
                                }}<span class="span-nbsp"></span
                                >{{ tokens[transaction[0].token0Id].symbol }}
                              </div>
                              <div
                                v-if="
                                  Object.keys(
                                    transaction[0].filled.token1Value
                                  )[0] === 'DebitRecord' &&
                                  tokens &&
                                  tokens[transaction[0].token1Id]
                                "
                              >
                                <span class="span-nbsp"></span
                                >{{
                                  Object.values(
                                    transaction[0].filled.token1Value
                                  )[0] |
                                    bigintToFloat(
                                      tokens[transaction[0].token1Id].decimals,
                                      tokens[transaction[0].token1Id].decimals
                                    )
                                }}<span class="span-nbsp"></span
                                >{{ tokens[transaction[0].token1Id].symbol }}
                              </div>
                              <div
                                v-if="
                                  Object.keys(
                                    transaction[0].filled.token0Value
                                  )[0] === 'DebitRecord' &&
                                  transaction[0].token0Id === 'Cycles'
                                "
                              >
                                {{
                                  Object.values(
                                    transaction[0].filled.token0Value
                                  )[0] | bigintToFloat(12, 12)
                                }}<span class="span-nbsp"></span>TCycles
                              </div>
                              <div
                                v-if="
                                  Object.keys(
                                    transaction[0].filled.token1Value
                                  )[0] === 'DebitRecord' &&
                                  transaction[0].token1Id === 'Cycles'
                                "
                              >
                                {{
                                  Object.values(
                                    transaction[0].filled.token1Value
                                  )[0] | bigintToFloat(12, 12)
                                }}<span class="span-nbsp"></span>TCycles
                              </div>
                              <div
                                v-if="
                                  Object.keys(
                                    transaction[0].filled.token0Value
                                  )[0] === 'DebitRecord' &&
                                  transaction[0].token0Id === 'ICP'
                                "
                              >
                                {{
                                  Object.values(
                                    transaction[0].filled.token0Value
                                  )[0] | bigintToFloat(8)
                                }}<span class="span-nbsp"></span>ICP
                              </div>
                              <div
                                v-if="
                                  Object.keys(
                                    transaction[0].filled.token1Value
                                  )[0] === 'DebitRecord' &&
                                  transaction[0].token1Id === 'ICP'
                                "
                              >
                                {{
                                  Object.values(
                                    transaction[0].filled.token1Value
                                  )[0] | bigintToFloat(8)
                                }}<span class="span-nbsp"></span>ICP
                              </div>
                              <span class="span-nbsp"></span>-><span
                                class="span-nbsp"
                              ></span>
                              <div
                                v-if="
                                  Object.keys(
                                    transaction[0].filled.token0Value
                                  )[0] === 'CreditRecord' &&
                                  tokens &&
                                  tokens[transaction[0].token0Id]
                                "
                              >
                                <span class="span-nbsp"></span
                                >{{
                                  Object.values(
                                    transaction[0].filled.token0Value
                                  )[0] |
                                    bigintToFloat(
                                      tokens[transaction[0].token0Id].decimals,
                                      tokens[transaction[0].token0Id].decimals
                                    )
                                }}<span class="span-nbsp"></span
                                >{{ tokens[transaction[0].token0Id].symbol }}
                              </div>
                              <div
                                v-if="
                                  Object.keys(
                                    transaction[0].filled.token1Value
                                  )[0] === 'CreditRecord' &&
                                  tokens &&
                                  tokens[transaction[0].token1Id]
                                "
                              >
                                <span class="span-nbsp"></span
                                >{{
                                  Object.values(
                                    transaction[0].filled.token1Value
                                  )[0] |
                                    bigintToFloat(
                                      tokens[transaction[0].token1Id].decimals,
                                      tokens[transaction[0].token1Id].decimals
                                    )
                                }}<span class="span-nbsp"></span
                                >{{ tokens[transaction[0].token1Id].symbol }}
                              </div>
                              <div
                                v-if="
                                  Object.keys(
                                    transaction[0].filled.token0Value
                                  )[0] === 'CreditRecord' &&
                                  transaction[0].token0Id === 'Cycles'
                                "
                              >
                                {{
                                  Object.values(
                                    transaction[0].filled.token0Value
                                  )[0] | bigintToFloat(12, 12)
                                }}<span class="span-nbsp"></span>TCycles
                              </div>
                              <div
                                v-if="
                                  Object.keys(
                                    transaction[0].filled.token1Value
                                  )[0] === 'CreditRecord' &&
                                  transaction[0].token1Id === 'Cycles'
                                "
                              >
                                {{
                                  Object.values(
                                    transaction[0].filled.token1Value
                                  )[0] | bigintToFloat(12, 12)
                                }}<span class="span-nbsp"></span>TCycles
                              </div>
                              <div
                                v-if="
                                  Object.keys(
                                    transaction[0].filled.token0Value
                                  )[0] === 'CreditRecord' &&
                                  transaction[0].token0Id === 'ICP'
                                "
                              >
                                {{
                                  Object.values(
                                    transaction[0].filled.token0Value
                                  )[0] | bigintToFloat(8)
                                }}<span class="span-nbsp"></span>ICP
                              </div>
                              <div
                                v-if="
                                  Object.keys(
                                    transaction[0].filled.token1Value
                                  )[0] === 'CreditRecord' &&
                                  transaction[0].token1Id === 'ICP'
                                "
                              >
                                {{
                                  Object.values(
                                    transaction[0].filled.token1Value
                                  )[0] | bigintToFloat(8)
                                }}<span class="span-nbsp"></span>ICP
                              </div>
                            </div>
                            <div
                              class="swap-info"
                              v-if="
                                Object.keys(transaction[0].operation)[0] ===
                                'AddLiquidity'
                              "
                            >
                              <div v-if="transaction[0].token0Id === 'Cycles'">
                                {{
                                  Object.values(
                                    transaction[0].filled.token0Value
                                  )[0] | bigintToFloat(12, 12)
                                }}<span class="span-nbsp"></span>TCycles
                              </div>
                              <div v-if="transaction[0].token0Id === 'ICP'">
                                {{
                                  Object.values(
                                    transaction[0].filled.token0Value
                                  )[0] | bigintToFloat(8)
                                }}<span class="span-nbsp"></span>ICP
                              </div>
                              <div
                                v-if="tokens && tokens[transaction[0].token0Id]"
                              >
                                <span class="span-nbsp"></span
                                >{{
                                  Object.values(
                                    transaction[0].filled.token0Value
                                  )[0] |
                                    bigintToFloat(
                                      tokens[transaction[0].token0Id].decimals,
                                      tokens[transaction[0].token0Id].decimals
                                    )
                                }}<span class="span-nbsp"></span
                                >{{ tokens[transaction[0].token0Id].symbol }}
                              </div>
                              <span class="span-nbsp"></span
                              ><a-icon type="plus" /><span
                                class="span-nbsp"
                              ></span>
                              <div v-if="transaction[0].token1Id === 'Cycles'">
                                {{
                                  Object.values(
                                    transaction[0].filled.token1Value
                                  )[0] | bigintToFloat(12, 12)
                                }}<span class="span-nbsp"></span>TCycles
                              </div>
                              <div v-if="transaction[0].token1Id === 'ICP'">
                                {{
                                  Object.values(
                                    transaction[0].filled.token1Value
                                  )[0] | bigintToFloat(8)
                                }}<span class="span-nbsp"></span>ICP
                              </div>
                              <div
                                v-if="tokens && tokens[transaction[0].token1Id]"
                              >
                                <span class="span-nbsp"></span
                                >{{
                                  Object.values(
                                    transaction[0].filled.token1Value
                                  )[0] |
                                    bigintToFloat(
                                      tokens[transaction[0].token1Id].decimals,
                                      tokens[transaction[0].token1Id].decimals
                                    )
                                }}<span class="span-nbsp"></span
                                >{{ tokens[transaction[0].token1Id].symbol }}
                              </div>
                              <div
                                v-if="
                                  transaction[0].shares &&
                                  swaps[transaction[3].toString()]
                                "
                              >
                                <span class="span-nbsp"></span>-><span
                                  class="span-nbsp"
                                ></span
                                >{{
                                  transaction[0].shares |
                                    filterShare(
                                      swaps[transaction[3].toString()].decimals,
                                      swaps[transaction[3].toString()].decimals
                                    )
                                }}<span class="span-nbsp"></span>Shares
                              </div>
                            </div>
                            <div
                              class="swap-info"
                              v-if="
                                Object.keys(transaction[0].operation)[0] ===
                                'Claim'
                              "
                            >
                              <div v-if="transaction[0].token0Id === 'Cycles'">
                                {{
                                  Object.values(
                                    transaction[0].filled.token0Value
                                  )[0] | bigintToFloat(12, 12)
                                }}<span class="span-nbsp"></span>TCycles
                              </div>
                              <div v-if="transaction[0].token0Id === 'ICP'">
                                {{
                                  Object.values(
                                    transaction[0].filled.token0Value
                                  )[0] | bigintToFloat(8)
                                }}<span class="span-nbsp"></span>ICP
                              </div>
                              <div
                                v-if="tokens && tokens[transaction[0].token0Id]"
                              >
                                <span class="span-nbsp"></span
                                >{{
                                  Object.values(
                                    transaction[0].filled.token0Value
                                  )[0] |
                                    bigintToFloat(
                                      tokens[transaction[0].token0Id].decimals,
                                      tokens[transaction[0].token0Id].decimals
                                    )
                                }}<span class="span-nbsp"></span
                                >{{ tokens[transaction[0].token0Id].symbol }}
                              </div>
                              <span class="span-nbsp"></span
                              ><a-icon type="plus" /><span
                                class="span-nbsp"
                              ></span>
                              <div v-if="transaction[0].token1Id === 'Cycles'">
                                {{
                                  Object.values(
                                    transaction[0].filled.token1Value
                                  )[0] | bigintToFloat(12, 12)
                                }}<span class="span-nbsp"></span>TCycles
                              </div>
                              <div v-if="transaction[0].token1Id === 'ICP'">
                                {{
                                  Object.values(
                                    transaction[0].filled.token1Value
                                  )[0] | bigintToFloat(8)
                                }}<span class="span-nbsp"></span>ICP
                              </div>
                              <div
                                v-if="tokens && tokens[transaction[0].token1Id]"
                              >
                                <span class="span-nbsp"></span
                                >{{
                                  Object.values(
                                    transaction[0].filled.token1Value
                                  )[0] |
                                    bigintToFloat(
                                      tokens[transaction[0].token1Id].decimals,
                                      tokens[transaction[0].token1Id].decimals
                                    )
                                }}<span class="span-nbsp"></span
                                >{{ tokens[transaction[0].token1Id].symbol }}
                              </div>
                            </div>
                            <div
                              class="swap-info"
                              v-if="
                                Object.keys(transaction[0].operation)[0] ===
                                'RemoveLiquidity'
                              "
                            >
                              <div
                                v-if="
                                  transaction[0].shares &&
                                  swaps[transaction[3].toString()]
                                "
                              >
                                {{
                                  transaction[0].shares |
                                    filterShare(
                                      swaps[transaction[3].toString()].decimals,
                                      swaps[transaction[3].toString()].decimals
                                    )
                                }}
                                Shares<span class="span-nbsp"></span>-><span
                                  class="span-nbsp"
                                ></span>
                              </div>
                              <div v-if="transaction[0].token0Id === 'Cycles'">
                                {{
                                  Object.values(
                                    transaction[0].filled.token0Value
                                  )[0] | bigintToFloat(12, 12)
                                }}<span class="span-nbsp"></span>TCycles
                              </div>
                              <div v-if="transaction[0].token0Id === 'ICP'">
                                {{
                                  Object.values(
                                    transaction[0].filled.token0Value
                                  )[0] | bigintToFloat(8)
                                }}<span class="span-nbsp"></span>ICP
                              </div>
                              <div
                                v-if="tokens && tokens[transaction[0].token0Id]"
                              >
                                <span class="span-nbsp"></span
                                >{{
                                  Object.values(
                                    transaction[0].filled.token0Value
                                  )[0] |
                                    bigintToFloat(
                                      tokens[transaction[0].token0Id].decimals,
                                      tokens[transaction[0].token0Id].decimals
                                    )
                                }}<span class="span-nbsp"></span
                                >{{ tokens[transaction[0].token0Id].symbol }}
                              </div>
                              <span class="span-nbsp"></span
                              ><a-icon type="plus" /><span
                                class="span-nbsp"
                              ></span>
                              <div v-if="transaction[0].token1Id === 'Cycles'">
                                {{
                                  Object.values(
                                    transaction[0].filled.token1Value
                                  )[0] | bigintToFloat(12, 12)
                                }}<span class="span-nbsp"></span>TCycles
                              </div>
                              <div v-if="transaction[0].token1Id === 'ICP'">
                                {{
                                  Object.values(
                                    transaction[0].filled.token1Value
                                  )[0] | bigintToFloat(8)
                                }}<span class="span-nbsp"></span>ICP
                              </div>
                              <div
                                v-if="tokens && tokens[transaction[0].token1Id]"
                              >
                                <span class="span-nbsp"></span
                                >{{
                                  Object.values(
                                    transaction[0].filled.token1Value
                                  )[0] |
                                    bigintToFloat(
                                      tokens[transaction[0].token1Id].decimals,
                                      tokens[transaction[0].token1Id].decimals
                                    )
                                }}<span class="span-nbsp"></span
                                >{{ tokens[transaction[0].token1Id].symbol }}
                              </div>
                            </div>
                          </template>
                          <div
                            class="swap-info"
                            v-if="
                              Object.keys(transaction[0].operation)[0] ===
                              'Swap'
                            "
                          >
                            <div
                              v-if="
                                Object.keys(
                                  transaction[0].filled.token0Value
                                )[0] === 'DebitRecord' &&
                                tokens &&
                                tokens[transaction[0].token0Id]
                              "
                            >
                              <span class="span-nbsp"></span
                              >{{
                                Object.values(
                                  transaction[0].filled.token0Value
                                )[0] |
                                  bigintToFloat(
                                    4,
                                    tokens[transaction[0].token0Id].decimals
                                  )
                              }}<span class="span-nbsp"></span
                              >{{ tokens[transaction[0].token0Id].symbol }}
                            </div>
                            <div
                              v-if="
                                Object.keys(
                                  transaction[0].filled.token1Value
                                )[0] === 'DebitRecord' &&
                                tokens &&
                                tokens[transaction[0].token1Id]
                              "
                            >
                              <span class="span-nbsp"></span
                              >{{
                                Object.values(
                                  transaction[0].filled.token1Value
                                )[0] |
                                  bigintToFloat(
                                    4,
                                    tokens[transaction[0].token1Id].decimals
                                  )
                              }}<span class="span-nbsp"></span
                              >{{ tokens[transaction[0].token1Id].symbol }}
                            </div>
                            <div
                              v-if="
                                Object.keys(
                                  transaction[0].filled.token0Value
                                )[0] === 'DebitRecord' &&
                                transaction[0].token0Id === 'Cycles'
                              "
                            >
                              {{
                                Object.values(
                                  transaction[0].filled.token0Value
                                )[0] | bigintToFloat(4, 12)
                              }}<span class="span-nbsp"></span>TCycles
                            </div>
                            <div
                              v-if="
                                Object.keys(
                                  transaction[0].filled.token1Value
                                )[0] === 'DebitRecord' &&
                                transaction[0].token1Id === 'Cycles'
                              "
                            >
                              {{
                                Object.values(
                                  transaction[0].filled.token1Value
                                )[0] | bigintToFloat(4, 12)
                              }}<span class="span-nbsp"></span>TCycles
                            </div>
                            <div
                              v-if="
                                Object.keys(
                                  transaction[0].filled.token0Value
                                )[0] === 'DebitRecord' &&
                                transaction[0].token0Id === 'ICP'
                              "
                            >
                              {{
                                Object.values(
                                  transaction[0].filled.token0Value
                                )[0] | bigintToFloat(4)
                              }}<span class="span-nbsp"></span>ICP
                            </div>
                            <div
                              v-if="
                                Object.keys(
                                  transaction[0].filled.token1Value
                                )[0] === 'DebitRecord' &&
                                transaction[0].token1Id === 'ICP'
                              "
                            >
                              {{
                                Object.values(
                                  transaction[0].filled.token1Value
                                )[0] | bigintToFloat(4)
                              }}<span class="span-nbsp"></span>ICP
                            </div>
                            <span class="span-nbsp"></span>-><span
                              class="span-nbsp"
                            ></span>
                            <div
                              v-if="
                                Object.keys(
                                  transaction[0].filled.token0Value
                                )[0] === 'CreditRecord' &&
                                tokens &&
                                tokens[transaction[0].token0Id]
                              "
                            >
                              <span class="span-nbsp"></span
                              >{{
                                Object.values(
                                  transaction[0].filled.token0Value
                                )[0] |
                                  bigintToFloat(
                                    4,
                                    tokens[transaction[0].token0Id].decimals
                                  )
                              }}<span class="span-nbsp"></span
                              >{{ tokens[transaction[0].token0Id].symbol }}
                            </div>
                            <div
                              v-if="
                                Object.keys(
                                  transaction[0].filled.token1Value
                                )[0] === 'CreditRecord' &&
                                tokens &&
                                tokens[transaction[0].token1Id]
                              "
                            >
                              <span class="span-nbsp"></span
                              >{{
                                Object.values(
                                  transaction[0].filled.token1Value
                                )[0] |
                                  bigintToFloat(
                                    4,
                                    tokens[transaction[0].token1Id].decimals
                                  )
                              }}<span class="span-nbsp"></span
                              >{{ tokens[transaction[0].token1Id].symbol }}
                            </div>
                            <div
                              v-if="
                                Object.keys(
                                  transaction[0].filled.token0Value
                                )[0] === 'CreditRecord' &&
                                transaction[0].token0Id === 'Cycles'
                              "
                            >
                              {{
                                Object.values(
                                  transaction[0].filled.token0Value
                                )[0] | bigintToFloat(4, 12)
                              }}<span class="span-nbsp"></span>TCycles
                            </div>
                            <div
                              v-if="
                                Object.keys(
                                  transaction[0].filled.token1Value
                                )[0] === 'CreditRecord' &&
                                transaction[0].token1Id === 'Cycles'
                              "
                            >
                              {{
                                Object.values(
                                  transaction[0].filled.token1Value
                                )[0] | bigintToFloat(4, 12)
                              }}<span class="span-nbsp"></span>TCycles
                            </div>
                            <div
                              v-if="
                                Object.keys(
                                  transaction[0].filled.token0Value
                                )[0] === 'CreditRecord' &&
                                transaction[0].token0Id === 'ICP'
                              "
                            >
                              {{
                                Object.values(
                                  transaction[0].filled.token0Value
                                )[0] | bigintToFloat(4)
                              }}<span class="span-nbsp"></span>ICP
                            </div>
                            <div
                              v-if="
                                Object.keys(
                                  transaction[0].filled.token1Value
                                )[0] === 'CreditRecord' &&
                                transaction[0].token1Id === 'ICP'
                              "
                            >
                              {{
                                Object.values(
                                  transaction[0].filled.token1Value
                                )[0] | bigintToFloat(4)
                              }}<span class="span-nbsp"></span>ICP
                            </div>
                          </div>
                          <div
                            class="swap-info"
                            v-if="
                              Object.keys(transaction[0].operation)[0] ===
                              'AddLiquidity'
                            "
                          >
                            <div v-if="transaction[0].token0Id === 'Cycles'">
                              {{
                                Object.values(
                                  transaction[0].filled.token0Value
                                )[0] | bigintToFloat(4, 12)
                              }}<span class="span-nbsp"></span>TCycles
                            </div>
                            <div v-if="transaction[0].token0Id === 'ICP'">
                              {{
                                Object.values(
                                  transaction[0].filled.token0Value
                                )[0] | bigintToFloat(4)
                              }}<span class="span-nbsp"></span>ICP
                            </div>
                            <div
                              v-if="tokens && tokens[transaction[0].token0Id]"
                            >
                              <span class="span-nbsp"></span
                              >{{
                                Object.values(
                                  transaction[0].filled.token0Value
                                )[0] |
                                  bigintToFloat(
                                    4,
                                    tokens[transaction[0].token0Id].decimals
                                  )
                              }}<span class="span-nbsp"></span
                              >{{ tokens[transaction[0].token0Id].symbol }}
                            </div>
                            <span class="span-nbsp"></span
                            ><a-icon type="plus" /><span
                              class="span-nbsp"
                            ></span>
                            <div v-if="transaction[0].token1Id === 'Cycles'">
                              {{
                                Object.values(
                                  transaction[0].filled.token1Value
                                )[0] | bigintToFloat(4, 12)
                              }}<span class="span-nbsp"></span>TCycles
                            </div>
                            <div v-if="transaction[0].token1Id === 'ICP'">
                              {{
                                Object.values(
                                  transaction[0].filled.token1Value
                                )[0] | bigintToFloat(4)
                              }}<span class="span-nbsp"></span>ICP
                            </div>
                            <div
                              v-if="tokens && tokens[transaction[0].token1Id]"
                            >
                              <span class="span-nbsp"></span
                              >{{
                                Object.values(
                                  transaction[0].filled.token1Value
                                )[0] |
                                  bigintToFloat(
                                    4,
                                    tokens[transaction[0].token1Id].decimals
                                  )
                              }}<span class="span-nbsp"></span
                              >{{ tokens[transaction[0].token1Id].symbol }}
                            </div>
                            <div
                              v-if="
                                transaction[0].shares &&
                                swaps[transaction[3].toString()]
                              "
                            >
                              <span class="span-nbsp"></span>-><span
                                class="span-nbsp"
                              ></span
                              >{{
                                transaction[0].shares |
                                  filterShare(
                                    swaps[transaction[3].toString()].decimals,
                                    4
                                  )
                              }}<span class="span-nbsp"></span>Shares
                            </div>
                          </div>
                          <div
                            class="swap-info"
                            v-if="
                              Object.keys(transaction[0].operation)[0] ===
                              'Claim'
                            "
                          >
                            <div v-if="transaction[0].token0Id === 'Cycles'">
                              {{
                                Object.values(
                                  transaction[0].filled.token0Value
                                )[0] | bigintToFloat(4, 12)
                              }}<span class="span-nbsp"></span>TCycles
                            </div>
                            <div v-if="transaction[0].token0Id === 'ICP'">
                              {{
                                Object.values(
                                  transaction[0].filled.token0Value
                                )[0] | bigintToFloat(4)
                              }}<span class="span-nbsp"></span>ICP
                            </div>
                            <div
                              v-if="tokens && tokens[transaction[0].token0Id]"
                            >
                              <span class="span-nbsp"></span
                              >{{
                                Object.values(
                                  transaction[0].filled.token0Value
                                )[0] |
                                  bigintToFloat(
                                    4,
                                    tokens[transaction[0].token0Id].decimals
                                  )
                              }}<span class="span-nbsp"></span
                              >{{ tokens[transaction[0].token0Id].symbol }}
                            </div>
                            <span class="span-nbsp"></span
                            ><a-icon type="plus" /><span
                              class="span-nbsp"
                            ></span>
                            <div v-if="transaction[0].token1Id === 'Cycles'">
                              {{
                                Object.values(
                                  transaction[0].filled.token1Value
                                )[0] | bigintToFloat(4, 12)
                              }}<span class="span-nbsp"></span>TCycles
                            </div>
                            <div v-if="transaction[0].token1Id === 'ICP'">
                              {{
                                Object.values(
                                  transaction[0].filled.token1Value
                                )[0] | bigintToFloat(4)
                              }}<span class="span-nbsp"></span>ICP
                            </div>
                            <div
                              v-if="tokens && tokens[transaction[0].token1Id]"
                            >
                              <span class="span-nbsp"></span
                              >{{
                                Object.values(
                                  transaction[0].filled.token1Value
                                )[0] |
                                  bigintToFloat(
                                    4,
                                    tokens[transaction[0].token1Id].decimals
                                  )
                              }}<span class="span-nbsp"></span
                              >{{ tokens[transaction[0].token1Id].symbol }}
                            </div>
                          </div>
                          <div
                            class="swap-info"
                            v-if="
                              Object.keys(transaction[0].operation)[0] ===
                              'RemoveLiquidity'
                            "
                          >
                            <div
                              v-if="
                                transaction[0].shares &&
                                swaps[transaction[3].toString()]
                              "
                            >
                              {{
                                transaction[0].shares |
                                  filterShare(
                                    swaps[transaction[3].toString()].decimals,
                                    4
                                  )
                              }}
                              Shares<span class="span-nbsp"></span>-><span
                                class="span-nbsp"
                              ></span>
                            </div>
                            <div v-if="transaction[0].token0Id === 'Cycles'">
                              {{
                                Object.values(
                                  transaction[0].filled.token0Value
                                )[0] | bigintToFloat(4, 12)
                              }}<span class="span-nbsp"></span>TCycles
                            </div>
                            <div v-if="transaction[0].token0Id === 'ICP'">
                              {{
                                Object.values(
                                  transaction[0].filled.token0Value
                                )[0] | bigintToFloat(4)
                              }}<span class="span-nbsp"></span>ICP
                            </div>
                            <div
                              v-if="tokens && tokens[transaction[0].token0Id]"
                            >
                              <span class="span-nbsp"></span
                              >{{
                                Object.values(
                                  transaction[0].filled.token0Value
                                )[0] |
                                  bigintToFloat(
                                    4,
                                    tokens[transaction[0].token0Id].decimals
                                  )
                              }}<span class="span-nbsp"></span
                              >{{ tokens[transaction[0].token0Id].symbol }}
                            </div>
                            <span class="span-nbsp"></span
                            ><a-icon type="plus" /><span
                              class="span-nbsp"
                            ></span>
                            <div v-if="transaction[0].token1Id === 'Cycles'">
                              {{
                                Object.values(
                                  transaction[0].filled.token1Value
                                )[0] | bigintToFloat(4, 12)
                              }}<span class="span-nbsp"></span>TCycles
                            </div>
                            <div v-if="transaction[0].token1Id === 'ICP'">
                              {{
                                Object.values(
                                  transaction[0].filled.token1Value
                                )[0] | bigintToFloat(4)
                              }}<span class="span-nbsp"></span>ICP
                            </div>
                            <div
                              v-if="tokens && tokens[transaction[0].token1Id]"
                            >
                              <span class="span-nbsp"></span
                              >{{
                                Object.values(
                                  transaction[0].filled.token1Value
                                )[0] |
                                  bigintToFloat(
                                    4,
                                    tokens[transaction[0].token1Id].decimals
                                  )
                              }}<span class="span-nbsp"></span
                              >{{ tokens[transaction[0].token1Id].symbol }}
                            </div>
                          </div>
                        </a-tooltip>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </a-spin>
        </div>
        <div class="view-all">
          <router-link :to="jumpRouter('/swaps/txs')">
            <a-button type="primary">View more transactions</a-button>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import BigNumber from 'bignumber.js';
import { DRC205ProxyService } from '@/ic/DRC205Proxy/DRC205ProxyService';
import { AppId, Stats } from '@/ic/DRC205Proxy/model';
import { DRC205BucketService } from '@/ic/DRC205Bucket/DRC205BucketService';
import { SwapInfo, TokenId, TokenInfo, Txid } from '@/ic/common/icType';
import { LatestTransaction } from './model';
import { toHexString } from '@/ic/converter';
import { getSwapInfo } from '@/ic/getSwapInfo';
import { getLogo, getTokenInfo } from '@/ic/getTokenInfo';
import { ShareChange, TokenType, TxnRecord } from '@/ic/DRC205Bucket/model';
import { ICSwapRouterService } from '@/ic/ICSwapRouter/ICSwapRouterService';
import { PairResponse, TrieListData } from '@/ic/ICSwapRouter/model';
import { Principal } from '@dfinity/principal/lib/cjs';
import { CYCLES_FINANCE_CANISTER_ID, LEDGER_CANISTER_ID } from '@/ic/utils';

let tokenIds = [];

@Component({
  name: 'Index',
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
    },
    filterShare(val: ShareChange, decimals: number, decimalPlaces?): string {
      if (val) {
        const share = Object.values(val);
        if (share) {
          if (decimals) {
            return new BigNumber(share.toString())
              .div(10 ** decimals)
              .decimalPlaces(decimalPlaces ? decimalPlaces : 4, 1)
              .toString(10);
          } else {
            return share.toString();
          }
        } else {
          return '-';
        }
      } else {
        return '-';
      }
    }
  }
})
export default class extends Vue {
  private DRC205ProxyService: DRC205ProxyService;
  private ICSwapRouterService: ICSwapRouterService;
  private stats: Stats = null;
  private spinning = false;
  private latestTransactions: Array<LatestTransaction> = [];
  private swaps: { [key: string]: SwapInfo };
  private tokens: { [key: string]: TokenInfo } = {};
  private ellipsisNumber = 20;
  private pairs: Array<TrieListData> = [];
  private pairsSpinning = false;
  private icpPrice = '';
  private pairTotalVol = '0'; // usd
  private innerWidth =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth;
  mounted(): void {
    tokenIds = [];
    window.onresize = () => {
      this.innerWidth =
        window.innerWidth ||
        document.documentElement.clientWidth ||
        document.body.clientWidth;
    };
    if (this.innerWidth >= 1100) {
      this.ellipsisNumber = 20;
    } else if (this.innerWidth >= 768) {
      this.ellipsisNumber = 10;
    } else {
      this.ellipsisNumber = 4;
    }
  }
  @Watch('innerWidth')
  private onresize(innerWidth: number) {
    if (innerWidth >= 1100) {
      this.ellipsisNumber = 20;
    } else if (innerWidth >= 768) {
      this.ellipsisNumber = 10;
    } else {
      this.ellipsisNumber = 4;
    }
  }
  @Watch('$route')
  private onRouteChange() {
    this.latestTransactions = [];
    this.init();
  }
  created(): void {
    this.init();
  }
  private init(): void {
    this.stats = JSON.parse(localStorage.getItem('swapStats'));
    this.swaps = JSON.parse(localStorage.getItem('swaps')) || {};
    this.tokens = JSON.parse(localStorage.getItem('tokens')) || {};
    this.DRC205ProxyService = new DRC205ProxyService();
    this.ICSwapRouterService = new ICSwapRouterService();
    this.getStats();
    this.getLatestTransactions();
    this.getPairs();
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
      const res = await this.ICSwapRouterService.getPairs2();
      console.log(res);
      if (res && res.data) {
        res.data.forEach((item) => {
          const token1Symbol = item[1].pair.token1[1];
          if (!token1Symbol.toLocaleLowerCase().includes('test')) {
            let currentPrice = '1';
            if (token1Symbol.toLocaleLowerCase() === 'icp') {
              currentPrice = this.icpPrice;
            }
            this.pairTotalVol = new BigNumber(
              item[1].liquidity[0].vol.value1.toString(10)
            )
              .times(currentPrice)
              .plus(this.pairTotalVol)
              .toString(10);
          }
        });
        console.log(this.pairTotalVol);
        this.pairs = res.data
          .sort((a, b) => {
            return Number(
              new BigNumber(b[1].score.toString(10)).minus(
                a[1].score.toString(10)
              )
            );
          })
          .slice(0, 5);
        this.pairs.forEach((pair) => {
          const token0Id = pair[1].pair.token0[0];
          const token1Id = pair[1].pair.token1[0];
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
      }
      console.log(this.pairs);
    } catch (e) {
      console.error(e);
    }
    this.pairsSpinning = false;
  }
  private async getLogo(tokenId: string): Promise<boolean> {
    if (!tokenIds.includes(tokenId)) {
      tokenIds.push(tokenId);
    } else {
      return !!this.tokens[tokenId].logo;
    }
    let logo = '';
    if (this.tokens[tokenId] && !this.tokens[tokenId].logo) {
      logo = await getLogo(
        Principal.fromText(tokenId),
        this.tokens[tokenId].tokenStd
      );
      this.$set(this.tokens[tokenId], 'logo', logo);
    }
    return !!this.tokens[tokenId].logo;
  }
  private async getStats(): Promise<void> {
    this.stats = await this.DRC205ProxyService.stats();
    localStorage.setItem(
      'swapStats',
      JSON.stringify(
        this.stats,
        (key, value) => (typeof value === 'bigint' ? value.toString() : value) // return everything else unchanged
      )
    );
  }
  private async getLatestTransactions(): Promise<void> {
    this.spinning = true;
    try {
      const lastTxns = await this.DRC205ProxyService.getLastTxns();
      const txnIndex: { [key: string]: number } = {};
      if (lastTxns && lastTxns.length) {
        const lastIndex = Math.min(lastTxns.length, 10);
        const promiseAllValue = [];
        for (let i = 0; i < lastIndex; i++) {
          if (
            !txnIndex[this.txidToHexString(lastTxns[i][3])] &&
            txnIndex[this.txidToHexString(lastTxns[i][3])] !== 0
          ) {
            txnIndex[this.txidToHexString(lastTxns[i][3])] = 0;
          } else {
            txnIndex[this.txidToHexString(lastTxns[i][3])] =
              txnIndex[this.txidToHexString(lastTxns[i][3])] + 1;
          }
          promiseAllValue.push(
            this.getTransaction(
              lastTxns[i][0],
              lastTxns[i][1],
              lastTxns[i][3],
              txnIndex[this.txidToHexString(lastTxns[i][3])]
            )
          );
          const appId = lastTxns[i][1].toString();
          if (!this.swaps[appId]) {
            try {
              this.swaps[appId] = await getSwapInfo(lastTxns[i][1]);
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
        this.latestTransactions = await Promise.all(promiseAllValue);
        console.log(this.latestTransactions);
      }
    } catch (e) {
      console.log(e);
    }
    this.spinning = false;
  }
  private async getTransaction(
    index: bigint,
    appId: AppId,
    txid: Txid,
    txnIndex: number
  ): Promise<LatestTransaction | []> {
    try {
      let step = 0;
      return await this.getTxn(appId, txid, step, index, txnIndex);
    } catch (e) {
      console.log(e);
      return [];
    }
  }
  private getTokenId(tokenType: TokenType): string {
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
        getTokenInfo(tokenId).then((tokenInfo) => {
          this.tokens[tokenId.toString()] = tokenInfo;
          this.$forceUpdate();
        });
      }
      return tokenId.toString();
    } else {
      if ((tokenType as { Cycles: null }).Cycles === null) {
        return CYCLES_FINANCE_CANISTER_ID;
      } else if ((tokenType as { Icp: null }).Icp === null) {
        return LEDGER_CANISTER_ID;
      }
    }
  }
  private async getTxn(
    appId: AppId,
    txid: Txid,
    step: number,
    index: bigint,
    txnIndex: number
  ): Promise<LatestTransaction | []> {
    const bucket = await this.DRC205ProxyService.bucket(
      appId,
      txid,
      BigInt(step)
    );
    if ((bucket && !bucket[0]) || !bucket) {
      return [];
    } else {
      const currentDRC205BucketService = new DRC205BucketService(
        bucket[0].toString()
      );
      let latestTransaction: LatestTransaction;
      const txn = await currentDRC205BucketService.txnHistory(appId, txid);
      if (txn && txn.length) {
        txn.reverse();
      }
      if (txn && txn[txnIndex]) {
        latestTransaction = [...txn[txnIndex], index, appId];
        latestTransaction[0].token0Id = this.getTokenId(
          latestTransaction[0].token0
        );
        latestTransaction[0].token1Id = this.getTokenId(
          latestTransaction[0].token1
        );
        return latestTransaction;
      } else {
        return await this.getTxn(appId, txid, ++step, index, txnIndex);
      }
    }
  }
  private txidToHexString = (val: Array<number>): string => {
    return toHexString(new Uint8Array(val));
  };
  private jumpRouter(url: string): string {
    if (this.$route.meta && this.$route.meta.type === 'Test') {
      url = '/swapsTest' + url;
    }
    return url;
  }
  private jumpTokensTest(url: string): string {
    if (this.$route.meta && this.$route.meta.type === 'Test') {
      url = '/tokensTest' + url;
    }
    return url;
  }
  private getOrderMode(val: { AMM: null } | { OrderBook: null }): string {
    if (val) {
      return Object.keys(val)[0];
    }
    return '';
  }
  private orderBookDetails(val: TxnRecord, isValue0 = true): bigint {
    let total = BigInt(0);
    if (val.details && val.details.length) {
      val.details.forEach((item) => {
        let value;
        if (isValue0) {
          value = Object.values(item.token0Value)[0];
        } else {
          value = Object.values(item.token1Value)[0];
        }
        total = BigInt(
          new BigNumber(total.toString(10))
            .plus(value.toString(10))
            .toString(10)
        );
      });
      return total;
    }
    return BigInt(0);
  }
  private getStatus(val: TxnRecord): string {
    if (val) {
      const status = Object.keys(val.status)[0];
      if (status === 'Pending' && !val.details.length) {
        return 'Open';
      }
      if (
        (status === 'Pending' && val.details.length) ||
        status === 'Completed'
      ) {
        return 'Filled';
      }
      return status;
    }
  }
}
</script>

<style scoped lang="scss">
.swap-info {
  display: flex;
  align-items: center;
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
@media screen and (min-width: 1200px) {
  .latest-transactions-main-pairs {
    td {
      min-width: 180px;
    }
  }
}
</style>
