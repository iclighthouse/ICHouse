<template>
  <div class="tx-details">
    <div class="tx-main">
      <div class="tx-main-title"><a-icon type="swap" /> Transaction</div>
      <a-spin :spinning="spinning">
        <div class="tx-item">
          <div class="tx-item-left">Swapping Pair:</div>
          <div class="tx-item-right" v-if="swapId">
            <router-link :to="jumpRouter(`/swap/${swapId}`)">
              {{ swapId }} </router-link
            ><span class="span-nbsp"></span
            ><a-icon
              type="copy"
              v-clipboard:copy="swapId"
              v-clipboard:success="onCopy"
            />
          </div>
        </div>
        <div class="tx-item">
          <div class="tx-item-left">Txid:</div>
          <div class="tx-item-right">
            {{ txid }}<span class="span-nbsp"></span
            ><a-icon
              type="copy"
              v-clipboard:copy="txid"
              v-clipboard:success="onCopy"
            />
          </div>
        </div>
        <div v-if="!showErr">
          <div class="tx-item">
            <div class="tx-item-left">Caller:</div>
            <div class="tx-item-right" v-if="transaction && transaction.length">
              <div
                v-if="
                  isICRC &&
                  transaction[transaction.length - 1][0].msgCaller.length
                "
                class="tx-item-right-swap"
              >
                <div>
                  <router-link
                    :to="
                      jumpRouter(
                        `/swap/address/${swapId}/${transaction[
                          transaction.length - 1
                        ][0].msgCaller[0].toString()}`
                      )
                    "
                  >
                    {{
                      transaction[
                        transaction.length - 1
                      ][0].msgCaller[0].toString()
                    }} </router-link
                  ><span class="span-nbsp"></span>
                  <a-icon
                    type="copy"
                    v-clipboard:copy="
                      transaction[
                        transaction.length - 1
                      ][0].msgCaller[0].toString()
                    "
                    v-clipboard:success="onCopy"
                  />
                </div>
                <span
                  v-if="
                    hasSubaccount(transaction[transaction.length - 1][0].caller)
                  "
                  >(subaccount:
                  {{
                    transaction[transaction.length - 1][0].caller | txidToHex
                  }})</span
                >
              </div>
              <div
                v-show="
                  !isICRC ||
                  !transaction[transaction.length - 1][0].msgCaller.length
                "
              >
                <router-link
                  :to="
                    jumpRouter(
                      `/swap/address/${swapId}/${arrayToHexString(
                        transaction[transaction.length - 1][0].caller
                      )}`
                    )
                  "
                >
                  {{
                    transaction[transaction.length - 1][0].caller | txidToHex
                  }} </router-link
                ><span class="span-nbsp"></span>
                <a-icon
                  type="copy"
                  v-clipboard:copy="
                    arrayToHexString(
                      transaction[transaction.length - 1][0].caller
                    )
                  "
                  v-clipboard:success="onCopy"
                />
              </div>
            </div>
            <div class="tx-item-right" v-else>-</div>
          </div>
          <div class="tx-item">
            <div class="tx-item-left">Account:</div>
            <div class="tx-item-right" v-if="transaction && transaction.length">
              {{ transaction[transaction.length - 1][0].account | txidToHex
              }}<span class="span-nbsp"></span
              ><a-icon
                type="copy"
                v-clipboard:copy="
                  arrayToHexString(
                    transaction[transaction.length - 1][0].account
                  )
                "
                v-clipboard:success="onCopy"
              />
            </div>
            <div class="tx-item-right" v-else>-</div>
          </div>
          <div class="tx-item">
            <div class="tx-item-left">Operation:</div>
            <div class="tx-item-right" v-if="transaction && transaction.length">
              <div
                class="tx-item-right-swap"
                v-if="
                  Object.keys(
                    transaction[transaction.length - 1][0].operation
                  )[0] === 'Swap'
                "
              >
                <div
                  v-if="
                    Object.keys(
                      transaction[transaction.length - 1][0].orderMode
                    )[0] === 'AMM'
                  "
                >
                  {{
                    Object.keys(
                      transaction[transaction.length - 1][0].operation
                    )[0]
                  }}:
                  <span
                    v-if="
                      Object.keys(
                        transaction[transaction.length - 1][0].filled
                          .token0Value
                      )[0] === 'DebitRecord' &&
                      tokens &&
                      tokens[
                        getTokenId(
                          transaction[transaction.length - 1][0].token0
                        )
                      ]
                    "
                  >
                    {{
                      Object.values(
                        transaction[transaction.length - 1][0].filled
                          .token0Value
                      )[0] |
                        bigintToFloat(
                          tokens[
                            getTokenId(
                              transaction[transaction.length - 1][0].token0
                            )
                          ].decimals,
                          tokens[
                            getTokenId(
                              transaction[transaction.length - 1][0].token0
                            )
                          ].decimals
                        )
                    }}
                    {{
                      tokens[
                        getTokenId(
                          transaction[transaction.length - 1][0].token0
                        )
                      ].symbol
                    }}
                  </span>
                  <span
                    v-if="
                      Object.keys(
                        transaction[transaction.length - 1][0].filled
                          .token1Value
                      )[0] === 'DebitRecord' &&
                      tokens &&
                      tokens[
                        getTokenId(
                          transaction[transaction.length - 1][0].token1
                        )
                      ]
                    "
                  >
                    {{
                      Object.values(
                        transaction[transaction.length - 1][0].filled
                          .token1Value
                      )[0] |
                        bigintToFloat(
                          tokens[
                            getTokenId(
                              transaction[transaction.length - 1][0].token1
                            )
                          ].decimals,
                          tokens[
                            getTokenId(
                              transaction[transaction.length - 1][0].token1
                            )
                          ].decimals
                        )
                    }}
                    {{
                      tokens[
                        getTokenId(
                          transaction[transaction.length - 1][0].token1
                        )
                      ].symbol
                    }}
                  </span>
                  <span
                    v-if="
                      Object.keys(
                        transaction[transaction.length - 1][0].filled
                          .token0Value
                      )[0] === 'DebitRecord' &&
                      getTokenId(
                        transaction[transaction.length - 1][0].token0
                      ) === 'Cycles'
                    "
                  >
                    {{
                      Object.values(
                        transaction[transaction.length - 1][0].filled
                          .token0Value
                      )[0] | bigintToFloat(12, 12)
                    }}
                    TCycles
                  </span>
                  <span
                    v-if="
                      Object.keys(
                        transaction[transaction.length - 1][0].filled
                          .token1Value
                      )[0] === 'DebitRecord' &&
                      getTokenId(
                        transaction[transaction.length - 1][0].token1
                      ) === 'Cycles'
                    "
                  >
                    {{
                      Object.values(
                        transaction[transaction.length - 1][0].filled
                          .token1Value
                      )[0] | bigintToFloat(12, 12)
                    }}
                    TCycles
                  </span>
                  <span
                    v-if="
                      Object.keys(
                        transaction[transaction.length - 1][0].filled
                          .token0Value
                      )[0] === 'DebitRecord' &&
                      getTokenId(
                        transaction[transaction.length - 1][0].token0
                      ) === 'ICP'
                    "
                  >
                    {{
                      Object.values(
                        transaction[transaction.length - 1][0].filled
                          .token0Value
                      )[0] | bigintToFloat(8)
                    }}
                    ICP
                  </span>
                  <span
                    v-if="
                      Object.keys(
                        transaction[transaction.length - 1][0].filled
                          .token1Value
                      )[0] === 'DebitRecord' &&
                      getTokenId(
                        transaction[transaction.length - 1][0].token1
                      ) === 'ICP'
                    "
                  >
                    {{
                      Object.values(
                        transaction[transaction.length - 1][0].filled
                          .token1Value
                      )[0] | bigintToFloat(8)
                    }}
                    ICP
                  </span>
                  ->
                  <span
                    v-if="
                      Object.keys(
                        transaction[transaction.length - 1][0].filled
                          .token0Value
                      )[0] === 'CreditRecord' &&
                      tokens &&
                      tokens[
                        getTokenId(
                          transaction[transaction.length - 1][0].token0
                        )
                      ]
                    "
                  >
                    {{
                      Object.values(
                        transaction[transaction.length - 1][0].filled
                          .token0Value
                      )[0] |
                        bigintToFloat(
                          tokens[
                            getTokenId(
                              transaction[transaction.length - 1][0].token0
                            )
                          ].decimals,
                          tokens[
                            getTokenId(
                              transaction[transaction.length - 1][0].token0
                            )
                          ].decimals
                        )
                    }}
                    {{
                      tokens[
                        getTokenId(
                          transaction[transaction.length - 1][0].token0
                        )
                      ].symbol
                    }}
                  </span>
                  <span
                    v-if="
                      Object.keys(
                        transaction[transaction.length - 1][0].filled
                          .token1Value
                      )[0] === 'CreditRecord' &&
                      tokens &&
                      tokens[
                        getTokenId(
                          transaction[transaction.length - 1][0].token1
                        )
                      ]
                    "
                  >
                    {{
                      Object.values(
                        transaction[transaction.length - 1][0].filled
                          .token1Value
                      )[0] |
                        bigintToFloat(
                          tokens[
                            getTokenId(
                              transaction[transaction.length - 1][0].token1
                            )
                          ].decimals,
                          tokens[
                            getTokenId(
                              transaction[transaction.length - 1][0].token1
                            )
                          ].decimals
                        )
                    }}
                    {{
                      tokens[
                        getTokenId(
                          transaction[transaction.length - 1][0].token1
                        )
                      ].symbol
                    }}
                  </span>
                  <span
                    v-if="
                      Object.keys(
                        transaction[transaction.length - 1][0].filled
                          .token0Value
                      )[0] === 'CreditRecord' &&
                      getTokenId(
                        transaction[transaction.length - 1][0].token0
                      ) === 'Cycles'
                    "
                  >
                    {{
                      Object.values(
                        transaction[transaction.length - 1][0].filled
                          .token0Value
                      )[0] | bigintToFloat(12, 12)
                    }}
                    TCycles
                  </span>
                  <span
                    v-if="
                      Object.keys(
                        transaction[transaction.length - 1][0].filled
                          .token1Value
                      )[0] === 'CreditRecord' &&
                      getTokenId(
                        transaction[transaction.length - 1][0].token1
                      ) === 'Cycles'
                    "
                  >
                    {{
                      Object.values(
                        transaction[transaction.length - 1][0].filled
                          .token1Value
                      )[0] | bigintToFloat(12, 12)
                    }}
                    TCycles
                  </span>
                  <span
                    v-if="
                      Object.keys(
                        transaction[transaction.length - 1][0].filled
                          .token0Value
                      )[0] === 'CreditRecord' &&
                      getTokenId(
                        transaction[transaction.length - 1][0].token0
                      ) === 'ICP'
                    "
                  >
                    {{
                      Object.values(
                        transaction[transaction.length - 1][0].filled
                          .token0Value
                      )[0] | bigintToFloat(8)
                    }}
                    ICP
                  </span>
                  <span
                    v-if="
                      Object.keys(
                        transaction[transaction.length - 1][0].filled
                          .token1Value
                      )[0] === 'CreditRecord' &&
                      getTokenId(
                        transaction[transaction.length - 1][0].token1
                      ) === 'ICP'
                    "
                  >
                    {{
                      Object.values(
                        transaction[transaction.length - 1][0].filled
                          .token1Value
                      )[0] | bigintToFloat(8)
                    }}
                    ICP
                  </span>
                  <span>
                    (price:
                    <span
                      v-show="
                        !transaction[transaction.length - 1][0].filled
                          .priceShowType
                      "
                    >
                      {{
                        transaction[transaction.length - 1][0].filled.priceShow0
                      }}
                    </span>
                    <span
                      v-show="
                        transaction[transaction.length - 1][0].filled
                          .priceShowType
                      "
                    >
                      {{
                        transaction[transaction.length - 1][0].filled.priceShow1
                      }}
                    </span>
                    <a-icon
                      @click="
                        changePrice(
                          transaction[transaction.length - 1][0].filled
                        )
                      "
                      type="swap"
                      class="can-click"
                    />)
                  </span>
                </div>
                <div
                  v-if="
                    Object.keys(
                      transaction[transaction.length - 1][0].orderMode
                    )[0] === 'OrderBook' &&
                    Object.keys(
                      transaction[transaction.length - 1][0].orderType[0]
                    )[0] !== 'MKT'
                  "
                >
                  Order:
                  <span
                    v-if="
                      Object.keys(
                        transaction[transaction.length - 1][0].order
                          .token0Value[0]
                      )[0] === 'DebitRecord' &&
                      tokens &&
                      tokens[
                        getTokenId(
                          transaction[transaction.length - 1][0].token0
                        )
                      ]
                    "
                  >
                    {{
                      Object.values(
                        transaction[transaction.length - 1][0].order
                          .token0Value[0]
                      )[0] |
                        bigintToFloat(
                          tokens[
                            getTokenId(
                              transaction[transaction.length - 1][0].token0
                            )
                          ].decimals,
                          tokens[
                            getTokenId(
                              transaction[transaction.length - 1][0].token0
                            )
                          ].decimals
                        )
                    }}
                    {{
                      tokens[
                        getTokenId(
                          transaction[transaction.length - 1][0].token0
                        )
                      ].symbol
                    }}
                  </span>
                  <span
                    v-if="
                      Object.keys(
                        transaction[transaction.length - 1][0].order
                          .token1Value[0]
                      )[0] === 'DebitRecord' &&
                      tokens &&
                      tokens[
                        getTokenId(
                          transaction[transaction.length - 1][0].token1
                        )
                      ]
                    "
                  >
                    {{
                      Object.values(
                        transaction[transaction.length - 1][0].order
                          .token1Value[0]
                      )[0] |
                        bigintToFloat(
                          tokens[
                            getTokenId(
                              transaction[transaction.length - 1][0].token1
                            )
                          ].decimals,
                          tokens[
                            getTokenId(
                              transaction[transaction.length - 1][0].token1
                            )
                          ].decimals
                        )
                    }}
                    {{
                      tokens[
                        getTokenId(
                          transaction[transaction.length - 1][0].token1
                        )
                      ].symbol
                    }}
                  </span>
                  <span
                    v-if="
                      Object.keys(
                        transaction[transaction.length - 1][0].order
                          .token0Value[0]
                      )[0] === 'DebitRecord' &&
                      getTokenId(
                        transaction[transaction.length - 1][0].token0
                      ) === 'Cycles'
                    "
                  >
                    {{
                      Object.values(
                        transaction[transaction.length - 1][0].order
                          .token0Value[0]
                      )[0] | bigintToFloat(12, 12)
                    }}
                    TCycles
                  </span>
                  <span
                    v-if="
                      Object.keys(
                        transaction[transaction.length - 1][0].order
                          .token1Value[0]
                      )[0] === 'DebitRecord' &&
                      getTokenId(
                        transaction[transaction.length - 1][0].token1
                      ) === 'Cycles'
                    "
                  >
                    {{
                      Object.values(
                        transaction[transaction.length - 1][0].order
                          .token1Value[0]
                      )[0] | bigintToFloat(12, 12)
                    }}
                    TCycles
                  </span>
                  <span
                    v-if="
                      Object.keys(
                        transaction[transaction.length - 1][0].order
                          .token0Value[0]
                      )[0] === 'DebitRecord' &&
                      getTokenId(
                        transaction[transaction.length - 1][0].token0
                      ) === 'ICP'
                    "
                  >
                    {{
                      Object.values(
                        transaction[transaction.length - 1][0].order
                          .token0Value[0]
                      )[0] | bigintToFloat(8)
                    }}
                    ICP
                  </span>
                  <span
                    v-if="
                      Object.keys(
                        transaction[transaction.length - 1][0].order
                          .token1Value[0]
                      )[0] === 'DebitRecord' &&
                      getTokenId(
                        transaction[transaction.length - 1][0].token1
                      ) === 'ICP'
                    "
                  >
                    {{
                      Object.values(
                        transaction[transaction.length - 1][0].order
                          .token1Value[0]
                      )[0] | bigintToFloat(8)
                    }}
                    ICP
                  </span>
                  ->
                  <span
                    v-if="
                      Object.keys(
                        transaction[transaction.length - 1][0].order
                          .token0Value[0]
                      )[0] === 'CreditRecord' &&
                      tokens &&
                      tokens[
                        getTokenId(
                          transaction[transaction.length - 1][0].token0
                        )
                      ]
                    "
                  >
                    {{
                      Object.values(
                        transaction[transaction.length - 1][0].order
                          .token0Value[0]
                      )[0] |
                        bigintToFloat(
                          tokens[
                            getTokenId(
                              transaction[transaction.length - 1][0].token0
                            )
                          ].decimals,
                          tokens[
                            getTokenId(
                              transaction[transaction.length - 1][0].token0
                            )
                          ].decimals
                        )
                    }}
                    {{
                      tokens[
                        getTokenId(
                          transaction[transaction.length - 1][0].token0
                        )
                      ].symbol
                    }}
                  </span>
                  <span
                    v-if="
                      Object.keys(
                        transaction[transaction.length - 1][0].order
                          .token1Value[0]
                      )[0] === 'CreditRecord' &&
                      tokens &&
                      tokens[
                        getTokenId(
                          transaction[transaction.length - 1][0].token1
                        )
                      ]
                    "
                  >
                    {{
                      Object.values(
                        transaction[transaction.length - 1][0].order
                          .token1Value[0]
                      )[0] |
                        bigintToFloat(
                          tokens[
                            getTokenId(
                              transaction[transaction.length - 1][0].token1
                            )
                          ].decimals,
                          tokens[
                            getTokenId(
                              transaction[transaction.length - 1][0].token1
                            )
                          ].decimals
                        )
                    }}
                    {{
                      tokens[
                        getTokenId(
                          transaction[transaction.length - 1][0].token1
                        )
                      ].symbol
                    }}
                  </span>
                  <span
                    v-if="
                      Object.keys(
                        transaction[transaction.length - 1][0].order
                          .token0Value[0]
                      )[0] === 'CreditRecord' &&
                      getTokenId(
                        transaction[transaction.length - 1][0].token0
                      ) === 'Cycles'
                    "
                  >
                    {{
                      Object.values(
                        transaction[transaction.length - 1][0].order
                          .token0Value[0]
                      )[0] | bigintToFloat(12, 12)
                    }}
                    TCycles
                  </span>
                  <span
                    v-if="
                      Object.keys(
                        transaction[transaction.length - 1][0].order
                          .token1Value[0]
                      )[0] === 'CreditRecord' &&
                      getTokenId(
                        transaction[transaction.length - 1][0].token1
                      ) === 'Cycles'
                    "
                  >
                    {{
                      Object.values(
                        transaction[transaction.length - 1][0].order
                          .token1Value[0]
                      )[0] | bigintToFloat(12, 12)
                    }}
                    TCycles
                  </span>
                  <span
                    v-if="
                      Object.keys(
                        transaction[transaction.length - 1][0].order
                          .token0Value[0]
                      )[0] === 'CreditRecord' &&
                      getTokenId(
                        transaction[transaction.length - 1][0].token0
                      ) === 'ICP'
                    "
                  >
                    {{
                      Object.values(
                        transaction[transaction.length - 1][0].order
                          .token0Value[0]
                      )[0] | bigintToFloat(8)
                    }}
                    ICP
                  </span>
                  <span
                    v-if="
                      Object.keys(
                        transaction[transaction.length - 1][0].order
                          .token1Value[0]
                      )[0] === 'CreditRecord' &&
                      getTokenId(
                        transaction[transaction.length - 1][0].token1
                      ) === 'ICP'
                    "
                  >
                    {{
                      Object.values(
                        transaction[transaction.length - 1][0].order
                          .token1Value[0]
                      )[0] | bigintToFloat(8)
                    }}
                    ICP
                  </span>
                  <span>
                    (price:
                    <span
                      v-show="
                        !transaction[transaction.length - 1][0].order
                          .priceShowType
                      "
                    >
                      {{
                        transaction[transaction.length - 1][0].order.priceShow0
                      }}
                    </span>
                    <span
                      v-show="
                        transaction[transaction.length - 1][0].order
                          .priceShowType
                      "
                    >
                      {{
                        transaction[transaction.length - 1][0].order.priceShow1
                      }}
                    </span>
                    <a-icon
                      @click="
                        changePrice(
                          transaction[transaction.length - 1][0].order
                        )
                      "
                      type="swap"
                      class="can-click"
                    />)
                  </span>
                </div>
                <div
                  v-if="
                    Object.keys(
                      transaction[transaction.length - 1][0].orderMode
                    )[0] === 'OrderBook' &&
                    Object.keys(
                      transaction[transaction.length - 1][0].orderType[0]
                    )[0] === 'MKT'
                  "
                >
                  Order:
                  <span
                    v-if="
                      transaction[transaction.length - 1][0].order
                        .token0Value[0] &&
                      Object.keys(
                        transaction[transaction.length - 1][0].order
                          .token0Value[0]
                      )[0] === 'DebitRecord' &&
                      tokens &&
                      tokens[
                        getTokenId(
                          transaction[transaction.length - 1][0].token0
                        )
                      ]
                    "
                  >
                    {{
                      Object.values(
                        transaction[transaction.length - 1][0].order
                          .token0Value[0]
                      )[0] |
                        bigintToFloat(
                          tokens[
                            getTokenId(
                              transaction[transaction.length - 1][0].token0
                            )
                          ].decimals,
                          tokens[
                            getTokenId(
                              transaction[transaction.length - 1][0].token0
                            )
                          ].decimals
                        )
                    }}
                    {{
                      tokens[
                        getTokenId(
                          transaction[transaction.length - 1][0].token0
                        )
                      ].symbol
                    }}
                  </span>
                  <span
                    v-if="
                      transaction[transaction.length - 1][0].order
                        .token1Value[0] &&
                      Object.keys(
                        transaction[transaction.length - 1][0].order
                          .token1Value[0]
                      )[0] === 'DebitRecord' &&
                      tokens &&
                      tokens[
                        getTokenId(
                          transaction[transaction.length - 1][0].token1
                        )
                      ]
                    "
                  >
                    {{
                      Object.values(
                        transaction[transaction.length - 1][0].order
                          .token1Value[0]
                      )[0] |
                        bigintToFloat(
                          tokens[
                            getTokenId(
                              transaction[transaction.length - 1][0].token1
                            )
                          ].decimals,
                          tokens[
                            getTokenId(
                              transaction[transaction.length - 1][0].token1
                            )
                          ].decimals
                        )
                    }}
                    {{
                      tokens[
                        getTokenId(
                          transaction[transaction.length - 1][0].token1
                        )
                      ].symbol
                    }}
                  </span>
                  <span
                    v-if="
                      transaction[transaction.length - 1][0].order
                        .token0Value[0] &&
                      Object.keys(
                        transaction[transaction.length - 1][0].order
                          .token0Value[0]
                      )[0] === 'DebitRecord' &&
                      getTokenId(
                        transaction[transaction.length - 1][0].token0
                      ) === 'Cycles'
                    "
                  >
                    {{
                      Object.values(
                        transaction[transaction.length - 1][0].order
                          .token0Value[0]
                      )[0] | bigintToFloat(12, 12)
                    }}
                    TCycles
                  </span>
                  <span
                    v-if="
                      transaction[transaction.length - 1][0].order
                        .token1Value[0] &&
                      Object.keys(
                        transaction[transaction.length - 1][0].order
                          .token1Value[0]
                      )[0] === 'DebitRecord' &&
                      getTokenId(
                        transaction[transaction.length - 1][0].token1
                      ) === 'Cycles'
                    "
                  >
                    {{
                      Object.values(
                        transaction[transaction.length - 1][0].order
                          .token1Value[0]
                      )[0] | bigintToFloat(12, 12)
                    }}
                    TCycles
                  </span>
                  <span
                    v-if="
                      transaction[transaction.length - 1][0].order
                        .token0Value[0] &&
                      Object.keys(
                        transaction[transaction.length - 1][0].order
                          .token0Value[0]
                      )[0] === 'DebitRecord' &&
                      getTokenId(
                        transaction[transaction.length - 1][0].token0
                      ) === 'ICP'
                    "
                  >
                    {{
                      Object.values(
                        transaction[transaction.length - 1][0].order
                          .token0Value[0]
                      )[0] | bigintToFloat(8)
                    }}
                    ICP
                  </span>
                  <span
                    v-if="
                      transaction[transaction.length - 1][0].order
                        .token1Value[0] &&
                      Object.keys(
                        transaction[transaction.length - 1][0].order
                          .token1Value[0]
                      )[0] === 'DebitRecord' &&
                      getTokenId(
                        transaction[transaction.length - 1][0].token1
                      ) === 'ICP'
                    "
                  >
                    {{
                      Object.values(
                        transaction[transaction.length - 1][0].order
                          .token1Value[0]
                      )[0] | bigintToFloat(8)
                    }}
                    ICP
                  </span>
                  ->
                  <span
                    v-if="
                      !transaction[transaction.length - 1][0].order
                        .token0Value[0]
                    "
                  >
                    ?(market)
                    <span
                      v-if="
                        tokens &&
                        tokens[
                          getTokenId(
                            transaction[transaction.length - 1][0].token0
                          )
                        ]
                      "
                    >
                      {{
                        tokens[
                          getTokenId(
                            transaction[transaction.length - 1][0].token0
                          )
                        ].symbol
                      }}
                    </span>
                    <span
                      v-if="
                        getTokenId(
                          transaction[transaction.length - 1][0].token0
                        ) === 'Cycles'
                      "
                    >
                      TCycles
                    </span>
                    <span
                      v-if="
                        getTokenId(
                          transaction[transaction.length - 1][0].token0
                        ) === 'ICP'
                      "
                      >ICP</span
                    >
                  </span>
                  <span
                    v-if="
                      !transaction[transaction.length - 1][0].order
                        .token1Value[0]
                    "
                  >
                    ?(market)
                    <span
                      v-if="
                        tokens &&
                        tokens[
                          getTokenId(
                            transaction[transaction.length - 1][0].token1
                          )
                        ]
                      "
                      >{{
                        tokens[
                          getTokenId(
                            transaction[transaction.length - 1][0].token1
                          )
                        ].symbol
                      }}</span
                    >
                    <span
                      v-if="
                        getTokenId(
                          transaction[transaction.length - 1][0].token1
                        ) === 'Cycles'
                      "
                    >
                      TCycles
                    </span>
                    <span
                      v-if="
                        getTokenId(
                          transaction[transaction.length - 1][0].token1
                        ) === 'ICP'
                      "
                      >ICP</span
                    >
                  </span>
                  <span
                    v-if="
                      transaction[transaction.length - 1][0].order
                        .token0Value[0] &&
                      Object.keys(
                        transaction[transaction.length - 1][0].order
                          .token0Value[0]
                      )[0] === 'CreditRecord' &&
                      tokens &&
                      tokens[
                        getTokenId(
                          transaction[transaction.length - 1][0].token0
                        )
                      ]
                    "
                  >
                    {{
                      Object.values(
                        transaction[transaction.length - 1][0].order
                          .token0Value[0]
                      )[0] |
                        bigintToFloat(
                          tokens[
                            getTokenId(
                              transaction[transaction.length - 1][0].token0
                            )
                          ].decimals,
                          tokens[
                            getTokenId(
                              transaction[transaction.length - 1][0].token0
                            )
                          ].decimals
                        )
                    }}
                    {{
                      tokens[
                        getTokenId(
                          transaction[transaction.length - 1][0].token0
                        )
                      ].symbol
                    }}
                  </span>
                  <span
                    v-if="
                      transaction[transaction.length - 1][0].order
                        .token1Value[0] &&
                      Object.keys(
                        transaction[transaction.length - 1][0].order
                          .token1Value[0]
                      )[0] === 'CreditRecord' &&
                      tokens &&
                      tokens[
                        getTokenId(
                          transaction[transaction.length - 1][0].token1
                        )
                      ]
                    "
                  >
                    {{
                      Object.values(
                        transaction[transaction.length - 1][0].order
                          .token1Value[0]
                      )[0] |
                        bigintToFloat(
                          tokens[
                            getTokenId(
                              transaction[transaction.length - 1][0].token1
                            )
                          ].decimals,
                          tokens[
                            getTokenId(
                              transaction[transaction.length - 1][0].token1
                            )
                          ].decimals
                        )
                    }}
                    {{
                      tokens[
                        getTokenId(
                          transaction[transaction.length - 1][0].token1
                        )
                      ].symbol
                    }}
                  </span>
                  <span
                    v-if="
                      transaction[transaction.length - 1][0].order
                        .token0Value[0] &&
                      Object.keys(
                        transaction[transaction.length - 1][0].order
                          .token0Value[0]
                      )[0] === 'CreditRecord' &&
                      getTokenId(
                        transaction[transaction.length - 1][0].token0
                      ) === 'Cycles'
                    "
                  >
                    {{
                      Object.values(
                        transaction[transaction.length - 1][0].order
                          .token0Value[0]
                      )[0] | bigintToFloat(12, 12)
                    }}
                    TCycles
                  </span>
                  <span
                    v-if="
                      transaction[transaction.length - 1][0].order
                        .token1Value[0] &&
                      Object.keys(
                        transaction[transaction.length - 1][0].order
                          .token1Value[0]
                      )[0] === 'CreditRecord' &&
                      getTokenId(
                        transaction[transaction.length - 1][0].token1
                      ) === 'Cycles'
                    "
                  >
                    {{
                      Object.values(
                        transaction[transaction.length - 1][0].order
                          .token1Value[0]
                      )[0] | bigintToFloat(12, 12)
                    }}
                    TCycles
                  </span>
                  <span
                    v-if="
                      transaction[transaction.length - 1][0].order
                        .token0Value[0] &&
                      Object.keys(
                        transaction[transaction.length - 1][0].order
                          .token0Value[0]
                      )[0] === 'CreditRecord' &&
                      getTokenId(
                        transaction[transaction.length - 1][0].token0
                      ) === 'ICP'
                    "
                  >
                    {{
                      Object.values(
                        transaction[transaction.length - 1][0].order
                          .token0Value[0]
                      )[0] | bigintToFloat(8)
                    }}
                    ICP
                  </span>
                  <span
                    v-if="
                      transaction[transaction.length - 1][0].order
                        .token1Value[0] &&
                      Object.keys(
                        transaction[transaction.length - 1][0].order
                          .token1Value[0]
                      )[0] === 'CreditRecord' &&
                      getTokenId(
                        transaction[transaction.length - 1][0].token1
                      ) === 'ICP'
                    "
                  >
                    {{
                      Object.values(
                        transaction[transaction.length - 1][0].order
                          .token1Value[0]
                      )[0] | bigintToFloat(8)
                    }}
                    ICP
                  </span>
                </div>
                <div
                  v-if="
                    Object.keys(
                      transaction[transaction.length - 1][0].orderMode
                    )[0] === 'OrderBook'
                  "
                >
                  Filled:
                  <span
                    v-if="
                      Object.keys(
                        transaction[transaction.length - 1][0].status
                      )[0] === 'Cancelled' ||
                      Object.keys(
                        transaction[transaction.length - 1][0].status
                      )[0] === 'Failed' ||
                      (Object.keys(
                        transaction[transaction.length - 1][0].status
                      )[0] === 'Pending' &&
                        !transaction[transaction.length - 1][0].details.length)
                    "
                    >-</span
                  >
                  <span v-else>
                    <span
                      v-if="
                        Object.keys(
                          transaction[transaction.length - 1][0].filled
                            .token0Value
                        )[0] === 'DebitRecord' &&
                        tokens &&
                        tokens[
                          getTokenId(
                            transaction[transaction.length - 1][0].token0
                          )
                        ]
                      "
                    >
                      {{
                        Object.values(
                          transaction[transaction.length - 1][0].filled
                            .token0Value
                        )[0] |
                          bigintToFloat(
                            tokens[
                              getTokenId(
                                transaction[transaction.length - 1][0].token0
                              )
                            ].decimals,
                            tokens[
                              getTokenId(
                                transaction[transaction.length - 1][0].token0
                              )
                            ].decimals
                          )
                      }}
                      {{
                        tokens[
                          getTokenId(
                            transaction[transaction.length - 1][0].token0
                          )
                        ].symbol
                      }}
                    </span>
                    <span
                      v-if="
                        Object.keys(
                          transaction[transaction.length - 1][0].filled
                            .token1Value
                        )[0] === 'DebitRecord' &&
                        tokens &&
                        tokens[
                          getTokenId(
                            transaction[transaction.length - 1][0].token1
                          )
                        ]
                      "
                    >
                      {{
                        Object.values(
                          transaction[transaction.length - 1][0].filled
                            .token1Value
                        )[0] |
                          bigintToFloat(
                            tokens[
                              getTokenId(
                                transaction[transaction.length - 1][0].token1
                              )
                            ].decimals,
                            tokens[
                              getTokenId(
                                transaction[transaction.length - 1][0].token1
                              )
                            ].decimals
                          )
                      }}
                      {{
                        tokens[
                          getTokenId(
                            transaction[transaction.length - 1][0].token1
                          )
                        ].symbol
                      }}
                    </span>
                    <span
                      v-if="
                        Object.keys(
                          transaction[transaction.length - 1][0].filled
                            .token0Value
                        )[0] === 'DebitRecord' &&
                        getTokenId(
                          transaction[transaction.length - 1][0].token0
                        ) === 'Cycles'
                      "
                    >
                      {{
                        Object.values(
                          transaction[transaction.length - 1][0].filled
                            .token0Value
                        )[0] | bigintToFloat(12, 12)
                      }}
                      TCycles
                    </span>
                    <span
                      v-if="
                        Object.keys(
                          transaction[transaction.length - 1][0].filled
                            .token1Value
                        )[0] === 'DebitRecord' &&
                        getTokenId(
                          transaction[transaction.length - 1][0].token1
                        ) === 'Cycles'
                      "
                    >
                      {{
                        Object.values(
                          transaction[transaction.length - 1][0].filled
                            .token1Value
                        )[0] | bigintToFloat(12, 12)
                      }}
                      TCycles
                    </span>
                    <span
                      v-if="
                        Object.keys(
                          transaction[transaction.length - 1][0].filled
                            .token0Value
                        )[0] === 'DebitRecord' &&
                        getTokenId(
                          transaction[transaction.length - 1][0].token0
                        ) === 'ICP'
                      "
                    >
                      {{
                        Object.values(
                          transaction[transaction.length - 1][0].filled
                            .token0Value
                        )[0] | bigintToFloat(8)
                      }}
                      ICP
                    </span>
                    <span
                      v-if="
                        Object.keys(
                          transaction[transaction.length - 1][0].filled
                            .token1Value
                        )[0] === 'DebitRecord' &&
                        getTokenId(
                          transaction[transaction.length - 1][0].token1
                        ) === 'ICP'
                      "
                    >
                      {{
                        Object.values(
                          transaction[transaction.length - 1][0].filled
                            .token1Value
                        )[0] | bigintToFloat(8)
                      }}
                      ICP
                    </span>
                    ->
                    <span
                      v-if="
                        Object.keys(
                          transaction[transaction.length - 1][0].filled
                            .token0Value
                        )[0] === 'CreditRecord' &&
                        tokens &&
                        tokens[
                          getTokenId(
                            transaction[transaction.length - 1][0].token0
                          )
                        ]
                      "
                    >
                      {{
                        Object.values(
                          transaction[transaction.length - 1][0].filled
                            .token0Value
                        )[0] |
                          bigintToFloat(
                            tokens[
                              getTokenId(
                                transaction[transaction.length - 1][0].token0
                              )
                            ].decimals,
                            tokens[
                              getTokenId(
                                transaction[transaction.length - 1][0].token0
                              )
                            ].decimals
                          )
                      }}
                      {{
                        tokens[
                          getTokenId(
                            transaction[transaction.length - 1][0].token0
                          )
                        ].symbol
                      }}
                    </span>
                    <span
                      v-if="
                        Object.keys(
                          transaction[transaction.length - 1][0].filled
                            .token1Value
                        )[0] === 'CreditRecord' &&
                        tokens &&
                        tokens[
                          getTokenId(
                            transaction[transaction.length - 1][0].token1
                          )
                        ]
                      "
                    >
                      {{
                        Object.values(
                          transaction[transaction.length - 1][0].filled
                            .token1Value
                        )[0] |
                          bigintToFloat(
                            tokens[
                              getTokenId(
                                transaction[transaction.length - 1][0].token1
                              )
                            ].decimals,
                            tokens[
                              getTokenId(
                                transaction[transaction.length - 1][0].token1
                              )
                            ].decimals
                          )
                      }}
                      {{
                        tokens[
                          getTokenId(
                            transaction[transaction.length - 1][0].token1
                          )
                        ].symbol
                      }}
                    </span>
                    <span
                      v-if="
                        Object.keys(
                          transaction[transaction.length - 1][0].filled
                            .token0Value
                        )[0] === 'CreditRecord' &&
                        getTokenId(
                          transaction[transaction.length - 1][0].token0
                        ) === 'Cycles'
                      "
                    >
                      {{
                        Object.values(
                          transaction[transaction.length - 1][0].filled
                            .token0Value
                        )[0] | bigintToFloat(12, 12)
                      }}
                      TCycles
                    </span>
                    <span
                      v-if="
                        Object.keys(
                          transaction[transaction.length - 1][0].filled
                            .token1Value
                        )[0] === 'CreditRecord' &&
                        getTokenId(
                          transaction[transaction.length - 1][0].token1
                        ) === 'Cycles'
                      "
                    >
                      {{
                        Object.values(
                          transaction[transaction.length - 1][0].filled
                            .token1Value
                        )[0] | bigintToFloat(12, 12)
                      }}
                      TCycles
                    </span>
                    <span
                      v-if="
                        Object.keys(
                          transaction[transaction.length - 1][0].filled
                            .token0Value
                        )[0] === 'CreditRecord' &&
                        getTokenId(
                          transaction[transaction.length - 1][0].token0
                        ) === 'ICP'
                      "
                    >
                      {{
                        Object.values(
                          transaction[transaction.length - 1][0].filled
                            .token0Value
                        )[0] | bigintToFloat(8)
                      }}
                      ICP
                    </span>
                    <span
                      v-if="
                        Object.keys(
                          transaction[transaction.length - 1][0].filled
                            .token1Value
                        )[0] === 'CreditRecord' &&
                        getTokenId(
                          transaction[transaction.length - 1][0].token1
                        ) === 'ICP'
                      "
                    >
                      {{
                        Object.values(
                          transaction[transaction.length - 1][0].filled
                            .token1Value
                        )[0] | bigintToFloat(8)
                      }}
                      ICP
                    </span>
                    <span>
                      (price:
                      <span
                        v-show="
                          !transaction[transaction.length - 1][0].filled
                            .priceShowType
                        "
                      >
                        {{
                          transaction[transaction.length - 1][0].filled
                            .priceShow0
                        }}
                      </span>
                      <span
                        v-show="
                          transaction[transaction.length - 1][0].filled
                            .priceShowType
                        "
                      >
                        {{
                          transaction[transaction.length - 1][0].filled
                            .priceShow1
                        }}
                      </span>
                      <a-icon
                        @click="
                          changePrice(
                            transaction[transaction.length - 1][0].filled
                          )
                        "
                        type="swap"
                        class="can-click"
                      />)
                    </span>
                  </span>
                </div>
              </div>
              <div
                v-if="
                  Object.keys(
                    transaction[transaction.length - 1][0].operation
                  )[0] === 'AddLiquidity'
                "
              >
                <div
                  v-if="
                    getTokenId(
                      transaction[transaction.length - 1][0].token0
                    ) === 'Cycles'
                  "
                >
                  {{
                    Object.values(
                      transaction[transaction.length - 1][0].filled.token0Value
                    )[0] | bigintToFloat(12, 12)
                  }}
                  TCycles
                </div>
                <div
                  v-if="
                    getTokenId(
                      transaction[transaction.length - 1][0].token0
                    ) === 'ICP'
                  "
                >
                  {{
                    Object.values(
                      transaction[transaction.length - 1][0].filled.token0Value
                    )[0] | bigintToFloat(8)
                  }}
                  ICP
                </div>
                <div
                  v-if="
                    tokens &&
                    tokens[
                      getTokenId(transaction[transaction.length - 1][0].token0)
                    ]
                  "
                >
                  {{
                    Object.values(
                      transaction[transaction.length - 1][0].filled.token0Value
                    )[0] |
                      bigintToFloat(
                        tokens[
                          getTokenId(
                            transaction[transaction.length - 1][0].token0
                          )
                        ].decimals,
                        tokens[
                          getTokenId(
                            transaction[transaction.length - 1][0].token0
                          )
                        ].decimals
                      )
                  }}
                  {{
                    tokens[
                      getTokenId(transaction[transaction.length - 1][0].token0)
                    ].symbol
                  }}
                </div>
                <a-icon type="plus" />

                <div
                  v-if="
                    getTokenId(
                      transaction[transaction.length - 1][0].token1
                    ) === 'Cycles'
                  "
                >
                  {{
                    Object.values(
                      transaction[transaction.length - 1][0].filled.token1Value
                    )[0] | bigintToFloat(12, 12)
                  }}
                  TCycles
                </div>
                <div
                  v-if="
                    getTokenId(
                      transaction[transaction.length - 1][0].token1
                    ) === 'ICP'
                  "
                >
                  {{
                    Object.values(
                      transaction[transaction.length - 1][0].filled.token1Value
                    )[0] | bigintToFloat(8)
                  }}
                  ICP
                </div>
                <div
                  v-if="
                    tokens &&
                    tokens[
                      getTokenId(transaction[transaction.length - 1][0].token1)
                    ]
                  "
                >
                  {{
                    Object.values(
                      transaction[transaction.length - 1][0].filled.token1Value
                    )[0] |
                      bigintToFloat(
                        tokens[
                          getTokenId(
                            transaction[transaction.length - 1][0].token1
                          )
                        ].decimals,
                        tokens[
                          getTokenId(
                            transaction[transaction.length - 1][0].token1
                          )
                        ].decimals
                      )
                  }}
                  {{
                    tokens[
                      getTokenId(transaction[transaction.length - 1][0].token1)
                    ].symbol
                  }}
                </div>
                <div
                  v-if="
                    transaction[transaction.length - 1][0].shares &&
                    swaps[swapId]
                  "
                >
                  ->
                  {{
                    transaction[transaction.length - 1][0].shares |
                      filterShare(
                        swaps[swapId].decimals,
                        swaps[swapId].decimals
                      )
                  }}
                  Shares
                </div>
              </div>
              <div
                v-if="
                  Object.keys(
                    transaction[transaction.length - 1][0].operation
                  )[0] === 'Claim'
                "
              >
                <div
                  v-if="
                    getTokenId(
                      transaction[transaction.length - 1][0].token0
                    ) === 'Cycles'
                  "
                >
                  {{
                    Object.values(
                      transaction[transaction.length - 1][0].filled.token0Value
                    )[0] | bigintToFloat(12, 12)
                  }}
                  TCycles
                </div>
                <div
                  v-if="
                    getTokenId(
                      transaction[transaction.length - 1][0].token0
                    ) === 'ICP'
                  "
                >
                  {{
                    Object.values(
                      transaction[transaction.length - 1][0].filled.token0Value
                    )[0] | bigintToFloat(8)
                  }}
                  ICP
                </div>
                <div
                  v-if="
                    tokens &&
                    tokens[
                      getTokenId(transaction[transaction.length - 1][0].token0)
                    ]
                  "
                >
                  {{
                    Object.values(
                      transaction[transaction.length - 1][0].filled.token0Value
                    )[0] |
                      bigintToFloat(
                        tokens[
                          getTokenId(
                            transaction[transaction.length - 1][0].token0
                          )
                        ].decimals,
                        tokens[
                          getTokenId(
                            transaction[transaction.length - 1][0].token0
                          )
                        ].decimals
                      )
                  }}
                  {{
                    tokens[
                      getTokenId(transaction[transaction.length - 1][0].token0)
                    ].symbol
                  }}
                </div>
                <a-icon type="plus" />
                <div
                  v-if="
                    getTokenId(
                      transaction[transaction.length - 1][0].token1
                    ) === 'Cycles'
                  "
                >
                  {{
                    Object.values(
                      transaction[transaction.length - 1][0].filled.token1Value
                    )[0] | bigintToFloat(12, 12)
                  }}
                  TCycles
                </div>
                <div
                  v-if="
                    getTokenId(
                      transaction[transaction.length - 1][0].token1
                    ) === 'ICP'
                  "
                >
                  {{
                    Object.values(
                      transaction[transaction.length - 1][0].filled.token1Value
                    )[0] | bigintToFloat(8)
                  }}
                  ICP
                </div>
                <div
                  v-if="
                    tokens &&
                    tokens[
                      getTokenId(transaction[transaction.length - 1][0].token1)
                    ]
                  "
                >
                  {{
                    Object.values(
                      transaction[transaction.length - 1][0].filled.token1Value
                    )[0] |
                      bigintToFloat(
                        tokens[
                          getTokenId(
                            transaction[transaction.length - 1][0].token1
                          )
                        ].decimals,
                        tokens[
                          getTokenId(
                            transaction[transaction.length - 1][0].token1
                          )
                        ].decimals
                      )
                  }}
                  {{
                    tokens[
                      getTokenId(transaction[transaction.length - 1][0].token1)
                    ].symbol
                  }}
                </div>
              </div>
              <div
                v-if="
                  Object.keys(
                    transaction[transaction.length - 1][0].operation
                  )[0] === 'RemoveLiquidity'
                "
              >
                <div
                  v-if="
                    transaction[transaction.length - 1][0].shares &&
                    swaps[swapId]
                  "
                >
                  {{
                    transaction[transaction.length - 1][0].shares |
                      filterShare(
                        swaps[swapId].decimals,
                        swaps[swapId].decimals
                      )
                  }}
                  Shares ->
                </div>
                <div
                  v-if="
                    getTokenId(
                      transaction[transaction.length - 1][0].token0
                    ) === 'Cycles'
                  "
                >
                  {{
                    Object.values(
                      transaction[transaction.length - 1][0].filled.token0Value
                    )[0] | bigintToFloat(12, 12)
                  }}
                  TCycles
                </div>
                <div
                  v-if="
                    getTokenId(
                      transaction[transaction.length - 1][0].token0
                    ) === 'ICP'
                  "
                >
                  {{
                    Object.values(
                      transaction[transaction.length - 1][0].filled.token0Value
                    )[0] | bigintToFloat(8)
                  }}
                  ICP
                </div>
                <div
                  v-if="
                    tokens &&
                    tokens[
                      getTokenId(transaction[transaction.length - 1][0].token0)
                    ]
                  "
                >
                  {{
                    Object.values(
                      transaction[transaction.length - 1][0].filled.token0Value
                    )[0] |
                      bigintToFloat(
                        tokens[
                          getTokenId(
                            transaction[transaction.length - 1][0].token0
                          )
                        ].decimals,
                        tokens[
                          getTokenId(
                            transaction[transaction.length - 1][0].token0
                          )
                        ].decimals
                      )
                  }}
                  {{
                    tokens[
                      getTokenId(transaction[transaction.length - 1][0].token0)
                    ].symbol
                  }}
                </div>
                <a-icon type="plus" />
                <div
                  v-if="
                    getTokenId(
                      transaction[transaction.length - 1][0].token1
                    ) === 'Cycles'
                  "
                >
                  {{
                    Object.values(
                      transaction[transaction.length - 1][0].filled.token1Value
                    )[0] | bigintToFloat(12, 12)
                  }}
                  TCycles
                </div>
                <div
                  v-if="
                    getTokenId(
                      transaction[transaction.length - 1][0].token1
                    ) === 'ICP'
                  "
                >
                  {{
                    Object.values(
                      transaction[transaction.length - 1][0].filled.token1Value
                    )[0] | bigintToFloat(8)
                  }}
                  ICP
                </div>
                <div
                  v-if="
                    tokens &&
                    tokens[
                      getTokenId(transaction[transaction.length - 1][0].token1)
                    ]
                  "
                >
                  {{
                    Object.values(
                      transaction[transaction.length - 1][0].filled.token1Value
                    )[0] |
                      bigintToFloat(
                        tokens[
                          getTokenId(
                            transaction[transaction.length - 1][0].token1
                          )
                        ].decimals,
                        tokens[
                          getTokenId(
                            transaction[transaction.length - 1][0].token1
                          )
                        ].decimals
                      )
                  }}
                  {{
                    tokens[
                      getTokenId(transaction[transaction.length - 1][0].token1)
                    ].symbol
                  }}
                </div>
              </div>
            </div>
            <div class="tx-item-right" v-else>-</div>
          </div>
          <div
            class="tx-item"
            v-if="
              transaction &&
              transaction[transaction.length - 1] &&
              transaction[transaction.length - 1] &&
              transaction[transaction.length - 1].length
            "
          >
            <div class="tx-item-left">Details:</div>
            <div class="tx-item-right" v-if="swaps && swaps[swapId]">
              <div class="tx-item-right-details-main">
                <div
                  class="tx-item-right-details"
                  v-for="(transactionInfo, index) in transaction"
                  :key="index"
                >
                  <div
                    v-for="(item, index) in transactionInfo[0].details"
                    :key="index"
                  >
                    <span>
                      {{ item.time | formatDateFromNanosecond }}
                    </span>
                    <router-link
                      :to="
                        jumpRouter(
                          `/swap/${swapId}/${arrayToHexString(
                            item.counterparty
                          )}`
                        )
                      "
                      >{{
                        item.counterparty | txidToHex | ellipsis()
                      }} </router-link
                    >:
                    <div
                      v-if="
                        Object.keys(
                          transaction[transaction.length - 1][0].operation
                        )[0] === 'Swap'
                      "
                    >
                      <div
                        v-if="
                          Object.keys(item.token0Value)[0] === 'DebitRecord' &&
                          tokens &&
                          tokens[
                            getTokenId(
                              transaction[transaction.length - 1][0].token0
                            )
                          ]
                        "
                      >
                        {{
                          Object.values(item.token0Value)[0] |
                            bigintToFloat(
                              tokens[
                                getTokenId(
                                  transaction[transaction.length - 1][0].token0
                                )
                              ].decimals,
                              tokens[
                                getTokenId(
                                  transaction[transaction.length - 1][0].token0
                                )
                              ].decimals
                            )
                        }}
                        {{
                          tokens[
                            getTokenId(
                              transaction[transaction.length - 1][0].token0
                            )
                          ].symbol
                        }}
                      </div>
                      <div
                        v-if="
                          Object.keys(item.token1Value)[0] === 'DebitRecord' &&
                          tokens &&
                          tokens[
                            getTokenId(
                              transaction[transaction.length - 1][0].token1
                            )
                          ]
                        "
                      >
                        {{
                          Object.values(item.token1Value)[0] |
                            bigintToFloat(
                              tokens[
                                getTokenId(
                                  transaction[transaction.length - 1][0].token1
                                )
                              ].decimals,
                              tokens[
                                getTokenId(
                                  transaction[transaction.length - 1][0].token1
                                )
                              ].decimals
                            )
                        }}
                        {{
                          tokens[
                            getTokenId(
                              transaction[transaction.length - 1][0].token1
                            )
                          ].symbol
                        }}
                      </div>
                      <div
                        v-if="
                          Object.keys(item.token0Value)[0] === 'DebitRecord' &&
                          getTokenId(
                            transaction[transaction.length - 1][0].token0
                          ) === 'Cycles'
                        "
                      >
                        {{
                          Object.values(item.token0Value)[0] |
                            bigintToFloat(12, 12)
                        }}
                        TCycles
                      </div>
                      <div
                        v-if="
                          Object.keys(item.token1Value)[0] === 'DebitRecord' &&
                          getTokenId(
                            transaction[transaction.length - 1][0].token1
                          ) === 'Cycles'
                        "
                      >
                        {{
                          Object.values(item.token1Value)[0] |
                            bigintToFloat(12, 12)
                        }}
                        TCycles
                      </div>
                      <div
                        v-if="
                          Object.keys(item.token0Value)[0] === 'DebitRecord' &&
                          getTokenId(
                            transaction[transaction.length - 1][0].token0
                          ) === 'ICP'
                        "
                      >
                        {{
                          Object.values(item.token0Value)[0] | bigintToFloat(8)
                        }}
                        ICP
                      </div>
                      <div
                        v-if="
                          Object.keys(item.token1Value)[0] === 'DebitRecord' &&
                          getTokenId(
                            transaction[transaction.length - 1][0].token1
                          ) === 'ICP'
                        "
                      >
                        {{
                          Object.values(item.token1Value)[0] | bigintToFloat(8)
                        }}
                        ICP
                      </div>
                      ->
                      <div
                        v-if="
                          Object.keys(item.token0Value)[0] === 'CreditRecord' &&
                          tokens &&
                          tokens[
                            getTokenId(
                              transaction[transaction.length - 1][0].token0
                            )
                          ]
                        "
                      >
                        {{
                          Object.values(item.token0Value)[0] |
                            bigintToFloat(
                              tokens[
                                getTokenId(
                                  transaction[transaction.length - 1][0].token0
                                )
                              ].decimals,
                              tokens[
                                getTokenId(
                                  transaction[transaction.length - 1][0].token0
                                )
                              ].decimals
                            )
                        }}
                        {{
                          tokens[
                            getTokenId(
                              transaction[transaction.length - 1][0].token0
                            )
                          ].symbol
                        }}
                      </div>
                      <div
                        v-if="
                          Object.keys(item.token1Value)[0] === 'CreditRecord' &&
                          tokens &&
                          tokens[
                            getTokenId(
                              transaction[transaction.length - 1][0].token1
                            )
                          ]
                        "
                      >
                        {{
                          Object.values(item.token1Value)[0] |
                            bigintToFloat(
                              tokens[
                                getTokenId(
                                  transaction[transaction.length - 1][0].token1
                                )
                              ].decimals,
                              tokens[
                                getTokenId(
                                  transaction[transaction.length - 1][0].token1
                                )
                              ].decimals
                            )
                        }}
                        {{
                          tokens[
                            getTokenId(
                              transaction[transaction.length - 1][0].token1
                            )
                          ].symbol
                        }}
                      </div>
                      <div
                        v-if="
                          Object.keys(item.token0Value)[0] === 'CreditRecord' &&
                          getTokenId(
                            transaction[transaction.length - 1][0].token0
                          ) === 'Cycles'
                        "
                      >
                        {{
                          Object.values(item.token0Value)[0] |
                            bigintToFloat(12, 12)
                        }}
                        TCycles
                      </div>
                      <div
                        v-if="
                          Object.keys(item.token1Value)[0] === 'CreditRecord' &&
                          getTokenId(
                            transaction[transaction.length - 1][0].token1
                          ) === 'Cycles'
                        "
                      >
                        {{
                          Object.values(item.token1Value)[0] |
                            bigintToFloat(12, 12)
                        }}
                        TCycles
                      </div>
                      <div
                        v-if="
                          Object.keys(item.token0Value)[0] === 'CreditRecord' &&
                          getTokenId(
                            transaction[transaction.length - 1][0].token0
                          ) === 'ICP'
                        "
                      >
                        {{
                          Object.values(item.token0Value)[0] | bigintToFloat(8)
                        }}
                        ICP
                      </div>
                      <div
                        v-if="
                          Object.keys(item.token1Value)[0] === 'CreditRecord' &&
                          getTokenId(
                            transaction[transaction.length - 1][0].token1
                          ) === 'ICP'
                        "
                      >
                        {{
                          Object.values(item.token1Value)[0] | bigintToFloat(8)
                        }}
                        ICP
                      </div>
                      <span>
                        (price:
                        <span v-show="!item.priceShowType">
                          {{ item.priceShow0 }}
                        </span>
                        <span v-show="item.priceShowType">
                          {{ item.priceShow1 }}
                        </span>
                        <a-icon
                          @click="changePrice(item)"
                          type="swap"
                          class="can-click"
                        />)
                      </span>
                    </div>
                    <div
                      v-if="
                        Object.keys(
                          transaction[transaction.length - 1][0].operation
                        )[0] === 'AddLiquidity'
                      "
                    >
                      <div
                        v-if="
                          getTokenId(
                            transaction[transaction.length - 1][0].token0
                          ) === 'Cycles'
                        "
                      >
                        {{
                          Object.values(item.token0Value)[0] |
                            bigintToFloat(12, 12)
                        }}
                        TCycles
                      </div>
                      <div
                        v-if="
                          getTokenId(
                            transaction[transaction.length - 1][0].token0
                          ) === 'ICP'
                        "
                      >
                        {{
                          Object.values(item.token0Value)[0] | bigintToFloat(8)
                        }}
                        ICP
                      </div>
                      <div
                        v-if="
                          tokens &&
                          tokens[
                            getTokenId(
                              transaction[transaction.length - 1][0].token0
                            )
                          ]
                        "
                      >
                        {{
                          Object.values(item.token0Value)[0] |
                            bigintToFloat(
                              tokens[
                                getTokenId(
                                  transaction[transaction.length - 1][0].token0
                                )
                              ].decimals,
                              tokens[
                                getTokenId(
                                  transaction[transaction.length - 1][0].token0
                                )
                              ].decimals
                            )
                        }}
                        {{
                          tokens[
                            getTokenId(
                              transaction[transaction.length - 1][0].token0
                            )
                          ].symbol
                        }}
                      </div>
                      <a-icon type="plus" />
                      <div
                        v-if="
                          getTokenId(
                            transaction[transaction.length - 1][0].token1
                          ) === 'Cycles'
                        "
                      >
                        {{
                          Object.values(item.token1Value)[0] |
                            bigintToFloat(12, 12)
                        }}
                        TCycles
                      </div>
                      <div
                        v-if="
                          getTokenId(
                            transaction[transaction.length - 1][0].token1
                          ) === 'ICP'
                        "
                      >
                        {{
                          Object.values(item.token1Value)[0] | bigintToFloat(8)
                        }}
                        ICP
                      </div>
                      <div
                        v-if="
                          tokens &&
                          tokens[
                            getTokenId(
                              transaction[transaction.length - 1][0].token1
                            )
                          ]
                        "
                      >
                        {{
                          Object.values(item.token1Value)[0] |
                            bigintToFloat(
                              tokens[
                                getTokenId(
                                  transaction[transaction.length - 1][0].token1
                                )
                              ].decimals,
                              tokens[
                                getTokenId(
                                  transaction[transaction.length - 1][0].token1
                                )
                              ].decimals
                            )
                        }}
                        {{
                          tokens[
                            getTokenId(
                              transaction[transaction.length - 1][0].token1
                            )
                          ].symbol
                        }}
                      </div>
                    </div>
                    <div
                      v-if="
                        Object.keys(
                          transaction[transaction.length - 1][0].operation
                        )[0] === 'Claim'
                      "
                    >
                      <div
                        v-if="
                          getTokenId(
                            transaction[transaction.length - 1][0].token0
                          ) === 'Cycles'
                        "
                      >
                        {{
                          Object.values(item.token0Value)[0] |
                            bigintToFloat(12, 12)
                        }}
                        TCycles
                      </div>
                      <div
                        v-if="
                          getTokenId(
                            transaction[transaction.length - 1][0].token0
                          ) === 'ICP'
                        "
                      >
                        {{
                          Object.values(item.token0Value)[0] | bigintToFloat(8)
                        }}
                        ICP
                      </div>
                      <div
                        v-if="
                          tokens &&
                          tokens[
                            getTokenId(
                              transaction[transaction.length - 1][0].token0
                            )
                          ]
                        "
                      >
                        {{
                          Object.values(item.token0Value)[0] |
                            bigintToFloat(
                              tokens[
                                getTokenId(
                                  transaction[transaction.length - 1][0].token0
                                )
                              ].decimals,
                              tokens[
                                getTokenId(
                                  transaction[transaction.length - 1][0].token0
                                )
                              ].decimals
                            )
                        }}
                        {{
                          tokens[
                            getTokenId(
                              transaction[transaction.length - 1][0].token0
                            )
                          ].symbol
                        }}
                      </div>
                      <a-icon type="plus" />
                      <div
                        v-if="
                          getTokenId(
                            transaction[transaction.length - 1][0].token1
                          ) === 'Cycles'
                        "
                      >
                        {{
                          Object.values(item.token1Value)[0] |
                            bigintToFloat(12, 12)
                        }}
                        TCycles
                      </div>
                      <div
                        v-if="
                          getTokenId(
                            transaction[transaction.length - 1][0].token1
                          ) === 'ICP'
                        "
                      >
                        {{
                          Object.values(item.token1Value)[0] | bigintToFloat(8)
                        }}
                        ICP
                      </div>
                      <div
                        v-if="
                          tokens &&
                          tokens[
                            getTokenId(
                              transaction[transaction.length - 1][0].token1
                            )
                          ]
                        "
                      >
                        {{
                          Object.values(item.token1Value)[0] |
                            bigintToFloat(
                              tokens[
                                getTokenId(
                                  transaction[transaction.length - 1][0].token1
                                )
                              ].decimals,
                              tokens[
                                getTokenId(
                                  transaction[transaction.length - 1][0].token1
                                )
                              ].decimals
                            )
                        }}
                        {{
                          tokens[
                            getTokenId(
                              transaction[transaction.length - 1][0].token1
                            )
                          ].symbol
                        }}
                      </div>
                    </div>
                    <div
                      v-if="
                        Object.keys(
                          transaction[transaction.length - 1][0].operation
                        )[0] === 'RemoveLiquidity'
                      "
                    >
                      <div
                        v-if="
                          getTokenId(
                            transaction[transaction.length - 1][0].token0
                          ) === 'Cycles'
                        "
                      >
                        {{
                          Object.values(item.token0Value)[0] |
                            bigintToFloat(12, 12)
                        }}
                        TCycles
                      </div>
                      <div
                        v-if="
                          getTokenId(
                            transaction[transaction.length - 1][0].token0
                          ) === 'ICP'
                        "
                      >
                        {{
                          Object.values(item.token0Value)[0] | bigintToFloat(8)
                        }}
                        ICP
                      </div>
                      <div
                        v-if="
                          tokens &&
                          tokens[
                            getTokenId(
                              transaction[transaction.length - 1][0].token0
                            )
                          ]
                        "
                      >
                        {{
                          Object.values(item.token0Value)[0] |
                            bigintToFloat(
                              tokens[
                                getTokenId(
                                  transaction[transaction.length - 1][0].token0
                                )
                              ].decimals,
                              tokens[
                                getTokenId(
                                  transaction[transaction.length - 1][0].token0
                                )
                              ].decimals
                            )
                        }}
                        {{
                          tokens[
                            getTokenId(
                              transaction[transaction.length - 1][0].token0
                            )
                          ].symbol
                        }}
                      </div>
                      <a-icon type="plus" />
                      <div
                        v-if="
                          getTokenId(
                            transaction[transaction.length - 1][0].token1
                          ) === 'Cycles'
                        "
                      >
                        {{
                          Object.values(item.token1Value)[0] |
                            bigintToFloat(12, 12)
                        }}
                        TCycles
                      </div>
                      <div
                        v-if="
                          getTokenId(
                            transaction[transaction.length - 1][0].token1
                          ) === 'ICP'
                        "
                      >
                        {{
                          Object.values(item.token1Value)[0] | bigintToFloat(8)
                        }}
                        ICP
                      </div>
                      <div
                        v-if="
                          tokens &&
                          tokens[
                            getTokenId(
                              transaction[transaction.length - 1][0].token1
                            )
                          ]
                        "
                      >
                        {{
                          Object.values(item.token1Value)[0] |
                            bigintToFloat(
                              tokens[
                                getTokenId(
                                  transaction[transaction.length - 1][0].token1
                                )
                              ].decimals,
                              tokens[
                                getTokenId(
                                  transaction[transaction.length - 1][0].token1
                                )
                              ].decimals
                            )
                        }}
                        {{
                          tokens[
                            getTokenId(
                              transaction[transaction.length - 1][0].token1
                            )
                          ].symbol
                        }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="tx-item">
            <div class="tx-item-left">Order mode:</div>
            <div class="tx-item-right" v-if="transaction && transaction.length">
              {{
                Object.keys(transaction[transaction.length - 1][0].orderMode)[0]
              }}
            </div>
            <div class="tx-item-right" v-else>-</div>
          </div>
          <div class="tx-item">
            <div class="tx-item-left">Fee:</div>
            <div class="tx-item-right" v-if="transaction && transaction.length">
              <div v-if="transaction[transaction.length - 1][0].fee.token0Fee">
                <div
                  v-if="
                    tokens &&
                    tokens[
                      getTokenId(transaction[transaction.length - 1][0].token0)
                    ]
                  "
                >
                  {{
                    transaction[transaction.length - 1][0].fee.token0Fee |
                      bigintToFloat(
                        tokens[
                          getTokenId(
                            transaction[transaction.length - 1][0].token0
                          )
                        ].decimals,
                        tokens[
                          getTokenId(
                            transaction[transaction.length - 1][0].token0
                          )
                        ].decimals
                      )
                  }}
                  {{
                    tokens[
                      getTokenId(transaction[transaction.length - 1][0].token0)
                    ].symbol
                  }}
                </div>
                <div
                  v-if="
                    getTokenId(
                      transaction[transaction.length - 1][0].token0
                    ) === 'Cycles'
                  "
                >
                  {{
                    transaction[transaction.length - 1][0].fee.token0Fee |
                      bigintToFloat(12, 12)
                  }}
                  TCycles
                </div>
                <div
                  v-if="
                    getTokenId(
                      transaction[transaction.length - 1][0].token0
                    ) === 'ICP'
                  "
                >
                  {{
                    transaction[transaction.length - 1][0].fee.token0Fee |
                      bigintToFloat(8)
                  }}
                  ICP
                </div>
              </div>
              <div
                v-if="
                  transaction[transaction.length - 1][0].fee.token0Fee &&
                  transaction[transaction.length - 1][0].fee.token1Fee
                "
              >
                <span class="span-nbsp"></span><span class="span-nbsp"></span>
              </div>
              <div v-if="transaction[transaction.length - 1][0].fee.token1Fee">
                <div
                  v-if="
                    tokens &&
                    tokens[
                      getTokenId(transaction[transaction.length - 1][0].token1)
                    ]
                  "
                >
                  {{
                    transaction[transaction.length - 1][0].fee.token1Fee |
                      bigintToFloat(
                        tokens[
                          getTokenId(
                            transaction[transaction.length - 1][0].token1
                          )
                        ].decimals,
                        tokens[
                          getTokenId(
                            transaction[transaction.length - 1][0].token1
                          )
                        ].decimals
                      )
                  }}
                  {{
                    tokens[
                      getTokenId(transaction[transaction.length - 1][0].token1)
                    ].symbol
                  }}
                </div>
                <div
                  v-if="
                    getTokenId(
                      transaction[transaction.length - 1][0].token1
                    ) === 'Cycles'
                  "
                >
                  {{
                    transaction[transaction.length - 1][0].fee.token1Fee |
                      bigintToFloat(12, 12)
                  }}
                  TCycles
                </div>
                <div
                  v-if="
                    getTokenId(
                      transaction[transaction.length - 1][0].token1
                    ) === 'ICP'
                  "
                >
                  {{
                    transaction[transaction.length - 1][0].fee.token1Fee |
                      bigintToFloat(8)
                  }}
                  ICP
                </div>
              </div>
              <div
                v-if="
                  !transaction[transaction.length - 1][0].fee.token1Fee &&
                  !transaction[transaction.length - 1][0].fee.token0Fee
                "
              >
                NoFee
              </div>
            </div>
          </div>
          <div class="tx-item">
            <div class="tx-item-left">Index:</div>
            <div class="tx-item-right" v-if="transaction && transaction.length">
              {{ transaction[transaction.length - 1][0].index }}
            </div>
            <div class="tx-item-right" v-else>-</div>
          </div>
          <div class="tx-item">
            <div class="tx-item-left">Nonce:</div>
            <div class="tx-item-right" v-if="transaction && transaction.length">
              {{ transaction[transaction.length - 1][0].nonce }}
            </div>
            <div class="tx-item-right" v-else>-</div>
          </div>
          <div class="tx-item">
            <div class="tx-item-left">Timestamp:</div>
            <div class="tx-item-right" v-if="transaction && transaction.length">
              {{
                transaction[transaction.length - 1][0].time |
                  formatDateFromNanosecond
              }}
            </div>
            <div class="tx-item-right" v-else>-</div>
          </div>
          <div class="tx-item">
            <div class="tx-item-left">Data:</div>
            <div class="tx-item-right" v-if="transaction && transaction.length">
              {{ transaction[transaction.length - 1][0].data[0] | txidToHex }}
            </div>
            <div class="tx-item-right" v-else>-</div>
          </div>
          <div class="tx-item">
            <div class="tx-item-left">Status:</div>
            <div
              class="tx-item-right"
              :class="
                Object.keys(transaction[transaction.length - 1][0].status)[0]
              "
              v-if="
                transaction &&
                transaction[transaction.length - 1] &&
                transaction[transaction.length - 1][0]
              "
            >
              {{
                Object.keys(transaction[transaction.length - 1][0].status)[0]
              }}
            </div>
          </div>
        </div>
        <div class="tx-item tx-item-err" v-if="showErr">
          The record does not exist or is in Pending status. (OrderBook type
          orders do not store records until after the order is closed.)
        </div>
      </a-spin>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import BigNumber from 'bignumber.js';
import { Principal } from '@dfinity/principal';
import { SwapInfo, TokenId, TokenInfo, Txid } from '@/ic/common/icType';
import { getSwapInfo } from '@/ic/getSwapInfo';
import { hexToBytes, toHexString } from '@/ic/converter';
import {
  ShareChange,
  TokenType,
  TxnRecord,
  TxnRecordDetails,
  TxnRecordFilled,
  TxnRecordOrder,
  TxnResult
} from '@/ic/DRC205Bucket/model';
import { DRC205SwapService } from '@/ic/DRC205Swap/DRC205SwapService';
import { DRC205ProxyService } from '@/ic/DRC205Proxy/DRC205ProxyService';
import { DRC205BucketService } from '@/ic/DRC205Bucket/DRC205BucketService';
import { getTokenInfo } from '@/ic/getTokenInfo';

@Component({
  name: 'Transaction',
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
  private swaps: { [key: string]: SwapInfo };
  private swapId = '';
  private tokens: { [key: string]: TokenInfo } = {};
  private txid = '';
  private transaction: Array<TxnRecord | TxnResult> = [];
  private showErr = false;
  private details: Array<any> = [];
  private isICRC = false;
  @Watch('$route')
  private onRouteChange() {
    this.swapId = '';
    this.txid = '';
    this.transaction = null;
    this.init();
  }
  created(): void {
    this.DRC205ProxyService = new DRC205ProxyService();
    this.init();
  }
  private async init(): Promise<void> {
    this.txid = this.$route.params.id;
    this.swapId = this.$route.params.swapId;
    this.tokens = JSON.parse(localStorage.getItem('tokens')) || {};
    this.swaps = JSON.parse(localStorage.getItem('swaps')) || {};
    if (!this.swaps[this.swapId]) {
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
    if (this.swaps[this.swapId].token0[1]) {
      const tokenStd = Object.keys(this.swaps[this.swapId].token0[1])[0];
      if (tokenStd && tokenStd.toLocaleLowerCase().includes('icrc')) {
        this.isICRC = true;
      }
    }
    if (this.swaps[this.swapId].token1[1]) {
      const tokenStd = Object.keys(this.swaps[this.swapId].token1[1])[0];
      if (tokenStd && tokenStd.toLocaleLowerCase().includes('icrc')) {
        this.isICRC = true;
      }
    }
    this.getTransactionDetails();
  }
  private async getTransactionDetails(): Promise<void> {
    this.spinning = true;
    try {
      if (/^[0-9]*$/.test(this.txid.trim())) {
        const bucketList = await this.DRC205ProxyService.bucketList();
        console.log(bucketList);
        for (let i = 0; i < bucketList.length; i++) {
          const currentDRC205BucketService = new DRC205BucketService(
            bucketList[i].toString()
          );
          const res = await currentDRC205BucketService.txnByIndex(
            Principal.from(this.swapId),
            BigInt(this.txid.trim())
          );
          if (res && res.length) {
            console.log(res);
            this.transaction = res;
            break;
          }
        }
      } else {
        const txid = Array.from(hexToBytes(this.txid));
        let step = 0;
        const transaction = await this.getTxn(
          Principal.fromText(this.swapId),
          txid,
          step
        );
        this.transaction = transaction.sort(
          (a, b) => Number(a[0].time) - Number(b[0].time)
        );
      }
      this.transaction.forEach((transaction) => {
        if (transaction[0].details && transaction[0].details.length) {
          transaction[0].details = transaction[0].details.sort(
            (a, b) => Number(a.time) - Number(b.time)
          );
        }
      });
      this.transaction.forEach((transaction) => {
        const price = this.getPrice(transaction[0]);
        transaction[0].order.priceShow0 = price.order.price0;
        transaction[0].order.priceShow1 = price.order.price1;
        transaction[0].filled.priceShow0 = price.filled.price0;
        transaction[0].filled.priceShow1 = price.filled.price1;
        if (transaction[0].details && transaction[0].details.length) {
          transaction[0].details.forEach((item) => {
            const detailsPrice = this.getDetailsPrice(transaction[0], item);
            item.priceShow0 = detailsPrice.price0;
            item.priceShow1 = detailsPrice.price1;
          });
        }
      });
      this.showErr = !this.transaction;
      console.log(this.transaction);
    } catch (e) {
      this.showErr = true;
      console.log(e);
    }
    this.spinning = false;
  }
  private async getTxn(
    swapId: TokenId,
    txid: Txid,
    step: number
  ): Promise<Array<TxnRecord | TxnResult>> {
    const bucket = await this.DRC205ProxyService.bucket(
      swapId,
      txid,
      BigInt(step)
    );
    console.log('bucket');
    console.log(bucket[0].toString());
    if ((bucket && !bucket[0]) || !bucket) {
      try {
        const DRC205Swap = new DRC205SwapService(this.swapId);
        const res = await DRC205Swap.drc205_txn(txid);
        console.log(res);
        if (res && res.length) {
          return res;
        } else {
          return null;
        }
      } catch (e) {
        return null;
      }
    } else {
      const currentDRC205BucketService = new DRC205BucketService(
        bucket[0].toString()
      );
      const txn = await currentDRC205BucketService.txnHistory(swapId, txid);
      console.log(txn);
      if (txn && txn.length) {
        return txn;
      } else {
        return await this.getTxn(swapId, txid, ++step);
      }
    }
  }
  private arrayToHexString = (val: Array<number>): string => {
    return toHexString(new Uint8Array(val));
  };
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
        return 'Cycles';
      } else if ((tokenType as { Icp: null }).Icp === null) {
        return 'ICP';
      }
    }
  }
  private hasSubaccount(val: Array<number>): boolean {
    if (val && val.length) {
      const flag = val.every((item) => {
        return item === 0;
      });
      return !flag;
    }
    return false;
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
  private jumpTokensTest(url: string): string {
    if (this.$route.meta && this.$route.meta.type === 'Test') {
      url = '/tokensTest' + url;
    }
    return url;
  }
  private changePrice(val: TxnRecordFilled | TxnRecordOrder): void {
    if (val.priceShowType) {
      this.$set(val, 'priceShowType', '');
    } else {
      this.$set(val, 'priceShowType', 'swap');
    }
    console.log(this.transaction);
  }
  private getDetailsPrice(
    val: TxnRecord,
    detail: TxnRecordDetails
  ): { price0: string; price1: string } {
    let price0 = '';
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
    const token0Value = Object.values(detail.token0Value)[0];
    const token1Value = Object.values(detail.token1Value)[0];
    const balanceChange = Object.keys(detail.token0Value)[0];
    price0 = new BigNumber(token0Value.toString(10))
      .div(10 ** token0decimals)
      .div(token1Value.toString(10))
      .times(10 ** token1decimals)
      .decimalPlaces(token0decimals)
      .toString(10);
    price1 = new BigNumber(token1Value.toString(10))
      .div(10 ** token1decimals)
      .div(token0Value.toString(10))
      .times(10 ** token0decimals)
      .decimalPlaces(token1decimals)
      .toString(10);
    return {
      price0: `1 ${token0Symbol} = ${price1} ${token1Symbol}`,
      price1: `1 ${token1Symbol} = ${price0} ${token0Symbol}`
    };
  }
  private getPrice(val: TxnRecord): {
    order: { price0: string; price1: string };
    filled: { price0: string; price1: string };
  } {
    const orderMode = Object.keys(val.orderMode)[0];
    let price0 = '';
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
    price0 = new BigNumber(token0Value.toString(10))
      .div(10 ** token0decimals)
      .div(token1Value.toString(10))
      .times(10 ** token1decimals)
      .decimalPlaces(token0decimals)
      .toString(10);
    price1 = new BigNumber(token1Value.toString(10))
      .div(10 ** token1decimals)
      .div(token0Value.toString(10))
      .times(10 ** token0decimals)
      .decimalPlaces(token1decimals)
      .toString(10);
    if (orderMode === 'AMM' || Object.keys(val.orderType[0])[0] === 'MKT') {
      return {
        filled: {
          price0: `1 ${token0Symbol} = ${price1} ${token1Symbol}`,
          price1: `1 ${token1Symbol} = ${price0} ${token0Symbol}`
        },
        order: {
          price0: null,
          price1: null
        }
      };
    } else {
      const token0ValueOrder = Object.values(val.order.token0Value[0])[0];
      const token1ValueOrder = Object.values(val.order.token1Value[0])[0];
      const price0Order = new BigNumber(token0ValueOrder.toString(10))
        .div(10 ** token0decimals)
        .div(token1ValueOrder.toString(10))
        .times(10 ** token1decimals)
        .decimalPlaces(token0decimals)
        .toString(10);
      const price1Order = new BigNumber(token1ValueOrder.toString(10))
        .div(10 ** token1decimals)
        .div(token0ValueOrder.toString(10))
        .times(10 ** token0decimals)
        .decimalPlaces(token1decimals)
        .toString(10);
      return {
        filled: {
          price0: `1 ${token0Symbol} = ${price1} ${token1Symbol}`,
          price1: `1 ${token1Symbol} = ${price0} ${token0Symbol}`
        },
        order: {
          price0: `1 ${token0Symbol} = ${price1Order} ${token1Symbol}`,
          price1: `1 ${token1Symbol} = ${price0Order} ${token0Symbol}`
        }
      };
    }
  }
}
</script>

<style scoped lang="scss">
.tx-item-right {
  &.Fail {
    color: #d13651;
  }
  &.Completed,
  &.PartiallyCompletedAndCancelled {
    color: #21c77d;
  }
  > div {
    display: flex;
    align-items: center;
    /*div {
        display: flex;
        align-items: center;
        white-space: nowrap;
      }*/
  }
  div.tx-item-right-details {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
    div {
      display: inline-block;
    }
  }
  div.tx-item-right-details-main {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
  }
}
.tx-item-err {
  height: 80px;
  align-items: center;
  color: #666;
}
.tx-item-right-swap {
  display: flex;
  flex-direction: column;
  align-items: flex-start !important;
  > div {
    display: inline-block;
  }
}
.can-click {
  color: #51b7c3;
}
</style>
