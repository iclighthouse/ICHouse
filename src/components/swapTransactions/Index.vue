<template>
  <div>
    <a-table
      v-if="!accountId"
      :locale="{
        emptyText: 'No transactions'
      }"
      :columns="columnsTransactions"
      :data-source="transactions"
      :loading="transactionsLoading"
      :scroll="scroll"
      :pagination="page"
      :rowKey="
        (record, index) => {
          return index;
        }
      "
    >
      <div slot="TxTime" slot-scope="text, record">
        <span v-if="record.details && record.details.length">
          {{
            record.details[record.details.length - 1].time |
              formatDateFromNanosecond
          }}
        </span>
        <span v-else>
          {{ record.time | formatDateFromNanosecond }}
        </span>
      </div>
      <router-link
        :to="jumpRouter(`/swap/${swapId}/${txidToHexString(txid)}`)"
        slot="Txid"
        slot-scope="txid"
      >
        <a-tooltip>
          <template slot="title">
            {{ txid | txidToHex }}
          </template>
          <span style="word-break: keep-all">
            {{ txid | txidToHex | ellipsis }}
          </span>
        </a-tooltip>
      </router-link>
      <div
        style="word-break: keep-all"
        slot="Account"
        slot-scope="text, record"
      >
        <span v-if="isICRC && record.msgCaller && record.msgCaller.length">
          <router-link
            v-if="$route.name === 'Swap'"
            :to="
              jumpRouter(
                `/swap/address/${swapId}/${record.msgCaller[0].toString()}`
              )
            "
          >
            <a-tooltip>
              <template slot="title">
                {{ record.msgCaller[0].toString() }}
              </template>
              <span>
                {{ record.msgCaller[0].toString() | ellipsis }}
              </span>
            </a-tooltip>
          </router-link>
          <span v-else>
            <a-tooltip>
              <template slot="title">
                {{ record.msgCaller[0].toString() }}
              </template>
              <span>
                {{ record.msgCaller[0].toString() | ellipsis }}
              </span>
            </a-tooltip>
          </span>
        </span>
        <span v-if="!isICRC || (record.msgCaller && !record.msgCaller.length)">
          <router-link
            v-if="$route.name === 'Swap'"
            :to="
              jumpRouter(
                `/swap/address/${swapId}/${txidToHexString(record.account)}`
              )
            "
          >
            <a-tooltip>
              <template slot="title">
                {{ record.account | txidToHex }}
              </template>
              <span>
                {{ record.account | txidToHex | ellipsis }}
              </span>
            </a-tooltip>
          </router-link>
          <span v-else>
            <a-tooltip>
              <template slot="title">
                {{ record.account | txidToHex }}
              </template>
              <span>
                {{ record.account | txidToHex | ellipsis }}
              </span>
            </a-tooltip>
          </span>
        </span>
      </div>
      <div
        v-if="tokens && swaps && swaps[swapId]"
        class="nowrap"
        slot="Value"
        slot-scope="text, record"
      >
        <a-tooltip
          placement="topLeft"
          :overlay-style="{
            whiteSpace: 'nowrap',
            maxWidth: 'max-content'
          }"
        >
          <template slot="title">
            <div
              v-if="
                record.operation && Object.keys(record.operation)[0] === 'Swap'
              "
            >
              <div
                v-if="
                  getStatus(record) === 'Cancelled' ||
                  getStatus(record) === 'Failed' ||
                  getStatus(record) === 'PartiallyCompletedAndCancelled'
                "
              >
                {{ getStatus(record) }}
              </div>
              <div v-else class="swap-info">
                <span v-if="Object.keys(record.orderMode)[0] === 'OrderBook'"
                  >{{ getStatus(record) }}:&nbsp;</span
                >
                <div v-if="getStatus(record) === 'Cancelled'">-</div>
                <div v-else class="flex-center">
                  <div
                    v-if="
                      getStatus(record) === 'Open' &&
                      record.order.token0Value.length &&
                      Object.keys(record.order.token0Value[0])[0] ===
                        'DebitRecord' &&
                      tokens &&
                      tokens[token0Id]
                    "
                  >
                    {{
                      Object.values(record.order.token0Value[0])[0] |
                        bigintToFloat(
                          tokens[token0Id].decimals,
                          tokens[token0Id].decimals
                        )
                    }}<span class="span-nbsp"></span
                    >{{ tokens[token0Id].symbol }}
                  </div>
                  <div
                    v-if="
                      getStatus(record) === 'Open' &&
                      record.order.token1Value.length &&
                      Object.keys(record.order.token1Value[0])[0] ===
                        'DebitRecord' &&
                      tokens &&
                      tokens[token1Id]
                    "
                  >
                    {{
                      Object.values(record.order.token1Value[0])[0] |
                        bigintToFloat(
                          tokens[token1Id].decimals,
                          tokens[token1Id].decimals
                        )
                    }}<span class="span-nbsp"></span
                    >{{ tokens[token1Id].symbol }}
                  </div>
                  <div
                    v-if="
                      getStatus(record) === 'Filled' &&
                      Object.keys(record.orderMode)[0] === 'OrderBook' &&
                      record.details.length &&
                      Object.keys(record.details[0].token0Value)[0] ===
                        'DebitRecord' &&
                      tokens &&
                      tokens[token0Id]
                    "
                  >
                    {{
                      Object.values(
                        record.details[record.details.length - 1].token0Value
                      )[0] |
                        bigintToFloat(
                          tokens[token0Id].decimals,
                          tokens[token0Id].decimals
                        )
                    }}<span class="span-nbsp"></span
                    >{{ tokens[token0Id].symbol }}
                  </div>
                  <div
                    v-if="
                      getStatus(record) === 'Filled' &&
                      Object.keys(record.orderMode)[0] === 'OrderBook' &&
                      record.details.length &&
                      Object.keys(record.details[0].token1Value)[0] ===
                        'DebitRecord' &&
                      tokens &&
                      tokens[token0Id]
                    "
                  >
                    {{
                      Object.values(
                        record.details[record.details.length - 1].token1Value
                      )[0] |
                        bigintToFloat(
                          tokens[token1Id].decimals,
                          tokens[token1Id].decimals
                        )
                    }}<span class="span-nbsp"></span
                    >{{ tokens[token1Id].symbol }}
                  </div>
                  <div
                    v-if="
                      getStatus(record) === 'Filled' &&
                      Object.keys(record.orderMode)[0] === 'AMM' &&
                      record.filled &&
                      Object.keys(record.filled.token0Value)[0] ===
                        'DebitRecord' &&
                      tokens &&
                      tokens[token0Id]
                    "
                  >
                    {{
                      Object.values(record.filled.token0Value)[0] |
                        bigintToFloat(
                          tokens[token0Id].decimals,
                          tokens[token0Id].decimals
                        )
                    }}<span class="span-nbsp"></span
                    >{{ tokens[token0Id].symbol }}
                  </div>
                  <div
                    v-if="
                      getStatus(record) === 'Filled' &&
                      Object.keys(record.orderMode)[0] === 'AMM' &&
                      record.filled &&
                      Object.keys(record.filled.token1Value)[0] ===
                        'DebitRecord' &&
                      tokens &&
                      tokens[token0Id]
                    "
                  >
                    {{
                      Object.values(record.filled.token1Value)[0] |
                        bigintToFloat(
                          tokens[token1Id].decimals,
                          tokens[token1Id].decimals
                        )
                    }}<span class="span-nbsp"></span
                    >{{ tokens[token1Id].symbol }}
                  </div>
                  <span class="span-nbsp"></span>-><span
                    class="span-nbsp"
                  ></span>
                  <div
                    v-if="
                      getStatus(record) === 'Open' &&
                      record.order.token0Value.length &&
                      Object.keys(record.order.token0Value[0])[0] ===
                        'CreditRecord' &&
                      tokens &&
                      tokens[token0Id]
                    "
                  >
                    {{
                      Object.values(record.order.token0Value[0])[0] |
                        bigintToFloat(
                          tokens[token0Id].decimals,
                          tokens[token0Id].decimals
                        )
                    }}<span class="span-nbsp"></span
                    >{{ tokens[token0Id].symbol }}
                  </div>
                  <div
                    v-if="
                      getStatus(record) === 'Open' &&
                      record.order.token1Value.length &&
                      Object.keys(record.order.token1Value[0])[0] ===
                        'CreditRecord' &&
                      tokens &&
                      tokens[token1Id]
                    "
                  >
                    {{
                      Object.values(record.order.token1Value[0])[0] |
                        bigintToFloat(
                          tokens[token1Id].decimals,
                          tokens[token1Id].decimals
                        )
                    }}<span class="span-nbsp"></span
                    >{{ tokens[token1Id].symbol }}
                  </div>
                  <div
                    v-if="
                      getStatus(record) === 'Filled' &&
                      Object.keys(record.orderMode)[0] === 'OrderBook' &&
                      record.details.length &&
                      Object.keys(record.details[0].token0Value)[0] ===
                        'CreditRecord' &&
                      tokens &&
                      tokens[token0Id]
                    "
                  >
                    {{
                      Object.values(
                        record.details[record.details.length - 1].token0Value
                      )[0] |
                        bigintToFloat(
                          tokens[token0Id].decimals,
                          tokens[token0Id].decimals
                        )
                    }}<span class="span-nbsp"></span
                    >{{ tokens[token0Id].symbol }}
                  </div>
                  <div
                    v-if="
                      getStatus(record) === 'Filled' &&
                      Object.keys(record.orderMode)[0] === 'OrderBook' &&
                      record.details.length &&
                      Object.keys(record.details[0].token1Value)[0] ===
                        'CreditRecord' &&
                      tokens &&
                      tokens[token0Id]
                    "
                  >
                    {{
                      Object.values(
                        record.details[record.details.length - 1].token1Value
                      )[0] |
                        bigintToFloat(
                          tokens[token1Id].decimals,
                          tokens[token1Id].decimals
                        )
                    }}<span class="span-nbsp"></span
                    >{{ tokens[token1Id].symbol }}
                  </div>
                  <div
                    v-if="
                      Object.keys(record.orderMode)[0] === 'AMM' &&
                      record.filled &&
                      Object.keys(record.filled.token0Value)[0] ===
                        'CreditRecord' &&
                      tokens &&
                      tokens[token0Id]
                    "
                  >
                    {{
                      Object.values(record.filled.token0Value)[0] |
                        bigintToFloat(
                          tokens[token0Id].decimals,
                          tokens[token0Id].decimals
                        )
                    }}<span class="span-nbsp"></span
                    >{{ tokens[token0Id].symbol }}
                  </div>
                  <div
                    v-if="
                      getStatus(record) === 'Filled' &&
                      Object.keys(record.orderMode)[0] === 'AMM' &&
                      record.filled &&
                      Object.keys(record.filled.token1Value)[0] ===
                        'CreditRecord' &&
                      tokens &&
                      tokens[token0Id]
                    "
                  >
                    {{
                      Object.values(record.filled.token1Value)[0] |
                        bigintToFloat(
                          tokens[token1Id].decimals,
                          tokens[token1Id].decimals
                        )
                    }}<span class="span-nbsp"></span
                    >{{ tokens[token1Id].symbol }}
                  </div>
                </div>
                <!--<div
                        v-if="
                          record.filled &&
                          Object.keys(record.filled.token0Value)[0] === 'DebitRecord' &&
                          token0Id === 'Cycles'
                        "
                      >
                        {{
                          Object.values(record.filled.token0Value)[0] |
                            bigintToFloat(4, 12)
                        }}<span class="span-nbsp"></span>TCycles
                      </div>
                      <div
                        v-if="
                          record.filled &&
                          Object.keys(record.filled.token1Value)[0] === 'DebitRecord' &&
                          token1Id === 'Cycles'
                        "
                      >
                        {{
                          Object.values(record.filled.token1Value)[0] |
                            bigintToFloat(4, 12)
                        }}<span class="span-nbsp"></span>TCycles
                      </div>
                      <div
                        v-if="
                          record.filled &&
                          Object.keys(record.filled.token0Value)[0] === 'DebitRecord' &&
                          token0Id === 'ICP'
                        "
                      >
                        {{
                          Object.values(record.filled.token0Value)[0] |
                            bigintToFloat(4)
                        }}<span class="span-nbsp"></span>ICP
                      </div>
                      <div
                        v-if="
                          record.filled &&
                          Object.keys(record.filled.token1Value)[0] === 'DebitRecord' &&
                          token1Id === 'ICP'
                        "
                      >
                        {{
                          Object.values(record.filled.token1Value)[0] |
                            bigintToFloat(4)
                        }}<span class="span-nbsp"></span>ICP
                      </div>-->
                <!--<div
                        v-if="
                          record.filled &&
                          Object.keys(record.filled.token0Value)[0] ===
                            'CreditRecord' &&
                          token0Id === 'Cycles'
                        "
                      >
                        {{
                          Object.values(record.filled.token0Value)[0] |
                            bigintToFloat(4, 12)
                        }}<span class="span-nbsp"></span>TCycles
                      </div>
                      <div
                        v-if="
                          record.filled &&
                          Object.keys(record.filled.token1Value)[0] ===
                            'CreditRecord' &&
                          token1Id === 'Cycles'
                        "
                      >
                        {{
                          Object.values(record.filled.token1Value)[0] |
                            bigintToFloat(4, 12)
                        }}<span class="span-nbsp"></span>TCycles
                      </div>
                      <div
                        v-if="
                          record.filled &&
                          Object.keys(record.filled.token0Value)[0] ===
                            'CreditRecord' &&
                          token0Id === 'ICP'
                        "
                      >
                        {{
                          Object.values(record.filled.token0Value)[0] |
                            bigintToFloat(4)
                        }}<span class="span-nbsp"></span>ICP
                      </div>
                      <div
                        v-if="
                          record.filled &&
                          Object.keys(record.filled.token1Value)[0] ===
                            'CreditRecord' &&
                          token1Id === 'ICP'
                        "
                      >
                        {{
                          Object.values(record.filled.token1Value)[0] |
                            bigintToFloat(4)
                        }}<span class="span-nbsp"></span>ICP
                      </div>-->
              </div>
              <span
                v-if="
                  getStatus(record) !== 'Cancelled' &&
                  getStatus(record) !== 'Failed' &&
                  getStatus(record) !== 'PartiallyCompletedAndCancelled' &&
                  tokens &&
                  (tokens[token0Id] ||
                    token0Id === 'Cycles' ||
                    token0Id === 'ICP') &&
                  (tokens[token1Id] ||
                    token1Id === 'Cycles' ||
                    token1Id === 'ICP')
                "
              >
                (price:
                <span> {{ getPrice(record) }}</span
                >)
              </span>
            </div>
            <div
              class="swap-info"
              v-if="
                record.operation &&
                Object.keys(record.operation)[0] === 'AddLiquidity'
              "
            >
              <div v-if="record.filled && token0Id === 'Cycles'">
                {{
                  Object.values(record.filled.token0Value)[0] |
                    bigintToFloat(12, 12)
                }}<span class="span-nbsp"></span>TCycles
              </div>
              <div v-if="record.filled && token0Id === 'ICP'">
                {{
                  Object.values(record.filled.token0Value)[0] |
                    bigintToFloat(8)
                }}<span class="span-nbsp"></span>ICP
              </div>
              <div v-if="record.filled && tokens && tokens[token0Id]">
                {{
                  Object.values(record.filled.token0Value)[0] |
                    bigintToFloat(
                      tokens[token0Id].decimals,
                      tokens[token0Id].decimals
                    )
                }}<span class="span-nbsp"></span>{{ tokens[token0Id].symbol }}
              </div>
              <span class="span-nbsp"></span><a-icon type="plus" /><span
                class="span-nbsp"
              ></span>
              <div v-if="record.filled && token1Id === 'Cycles'">
                {{
                  Object.values(record.filled.token1Value)[0] |
                    bigintToFloat(12, 12)
                }}<span class="span-nbsp"></span>TCycles
              </div>
              <div v-if="record.filled && token1Id === 'ICP'">
                {{
                  Object.values(record.filled.token1Value)[0] |
                    bigintToFloat(8)
                }}<span class="span-nbsp"></span>ICP
              </div>
              <div v-if="record.filled && tokens && tokens[token1Id]">
                {{
                  Object.values(record.filled.token1Value)[0] |
                    bigintToFloat(
                      tokens[token1Id].decimals,
                      tokens[token1Id].decimals
                    )
                }}<span class="span-nbsp"></span>{{ tokens[token1Id].symbol }}
              </div>
              <div v-if="record.shares && swaps[swapId]">
                <span class="span-nbsp"></span>-><span class="span-nbsp"></span
                >{{
                  record.shares |
                    filterShare(swaps[swapId].decimals, swaps[swapId].decimals)
                }}<span class="span-nbsp"></span>Shares
              </div>
            </div>
            <div
              class="swap-info"
              v-if="
                record.operation && Object.keys(record.operation)[0] === 'Claim'
              "
            >
              <div v-if="record.filled && token0Id === 'Cycles'">
                {{
                  Object.values(record.filled.token0Value)[0] |
                    bigintToFloat(12, 12)
                }}<span class="span-nbsp"></span>TCycles
              </div>
              <div v-if="record.filled && token0Id === 'ICP'">
                {{
                  Object.values(record.filled.token0Value)[0] |
                    bigintToFloat(8)
                }}<span class="span-nbsp"></span>ICP
              </div>
              <div v-if="record.filledtokens && tokens[token0Id]">
                {{
                  Object.values(record.filled.token0Value)[0] |
                    bigintToFloat(
                      tokens[token0Id].decimals,
                      tokens[token0Id].decimals
                    )
                }}<span class="span-nbsp"></span>{{ tokens[token0Id].symbol }}
              </div>
              <span class="span-nbsp"></span><a-icon type="plus" /><span
                class="span-nbsp"
              ></span>
              <div v-if="record.filled && token1Id === 'Cycles'">
                {{
                  Object.values(record.filled.token1Value)[0] |
                    bigintToFloat(12, 12)
                }}<span class="span-nbsp"></span>TCycles
              </div>
              <div v-if="record.filled && token1Id === 'ICP'">
                {{
                  Object.values(record.filled.token1Value)[0] |
                    bigintToFloat(8)
                }}<span class="span-nbsp"></span>ICP
              </div>
              <div v-if="record.filledtokens && tokens[token1Id]">
                {{
                  Object.values(record.filled.token1Value)[0] |
                    bigintToFloat(
                      tokens[token1Id].decimals,
                      tokens[token1Id].decimals
                    )
                }}<span class="span-nbsp"></span>{{ tokens[token1Id].symbol }}
              </div>
            </div>
            <div
              class="swap-info"
              v-if="
                record.operation &&
                Object.keys(record.operation)[0] === 'RemoveLiquidity'
              "
            >
              <div v-if="record.shares && swaps[swapId]">
                {{
                  record.shares |
                    filterShare(swaps[swapId].decimals, swaps[swapId].decimals)
                }}
                Shares<span class="span-nbsp"></span>-><span
                  class="span-nbsp"
                ></span>
              </div>
              <div v-if="record.filled && token0Id === 'Cycles'">
                {{
                  Object.values(record.filled.token0Value)[0] |
                    bigintToFloat(12, 12)
                }}<span class="span-nbsp"></span>TCycles
              </div>
              <div v-if="record.filled && token0Id === 'ICP'">
                {{
                  Object.values(record.filled.token0Value)[0] |
                    bigintToFloat(8)
                }}<span class="span-nbsp"></span>ICP
              </div>
              <div v-if="record.filled && tokens && tokens[token0Id]">
                {{
                  Object.values(record.filled.token0Value)[0] |
                    bigintToFloat(
                      tokens[token0Id].decimals,
                      tokens[token0Id].decimals
                    )
                }}<span class="span-nbsp"></span>{{ tokens[token0Id].symbol }}
              </div>
              <span class="span-nbsp"></span><a-icon type="plus" /><span
                class="span-nbsp"
              ></span>
              <div v-if="record.filled && token1Id === 'Cycles'">
                {{
                  Object.values(record.filled.token1Value)[0] |
                    bigintToFloat(12, 12)
                }}<span class="span-nbsp"></span>TCycles
              </div>
              <div v-if="record.filled && token1Id === 'ICP'">
                {{
                  Object.values(record.filled.token1Value)[0] |
                    bigintToFloat(8)
                }}<span class="span-nbsp"></span>ICP
              </div>
              <div v-if="record.filled && tokens && tokens[token1Id]">
                {{
                  Object.values(record.filled.token1Value)[0] |
                    bigintToFloat(
                      tokens[token1Id].decimals,
                      tokens[token1Id].decimals
                    )
                }}<span class="span-nbsp"></span>{{ tokens[token1Id].symbol }}
              </div>
            </div>
          </template>
          <div
            v-if="
              record.operation && Object.keys(record.operation)[0] === 'Swap'
            "
          >
            <div
              v-if="
                getStatus(record) === 'Cancelled' ||
                getStatus(record) === 'Failed' ||
                getStatus(record) === 'PartiallyCompletedAndCancelled'
              "
            >
              {{ getStatus(record) }}
            </div>
            <div v-else class="swap-info">
              <span v-if="Object.keys(record.orderMode)[0] === 'OrderBook'"
                >{{ getStatus(record) }}:&nbsp;</span
              >
              <div v-if="getStatus(record) === 'Cancelled'">-</div>
              <div v-else class="flex-center">
                <div
                  v-if="
                    getStatus(record) === 'Open' &&
                    record.order.token0Value.length &&
                    Object.keys(record.order.token0Value[0])[0] ===
                      'DebitRecord' &&
                    tokens &&
                    tokens[token0Id]
                  "
                >
                  {{
                    Object.values(record.order.token0Value[0])[0] |
                      bigintToFloat(
                        token0FeeDecimals,
                        tokens[token0Id].decimals
                      )
                  }}<span class="span-nbsp"></span>{{ tokens[token0Id].symbol }}
                </div>
                <div
                  v-if="
                    getStatus(record) === 'Open' &&
                    record.order.token1Value.length &&
                    Object.keys(record.order.token1Value[0])[0] ===
                      'DebitRecord' &&
                    tokens &&
                    tokens[token1Id]
                  "
                >
                  {{
                    Object.values(record.order.token1Value[0])[0] |
                      bigintToFloat(
                        token1FeeDecimals,
                        tokens[token1Id].decimals
                      )
                  }}<span class="span-nbsp"></span>{{ tokens[token1Id].symbol }}
                </div>
                <div
                  v-if="
                    getStatus(record) === 'Filled' &&
                    Object.keys(record.orderMode)[0] === 'OrderBook' &&
                    record.details.length &&
                    Object.keys(record.details[0].token0Value)[0] ===
                      'DebitRecord' &&
                    tokens &&
                    tokens[token0Id]
                  "
                >
                  {{
                    Object.values(
                      record.details[record.details.length - 1].token0Value
                    )[0] |
                      bigintToFloat(
                        token0FeeDecimals,
                        tokens[token0Id].decimals
                      )
                  }}<span class="span-nbsp"></span>{{ tokens[token0Id].symbol }}
                </div>
                <div
                  v-if="
                    getStatus(record) === 'Filled' &&
                    Object.keys(record.orderMode)[0] === 'OrderBook' &&
                    record.details.length &&
                    Object.keys(record.details[0].token1Value)[0] ===
                      'DebitRecord' &&
                    tokens &&
                    tokens[token0Id]
                  "
                >
                  {{
                    Object.values(
                      record.details[record.details.length - 1].token1Value
                    )[0] |
                      bigintToFloat(
                        token1FeeDecimals,
                        tokens[token1Id].decimals
                      )
                  }}<span class="span-nbsp"></span>{{ tokens[token1Id].symbol }}
                </div>
                <div
                  v-if="
                    getStatus(record) === 'Filled' &&
                    Object.keys(record.orderMode)[0] === 'AMM' &&
                    record.filled &&
                    Object.keys(record.filled.token0Value)[0] ===
                      'DebitRecord' &&
                    tokens &&
                    tokens[token0Id]
                  "
                >
                  {{
                    Object.values(record.filled.token0Value)[0] |
                      bigintToFloat(
                        token0FeeDecimals,
                        tokens[token0Id].decimals
                      )
                  }}<span class="span-nbsp"></span>{{ tokens[token0Id].symbol }}
                </div>
                <div
                  v-if="
                    getStatus(record) === 'Filled' &&
                    Object.keys(record.orderMode)[0] === 'AMM' &&
                    record.filled &&
                    Object.keys(record.filled.token1Value)[0] ===
                      'DebitRecord' &&
                    tokens &&
                    tokens[token0Id]
                  "
                >
                  {{
                    Object.values(record.filled.token1Value)[0] |
                      bigintToFloat(
                        token1FeeDecimals,
                        tokens[token1Id].decimals
                      )
                  }}<span class="span-nbsp"></span>{{ tokens[token1Id].symbol }}
                </div>
                <span class="span-nbsp"></span>-><span class="span-nbsp"></span>
                <div
                  v-if="
                    getStatus(record) === 'Open' &&
                    record.order.token0Value.length &&
                    Object.keys(record.order.token0Value[0])[0] ===
                      'CreditRecord' &&
                    tokens &&
                    tokens[token0Id]
                  "
                >
                  {{
                    Object.values(record.order.token0Value[0])[0] |
                      bigintToFloat(
                        token0FeeDecimals,
                        tokens[token0Id].decimals
                      )
                  }}<span class="span-nbsp"></span>{{ tokens[token0Id].symbol }}
                </div>
                <div
                  v-if="
                    getStatus(record) === 'Open' &&
                    record.order.token1Value.length &&
                    Object.keys(record.order.token1Value[0])[0] ===
                      'CreditRecord' &&
                    tokens &&
                    tokens[token1Id]
                  "
                >
                  {{
                    Object.values(record.order.token1Value[0])[0] |
                      bigintToFloat(
                        token1FeeDecimals,
                        tokens[token1Id].decimals
                      )
                  }}<span class="span-nbsp"></span>{{ tokens[token1Id].symbol }}
                </div>
                <div
                  v-if="
                    getStatus(record) === 'Filled' &&
                    Object.keys(record.orderMode)[0] === 'OrderBook' &&
                    record.details.length &&
                    Object.keys(record.details[0].token0Value)[0] ===
                      'CreditRecord' &&
                    tokens &&
                    tokens[token0Id]
                  "
                >
                  {{
                    Object.values(
                      record.details[record.details.length - 1].token0Value
                    )[0] |
                      bigintToFloat(
                        token0FeeDecimals,
                        tokens[token0Id].decimals
                      )
                  }}<span class="span-nbsp"></span>{{ tokens[token0Id].symbol }}
                </div>
                <div
                  v-if="
                    getStatus(record) === 'Filled' &&
                    Object.keys(record.orderMode)[0] === 'OrderBook' &&
                    record.details.length &&
                    Object.keys(record.details[0].token1Value)[0] ===
                      'CreditRecord' &&
                    tokens &&
                    tokens[token0Id]
                  "
                >
                  {{
                    Object.values(
                      record.details[record.details.length - 1].token1Value
                    )[0] |
                      bigintToFloat(
                        token1FeeDecimals,
                        tokens[token1Id].decimals
                      )
                  }}<span class="span-nbsp"></span>{{ tokens[token1Id].symbol }}
                </div>
                <div
                  v-if="
                    Object.keys(record.orderMode)[0] === 'AMM' &&
                    record.filled &&
                    Object.keys(record.filled.token0Value)[0] ===
                      'CreditRecord' &&
                    tokens &&
                    tokens[token0Id]
                  "
                >
                  {{
                    Object.values(record.filled.token0Value)[0] |
                      bigintToFloat(
                        token0FeeDecimals,
                        tokens[token0Id].decimals
                      )
                  }}<span class="span-nbsp"></span>{{ tokens[token0Id].symbol }}
                </div>
                <div
                  v-if="
                    getStatus(record) === 'Filled' &&
                    Object.keys(record.orderMode)[0] === 'AMM' &&
                    record.filled &&
                    Object.keys(record.filled.token1Value)[0] ===
                      'CreditRecord' &&
                    tokens &&
                    tokens[token0Id]
                  "
                >
                  {{
                    Object.values(record.filled.token1Value)[0] |
                      bigintToFloat(
                        token1FeeDecimals,
                        tokens[token1Id].decimals
                      )
                  }}<span class="span-nbsp"></span>{{ tokens[token1Id].symbol }}
                </div>
              </div>
              <!--<div
                v-if="
                  record.filled &&
                  Object.keys(record.filled.token0Value)[0] === 'DebitRecord' &&
                  token0Id === 'Cycles'
                "
              >
                {{
                  Object.values(record.filled.token0Value)[0] |
                    bigintToFloat(4, 12)
                }}<span class="span-nbsp"></span>TCycles
              </div>
              <div
                v-if="
                  record.filled &&
                  Object.keys(record.filled.token1Value)[0] === 'DebitRecord' &&
                  token1Id === 'Cycles'
                "
              >
                {{
                  Object.values(record.filled.token1Value)[0] |
                    bigintToFloat(4, 12)
                }}<span class="span-nbsp"></span>TCycles
              </div>
              <div
                v-if="
                  record.filled &&
                  Object.keys(record.filled.token0Value)[0] === 'DebitRecord' &&
                  token0Id === 'ICP'
                "
              >
                {{
                  Object.values(record.filled.token0Value)[0] |
                    bigintToFloat(4)
                }}<span class="span-nbsp"></span>ICP
              </div>
              <div
                v-if="
                  record.filled &&
                  Object.keys(record.filled.token1Value)[0] === 'DebitRecord' &&
                  token1Id === 'ICP'
                "
              >
                {{
                  Object.values(record.filled.token1Value)[0] |
                    bigintToFloat(4)
                }}<span class="span-nbsp"></span>ICP
              </div>-->
              <!--<div
                v-if="
                  record.filled &&
                  Object.keys(record.filled.token0Value)[0] ===
                    'CreditRecord' &&
                  token0Id === 'Cycles'
                "
              >
                {{
                  Object.values(record.filled.token0Value)[0] |
                    bigintToFloat(4, 12)
                }}<span class="span-nbsp"></span>TCycles
              </div>
              <div
                v-if="
                  record.filled &&
                  Object.keys(record.filled.token1Value)[0] ===
                    'CreditRecord' &&
                  token1Id === 'Cycles'
                "
              >
                {{
                  Object.values(record.filled.token1Value)[0] |
                    bigintToFloat(4, 12)
                }}<span class="span-nbsp"></span>TCycles
              </div>
              <div
                v-if="
                  record.filled &&
                  Object.keys(record.filled.token0Value)[0] ===
                    'CreditRecord' &&
                  token0Id === 'ICP'
                "
              >
                {{
                  Object.values(record.filled.token0Value)[0] |
                    bigintToFloat(4)
                }}<span class="span-nbsp"></span>ICP
              </div>
              <div
                v-if="
                  record.filled &&
                  Object.keys(record.filled.token1Value)[0] ===
                    'CreditRecord' &&
                  token1Id === 'ICP'
                "
              >
                {{
                  Object.values(record.filled.token1Value)[0] |
                    bigintToFloat(4)
                }}<span class="span-nbsp"></span>ICP
              </div>-->
            </div>
            <span
              v-if="
                getStatus(record) !== 'Cancelled' &&
                getStatus(record) !== 'Failed' &&
                getStatus(record) !== 'PartiallyCompletedAndCancelled' &&
                tokens &&
                (tokens[token0Id] ||
                  token0Id === 'Cycles' ||
                  token0Id === 'ICP') &&
                (tokens[token1Id] ||
                  token1Id === 'Cycles' ||
                  token1Id === 'ICP')
              "
            >
              (price:
              <span> {{ getPrice(record) }}</span
              >)
            </span>
          </div>
          <div
            class="swap-info"
            v-if="
              record.operation &&
              Object.keys(record.operation)[0] === 'AddLiquidity'
            "
          >
            <div v-if="record.filled && token0Id === 'Cycles'">
              {{
                Object.values(record.filled.token0Value)[0] |
                  bigintToFloat(4, 12)
              }}<span class="span-nbsp"></span>TCycles
            </div>
            <div v-if="record.filled && token0Id === 'ICP'">
              {{ Object.values(record.filled.token0Value)[0] | bigintToFloat(4)
              }}<span class="span-nbsp"></span>ICP
            </div>
            <div v-if="record.filled && tokens && tokens[token0Id]">
              {{
                Object.values(record.filled.token0Value)[0] |
                  bigintToFloat(token0FeeDecimals, tokens[token0Id].decimals)
              }}<span class="span-nbsp"></span>{{ tokens[token0Id].symbol }}
            </div>
            <span class="span-nbsp"></span><a-icon type="plus" /><span
              class="span-nbsp"
            ></span>
            <div v-if="record.filled && token1Id === 'Cycles'">
              {{
                Object.values(record.filled.token1Value)[0] |
                  bigintToFloat(4, 12)
              }}<span class="span-nbsp"></span>TCycles
            </div>
            <div v-if="record.filled && token1Id === 'ICP'">
              {{ Object.values(record.filled.token1Value)[0] | bigintToFloat(4)
              }}<span class="span-nbsp"></span>ICP
            </div>
            <div v-if="record.filled && tokens && tokens[token1Id]">
              {{
                Object.values(record.filled.token1Value)[0] |
                  bigintToFloat(token1FeeDecimals, tokens[token1Id].decimals)
              }}<span class="span-nbsp"></span>{{ tokens[token1Id].symbol }}
            </div>
            <div v-if="record.shares && swaps[swapId]">
              <span class="span-nbsp"></span>-><span class="span-nbsp"></span
              >{{ record.shares | filterShare(swaps[swapId].decimals, 4)
              }}<span class="span-nbsp"></span>Shares
            </div>
          </div>
          <div
            class="swap-info"
            v-if="
              record.operation && Object.keys(record.operation)[0] === 'Claim'
            "
          >
            <div v-if="record.filled && token0Id === 'Cycles'">
              {{
                Object.values(record.filled.token0Value)[0] |
                  bigintToFloat(4, 12)
              }}<span class="span-nbsp"></span>TCycles
            </div>
            <div v-if="record.filled && token0Id === 'ICP'">
              {{ Object.values(record.filled.token0Value)[0] | bigintToFloat(4)
              }}<span class="span-nbsp"></span>ICP
            </div>
            <div v-if="record.filled && tokens && tokens[token0Id]">
              {{
                Object.values(record.filled.token0Value)[0] |
                  bigintToFloat(token0FeeDecimals, tokens[token0Id].decimals)
              }}<span class="span-nbsp"></span>{{ tokens[token0Id].symbol }}
            </div>
            <span class="span-nbsp"></span><a-icon type="plus" /><span
              class="span-nbsp"
            ></span>
            <div v-if="record.filled && token1Id === 'Cycles'">
              {{
                Object.values(record.filled.token1Value)[0] |
                  bigintToFloat(token1FeeDecimals, 12)
              }}<span class="span-nbsp"></span>TCycles
            </div>
            <div v-if="record.filled && token1Id === 'ICP'">
              {{ Object.values(record.filled.token1Value)[0] | bigintToFloat(4)
              }}<span class="span-nbsp"></span>ICP
            </div>
            <div v-if="record.filled && tokens && tokens[token1Id]">
              {{
                Object.values(record.filled.token1Value)[0] |
                  bigintToFloat(token1FeeDecimals, tokens[token1Id].decimals)
              }}<span class="span-nbsp"></span>{{ tokens[token1Id].symbol }}
            </div>
          </div>
          <div
            class="swap-info"
            v-if="
              record.operation &&
              Object.keys(record.operation)[0] === 'RemoveLiquidity'
            "
          >
            <div v-if="record.shares && swaps[swapId]">
              {{ record.shares | filterShare(swaps[swapId].decimals, 4) }}
              Shares<span class="span-nbsp"></span>-><span
                class="span-nbsp"
              ></span>
            </div>
            <div v-if="record.filled && token0Id === 'Cycles'">
              {{
                Object.values(record.filled.token0Value)[0] |
                  bigintToFloat(4, 12)
              }}<span class="span-nbsp"></span>TCycles
            </div>
            <div v-if="record.filled && token0Id === 'ICP'">
              {{ Object.values(record.filled.token0Value)[0] | bigintToFloat(4)
              }}<span class="span-nbsp"></span>ICP
            </div>
            <div v-if="record.filled && tokens && tokens[token0Id]">
              {{
                Object.values(record.filled.token0Value)[0] |
                  bigintToFloat(token0FeeDecimals, tokens[token0Id].decimals)
              }}<span class="span-nbsp"></span>{{ tokens[token0Id].symbol }}
            </div>
            <span class="span-nbsp"></span><a-icon type="plus" /><span
              class="span-nbsp"
            ></span>
            <div v-if="record.filled && token1Id === 'Cycles'">
              {{
                Object.values(record.filled.token1Value)[0] |
                  bigintToFloat(4, 12)
              }}<span class="span-nbsp"></span>TCycles
            </div>
            <div v-if="record.filled && token1Id === 'ICP'">
              {{ Object.values(record.filled.token1Value)[0] | bigintToFloat(4)
              }}<span class="span-nbsp"></span>ICP
            </div>
            <div v-if="record.filled && tokens && tokens[token1Id]">
              {{
                Object.values(record.filled.token1Value)[0] |
                  bigintToFloat(token1FeeDecimals, tokens[token1Id].decimals)
              }}<span class="span-nbsp"></span>{{ tokens[token1Id].symbol }}
            </div>
          </div>
        </a-tooltip>
      </div>
      <div class="nowrap" slot="Fee" slot-scope="fee">
        <a-tooltip
          placement="topLeft"
          :overlay-style="{
            whiteSpace: 'nowrap',
            maxWidth: 'max-content'
          }"
        >
          <template slot="title">
            <div class="nowrap-fee">
              <div v-if="fee && fee.token0Fee">
                <div v-if="tokens && tokens[token0Id]">
                  {{
                    fee.token0Fee |
                      bigintToFloat(
                        tokens[token0Id].decimals,
                        tokens[token0Id].decimals
                      )
                  }}
                  {{ tokens[token0Id].symbol }}
                </div>
                <div v-if="token0Id === 'Cycles'">
                  {{ fee.token0Fee | bigintToFloat(12, 12) }}
                  TCycles
                </div>
                <div v-if="token0Id === 'ICP'">
                  {{ fee.token0Fee | bigintToFloat(8) }}
                  ICP
                </div>
              </div>
              <div v-if="fee && fee.token1Fee">
                <div v-if="tokens && tokens[token1Id]">
                  {{
                    fee.token1Fee |
                      bigintToFloat(
                        tokens[token1Id].decimals,
                        tokens[token1Id].decimals
                      )
                  }}
                  {{ tokens[token1Id].symbol }}
                </div>
                <div v-if="token1Id === 'Cycles'">
                  {{ fee.token1Fee | bigintToFloat(12, 12) }}
                  TCycles
                </div>
                <div v-if="token1Id === 'ICP'">
                  {{ fee.token1Fee | bigintToFloat(8) }}
                  ICP
                </div>
              </div>
            </div>
          </template>
          <div class="nowrap-fee">
            <div v-if="fee && fee.token0Fee">
              <div v-if="tokens && tokens[token0Id]">
                {{
                  fee.token0Fee |
                    bigintToFloat(token0FeeDecimals, tokens[token0Id].decimals)
                }}
                {{ tokens[token0Id].symbol }}
              </div>
              <div v-if="token0Id === 'Cycles'">
                {{ fee.token0Fee | bigintToFloat(4, 12) }}
                TCycles
              </div>
              <div v-if="token0Id === 'ICP'">
                {{ fee.token0Fee | bigintToFloat(4) }}
                ICP
              </div>
            </div>
            <div v-if="fee && fee.token1Fee">
              <div v-if="tokens && tokens[token1Id]">
                {{
                  fee.token1Fee |
                    bigintToFloat(token1FeeDecimals, tokens[token1Id].decimals)
                }}
                {{ tokens[token1Id].symbol }}
              </div>
              <div v-if="token1Id === 'Cycles'">
                {{ fee.token1Fee | bigintToFloat(4, 12) }}
                TCycles
              </div>
              <div v-if="token1Id === 'ICP'">
                {{ fee.token1Fee | bigintToFloat(4) }}
                ICP
              </div>
            </div>
          </div>
        </a-tooltip>
        <div v-if="fee && !fee.token1Fee && !fee.token0Fee">NoFee</div>
      </div>
    </a-table>
    <div class="swaps-transactions-account">
      <a-spin :spinning="spinning">
        <table v-if="accountId">
          <thead>
            <tr>
              <th>Index</th>
              <th>Operation</th>
              <th>Txid</th>
              <th>Account</th>
              <th>Swap</th>
              <th>Nonce</th>
              <th>Fee</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in transactionsAccount" :key="index">
              <td>
                <span v-if="item[1][0]">{{ item[1][0][0].index }}</span>
              </td>
              <td>
                <span v-if="item[1][0]">{{
                  Object.keys(item[1][0][0].operation)[0]
                }}</span>
              </td>
              <td>
                <router-link
                  v-if="item[1][0]"
                  :to="
                    jumpRouter(
                      `/swap/${swapId}/${txidToHexString(item[1][0][0].txid)}`
                    )
                  "
                >
                  <a-tooltip>
                    <template slot="title">
                      {{ item[1][0][0].txid | txidToHex }}
                    </template>
                    <span style="word-break: keep-all">
                      {{ item[1][0][0].txid | txidToHex | ellipsis }}
                    </span>
                  </a-tooltip>
                </router-link>
              </td>
              <td>
                <div v-if="item[1][0]" style="word-break: keep-all">
                  <span
                    v-if="
                      isICRC &&
                      item[1][0][0].msgCaller &&
                      item[1][0][0].msgCaller.length
                    "
                  >
                    <router-link
                      v-if="$route.name === 'Swap'"
                      :to="
                        jumpRouter(
                          `/swap/address/${swapId}/${item[1][0][0].msgCaller[0].toString()}`
                        )
                      "
                    >
                      <a-tooltip>
                        <template slot="title">
                          {{ item[1][0][0].msgCaller[0].toString() }}
                        </template>
                        <span>
                          {{ item[1][0][0].msgCaller[0].toString() | ellipsis }}
                        </span>
                      </a-tooltip>
                    </router-link>
                    <span v-else>
                      <a-tooltip>
                        <template slot="title">
                          {{ item[1][0][0].msgCaller[0].toString() }}
                        </template>
                        <span>
                          {{ item[1][0][0].msgCaller[0].toString() | ellipsis }}
                        </span>
                      </a-tooltip>
                    </span>
                  </span>
                  <span
                    v-if="
                      !isICRC ||
                      (item[1][0][0].msgCaller &&
                        !item[1][0][0].msgCaller.length)
                    "
                  >
                    <router-link
                      v-if="$route.name === 'Swap'"
                      :to="
                        jumpRouter(
                          `/swap/address/${swapId}/${txidToHexString(
                            item[1][0][0].account
                          )}`
                        )
                      "
                    >
                      <a-tooltip>
                        <template slot="title">
                          {{ item[1][0][0].account | txidToHex }}
                        </template>
                        <span>
                          {{ item[1][0][0].account | txidToHex | ellipsis }}
                        </span>
                      </a-tooltip>
                    </router-link>
                    <span v-else>
                      <a-tooltip>
                        <template slot="title">
                          {{ item[1][0][0].account | txidToHex }}
                        </template>
                        <span>
                          {{ item[1][0][0].account | txidToHex | ellipsis }}
                        </span>
                      </a-tooltip>
                    </span>
                  </span>
                </div>
              </td>
              <td>
                <div
                  v-if="tokens && swaps && swaps[swapId] && item[1][0]"
                  class="nowrap"
                >
                  <a-tooltip
                    placement="topLeft"
                    :overlay-style="{
                      whiteSpace: 'nowrap',
                      maxWidth: 'max-content'
                    }"
                  >
                    <template slot="title">
                      <div
                        v-if="
                          item[1][0][0].operation &&
                          Object.keys(item[1][0][0].operation)[0] === 'Swap'
                        "
                      >
                        <div
                          v-if="
                            getStatus(item[1][0][0]) === 'Cancelled' ||
                            getStatus(item[1][0][0]) === 'Failed' ||
                            getStatus(item[1][0][0]) ===
                              'PartiallyCompletedAndCancelled'
                          "
                        >
                          {{ getStatus(item[1][0][0]) }}
                        </div>
                        <div v-else class="swap-info">
                          <span
                            v-if="
                              Object.keys(item[1][0][0].orderMode)[0] ===
                              'OrderBook'
                            "
                            >{{ getStatus(item[1][0][0]) }}:&nbsp;</span
                          >
                          <div v-if="getStatus(item[1][0][0]) === 'Cancelled'">
                            -
                          </div>
                          <div v-else class="flex-center">
                            <div
                              v-if="
                                getStatus(item[1][0][0]) === 'Open' &&
                                item[1][0][0].order.token0Value.length &&
                                Object.keys(
                                  item[1][0][0].order.token0Value[0]
                                )[0] === 'DebitRecord' &&
                                tokens &&
                                tokens[token0Id]
                              "
                            >
                              {{
                                Object.values(
                                  item[1][0][0].order.token0Value[0]
                                )[0] |
                                  bigintToFloat(
                                    tokens[token0Id].decimals,
                                    tokens[token0Id].decimals
                                  )
                              }}<span class="span-nbsp"></span
                              >{{ tokens[token0Id].symbol }}
                            </div>
                            <div
                              v-if="
                                getStatus(item[1][0][0]) === 'Open' &&
                                item[1][0][0].order.token1Value.length &&
                                Object.keys(
                                  item[1][0][0].order.token1Value[0]
                                )[0] === 'DebitRecord' &&
                                tokens &&
                                tokens[token1Id]
                              "
                            >
                              {{
                                Object.values(
                                  item[1][0][0].order.token1Value[0]
                                )[0] |
                                  bigintToFloat(
                                    tokens[token1Id].decimals,
                                    tokens[token1Id].decimals
                                  )
                              }}<span class="span-nbsp"></span
                              >{{ tokens[token1Id].symbol }}
                            </div>
                            <div
                              v-if="
                                getStatus(item[1][0][0]) === 'Filled' &&
                                item[1][0][0].details.length &&
                                Object.keys(
                                  item[1][0][0].details[0].token0Value
                                )[0] === 'DebitRecord' &&
                                tokens &&
                                tokens[token0Id]
                              "
                            >
                              {{
                                Object.values(
                                  item[1][0][0].details[
                                    item[1][0][0].details.length - 1
                                  ].token0Value
                                )[0] |
                                  bigintToFloat(
                                    tokens[token0Id].decimals,
                                    tokens[token0Id].decimals
                                  )
                              }}<span class="span-nbsp"></span
                              >{{ tokens[token0Id].symbol }}
                            </div>
                            <div
                              v-if="
                                getStatus(item[1][0][0]) === 'Filled' &&
                                item[1][0][0].details.length &&
                                Object.keys(
                                  item[1][0][0].details[0].token1Value
                                )[0] === 'DebitRecord' &&
                                tokens &&
                                tokens[token0Id]
                              "
                            >
                              {{
                                Object.values(
                                  item[1][0][0].details[
                                    item[1][0][0].details.length - 1
                                  ].token1Value
                                )[0] |
                                  bigintToFloat(
                                    tokens[token1Id].decimals,
                                    tokens[token1Id].decimals
                                  )
                              }}<span class="span-nbsp"></span
                              >{{ tokens[token1Id].symbol }}
                            </div>
                            <div
                              v-if="
                                getStatus(item[1][0][0]) === 'Filled' &&
                                Object.keys(item[1][0][0].orderMode)[0] ===
                                  'AMM' &&
                                item[1][0][0].filled &&
                                Object.keys(
                                  item[1][0][0].filled.token0Value
                                )[0] === 'DebitRecord' &&
                                tokens &&
                                tokens[token0Id]
                              "
                            >
                              {{
                                Object.values(
                                  item[1][0][0].filled.token0Value
                                )[0] |
                                  bigintToFloat(
                                    tokens[token0Id].decimals,
                                    tokens[token0Id].decimals
                                  )
                              }}<span class="span-nbsp"></span
                              >{{ tokens[token0Id].symbol }}
                            </div>
                            <div
                              v-if="
                                getStatus(item[1][0][0]) === 'Filled' &&
                                Object.keys(item[1][0][0].orderMode)[0] ===
                                  'AMM' &&
                                item[1][0][0].filled &&
                                Object.keys(
                                  item[1][0][0].filled.token1Value
                                )[0] === 'DebitRecord' &&
                                tokens &&
                                tokens[token0Id]
                              "
                            >
                              {{
                                Object.values(
                                  item[1][0][0].filled.token1Value
                                )[0] |
                                  bigintToFloat(
                                    tokens[token1Id].decimals,
                                    tokens[token1Id].decimals
                                  )
                              }}<span class="span-nbsp"></span
                              >{{ tokens[token1Id].symbol }}
                            </div>
                            <span class="span-nbsp"></span>-><span
                              class="span-nbsp"
                            ></span>
                            <div
                              v-if="
                                getStatus(item[1][0][0]) === 'Open' &&
                                item[1][0][0].order.token0Value.length &&
                                Object.keys(
                                  item[1][0][0].order.token0Value[0]
                                )[0] === 'CreditRecord' &&
                                tokens &&
                                tokens[token0Id]
                              "
                            >
                              {{
                                Object.values(
                                  item[1][0][0].order.token0Value[0]
                                )[0] |
                                  bigintToFloat(
                                    tokens[token0Id].decimals,
                                    tokens[token0Id].decimals
                                  )
                              }}<span class="span-nbsp"></span
                              >{{ tokens[token0Id].symbol }}
                            </div>
                            <div
                              v-if="
                                getStatus(item[1][0][0]) === 'Open' &&
                                item[1][0][0].order.token1Value.length &&
                                Object.keys(
                                  item[1][0][0].order.token1Value[0]
                                )[0] === 'CreditRecord' &&
                                tokens &&
                                tokens[token1Id]
                              "
                            >
                              {{
                                Object.values(
                                  item[1][0][0].order.token1Value[0]
                                )[0] |
                                  bigintToFloat(
                                    tokens[token1Id].decimals,
                                    tokens[token1Id].decimals
                                  )
                              }}<span class="span-nbsp"></span
                              >{{ tokens[token1Id].symbol }}
                            </div>
                            <div
                              v-if="
                                getStatus(item[1][0][0]) === 'Filled' &&
                                Object.keys(item[1][0][0].orderMode)[0] ===
                                  'OrderBook' &&
                                item[1][0][0].details.length &&
                                Object.keys(
                                  item[1][0][0].details[0].token0Value
                                )[0] === 'CreditRecord' &&
                                tokens &&
                                tokens[token0Id]
                              "
                            >
                              {{
                                Object.values(
                                  item[1][0][0].details[
                                    item[1][0][0].details.length - 1
                                  ].token0Value
                                )[0] |
                                  bigintToFloat(
                                    tokens[token0Id].decimals,
                                    tokens[token0Id].decimals
                                  )
                              }}<span class="span-nbsp"></span
                              >{{ tokens[token0Id].symbol }}
                            </div>
                            <div
                              v-if="
                                getStatus(item[1][0][0]) === 'Filled' &&
                                Object.keys(item[1][0][0].orderMode)[0] ===
                                  'OrderBook' &&
                                item[1][0][0].details.length &&
                                Object.keys(
                                  item[1][0][0].details[0].token1Value
                                )[0] === 'CreditRecord' &&
                                tokens &&
                                tokens[token0Id]
                              "
                            >
                              {{
                                Object.values(
                                  item[1][0][0].details[
                                    item[1][0][0].details.length - 1
                                  ].token1Value
                                )[0] |
                                  bigintToFloat(
                                    tokens[token1Id].decimals,
                                    tokens[token1Id].decimals
                                  )
                              }}<span class="span-nbsp"></span
                              >{{ tokens[token1Id].symbol }}
                            </div>
                            <div
                              v-if="
                                getStatus(item[1][0][0]) === 'Filled' &&
                                Object.keys(item[1][0][0].orderMode)[0] ===
                                  'AMM' &&
                                item[1][0][0].filled &&
                                Object.keys(
                                  item[1][0][0].filled.token0Value
                                )[0] === 'CreditRecord' &&
                                tokens &&
                                tokens[token0Id]
                              "
                            >
                              {{
                                Object.values(
                                  item[1][0][0].filled.token0Value
                                )[0] |
                                  bigintToFloat(
                                    tokens[token0Id].decimals,
                                    tokens[token0Id].decimals
                                  )
                              }}<span class="span-nbsp"></span
                              >{{ tokens[token0Id].symbol }}
                            </div>
                            <div
                              v-if="
                                getStatus(item[1][0][0]) === 'Filled' &&
                                Object.keys(item[1][0][0].orderMode)[0] ===
                                  'AMM' &&
                                item[1][0][0].filled &&
                                Object.keys(
                                  item[1][0][0].filled.token1Value
                                )[0] === 'CreditRecord' &&
                                tokens &&
                                tokens[token0Id]
                              "
                            >
                              {{
                                Object.values(
                                  item[1][0][0].filled.token1Value
                                )[0] |
                                  bigintToFloat(
                                    tokens[token1Id].decimals,
                                    tokens[token1Id].decimals
                                  )
                              }}<span class="span-nbsp"></span
                              >{{ tokens[token1Id].symbol }}
                            </div>
                          </div>
                        </div>
                        <span
                          v-if="
                            getStatus(item[1][0][0]) !== 'Cancelled' &&
                            getStatus(item[1][0][0]) !== 'Failed' &&
                            getStatus(item[1][0][0]) !==
                              'PartiallyCompletedAndCancelled' &&
                            tokens &&
                            (tokens[token0Id] ||
                              token0Id === 'Cycles' ||
                              token0Id === 'ICP') &&
                            (tokens[token1Id] ||
                              token1Id === 'Cycles' ||
                              token1Id === 'ICP')
                          "
                        >
                          (price:
                          <span> {{ getPrice(item[1][0][0]) }}</span
                          >)
                        </span>
                      </div>
                      <div
                        class="swap-info"
                        v-if="
                          item[1][0][0].operation &&
                          Object.keys(item[1][0][0].operation)[0] ===
                            'AddLiquidity'
                        "
                      >
                        <div
                          v-if="item[1][0][0].filled && token0Id === 'Cycles'"
                        >
                          {{
                            Object.values(item[1][0][0].filled.token0Value)[0] |
                              bigintToFloat(12, 12)
                          }}<span class="span-nbsp"></span>TCycles
                        </div>
                        <div v-if="item[1][0][0].filled && token0Id === 'ICP'">
                          {{
                            Object.values(item[1][0][0].filled.token0Value)[0] |
                              bigintToFloat(8)
                          }}<span class="span-nbsp"></span>ICP
                        </div>
                        <div
                          v-if="
                            item[1][0][0].filled && tokens && tokens[token0Id]
                          "
                        >
                          {{
                            Object.values(item[1][0][0].filled.token0Value)[0] |
                              bigintToFloat(
                                tokens[token0Id].decimals,
                                tokens[token0Id].decimals
                              )
                          }}<span class="span-nbsp"></span
                          >{{ tokens[token0Id].symbol }}
                        </div>
                        <span class="span-nbsp"></span
                        ><a-icon type="plus" /><span class="span-nbsp"></span>
                        <div
                          v-if="item[1][0][0].filled && token1Id === 'Cycles'"
                        >
                          {{
                            Object.values(item[1][0][0].filled.token1Value)[0] |
                              bigintToFloat(12, 12)
                          }}<span class="span-nbsp"></span>TCycles
                        </div>
                        <div v-if="item[1][0][0].filled && token1Id === 'ICP'">
                          {{
                            Object.values(item[1][0][0].filled.token1Value)[0] |
                              bigintToFloat(8)
                          }}<span class="span-nbsp"></span>ICP
                        </div>
                        <div
                          v-if="
                            item[1][0][0].filled && tokens && tokens[token1Id]
                          "
                        >
                          {{
                            Object.values(item[1][0][0].filled.token1Value)[0] |
                              bigintToFloat(
                                tokens[token1Id].decimals,
                                tokens[token1Id].decimals
                              )
                          }}<span class="span-nbsp"></span
                          >{{ tokens[token1Id].symbol }}
                        </div>
                        <div v-if="item[1][0][0].shares && swaps[swapId]">
                          <span class="span-nbsp"></span>-><span
                            class="span-nbsp"
                          ></span
                          >{{
                            item[1][0][0].shares |
                              filterShare(
                                swaps[swapId].decimals,
                                swaps[swapId].decimals
                              )
                          }}<span class="span-nbsp"></span>Shares
                        </div>
                      </div>
                      <div
                        class="swap-info"
                        v-if="
                          item[1][0][0].operation &&
                          Object.keys(item[1][0][0].operation)[0] === 'Claim'
                        "
                      >
                        <div
                          v-if="item[1][0][0].filled && token0Id === 'Cycles'"
                        >
                          {{
                            Object.values(item[1][0][0].filled.token0Value)[0] |
                              bigintToFloat(12, 12)
                          }}<span class="span-nbsp"></span>TCycles
                        </div>
                        <div v-if="item[1][0][0].filled && token0Id === 'ICP'">
                          {{
                            Object.values(item[1][0][0].filled.token0Value)[0] |
                              bigintToFloat(8)
                          }}<span class="span-nbsp"></span>ICP
                        </div>
                        <div
                          v-if="item[1][0][0].filledtokens && tokens[token0Id]"
                        >
                          {{
                            Object.values(item[1][0][0].filled.token0Value)[0] |
                              bigintToFloat(
                                tokens[token0Id].decimals,
                                tokens[token0Id].decimals
                              )
                          }}<span class="span-nbsp"></span
                          >{{ tokens[token0Id].symbol }}
                        </div>
                        <span class="span-nbsp"></span
                        ><a-icon type="plus" /><span class="span-nbsp"></span>
                        <div
                          v-if="item[1][0][0].filled && token1Id === 'Cycles'"
                        >
                          {{
                            Object.values(item[1][0][0].filled.token1Value)[0] |
                              bigintToFloat(12, 12)
                          }}<span class="span-nbsp"></span>TCycles
                        </div>
                        <div v-if="item[1][0][0].filled && token1Id === 'ICP'">
                          {{
                            Object.values(item[1][0][0].filled.token1Value)[0] |
                              bigintToFloat(8)
                          }}<span class="span-nbsp"></span>ICP
                        </div>
                        <div
                          v-if="item[1][0][0].filledtokens && tokens[token1Id]"
                        >
                          {{
                            Object.values(item[1][0][0].filled.token1Value)[0] |
                              bigintToFloat(
                                tokens[token1Id].decimals,
                                tokens[token1Id].decimals
                              )
                          }}<span class="span-nbsp"></span
                          >{{ tokens[token1Id].symbol }}
                        </div>
                      </div>
                      <div
                        class="swap-info"
                        v-if="
                          item[1][0][0].operation &&
                          Object.keys(item[1][0][0].operation)[0] ===
                            'RemoveLiquidity'
                        "
                      >
                        <div v-if="item[1][0][0].shares && swaps[swapId]">
                          {{
                            item[1][0][0].shares |
                              filterShare(
                                swaps[swapId].decimals,
                                swaps[swapId].decimals
                              )
                          }}
                          Shares<span class="span-nbsp"></span>-><span
                            class="span-nbsp"
                          ></span>
                        </div>
                        <div
                          v-if="item[1][0][0].filled && token0Id === 'Cycles'"
                        >
                          {{
                            Object.values(item[1][0][0].filled.token0Value)[0] |
                              bigintToFloat(12, 12)
                          }}<span class="span-nbsp"></span>TCycles
                        </div>
                        <div v-if="item[1][0][0].filled && token0Id === 'ICP'">
                          {{
                            Object.values(item[1][0][0].filled.token0Value)[0] |
                              bigintToFloat(8)
                          }}<span class="span-nbsp"></span>ICP
                        </div>
                        <div
                          v-if="
                            item[1][0][0].filled && tokens && tokens[token0Id]
                          "
                        >
                          {{
                            Object.values(item[1][0][0].filled.token0Value)[0] |
                              bigintToFloat(
                                tokens[token0Id].decimals,
                                tokens[token0Id].decimals
                              )
                          }}<span class="span-nbsp"></span
                          >{{ tokens[token0Id].symbol }}
                        </div>
                        <span class="span-nbsp"></span
                        ><a-icon type="plus" /><span class="span-nbsp"></span>
                        <div
                          v-if="item[1][0][0].filled && token1Id === 'Cycles'"
                        >
                          {{
                            Object.values(item[1][0][0].filled.token1Value)[0] |
                              bigintToFloat(12, 12)
                          }}<span class="span-nbsp"></span>TCycles
                        </div>
                        <div v-if="item[1][0][0].filled && token1Id === 'ICP'">
                          {{
                            Object.values(item[1][0][0].filled.token1Value)[0] |
                              bigintToFloat(8)
                          }}<span class="span-nbsp"></span>ICP
                        </div>
                        <div
                          v-if="
                            item[1][0][0].filled && tokens && tokens[token1Id]
                          "
                        >
                          {{
                            Object.values(item[1][0][0].filled.token1Value)[0] |
                              bigintToFloat(
                                tokens[token1Id].decimals,
                                tokens[token1Id].decimals
                              )
                          }}<span class="span-nbsp"></span
                          >{{ tokens[token1Id].symbol }}
                        </div>
                      </div>
                    </template>
                    <div
                      v-if="
                        item[1][0][0].operation &&
                        Object.keys(item[1][0][0].operation)[0] === 'Swap'
                      "
                    >
                      <div
                        v-if="
                          getStatus(item[1][0][0]) === 'Cancelled' ||
                          getStatus(item[1][0][0]) === 'Failed' ||
                          getStatus(item[1][0][0]) ===
                            'PartiallyCompletedAndCancelled'
                        "
                      >
                        {{ getStatus(item[1][0][0]) }}
                      </div>
                      <div v-else class="swap-info">
                        <span
                          v-if="
                            Object.keys(item[1][0][0].orderMode)[0] ===
                            'OrderBook'
                          "
                          >{{ getStatus(item[1][0][0]) }}:&nbsp;</span
                        >
                        <div v-if="getStatus(item[1][0][0]) === 'Cancelled'">
                          -
                        </div>
                        <div v-else class="flex-center">
                          <div
                            v-if="
                              getStatus(item[1][0][0]) === 'Open' &&
                              item[1][0][0].order.token0Value.length &&
                              Object.keys(
                                item[1][0][0].order.token0Value[0]
                              )[0] === 'DebitRecord' &&
                              tokens &&
                              tokens[token0Id]
                            "
                          >
                            {{
                              Object.values(
                                item[1][0][0].order.token0Value[0]
                              )[0] |
                                bigintToFloat(
                                  token0FeeDecimals,
                                  tokens[token0Id].decimals
                                )
                            }}<span class="span-nbsp"></span
                            >{{ tokens[token0Id].symbol }}
                          </div>
                          <div
                            v-if="
                              getStatus(item[1][0][0]) === 'Open' &&
                              item[1][0][0].order.token1Value.length &&
                              Object.keys(
                                item[1][0][0].order.token1Value[0]
                              )[0] === 'DebitRecord' &&
                              tokens &&
                              tokens[token1Id]
                            "
                          >
                            {{
                              Object.values(
                                item[1][0][0].order.token1Value[0]
                              )[0] |
                                bigintToFloat(
                                  token1FeeDecimals,
                                  tokens[token1Id].decimals
                                )
                            }}<span class="span-nbsp"></span
                            >{{ tokens[token1Id].symbol }}
                          </div>
                          <div
                            v-if="
                              getStatus(item[1][0][0]) === 'Filled' &&
                              Object.keys(item[1][0][0].orderMode)[0] ===
                                'OrderBook' &&
                              item[1][0][0].details.length &&
                              Object.keys(
                                item[1][0][0].details[0].token0Value
                              )[0] === 'DebitRecord' &&
                              tokens &&
                              tokens[token0Id]
                            "
                          >
                            {{
                              Object.values(
                                item[1][0][0].details[
                                  item[1][0][0].details.length - 1
                                ].token0Value
                              )[0] |
                                bigintToFloat(
                                  token0FeeDecimals,
                                  tokens[token0Id].decimals
                                )
                            }}<span class="span-nbsp"></span
                            >{{ tokens[token0Id].symbol }}
                          </div>
                          <div
                            v-if="
                              getStatus(item[1][0][0]) === 'Filled' &&
                              Object.keys(item[1][0][0].orderMode)[0] ===
                                'OrderBook' &&
                              item[1][0][0].details.length &&
                              Object.keys(
                                item[1][0][0].details[0].token1Value
                              )[0] === 'DebitRecord' &&
                              tokens &&
                              tokens[token0Id]
                            "
                          >
                            {{
                              Object.values(
                                item[1][0][0].details[
                                  item[1][0][0].details.length - 1
                                ].token1Value
                              )[0] |
                                bigintToFloat(
                                  token1FeeDecimals,
                                  tokens[token1Id].decimals
                                )
                            }}<span class="span-nbsp"></span
                            >{{ tokens[token1Id].symbol }}
                          </div>
                          <div
                            v-if="
                              getStatus(item[1][0][0]) === 'Filled' &&
                              Object.keys(item[1][0][0].orderMode)[0] ===
                                'AMM' &&
                              item[1][0][0].filled &&
                              Object.keys(
                                item[1][0][0].filled.token0Value
                              )[0] === 'DebitRecord' &&
                              tokens &&
                              tokens[token0Id]
                            "
                          >
                            {{
                              Object.values(
                                item[1][0][0].filled.token0Value
                              )[0] |
                                bigintToFloat(
                                  token0FeeDecimals,
                                  tokens[token0Id].decimals
                                )
                            }}<span class="span-nbsp"></span
                            >{{ tokens[token0Id].symbol }}
                          </div>
                          <div
                            v-if="
                              getStatus(item[1][0][0]) === 'Filled' &&
                              Object.keys(item[1][0][0].orderMode)[0] ===
                                'AMM' &&
                              item[1][0][0].filled &&
                              Object.keys(
                                item[1][0][0].filled.token1Value
                              )[0] === 'DebitRecord' &&
                              tokens &&
                              tokens[token0Id]
                            "
                          >
                            {{
                              Object.values(
                                item[1][0][0].filled.token1Value
                              )[0] |
                                bigintToFloat(
                                  token1FeeDecimals,
                                  tokens[token1Id].decimals
                                )
                            }}<span class="span-nbsp"></span
                            >{{ tokens[token1Id].symbol }}
                          </div>
                          <span class="span-nbsp"></span>-><span
                            class="span-nbsp"
                          ></span>
                          <div
                            v-if="
                              getStatus(item[1][0][0]) === 'Open' &&
                              item[1][0][0].order.token0Value.length &&
                              Object.keys(
                                item[1][0][0].order.token0Value[0]
                              )[0] === 'CreditRecord' &&
                              tokens &&
                              tokens[token0Id]
                            "
                          >
                            {{
                              Object.values(
                                item[1][0][0].order.token0Value[0]
                              )[0] |
                                bigintToFloat(
                                  token0FeeDecimals,
                                  tokens[token0Id].decimals
                                )
                            }}<span class="span-nbsp"></span
                            >{{ tokens[token0Id].symbol }}
                          </div>
                          <div
                            v-if="
                              getStatus(item[1][0][0]) === 'Open' &&
                              item[1][0][0].order.token1Value.length &&
                              Object.keys(
                                item[1][0][0].order.token1Value[0]
                              )[0] === 'CreditRecord' &&
                              tokens &&
                              tokens[token1Id]
                            "
                          >
                            {{
                              Object.values(
                                item[1][0][0].order.token1Value[0]
                              )[0] |
                                bigintToFloat(
                                  token1FeeDecimals,
                                  tokens[token1Id].decimals
                                )
                            }}<span class="span-nbsp"></span
                            >{{ tokens[token1Id].symbol }}
                          </div>
                          <div
                            v-if="
                              getStatus(item[1][0][0]) === 'Filled' &&
                              Object.keys(item[1][0][0].orderMode)[0] ===
                                'OrderBook' &&
                              item[1][0][0].details.length &&
                              Object.keys(
                                item[1][0][0].details[0].token0Value
                              )[0] === 'CreditRecord' &&
                              tokens &&
                              tokens[token0Id]
                            "
                          >
                            {{
                              Object.values(
                                item[1][0][0].details[
                                  item[1][0][0].details.length - 1
                                ].token0Value
                              )[0] |
                                bigintToFloat(
                                  token0FeeDecimals,
                                  tokens[token0Id].decimals
                                )
                            }}<span class="span-nbsp"></span
                            >{{ tokens[token0Id].symbol }}
                          </div>
                          <div
                            v-if="
                              getStatus(item[1][0][0]) === 'Filled' &&
                              Object.keys(item[1][0][0].orderMode)[0] ===
                                'OrderBook' &&
                              item[1][0][0].details.length &&
                              Object.keys(
                                item[1][0][0].details[0].token1Value
                              )[0] === 'CreditRecord' &&
                              tokens &&
                              tokens[token0Id]
                            "
                          >
                            {{
                              Object.values(
                                item[1][0][0].details[
                                  item[1][0][0].details.length - 1
                                ].token1Value
                              )[0] |
                                bigintToFloat(
                                  token1FeeDecimals,
                                  tokens[token1Id].decimals
                                )
                            }}<span class="span-nbsp"></span
                            >{{ tokens[token1Id].symbol }}
                          </div>
                          <div
                            v-if="
                              getStatus(item[1][0][0]) === 'Filled' &&
                              Object.keys(item[1][0][0].orderMode)[0] ===
                                'AMM' &&
                              item[1][0][0].filled &&
                              Object.keys(
                                item[1][0][0].filled.token0Value
                              )[0] === 'CreditRecord' &&
                              tokens &&
                              tokens[token0Id]
                            "
                          >
                            {{
                              Object.values(
                                item[1][0][0].filled.token0Value
                              )[0] |
                                bigintToFloat(
                                  token0FeeDecimals,
                                  tokens[token0Id].decimals
                                )
                            }}<span class="span-nbsp"></span
                            >{{ tokens[token0Id].symbol }}
                          </div>
                          <div
                            v-if="
                              getStatus(item[1][0][0]) === 'Filled' &&
                              Object.keys(item[1][0][0].orderMode)[0] ===
                                'AMM' &&
                              item[1][0][0].filled &&
                              Object.keys(
                                item[1][0][0].filled.token1Value
                              )[0] === 'CreditRecord' &&
                              tokens &&
                              tokens[token0Id]
                            "
                          >
                            {{
                              Object.values(
                                item[1][0][0].filled.token1Value
                              )[0] |
                                bigintToFloat(
                                  token1FeeDecimals,
                                  tokens[token1Id].decimals
                                )
                            }}<span class="span-nbsp"></span
                            >{{ tokens[token1Id].symbol }}
                          </div>
                        </div>
                      </div>
                      <span
                        v-if="
                          getStatus(item[1][0][0]) !== 'Cancelled' &&
                          getStatus(item[1][0][0]) !== 'Failed' &&
                          getStatus(item[1][0][0]) !==
                            'PartiallyCompletedAndCancelled' &&
                          tokens &&
                          (tokens[token0Id] ||
                            token0Id === 'Cycles' ||
                            token0Id === 'ICP') &&
                          (tokens[token1Id] ||
                            token1Id === 'Cycles' ||
                            token1Id === 'ICP')
                        "
                      >
                        (price:
                        <span> {{ getPrice(item[1][0][0]) }}</span
                        >)
                      </span>
                    </div>
                    <div
                      class="swap-info"
                      v-if="
                        item[1][0][0].operation &&
                        Object.keys(item[1][0][0].operation)[0] ===
                          'AddLiquidity'
                      "
                    >
                      <div v-if="item[1][0][0].filled && token0Id === 'Cycles'">
                        {{
                          Object.values(item[1][0][0].filled.token0Value)[0] |
                            bigintToFloat(4, 12)
                        }}<span class="span-nbsp"></span>TCycles
                      </div>
                      <div v-if="item[1][0][0].filled && token0Id === 'ICP'">
                        {{
                          Object.values(item[1][0][0].filled.token0Value)[0] |
                            bigintToFloat(4)
                        }}<span class="span-nbsp"></span>ICP
                      </div>
                      <div
                        v-if="
                          item[1][0][0].filled && tokens && tokens[token0Id]
                        "
                      >
                        {{
                          Object.values(item[1][0][0].filled.token0Value)[0] |
                            bigintToFloat(
                              token0FeeDecimals,
                              tokens[token0Id].decimals
                            )
                        }}<span class="span-nbsp"></span
                        >{{ tokens[token0Id].symbol }}
                      </div>
                      <span class="span-nbsp"></span><a-icon type="plus" /><span
                        class="span-nbsp"
                      ></span>
                      <div v-if="item[1][0][0].filled && token1Id === 'Cycles'">
                        {{
                          Object.values(item[1][0][0].filled.token1Value)[0] |
                            bigintToFloat(4, 12)
                        }}<span class="span-nbsp"></span>TCycles
                      </div>
                      <div v-if="item[1][0][0].filled && token1Id === 'ICP'">
                        {{
                          Object.values(item[1][0][0].filled.token1Value)[0] |
                            bigintToFloat(4)
                        }}<span class="span-nbsp"></span>ICP
                      </div>
                      <div
                        v-if="
                          item[1][0][0].filled && tokens && tokens[token1Id]
                        "
                      >
                        {{
                          Object.values(item[1][0][0].filled.token1Value)[0] |
                            bigintToFloat(
                              token1FeeDecimals,
                              tokens[token1Id].decimals
                            )
                        }}<span class="span-nbsp"></span
                        >{{ tokens[token1Id].symbol }}
                      </div>
                      <div v-if="item[1][0][0].shares && swaps[swapId]">
                        <span class="span-nbsp"></span>-><span
                          class="span-nbsp"
                        ></span
                        >{{
                          item[1][0][0].shares |
                            filterShare(swaps[swapId].decimals, 4)
                        }}<span class="span-nbsp"></span>Shares
                      </div>
                    </div>
                    <div
                      class="swap-info"
                      v-if="
                        item[1][0][0].operation &&
                        Object.keys(item[1][0][0].operation)[0] === 'Claim'
                      "
                    >
                      <div v-if="item[1][0][0].filled && token0Id === 'Cycles'">
                        {{
                          Object.values(item[1][0][0].filled.token0Value)[0] |
                            bigintToFloat(4, 12)
                        }}<span class="span-nbsp"></span>TCycles
                      </div>
                      <div v-if="item[1][0][0].filled && token0Id === 'ICP'">
                        {{
                          Object.values(item[1][0][0].filled.token0Value)[0] |
                            bigintToFloat(4)
                        }}<span class="span-nbsp"></span>ICP
                      </div>
                      <div
                        v-if="
                          item[1][0][0].filled && tokens && tokens[token0Id]
                        "
                      >
                        {{
                          Object.values(item[1][0][0].filled.token0Value)[0] |
                            bigintToFloat(
                              token0FeeDecimals,
                              tokens[token0Id].decimals
                            )
                        }}<span class="span-nbsp"></span
                        >{{ tokens[token0Id].symbol }}
                      </div>
                      <span class="span-nbsp"></span><a-icon type="plus" /><span
                        class="span-nbsp"
                      ></span>
                      <div v-if="item[1][0][0].filled && token1Id === 'Cycles'">
                        {{
                          Object.values(item[1][0][0].filled.token1Value)[0] |
                            bigintToFloat(token1FeeDecimals, 12)
                        }}<span class="span-nbsp"></span>TCycles
                      </div>
                      <div v-if="item[1][0][0].filled && token1Id === 'ICP'">
                        {{
                          Object.values(item[1][0][0].filled.token1Value)[0] |
                            bigintToFloat(4)
                        }}<span class="span-nbsp"></span>ICP
                      </div>
                      <div
                        v-if="
                          item[1][0][0].filled && tokens && tokens[token1Id]
                        "
                      >
                        {{
                          Object.values(item[1][0][0].filled.token1Value)[0] |
                            bigintToFloat(
                              token1FeeDecimals,
                              tokens[token1Id].decimals
                            )
                        }}<span class="span-nbsp"></span
                        >{{ tokens[token1Id].symbol }}
                      </div>
                    </div>
                    <div
                      class="swap-info"
                      v-if="
                        item[1][0][0].operation &&
                        Object.keys(item[1][0][0].operation)[0] ===
                          'RemoveLiquidity'
                      "
                    >
                      <div v-if="item[1][0][0].shares && swaps[swapId]">
                        {{
                          item[1][0][0].shares |
                            filterShare(swaps[swapId].decimals, 4)
                        }}
                        Shares<span class="span-nbsp"></span>-><span
                          class="span-nbsp"
                        ></span>
                      </div>
                      <div v-if="item[1][0][0].filled && token0Id === 'Cycles'">
                        {{
                          Object.values(item[1][0][0].filled.token0Value)[0] |
                            bigintToFloat(4, 12)
                        }}<span class="span-nbsp"></span>TCycles
                      </div>
                      <div v-if="item[1][0][0].filled && token0Id === 'ICP'">
                        {{
                          Object.values(item[1][0][0].filled.token0Value)[0] |
                            bigintToFloat(4)
                        }}<span class="span-nbsp"></span>ICP
                      </div>
                      <div
                        v-if="
                          item[1][0][0].filled && tokens && tokens[token0Id]
                        "
                      >
                        {{
                          Object.values(item[1][0][0].filled.token0Value)[0] |
                            bigintToFloat(
                              token0FeeDecimals,
                              tokens[token0Id].decimals
                            )
                        }}<span class="span-nbsp"></span
                        >{{ tokens[token0Id].symbol }}
                      </div>
                      <span class="span-nbsp"></span><a-icon type="plus" /><span
                        class="span-nbsp"
                      ></span>
                      <div v-if="item[1][0][0].filled && token1Id === 'Cycles'">
                        {{
                          Object.values(item[1][0][0].filled.token1Value)[0] |
                            bigintToFloat(4, 12)
                        }}<span class="span-nbsp"></span>TCycles
                      </div>
                      <div v-if="item[1][0][0].filled && token1Id === 'ICP'">
                        {{
                          Object.values(item[1][0][0].filled.token1Value)[0] |
                            bigintToFloat(4)
                        }}<span class="span-nbsp"></span>ICP
                      </div>
                      <div
                        v-if="
                          item[1][0][0].filled && tokens && tokens[token1Id]
                        "
                      >
                        {{
                          Object.values(item[1][0][0].filled.token1Value)[0] |
                            bigintToFloat(
                              token1FeeDecimals,
                              tokens[token1Id].decimals
                            )
                        }}<span class="span-nbsp"></span
                        >{{ tokens[token1Id].symbol }}
                      </div>
                    </div>
                  </a-tooltip>
                </div>
              </td>
              <td>
                <span v-if="item[1][0]">{{ item[1][0][0].nonce }}</span>
              </td>
              <td>
                <div v-if="item[1][0]" class="nowrap">
                  <a-tooltip
                    placement="topLeft"
                    :overlay-style="{
                      whiteSpace: 'nowrap',
                      maxWidth: 'max-content'
                    }"
                  >
                    <template slot="title">
                      <div class="nowrap-fee">
                        <div
                          v-if="
                            item[1][0][0].fee && item[1][0][0].fee.token0Fee
                          "
                        >
                          <div v-if="tokens && tokens[token0Id]">
                            {{
                              item[1][0][0].fee.token0Fee |
                                bigintToFloat(
                                  tokens[token0Id].decimals,
                                  tokens[token0Id].decimals
                                )
                            }}
                            {{ tokens[token0Id].symbol }}
                          </div>
                          <div v-if="token0Id === 'Cycles'">
                            {{
                              item[1][0][0].fee.token0Fee |
                                bigintToFloat(12, 12)
                            }}
                            TCycles
                          </div>
                          <div v-if="token0Id === 'ICP'">
                            {{ item[1][0][0].fee.token0Fee | bigintToFloat(8) }}
                            ICP
                          </div>
                        </div>
                        <div
                          v-if="
                            item[1][0][0].fee && item[1][0][0].fee.token1Fee
                          "
                        >
                          <div v-if="tokens && tokens[token1Id]">
                            {{
                              item[1][0][0].fee.token1Fee |
                                bigintToFloat(
                                  tokens[token1Id].decimals,
                                  tokens[token1Id].decimals
                                )
                            }}
                            {{ tokens[token1Id].symbol }}
                          </div>
                          <div v-if="token1Id === 'Cycles'">
                            {{
                              item[1][0][0].fee.token1Fee |
                                bigintToFloat(12, 12)
                            }}
                            TCycles
                          </div>
                          <div v-if="token1Id === 'ICP'">
                            {{ item[1][0][0].fee.token1Fee | bigintToFloat(8) }}
                            ICP
                          </div>
                        </div>
                      </div>
                    </template>
                    <div class="nowrap-fee">
                      <div
                        v-if="item[1][0][0].fee && item[1][0][0].fee.token0Fee"
                      >
                        <div v-if="tokens && tokens[token0Id]">
                          {{
                            item[1][0][0].fee.token0Fee |
                              bigintToFloat(
                                token0FeeDecimals,
                                tokens[token0Id].decimals
                              )
                          }}
                          {{ tokens[token0Id].symbol }}
                        </div>
                        <div v-if="token0Id === 'Cycles'">
                          {{
                            item[1][0][0].fee.token0Fee | bigintToFloat(4, 12)
                          }}
                          TCycles
                        </div>
                        <div v-if="token0Id === 'ICP'">
                          {{ item[1][0][0].fee.token0Fee | bigintToFloat(4) }}
                          ICP
                        </div>
                      </div>
                      <div
                        v-if="item[1][0][0].fee && item[1][0][0].fee.token1Fee"
                      >
                        <div v-if="tokens && tokens[token1Id]">
                          {{
                            item[1][0][0].fee.token1Fee |
                              bigintToFloat(
                                token1FeeDecimals,
                                tokens[token1Id].decimals
                              )
                          }}
                          {{ tokens[token1Id].symbol }}
                        </div>
                        <div v-if="token1Id === 'Cycles'">
                          {{
                            item[1][0][0].fee.token1Fee | bigintToFloat(4, 12)
                          }}
                          TCycles
                        </div>
                        <div v-if="token1Id === 'ICP'">
                          {{ item[1][0][0].fee.token1Fee | bigintToFloat(4) }}
                          ICP
                        </div>
                      </div>
                    </div>
                  </a-tooltip>
                  <div
                    v-if="
                      item[1][0][0].fee &&
                      !item[1][0][0].fee.token1Fee &&
                      !item[1][0][0].fee.token0Fee
                    "
                  >
                    NoFee
                  </div>
                </div>
              </td>
              <td>
                <span v-if="item[1][0]">
                  {{ item[1][0][1] | formatDateFromNanosecond }}
                </span>
              </td>
            </tr>
            <tr v-if="!spinning && accountPage.total === 0">
              <td colspan="8" style="text-align: center; font-size: 14px">
                No data
              </td>
            </tr>
          </tbody>
        </table>
        <div class="transactions-pagination-bottom">
          <a-pagination
            v-if="accountPage.total > accountPage.pageSize"
            class="transactions-pagination"
            v-model="accountPage.current"
            :total="accountPage.total"
            :defaultPageSize="accountPage.pageSize"
            :showQuickJumper="true"
            @change="pageChangeAccount"
          />
        </div>
      </a-spin>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import BigNumber from 'bignumber.js';
import { Principal } from '@dfinity/principal';
import {
  Gas,
  SwapInfo,
  Time,
  TokenId,
  TokenInfo,
  TokenType,
  Txid
} from '@/ic/common/icType';
import { getTokenInfo } from '@/ic/getTokenInfo';
import {
  OperationType,
  ShareChange,
  TxnRecord,
  TxnResult
} from '@/ic/DRC205Bucket/model';
import { DRC205SwapService } from '@/ic/DRC205Swap/DRC205SwapService';
import { generateSwapTxid, hexToBytes, toHexString } from '@/ic/converter';
import { getSwapInfo } from '@/ic/getSwapInfo';
import { DRC205BucketService } from '@/ic/DRC205Bucket/DRC205BucketService';
import { DRC205ProxyService } from '@/ic/DRC205Proxy/DRC205ProxyService';
import { AppId } from '@/ic/DRC205Proxy/model';
import { CYCLES_FINANCE_CANISTER_ID, LEDGER_CANISTER_ID } from '@/ic/utils';

@Component({
  name: 'Index',
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
  @Prop({ type: String, default: '' })
  public swapId!: string;
  @Prop({ type: String, default: '' })
  public accountId!: string;
  @Prop({ type: String, default: '' })
  public principal!: string;
  private DRC205ProxyService: DRC205ProxyService;
  private swaps: { [key: string]: SwapInfo };
  private tokens: { [key: string]: TokenInfo } = {};
  private token0Id: string = null;
  private token1Id: string = null;
  private transactionsLoading = false;
  private isICRC = false;
  private token0FeeDecimals = 4;
  private token1FeeDecimals = 4;
  private transactions: Array<TxnRecord> = [];
  private transactionsAccount: Array<[AppId, Array<TxnResult>]> = [];
  private page = {
    current: 1,
    pageSize: 20,
    onChange: this.pageChange,
    hideOnSinglePage: true,
    showQuickJumper: true
  };
  private transactionsMaxPage = 1;
  private accountPage = {
    current: 1,
    pageSize: 20,
    total: 0,
    onChange: this.pageChangeAccount,
    hideOnSinglePage: true,
    showQuickJumper: true
  };
  private bucket = '';
  private spinning = false;
  private columnsTransactions = [
    {
      title: 'Index',
      dataIndex: 'index',
      customRender: (text: bigint): string => {
        if (text || text === BigInt(0)) {
          return text.toString();
        } else {
          return '';
        }
      }
    },
    {
      title: 'Operation',
      dataIndex: 'operation',
      customRender: (text: OperationType): string => {
        if (text) {
          return Object.keys(text)[0];
        } else {
          return '';
        }
      }
    },
    {
      title: 'Txid',
      dataIndex: 'txid',
      scopedSlots: { customRender: 'Txid' }
    },
    {
      title: 'Account',
      dataIndex: 'account',
      scopedSlots: { customRender: 'Account' }
    },
    {
      title: 'Swap',
      dataIndex: 'value',
      scopedSlots: { customRender: 'Value' }
    },
    {
      title: 'Nonce',
      dataIndex: 'nonce',
      customRender: (text: bigint): string => {
        if (text || text === BigInt(0)) {
          return text.toString();
        } else {
          return '';
        }
      }
    },
    {
      title: 'Fee',
      dataIndex: 'fee',
      scopedSlots: { customRender: 'Fee' }
    },
    {
      title: 'Time',
      dataIndex: 'time',
      scopedSlots: { customRender: 'TxTime' }
    }
  ];
  private scroll = {
    x: false
  };
  private innerWidth =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth;
  mounted(): void {
    window.onresize = () => {
      this.innerWidth =
        window.innerWidth ||
        document.documentElement.clientWidth ||
        document.body.clientWidth;
      if (this.innerWidth <= 1200) {
        this.scroll = {
          x: true
        };
      } else {
        this.scroll = {
          x: false
        };
      }
    };
    if (this.innerWidth <= 1200) {
      this.scroll = {
        x: true
      };
    } else {
      this.scroll = {
        x: false
      };
    }
  }
  @Watch('innerWidth')
  private onresize(innerWidth: number) {
    if (innerWidth <= 1200) {
      this.scroll = {
        x: true
      };
    } else {
      this.scroll = {
        x: false
      };
    }
  }
  private async init(): Promise<void> {
    this.DRC205ProxyService = new DRC205ProxyService();
    this.tokens = JSON.parse(localStorage.getItem('tokens')) || {};
    this.swaps = JSON.parse(localStorage.getItem('swaps')) || {};
    if (!this.swaps[this.swapId]) {
      this.swaps[this.swapId] = await getSwapInfo(Principal.from(this.swapId));
      this.$forceUpdate();
      localStorage.setItem(
        'swaps',
        JSON.stringify(this.swaps, (key, value) =>
          typeof value === 'bigint' ? value.toString() : value
        )
      );
    }
    if (this.swaps[this.swapId].token0[1]) {
      const tokenStd = Object.keys(this.swaps[this.swapId].token0[1])[0];
      if (tokenStd && tokenStd.toLocaleLowerCase().includes('icrc')) {
        this.isICRC = true;
      }
      this.token0Id = this.getTokenId(this.swaps[this.swapId].token0[0], true);
    }
    if (this.swaps[this.swapId].token1[1]) {
      const tokenStd = Object.keys(this.swaps[this.swapId].token1[1])[0];
      if (tokenStd && tokenStd.toLocaleLowerCase().includes('icrc')) {
        this.isICRC = true;
      }
      this.token1Id = this.getTokenId(this.swaps[this.swapId].token1[0], false);
    }
    this.transactions = [];
    this.page.current = 1;
    this.bucket = '';
    this.transactionsAccount = [];
    this.accountPage.current = 1;
    this.accountPage.total = 0;
    this.transactionsMaxPage = 1;
    this.getTxns();
  }
  private getTokenFeeDecimals(tokenId: string, isToken0 = true): void {
    const tokenFee = this.tokens[tokenId].fee;
    let fee;
    if (typeof tokenFee === 'bigint') {
      fee = tokenFee.toString(10);
    } else if (typeof tokenFee === 'string') {
      fee = tokenFee;
    } else {
      fee = new BigNumber(
        Object.values(tokenFee as Gas)[0].toString(10)
      ).toString(10);
    }
    const decimals = this.tokens[tokenId].decimals - fee.length + 1;
    if (isToken0) {
      this.token0FeeDecimals = decimals;
    } else {
      this.token1FeeDecimals = decimals;
    }
  }
  private getTokenId(tokenType: TokenType, isToken0 = true): string {
    const tokenId = (tokenType as { Token: string }).Token;
    if (tokenId) {
      if (!this.tokens[tokenId]) {
        this.tokens[tokenId] = {
          name: '',
          symbol: '',
          decimals: 8,
          fee: { noFee: null },
          totalSupply: null,
          maxSupply: null,
          logo: ''
        };
        getTokenInfo(Principal.from(tokenId)).then((tokenInfo) => {
          this.$set(this.tokens, tokenId, tokenInfo);
          this.getTokenFeeDecimals(tokenId, isToken0);
        });
      } else {
        this.getTokenFeeDecimals(tokenId, isToken0);
      }
      return tokenId;
    } else {
      if ((tokenType as { Cycles: null }).Cycles === null) {
        return CYCLES_FINANCE_CANISTER_ID;
      } else if ((tokenType as { Icp: null }).Icp === null) {
        return LEDGER_CANISTER_ID;
      }
    }
  }
  private pageChange(page: number): void {
    this.page.current = page;
    // this.getTxn();
  }
  private pageChangeAccount(): void {
    this.getTxn();
  }
  private async getTxn(): Promise<void> {
    this.spinning = true;
    try {
      if (!this.bucket) {
        const bucketList = await this.DRC205ProxyService.bucketList();
        console.log(bucketList);
        for (let i = 0; i < bucketList.length; i++) {
          const currentDRC205BucketService = new DRC205BucketService(
            bucketList[i].toString()
          );
          const res = await currentDRC205BucketService.txnByAccountId(
            Array.from(hexToBytes(this.accountId)),
            [Principal.from(this.swapId)],
            [1],
            [1]
          );
          console.log(res);
          if (res && res.total) {
            this.bucket = bucketList[i].toString();
            this.accountPage.total = Number(res.data[0][1][0][0].nonce) + 1;
            break;
          }
        }
      }
      console.log('bucket: ' + this.bucket);
      if (this.bucket) {
        const currentDRC205BucketService = new DRC205BucketService(this.bucket);
        const res = await currentDRC205BucketService.txnByAccountId(
          Array.from(hexToBytes(this.accountId)),
          [Principal.from(this.swapId)],
          [this.accountPage.current],
          [this.accountPage.pageSize]
        );
        console.log(res);
        const removeDuplicateObj = (arr) => {
          let obj = {};
          arr = arr.reduce((newArr, next) => {
            obj[this.txidToHexString(next[1][0][0].txid)]
              ? ''
              : (obj[this.txidToHexString(next[1][0][0].txid)] =
                  true && newArr.push(next));
            return newArr;
          }, []);
          return arr;
        };
        // this.transactionsAccount = removeDuplicateObj(res.data);
        if (res.data.length === this.accountPage.pageSize) {
          this.transactionsAccount = removeDuplicateObj(res.data);
        } else {
          if (res.data.length < this.accountPage.pageSize) {
            const maxNonce =
              this.accountPage.total -
              (this.accountPage.current - 1) * this.accountPage.pageSize -
              res.data.length -
              1;
            const minNonce = Math.max(
              maxNonce - this.accountPage.pageSize + res.data.length + 1,
              0
            );
            console.log(minNonce, maxNonce);
            const promiseValue = [];
            for (let i = maxNonce; i >= minNonce; i--) {
              const txid = generateSwapTxid(this.swapId, this.accountId, i);
              promiseValue.push(
                this.getDRC205BucketTxn(
                  currentDRC205BucketService,
                  this.swapId,
                  txid
                )
              );
            }
            let value = await Promise.all(promiseValue);
            value = value.filter((item) => item[1].length);
            console.log(value);
            this.transactionsAccount = removeDuplicateObj(
              res.data.concat(value)
            );
          }
        }
      } else {
        const DRC205Swap = new DRC205SwapService(this.swapId);
        let nonce = 0;
        try {
          const res = await DRC205Swap.getTxAccount(this.accountId);
          nonce = Number(res[2]);
        } catch (e) {
          const res = await DRC205Swap.count([this.accountId]);
          nonce = Number(res);
        }
        console.log(nonce);
        if (nonce) {
          this.accountPage.total = nonce;
          const maxNonce =
            this.accountPage.total -
            (this.accountPage.current - 1) * this.accountPage.pageSize -
            1;
          const minNonce = Math.max(
            maxNonce - this.accountPage.pageSize + 1,
            0
          );
          console.log(minNonce, maxNonce);
          const promiseValue = [];
          for (let i = maxNonce; i >= minNonce; i--) {
            const txid = generateSwapTxid(this.swapId, this.accountId, i);
            promiseValue.push(this.drc205_txn(txid));
          }
          const value = await Promise.all(promiseValue);
          console.log(value);
          this.transactionsAccount = value;
        }
      }
    } catch (e) {
      console.error(e);
    }
    this.spinning = false;
  }
  private async getDRC205BucketTxn(
    currentDRC205BucketService: DRC205BucketService,
    swapId: string,
    txid
  ): Promise<[AppId, Array<TxnResult>]> {
    const res = await currentDRC205BucketService.txn(
      Principal.from(swapId),
      txid
    );
    return [Principal.from(swapId), res];
  }
  private async drc205_txn(
    txid: Array<number>
  ): Promise<[AppId, Array<TxnResult>]> {
    try {
      const DRC205Swap = new DRC205SwapService(this.swapId);
      const res = await DRC205Swap.drc205_txn(txid);
      console.log(res);
      if (res && res.length) {
        return [Principal.from(this.swapId), [[res[0], res[0].time]]];
      } else {
        return [Principal.from(this.swapId), []];
      }
    } catch (e) {
      console.error(e);
      return [Principal.from(this.swapId), []];
    }
  }
  private async getTxns(): Promise<void> {
    this.transactionsLoading = true;
    try {
      const DRC205Swap = new DRC205SwapService(this.swapId);
      // todo, address transactions
      if (this.accountId || (this.principal && this.principal !== '-')) {
        // let transaction = this.transactions.find((transaction) => {
        //   return transaction.msgCaller[0];
        // });
        // if (transaction) {
        //   this.$emit('msgCaller', transaction.msgCaller[0].toString());
        // }
        // let nonceTransaction;
        // this.transactions.forEach((transaction) => {
        //   if (!nonceTransaction) {
        //     nonceTransaction = transaction.nonce;
        //   } else {
        //     if (
        //       new BigNumber(transaction.nonce.toString(10)).lt(
        //         nonceTransaction.toString(10)
        //       )
        //     ) {
        //       nonceTransaction = transaction.nonce;
        //     }
        //   }
        // });
        // if (nonceTransaction) {
        //   const nonce = Number(nonceTransaction);
        //   for (let i = nonce - 1; i >= 0; i--) {
        //     const moreTxnRecord = new MoreTxnRecord();
        //     moreTxnRecord.txid = generateSwapTxid(
        //       this.swapId,
        //       this.accountId,
        //       i
        //     );
        //     moreTxnRecord.nonce = BigInt(i);
        //     this.transactions.push(moreTxnRecord);
        //   }
        // }
        this.getTxn();
      } else {
        let res;
        try {
          res = await DRC205Swap.drc205_events([]);
        } catch (e) {
          const now = new Date().getTime();
          const start = new BigNumber(now)
            .minus(30 * 24 * 60 * 60 * 1000)
            .times(10 ** 6)
            .toString(10);
          res = await DRC205Swap.drc205_events_filter([], [BigInt(start)], []);
        }
        console.log(res);
        if (res && res.length) {
          const removeDuplicateObj = (arr) => {
            let obj = {};
            arr = arr.reduce((newArr, next) => {
              obj[this.txidToHexString(next.txid)]
                ? ''
                : (obj[this.txidToHexString(next.txid)] =
                    true && newArr.push(next));
              return newArr;
            }, []);
            return arr;
          };
          this.transactions = removeDuplicateObj(res);
        }
      }
    } catch (e) {
      console.log(e);
    }
    console.log(this.transactions);
    this.transactionsLoading = false;
  }
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
  private txidToHexString = (val: Array<number>): string => {
    return toHexString(new Uint8Array(val));
  };
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
  private getPrice(val: TxnRecord): string {
    let price1 = '';
    let token0decimals: number;
    let token1decimals: number;
    let token0Symbol: string;
    let token1Symbol: string;
    if (this.token0Id === 'Cycles') {
      token0decimals = 12;
      token0Symbol = 'TCycles';
    } else if (this.token0Id === 'ICP') {
      token0decimals = 8;
      token0Symbol = 'ICP';
    } else {
      token0decimals = this.tokens[this.token0Id].decimals;
      token0Symbol = this.tokens[this.token0Id].symbol;
    }
    if (this.token1Id === 'Cycles') {
      token1decimals = 12;
      token1Symbol = 'TCycles';
    } else if (this.token1Id === 'ICP') {
      token1decimals = 8;
      token1Symbol = 'ICP';
    } else {
      token1decimals = this.tokens[this.token1Id].decimals;
      token1Symbol = this.tokens[this.token1Id].symbol;
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
    } else if (Number(token0Value) === 0) {
      price1 = '-';
    } else {
      price1 = new BigNumber(token1Value.toString(10))
        .div(10 ** token1decimals)
        .div(token0Value.toString(10))
        .times(10 ** token0decimals)
        .decimalPlaces(token1decimals)
        .toString(10);
    }
    return `1 ${token0Symbol} = ${price1} ${token1Symbol}`;
  }
}
</script>

<style scoped lang="scss">
.swap-info {
  display: flex;
  align-items: center;
}
.flex-center {
  display: flex;
  align-items: center;
}
.nowrap-fee {
  display: flex;
  align-items: flex-start;
  flex-direction: column;
}
.swaps-transactions-account {
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
  .transactions-pagination-bottom {
    display: flex;
    .transactions-pagination {
      margin: 15px 0 15px auto;
    }
  }
}
</style>
