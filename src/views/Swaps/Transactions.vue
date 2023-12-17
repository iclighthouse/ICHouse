<template>
  <div class="swaps-transactions">
    <div class="swaps-transactions-title">Latest Transactions</div>
    <div class="transactions-main">
      <a-spin :spinning="spinning">
        <table>
          <thead class="ant-table-thead">
            <tr>
              <th>Index</th>
              <th>Operation</th>
              <th>Swapping Pair</th>
              <th>Txid</th>
              <th>Account</th>
              <th>Swap</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody class="ant-table-tbody">
            <tr
              v-for="(transaction, index) in currentLatestTransactions"
              :key="index"
            >
              <td
                class="transaction-type"
                style="word-break: keep-all; white-space: nowrap"
              >
                <span v-if="transaction && transaction[2]">{{
                  transaction[2].toString()
                }}</span>
              </td>
              <td>
                <span v-if="transaction && transaction[0]">{{
                  Object.keys(transaction[0].operation)[0]
                }}</span>
              </td>
              <td>
                <router-link
                  class="swap-id-info"
                  v-if="
                    transaction &&
                    transaction[0] &&
                    transaction[3] &&
                    swaps[transaction[3].toString()]
                  "
                  :to="jumpRouter(`/swap/${transaction[3].toString()}`)"
                >
                  <span>{{ transaction[3].toString() | ellipsis(5) }}</span
                  ><span class="span-nbsp"></span
                  ><span>({{ swaps[transaction[3].toString()].name }})</span>
                </router-link>
              </td>
              <td>
                <router-link
                  v-if="transaction && transaction[0]"
                  :to="
                    jumpRouter(
                      `/swap/${transaction[3].toString()}/${txidToHexString(
                        transaction[0].txid
                      )}`
                    )
                  "
                  style="word-break: keep-all"
                  >{{ transaction[0].txid | txidToHex | ellipsis }}
                </router-link>
              </td>
              <td>
                <div
                  v-if="
                    isICRC && transaction[0] && transaction[0].msgCaller.length
                  "
                >
                  <router-link
                    v-if="transaction && transaction[0] && transaction[3]"
                    :to="
                      jumpRouter(
                        `/swap/address/${transaction[3].toString()}/${transaction[0].msgCaller[0].toString()}`
                      )
                    "
                    style="word-break: keep-all"
                  >
                    {{ transaction[0].account | txidToHex | ellipsis }}
                  </router-link>
                </div>
                <div
                  v-if="
                    !isICRC ||
                    (transaction[0] && !transaction[0].msgCaller.length)
                  "
                >
                  <router-link
                    v-if="transaction && transaction[0] && transaction[3]"
                    :to="
                      jumpRouter(
                        `/swap/address/${transaction[3].toString()}/${txidToHexString(
                          transaction[0].account
                        )}`
                      )
                    "
                    style="word-break: keep-all"
                  >
                    {{ transaction[0].account | txidToHex | ellipsis }}
                  </router-link>
                </div>
              </td>
              <td>
                <div v-if="transaction && transaction[0]" class="nowrap">
                  <div
                    v-if="
                      Object.keys(transaction[0].status)[0] === 'Cancelled' ||
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
                        getOrderMode(transaction[0].orderMode) === 'OrderBook'
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
                            Object.keys(transaction[0].operation)[0] === 'Swap'
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
                            >{{ tokens[transaction[0].token0Id].symbol }}
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
                          <span class="span-nbsp"></span>
                          <span
                            v-if="
                              getStatus(transaction[0]) !== 'Cancelled' &&
                              getStatus(transaction[0]) !== 'Failed' &&
                              getStatus(transaction[0]) !==
                                'PartiallyCompletedAndCancelled' &&
                              tokens &&
                              (tokens[transaction[0].token0Id] ||
                                transaction[0].token0Id === 'Cycles' ||
                                transaction[0].token0Id === 'ICP') &&
                              (tokens[transaction[0].token1Id] ||
                                transaction[0].token1Id === 'Cycles' ||
                                transaction[0].token1Id === 'ICP')
                            "
                          >
                            (price:
                            <span> {{ getPrice(transaction[0]) }}</span
                            >)
                          </span>
                        </div>
                      </template>
                      <div
                        class="swap-info"
                        v-if="
                          Object.keys(transaction[0].operation)[0] === 'Swap'
                        "
                        style="display: block; line-height: 1.2"
                      >
                        <div style="display: flex; align-items: center">
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
                              tokens[transaction[0].token1Id]
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
                              tokens[transaction[0].token1Id]
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
                        <span
                          v-if="
                            getStatus(transaction[0]) !== 'Cancelled' &&
                            getStatus(transaction[0]) !== 'Failed' &&
                            getStatus(transaction[0]) !==
                              'PartiallyCompletedAndCancelled' &&
                            tokens &&
                            (tokens[transaction[0].token0Id] ||
                              transaction[0].token0Id === 'Cycles' ||
                              transaction[0].token0Id === 'ICP') &&
                            (tokens[transaction[0].token1Id] ||
                              transaction[0].token1Id === 'Cycles' ||
                              transaction[0].token1Id === 'ICP')
                          "
                        >
                          (price:
                          <span> {{ getPrice(transaction[0]) }}</span
                          >)
                        </span>
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
                            Object.keys(transaction[0].operation)[0] === 'Swap'
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
                            {{
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
                            {{
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
                            {{
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
                            {{
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
                          <div v-if="tokens && tokens[transaction[0].token0Id]">
                            {{
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
                          ><a-icon type="plus" /><span class="span-nbsp"></span>
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
                          <div v-if="tokens && tokens[transaction[0].token1Id]">
                            {{
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
                            Object.keys(transaction[0].operation)[0] === 'Claim'
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
                          <div v-if="tokens && tokens[transaction[0].token0Id]">
                            {{
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
                          ><a-icon type="plus" /><span class="span-nbsp"></span>
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
                          <div v-if="tokens && tokens[transaction[0].token1Id]">
                            {{
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
                          <div v-if="tokens && tokens[transaction[0].token0Id]">
                            {{
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
                          ><a-icon type="plus" /><span class="span-nbsp"></span>
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
                          <div v-if="tokens && tokens[transaction[0].token1Id]">
                            {{
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
                          Object.keys(transaction[0].operation)[0] === 'Swap'
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
                          {{
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
                          {{
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
                          {{
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
                          {{
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
                        <div v-if="tokens && tokens[transaction[0].token0Id]">
                          {{
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
                        ><a-icon type="plus" /><span class="span-nbsp"></span>
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
                        <div v-if="tokens && tokens[transaction[0].token1Id]">
                          {{
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
                          Object.keys(transaction[0].operation)[0] === 'Claim'
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
                        <div v-if="tokens && tokens[transaction[0].token0Id]">
                          {{
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
                        ><a-icon type="plus" /><span class="span-nbsp"></span>
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
                        <div v-if="tokens && tokens[transaction[0].token1Id]">
                          {{
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
                        <div v-if="tokens && tokens[transaction[0].token0Id]">
                          {{
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
                        ><a-icon type="plus" /><span class="span-nbsp"></span>
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
                        <div v-if="tokens && tokens[transaction[0].token1Id]">
                          {{
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
              <td>
                <div
                  style="word-break: keep-all; white-space: nowrap"
                  v-if="transaction && transaction[0]"
                >
                  {{ transaction[0].time | formatDateFromNanosecond }}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="transactions-pagination-bottom">
          <a-pagination
            v-if="latestTransactions.length > page.pageSize"
            class="transactions-pagination"
            v-model="page.current"
            :total="latestTransactions.length"
            :showQuickJumper="true"
            :defaultPageSize="page.pageSize"
            @change="pageChange"
          />
        </div>
      </a-spin>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import BigNumber from 'bignumber.js';
import { DRC205ProxyService } from '@/ic/DRC205Proxy/DRC205ProxyService';
import { LatestTransaction } from '@/views/Swaps/model';
import { SwapInfo, TokenId, TokenInfo, Txid } from '@/ic/common/icType';
import { getSwapInfo } from '@/ic/getSwapInfo';
import { AppId, LastTxns } from '@/ic/DRC205Proxy/model';
import { DRC205BucketService } from '@/ic/DRC205Bucket/DRC205BucketService';
import { getTokenInfo } from '@/ic/getTokenInfo';
import { toHexString } from '@/ic/converter';
import {
  ShareChange,
  TokenType,
  TxnRecord,
  TxnRecordFilled,
  TxnRecordOrder
} from '@/ic/DRC205Bucket/model';
import { Route } from 'vue-router';
import { CYCLES_FINANCE_CANISTER_ID, LEDGER_CANISTER_ID } from '@/ic/utils';

@Component({
  name: 'Transactions',
  components: {},
  filters: {
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
  private spinning = false;
  private lastTxns: Array<LastTxns> = [];
  private latestTransactions: Array<LatestTransaction> = [];
  private currentLatestTransactions: Array<LatestTransaction> = [];
  private swaps: { [key: string]: SwapInfo };
  private tokens: { [key: string]: TokenInfo };
  private page = {
    current: 1,
    pageSize: 20,
    showQuickJumper: true
  };
  private isICRC = false;
  // activated(): void {
  //   this.page = {
  //     current: 1,
  //     pageSize: 20,
  //     showQuickJumper: true
  //   };
  //   this.init();
  // }
  @Watch('$route')
  private onRouteChange(to: Route, from: Route) {
    if (to.meta.type !== from.meta.type) {
      this.page = {
        current: 1,
        pageSize: 20,
        showQuickJumper: true
      };
      this.init();
    }
  }
  created(): void {
    this.init();
  }
  private init(): void {
    this.swaps = JSON.parse(localStorage.getItem('swaps')) || {};
    this.tokens = JSON.parse(localStorage.getItem('tokens')) || {};
    this.DRC205ProxyService = new DRC205ProxyService();
    this.getLatestTransactions();
  }
  private pageChange(page: number): void {
    this.page.current = page;
    // this.getTxn();
    this.spinning = true;
    this.getCurrentPageTransactions();
  }
  private async getCurrentPageTransactions(): Promise<void> {
    try {
      const lastIndex = Math.min(
        this.lastTxns.length,
        this.page.current * this.page.pageSize
      );
      const promiseAllValue = [];
      for (
        let i = (this.page.current - 1) * this.page.pageSize;
        i < lastIndex;
        i++
      ) {
        if (!this.latestTransactions[i]) {
          promiseAllValue.push(
            this.getTransaction(
              this.lastTxns[i][0],
              this.lastTxns[i][1],
              this.lastTxns[i][3],
              this.lastTxns[i][4],
              i
            )
          );
        }
        const appId = this.lastTxns[i][1].toString();
        if (!this.swaps[appId]) {
          try {
            this.swaps[appId] = await getSwapInfo(this.lastTxns[i][1]);
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
        if (this.swaps[appId].token0[1]) {
          const tokenStd = Object.keys(this.swaps[appId].token0[1])[0];
          if (tokenStd && tokenStd.toLocaleLowerCase().includes('icrc')) {
            this.isICRC = true;
          }
        }
        if (this.swaps[appId].token1[1]) {
          const tokenStd = Object.keys(this.swaps[appId].token1[1])[0];
          if (tokenStd && tokenStd.toLocaleLowerCase().includes('icrc')) {
            this.isICRC = true;
          }
        }
      }
      await Promise.all(promiseAllValue);
      this.currentLatestTransactions = this.latestTransactions.slice(
        (this.page.current - 1) * this.page.pageSize,
        lastIndex
      );
    } catch (e) {
      console.log(e);
    }
    console.log(this.currentLatestTransactions);
    this.spinning = false;
  }
  private async getLatestTransactions(): Promise<void> {
    this.spinning = true;
    try {
      this.lastTxns = await this.DRC205ProxyService.getLastTxns();
      const txnIndex: { [key: string]: number } = {};
      this.lastTxns.forEach((txns) => {
        if (
          !txnIndex[this.txidToHexString(txns[3])] &&
          txnIndex[this.txidToHexString(txns[3])] !== 0
        ) {
          txnIndex[this.txidToHexString(txns[3])] = 0;
        } else {
          txnIndex[this.txidToHexString(txns[3])] =
            txnIndex[this.txidToHexString(txns[3])] + 1;
        }
        txns[4] = txnIndex[this.txidToHexString(txns[3])];
      });
      this.latestTransactions = new Array(this.lastTxns.length);
      this.getCurrentPageTransactions();
    } catch (e) {
      this.spinning = false;
    }
  }
  private async getTransaction(
    index: bigint,
    appId: AppId,
    txid: Txid,
    txidIndex: number,
    i: number
  ): Promise<void> {
    try {
      let step = 0;
      this.latestTransactions[i] = await this.getTxn(
        appId,
        txid,
        step,
        txidIndex,
        index
      );
    } catch (e) {
      console.log(e);
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
    txidIndex: number,
    index: bigint
  ): Promise<LatestTransaction> {
    const bucket = await this.DRC205ProxyService.bucket(
      appId,
      txid,
      BigInt(step)
    );
    if ((bucket && !bucket[0]) || !bucket) {
      return null;
    } else {
      const currentDRC205BucketService = new DRC205BucketService(
        bucket[0].toString()
      );
      let latestTransaction: LatestTransaction;
      const txn = await currentDRC205BucketService.txnHistory(appId, txid);
      if (txn && txn.length) {
        txn.reverse();
      }
      if (txn && txn[txidIndex]) {
        latestTransaction = [...txn[txidIndex], index, appId];
        latestTransaction[0].token0Id = this.getTokenId(
          latestTransaction[0].token0
        );
        latestTransaction[0].token1Id = this.getTokenId(
          latestTransaction[0].token1
        );
        return latestTransaction;
      } else {
        return await this.getTxn(appId, txid, ++step, txidIndex, index);
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
  private getPrice(val: TxnRecord): string {
    let price1 = '';
    let token0decimals: number;
    let token1decimals: number;
    let token0Symbol: string;
    let token1Symbol: string;
    if (this.getTokenId(val.token0) === 'Cycles') {
      token0decimals = 12;
      token0Symbol = 'TCycles';
    } else if (this.getTokenId(val.token0) === 'ICP') {
      token0decimals = 8;
      token0Symbol = 'ICP';
    } else {
      token0decimals = this.tokens[this.getTokenId(val.token0)].decimals;
      token0Symbol = this.tokens[this.getTokenId(val.token0)].symbol;
    }
    if (this.getTokenId(val.token1) === 'Cycles') {
      token1decimals = 12;
      token1Symbol = 'TCycles';
    } else if (this.getTokenId(val.token1) === 'ICP') {
      token1decimals = 8;
      token1Symbol = 'ICP';
    } else {
      token1decimals = this.tokens[this.getTokenId(val.token1)].decimals;
      token1Symbol = this.tokens[this.getTokenId(val.token1)].symbol;
    }
    const token0Value = Object.values(val.filled.token0Value)[0];
    const token1Value = Object.values(val.filled.token1Value)[0];
    const status = this.getStatus(val);
    if (status === 'Open') {
      const token0ValueOrder = Object.values(val.order.token0Value[0])[0];
      const token1ValueOrder = Object.values(val.order.token1Value[0])[0];
      price1 = new BigNumber(token1ValueOrder.toString(10))
        .div(10 ** token1decimals)
        .div(token0ValueOrder.toString(10))
        .times(10 ** token0decimals)
        .decimalPlaces(token1decimals)
        .toString(10);
    } else if (
      status === 'Filled' &&
      Object.keys(val.orderMode)[0] === 'OrderBook'
    ) {
      const token0ValueOrder = Object.values(
        val.details[val.details.length - 1].token0Value
      )[0];
      const token1ValueOrder = Object.values(
        val.details[val.details.length - 1].token1Value
      )[0];
      price1 = new BigNumber(token1ValueOrder.toString(10))
        .div(10 ** token1decimals)
        .div(token0ValueOrder.toString(10))
        .times(10 ** token0decimals)
        .decimalPlaces(token1decimals)
        .toString(10);
    } else if (token0Value) {
      price1 = new BigNumber(token1Value.toString(10))
        .div(10 ** token1decimals)
        .div(token0Value.toString(10))
        .times(10 ** token0decimals)
        .decimalPlaces(token1decimals)
        .toString(10);
    } else {
      price1 = '-';
    }
    return `1 ${token0Symbol} = ${price1} ${token1Symbol}`;
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
.swap-id-info {
  line-height: 16px;
  word-break: break-word;
}
</style>
