<template>
  <div class="tx-details">
    <a-spin :spinning="spinning">
      <div class="tx-details-top">
        <div>
          <div class="tx-main">
            <div class="tx-main-title">Swapping Pair Info</div>
            <div class="tx-item">
              <div class="tx-item-left">Canister:</div>
              <div class="tx-item-right">
                {{ swapId }}
                <span class="span-nbsp"></span
                ><a-icon
                  style="cursor: pointer !important"
                  type="copy"
                  v-clipboard:copy="swapId"
                  v-clipboard:success="onCopy"
                />
              </div>
            </div>
            <div class="tx-item">
              <div class="tx-item-left">Name:</div>
              <div class="tx-item-right" v-if="swapId && swaps[swapId]">
                {{ swaps[swapId].name }}
                <a
                  v-if="
                    tokens &&
                    Object.keys(swaps[swapId].mmType)[0] === 'OrderBook'
                  "
                  :href="`https://iclight.io/ICDex/${getTokenSymbol(
                    swaps[swapId].token0[0],
                    swaps[swapId].token0[1]
                  )}/${getTokenSymbol(
                    swaps[swapId].token1[0],
                    swaps[swapId].token1[1]
                  )}`"
                  target="_blank"
                  style="display: flex; align-items: center; margin-left: 5px"
                  ><img src="@/assets/img/jump.svg" alt=""
                /></a>
                <a
                  v-if="swapId === '6nmrm-laaaa-aaaak-aacfq-cai'"
                  href="https://iclight.io/cyclesFinance"
                  target="_blank"
                  style="display: flex; align-items: center; margin-left: 5px"
                >
                  <img src="@/assets/img/jump.svg" alt="" />
                </a>
              </div>
            </div>
            <div class="tx-item">
              <div class="tx-item-left">Token0:</div>
              <div class="tx-item-right" v-if="swapId && swaps[swapId]">
                <span
                  v-if="
                    tokens &&
                    getToken(
                      swaps[swapId].token0[0],
                      swaps[swapId].token0[1]
                    ) === 'Cycles'
                  "
                >
                  Cycles
                </span>
                <span
                  v-if="
                    tokens &&
                    getToken(
                      swaps[swapId].token0[0],
                      swaps[swapId].token0[1]
                    ) === 'ICP'
                  "
                >
                  ICP
                </span>
                <div
                  v-if="
                    tokens &&
                    tokens[
                      getToken(swaps[swapId].token0[0], swaps[swapId].token0[1])
                    ]
                  "
                >
                  <span>
                    {{
                      tokens[
                        getToken(
                          swaps[swapId].token0[0],
                          swaps[swapId].token0[1]
                        )
                      ].symbol
                    }}({{
                      tokens[
                        getToken(
                          swaps[swapId].token0[0],
                          swaps[swapId].token0[1]
                        )
                      ].name
                    }}) </span
                  ><span>[{{ Object.keys(swaps[swapId].token0[1])[0] }}]</span>
                  <div>
                    <router-link
                      :to="
                        jumpTokensTest(
                          `/token/${getToken(
                            swaps[swapId].token0[0],
                            swaps[swapId].token0[1]
                          )}`
                        )
                      "
                      >{{
                        getToken(
                          swaps[swapId].token0[0],
                          swaps[swapId].token0[1]
                        )
                      }}</router-link
                    >
                  </div>
                </div>
              </div>
            </div>
            <div class="tx-item">
              <div class="tx-item-left">Token1:</div>
              <div class="tx-item-right" v-if="swapId && swaps[swapId]">
                <span
                  v-if="
                    tokens &&
                    getToken(
                      swaps[swapId].token1[0],
                      swaps[swapId].token1[1]
                    ) === 'Cycles'
                  "
                >
                  Cycles
                </span>
                <span
                  v-if="
                    tokens &&
                    getToken(
                      swaps[swapId].token1[0],
                      swaps[swapId].token1[1]
                    ) === 'ICP'
                  "
                >
                  ICP
                </span>
                <div
                  v-if="
                    tokens &&
                    tokens[
                      getToken(swaps[swapId].token1[0], swaps[swapId].token1[1])
                    ]
                  "
                >
                  <span>
                    {{
                      tokens[
                        getToken(
                          swaps[swapId].token1[0],
                          swaps[swapId].token1[1]
                        )
                      ].symbol
                    }}({{
                      tokens[
                        getToken(
                          swaps[swapId].token1[0],
                          swaps[swapId].token1[1]
                        )
                      ].name
                    }}) </span
                  ><span>[{{ Object.keys(swaps[swapId].token1[1])[0] }}]</span>
                  <div>
                    <router-link
                      :to="
                        jumpTokensTest(
                          `/token/${getToken(
                            swaps[swapId].token1[0],
                            swaps[swapId].token1[1]
                          )}`
                        )
                      "
                      >{{
                        getToken(
                          swaps[swapId].token1[0],
                          swaps[swapId].token1[1]
                        )
                      }}</router-link
                    >
                  </div>
                </div>
              </div>
            </div>
            <div class="tx-item">
              <div class="tx-item-left">Fee:</div>
              <div
                class="tx-item-right"
                v-if="
                  swaps && swaps[swapId] && Number(swaps[swapId].feeRate) !== 0
                "
              >
                {{ swaps[swapId].feeRate * 100 }}%
              </div>
              <div v-else>-</div>
            </div>
          </div>
        </div>
        <div class="echarts-vol-main">
          <a-spin style="height: 100%" :spinning="chartSpinning">
            <ul class="k-interval-time">
              <li
                :class="{ active: currentKInterval.value === item.value }"
                v-for="(item, index) in kIntervalList"
                :key="index"
                @click="changeKIntervalList(item)"
              >
                <span>{{ item.value }}</span>
              </li>
            </ul>
            <div id="echarts-responsive-container"></div>
          </a-spin>
        </div>
      </div>
      <div
        class="tx-main"
        v-if="
          swaps &&
          swaps[swapId] &&
          swaps[swapId].mmType &&
          swaps[swapId].mmType.AMM === null
        "
      >
        <div class="tx-main-title">Liquidity</div>
        <div class="tx-item">
          <div
            class="tx-item-left"
            v-if="swapId === '6nmrm-laaaa-aaaak-aacfq-cai'"
          >
            Cycles Amount:
          </div>
          <div
            class="tx-item-right"
            v-if="swapId === '6nmrm-laaaa-aaaak-aacfq-cai' && liquidity"
          >
            <a-statistic
              :value-style="{ fontSize: '14px', fontWeight: 'normal' }"
              :value="onBigintToFloat(liquidity.cycles, 12, 12)"
              suffix="TCycles"
            ></a-statistic>
          </div>
          <div
            class="tx-item-left"
            v-if="
              swaps &&
              swaps[swapId] &&
              swapId !== '6nmrm-laaaa-aaaak-aacfq-cai' &&
              tokens
            "
          >
            <span
              v-if="
                getToken(swaps[swapId].token0[0], swaps[swapId].token0[1]) ===
                'Cycles'
              "
              >Cycles</span
            >
            <span
              v-if="
                getToken(swaps[swapId].token0[0], swaps[swapId].token0[1]) ===
                'ICP'
              "
              >ICP</span
            >
            <span
              v-if="
                tokens &&
                tokens[
                  getToken(swaps[swapId].token0[0], swaps[swapId].token0[1])
                ]
              "
              >{{
                tokens[
                  getToken(swaps[swapId].token0[0], swaps[swapId].token0[1])
                ].name
              }}</span
            >
            Amount:
          </div>
          <div
            class="tx-item-right"
            v-if="
              liquidity &&
              swaps &&
              swaps[swapId] &&
              swapId !== '6nmrm-laaaa-aaaak-aacfq-cai'
            "
          >
            <a-statistic
              v-if="
                getToken(swaps[swapId].token0[0], swaps[swapId].token0[1]) ===
                'Cycles'
              "
              :value-style="{ fontSize: '14px', fontWeight: 'normal' }"
              :value="onBigintToFloat(liquidity.value0, 12, 12)"
              suffix="TCycles"
            ></a-statistic>
            <a-statistic
              v-if="
                getToken(swaps[swapId].token0[0], swaps[swapId].token0[1]) ===
                'ICP'
              "
              :value-style="{ fontSize: '14px', fontWeight: 'normal' }"
              :value="onBigintToFloat(liquidity.value0, 8, 8)"
              suffix="ICP"
            ></a-statistic>
            <a-statistic
              v-if="
                tokens &&
                tokens[
                  getToken(swaps[swapId].token0[0], swaps[swapId].token0[1])
                ]
              "
              :value-style="{ fontSize: '14px', fontWeight: 'normal' }"
              :value="
                onBigintToFloat(
                  liquidity.value0,
                  tokens[
                    getToken(swaps[swapId].token0[0], swaps[swapId].token0[1])
                  ].decimals,
                  tokens[
                    getToken(swaps[swapId].token0[0], swaps[swapId].token0[1])
                  ].decimals
                )
              "
              :suffix="
                tokens[
                  getToken(swaps[swapId].token0[0], swaps[swapId].token0[1])
                ].symbol
              "
            ></a-statistic>
          </div>
        </div>
        <div class="tx-item">
          <div
            class="tx-item-left"
            v-if="swapId === '6nmrm-laaaa-aaaak-aacfq-cai'"
          >
            ICP Amount:
          </div>
          <div
            v-if="swapId === '6nmrm-laaaa-aaaak-aacfq-cai' && liquidity"
            class="tx-item-right"
          >
            <a-statistic
              :value-style="{ fontSize: '14px', fontWeight: 'normal' }"
              :value="onBigintToFloat(liquidity.icpE8s, 8, 8)"
              suffix="ICP"
            ></a-statistic>
          </div>
          <div
            class="tx-item-left"
            v-if="
              swaps && swaps[swapId] && swapId !== '6nmrm-laaaa-aaaak-aacfq-cai'
            "
          >
            <span
              v-if="
                getToken(swaps[swapId].token1[0], swaps[swapId].token1[1]) ===
                'Cycles'
              "
              >Cycles</span
            >
            <span
              v-if="
                getToken(swaps[swapId].token1[0], swaps[swapId].token1[1]) ===
                'ICP'
              "
              >ICP</span
            >
            <span
              v-if="
                tokens &&
                tokens[
                  getToken(swaps[swapId].token1[0], swaps[swapId].token1[1])
                ]
              "
              >{{
                tokens[
                  getToken(swaps[swapId].token1[0], swaps[swapId].token1[1])
                ].name
              }}</span
            >
            Amount:
          </div>
          <div
            class="tx-item-right"
            v-if="
              liquidity &&
              swaps &&
              swaps[swapId] &&
              swapId !== '6nmrm-laaaa-aaaak-aacfq-cai'
            "
          >
            <a-statistic
              v-if="
                getToken(swaps[swapId].token1[0], swaps[swapId].token1[1]) ===
                'Cycles'
              "
              :value-style="{ fontSize: '14px', fontWeight: 'normal' }"
              :value="onBigintToFloat(liquidity.value1, 12, 12)"
              suffix="TCycles"
            ></a-statistic>
            <a-statistic
              v-if="
                getToken(swaps[swapId].token1[0], swaps[swapId].token1[1]) ===
                'ICP'
              "
              :value-style="{ fontSize: '14px', fontWeight: 'normal' }"
              :value="onBigintToFloat(liquidity.value1, 8, 8)"
              suffix="ICP"
            ></a-statistic>
            <a-statistic
              v-if="
                tokens &&
                tokens[
                  getToken(swaps[swapId].token1[0], swaps[swapId].token1[1])
                ]
              "
              :value-style="{ fontSize: '14px', fontWeight: 'normal' }"
              :value="
                onBigintToFloat(
                  liquidity.value1,
                  tokens[
                    getToken(swaps[swapId].token1[0], swaps[swapId].token1[1])
                  ].decimals,
                  tokens[
                    getToken(swaps[swapId].token1[0], swaps[swapId].token1[1])
                  ].decimals
                )
              "
              :suffix="
                tokens[
                  getToken(swaps[swapId].token1[0], swaps[swapId].token1[1])
                ].symbol
              "
            ></a-statistic>
          </div>
        </div>
        <div class="tx-item">
          <div class="tx-item-left">Price:</div>
          <div class="tx-item-right">
            <span v-if="swapId === '6nmrm-laaaa-aaaak-aacfq-cai' && liquidity">
              1 ICP = {{ liquidity | preIcpPrice }} TCycles
            </span>
            <span
              v-if="
                liquidity &&
                swaps &&
                swaps[swapId] &&
                swapId !== '6nmrm-laaaa-aaaak-aacfq-cai' &&
                tokens
              "
            >
              1
              <span
                v-if="
                  getToken(swaps[swapId].token0[0], swaps[swapId].token0[1]) ===
                  'Cycles'
                "
                >TCycles</span
              >
              <span
                v-if="
                  getToken(swaps[swapId].token0[0], swaps[swapId].token0[1]) ===
                  'ICP'
                "
                >ICP</span
              >
              <span
                v-if="
                  tokens[
                    getToken(swaps[swapId].token0[0], swaps[swapId].token0[1])
                  ]
                "
                >{{
                  tokens[
                    getToken(swaps[swapId].token0[0], swaps[swapId].token0[1])
                  ].symbol
                }}</span
              >
              =
              {{
                liquidity |
                  prePrice(
                    getToken(swaps[swapId].token0[0], swaps[swapId].token0[1]),
                    getToken(swaps[swapId].token1[0], swaps[swapId].token1[1]),
                    this.tokens
                  )
              }}
              <span
                v-if="
                  getToken(swaps[swapId].token1[0], swaps[swapId].token1[1]) ===
                  'Cycles'
                "
                >TCycles</span
              >
              <span
                v-if="
                  getToken(swaps[swapId].token1[0], swaps[swapId].token1[1]) ===
                  'ICP'
                "
                >ICP</span
              >
              <span
                v-if="
                  tokens[
                    getToken(swaps[swapId].token1[0], swaps[swapId].token1[1])
                  ]
                "
                >{{
                  tokens[
                    getToken(swaps[swapId].token1[0], swaps[swapId].token1[1])
                  ].symbol
                }}</span
              >
            </span>
          </div>
        </div>
        <div class="tx-item">
          <div class="tx-item-left">Shares:</div>
          <div
            class="tx-item-right"
            v-if="liquidity && swapId && swaps[swapId]"
          >
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
          </div>
        </div>
        <div class="tx-item">
          <div class="tx-item-left">Unit Value:</div>
          <div
            class="tx-item-right"
            v-if="swapId === '6nmrm-laaaa-aaaak-aacfq-cai' && liquidity"
          >
            {{ liquidity.unitValue[0] | bigintToFloat(12, 4) }}
            TCycles<span class="span-nbsp"></span><a-icon type="plus" /><span
              class="span-nbsp"
            ></span
            >{{ liquidity.unitValue[1] }}
            ICP
          </div>
          <div
            class="tx-item-right"
            v-if="
              liquidity &&
              swaps &&
              swaps[swapId] &&
              swapId !== '6nmrm-laaaa-aaaak-aacfq-cai' &&
              tokens
            "
          >
            <span
              v-if="
                getToken(swaps[swapId].token0[0], swaps[swapId].token0[1]) ===
                'Cycles'
              "
            >
              {{ liquidity.unitValue[0] | bigintToFloat(12, 12) }} TCycles
            </span>
            <span
              v-if="
                getToken(swaps[swapId].token0[0], swaps[swapId].token0[1]) ===
                'ICP'
              "
            >
              {{ liquidity.unitValue[0] | bigintToFloat(8, 8) }} ICP
            </span>
            <span
              v-if="
                tokens[
                  getToken(swaps[swapId].token0[0], swaps[swapId].token0[1])
                ]
              "
            >
              {{
                liquidity.unitValue[0] |
                  bigintToFloat(
                    tokens[
                      getToken(swaps[swapId].token0[0], swaps[swapId].token0[1])
                    ].decimals,
                    tokens[
                      getToken(swaps[swapId].token0[0], swaps[swapId].token0[1])
                    ].decimals
                  )
              }}
              {{
                tokens[
                  getToken(swaps[swapId].token0[0], swaps[swapId].token0[1])
                ].symbol
              }}
            </span>
            <span class="span-nbsp"></span><a-icon type="plus" /><span
              class="span-nbsp"
            ></span>
            <span
              v-if="
                getToken(swaps[swapId].token1[0], swaps[swapId].token1[1]) ===
                'Cycles'
              "
            >
              {{ liquidity.unitValue[1] | bigintToFloat(12, 12) }} TCycles
            </span>
            <span
              v-if="
                getToken(swaps[swapId].token1[0], swaps[swapId].token1[1]) ===
                'ICP'
              "
            >
              {{ liquidity.unitValue[1] | bigintToFloat(8, 8) }} ICP
            </span>
            <span
              v-if="
                tokens[
                  getToken(swaps[swapId].token1[0], swaps[swapId].token1[1])
                ]
              "
            >
              {{
                liquidity.unitValue[1] |
                  bigintToFloat(
                    tokens[
                      getToken(swaps[swapId].token1[0], swaps[swapId].token1[0])
                    ].decimals,
                    tokens[
                      getToken(swaps[swapId].token1[0], swaps[swapId].token1[1])
                    ].decimals
                  )
              }}
              {{
                tokens[
                  getToken(swaps[swapId].token1[0], swaps[swapId].token1[1])
                ].symbol
              }}
            </span>
          </div>
        </div>
        <div class="tx-item">
          <div class="tx-item-left">Swap Count:</div>
          <div class="tx-item-right" v-if="liquidity">
            <a-statistic
              :value-style="{ fontSize: '14px', fontWeight: 'normal' }"
              :value="liquidity.swapCount.toString()"
            ></a-statistic>
          </div>
        </div>
        <div class="tx-item">
          <div class="tx-item-left">Vol:</div>
          <div
            class="tx-item-right tx-item-right-vol"
            v-if="swapId === '6nmrm-laaaa-aaaak-aacfq-cai' && liquidity"
          >
            <a-statistic
              :value-style="{ fontSize: '14px', fontWeight: 'normal' }"
              :value="onBigintToFloat(liquidity.vol.swapCyclesVol, 12, 12)"
              suffix="TCycles"
            ></a-statistic>
            <a-statistic
              :value-style="{ fontSize: '14px', fontWeight: 'normal' }"
              :value="onBigintToFloat(liquidity.vol.swapIcpVol, 8)"
              suffix="ICP"
            ></a-statistic>
          </div>
          <div
            class="tx-item-right tx-item-right-vol"
            v-if="
              liquidity &&
              swaps &&
              swaps[swapId] &&
              tokens &&
              swapId !== '6nmrm-laaaa-aaaak-aacfq-cai'
            "
          >
            <a-statistic
              v-if="
                getToken(swaps[swapId].token0[0], swaps[swapId].token0[1]) ===
                'Cycles'
              "
              :value-style="{ fontSize: '14px', fontWeight: 'normal' }"
              :value="onBigintToFloat(liquidity.vol.value0, 12, 12)"
              suffix="TCycles"
            ></a-statistic>
            <a-statistic
              v-if="
                getToken(swaps[swapId].token0[0], swaps[swapId].token0[1]) ===
                'ICP'
              "
              :value-style="{ fontSize: '14px', fontWeight: 'normal' }"
              :value="onBigintToFloat(liquidity.vol.value0, 8, 8)"
              suffix="ICP"
            ></a-statistic>
            <a-statistic
              v-if="
                tokens[
                  getToken(swaps[swapId].token0[0], swaps[swapId].token0[1])
                ]
              "
              :value-style="{ fontSize: '14px', fontWeight: 'normal' }"
              :value="
                onBigintToFloat(
                  liquidity.vol.value0,
                  tokens[
                    getToken(swaps[swapId].token0[0], swaps[swapId].token0[1])
                  ].decimals,
                  tokens[
                    getToken(swaps[swapId].token0[0], swaps[swapId].token0[1])
                  ].decimals
                )
              "
              :suffix="
                tokens[
                  getToken(swaps[swapId].token0[0], swaps[swapId].token0[1])
                ].symbol
              "
            ></a-statistic>
            <a-statistic
              v-if="
                getToken(swaps[swapId].token1[0], swaps[swapId].token1[1]) ===
                'Cycles'
              "
              :value-style="{ fontSize: '14px', fontWeight: 'normal' }"
              :value="onBigintToFloat(liquidity.vol.value1, 12, 12)"
              suffix="TCycles"
            ></a-statistic>
            <a-statistic
              v-if="
                getToken(swaps[swapId].token1[0], swaps[swapId].token1[1]) ===
                'ICP'
              "
              :value-style="{ fontSize: '14px', fontWeight: 'normal' }"
              :value="onBigintToFloat(liquidity.vol.value1, 8, 8)"
              suffix="ICP"
            ></a-statistic>
            <a-statistic
              v-if="
                tokens[
                  getToken(swaps[swapId].token1[0], swaps[swapId].token1[1])
                ]
              "
              :value-style="{ fontSize: '14px', fontWeight: 'normal' }"
              :value="
                onBigintToFloat(
                  liquidity.vol.value1,
                  tokens[
                    getToken(swaps[swapId].token1[0], swaps[swapId].token1[1])
                  ].decimals,
                  tokens[
                    getToken(swaps[swapId].token1[0], swaps[swapId].token1[1])
                  ].decimals
                )
              "
              :suffix="
                tokens[
                  getToken(swaps[swapId].token1[0], swaps[swapId].token1[1])
                ].symbol
              "
            ></a-statistic>
          </div>
        </div>
      </div>
      <div
        class="tx-main"
        v-if="
          swaps &&
          swaps[swapId] &&
          swaps[swapId].mmType &&
          swaps[swapId].mmType.OrderBook === null
        "
      >
        <div class="tx-main-title">Liquidity</div>
        <div class="tx-item">
          <div class="tx-item-left">Price:</div>
          <div class="tx-item-right">
            <span v-if="swapId === '6nmrm-laaaa-aaaak-aacfq-cai' && liquidity">
              1 ICP = {{ liquidity | preIcpPrice }} TCycles
            </span>
            <span
              v-if="
                liquidity &&
                swaps &&
                swaps[swapId] &&
                swapId !== '6nmrm-laaaa-aaaak-aacfq-cai' &&
                tokens
              "
            >
              1
              <span
                v-if="
                  getToken(swaps[swapId].token0[0], swaps[swapId].token0[1]) ===
                  'Cycles'
                "
                >TCycles</span
              >
              <span
                v-if="
                  getToken(swaps[swapId].token0[0], swaps[swapId].token0[1]) ===
                  'ICP'
                "
                >ICP</span
              >
              <span
                v-if="
                  tokens[
                    getToken(swaps[swapId].token0[0], swaps[swapId].token0[1])
                  ]
                "
                >{{
                  tokens[
                    getToken(swaps[swapId].token0[0], swaps[swapId].token0[1])
                  ].symbol
                }}</span
              >
              =
              {{
                liquidity |
                  prePrice(
                    getToken(swaps[swapId].token0[0], swaps[swapId].token0[1]),
                    getToken(swaps[swapId].token1[0], swaps[swapId].token1[1]),
                    this.tokens
                  )
              }}
              <span
                v-if="
                  getToken(swaps[swapId].token1[0], swaps[swapId].token1[1]) ===
                  'Cycles'
                "
                >TCycles</span
              >
              <span
                v-if="
                  getToken(swaps[swapId].token1[0], swaps[swapId].token1[1]) ===
                  'ICP'
                "
                >ICP</span
              >
              <span
                v-if="
                  tokens[
                    getToken(swaps[swapId].token1[0], swaps[swapId].token1[1])
                  ]
                "
                >{{
                  tokens[
                    getToken(swaps[swapId].token1[0], swaps[swapId].token1[1])
                  ].symbol
                }}</span
              >
            </span>
          </div>
        </div>
        <div class="tx-item">
          <div class="tx-item-left">Swap Count:</div>
          <div class="tx-item-right" v-if="liquidity">
            <a-statistic
              :value-style="{ fontSize: '14px', fontWeight: 'normal' }"
              :value="liquidity.swapCount.toString()"
            ></a-statistic>
          </div>
        </div>
        <div class="tx-item">
          <div class="tx-item-left">Vol:</div>
          <div
            class="tx-item-right"
            v-if="swapId === '6nmrm-laaaa-aaaak-aacfq-cai' && liquidity"
          >
            <a-statistic
              :value-style="{ fontSize: '14px', fontWeight: 'normal' }"
              :value="onBigintToFloat(liquidity.vol.swapCyclesVol, 12, 12)"
              suffix="TCycles"
            ></a-statistic>
            <span class="span-nbsp"></span><span class="span-nbsp"></span
            ><a-statistic
              :value-style="{ fontSize: '14px', fontWeight: 'normal' }"
              :value="onBigintToFloat(liquidity.vol.swapIcpVol, 8)"
              suffix="ICP"
            ></a-statistic>
          </div>
          <div
            class="tx-item-right"
            v-if="
              liquidity &&
              swaps &&
              swaps[swapId] &&
              tokens &&
              swapId !== '6nmrm-laaaa-aaaak-aacfq-cai'
            "
          >
            <a-statistic
              v-if="
                getToken(swaps[swapId].token0[0], swaps[swapId].token0[1]) ===
                'Cycles'
              "
              :value-style="{ fontSize: '14px', fontWeight: 'normal' }"
              :value="onBigintToFloat(liquidity.vol.value0, 12, 12)"
              suffix="TCycles"
            ></a-statistic>
            <a-statistic
              v-if="
                getToken(swaps[swapId].token0[0], swaps[swapId].token0[1]) ===
                'ICP'
              "
              :value-style="{ fontSize: '14px', fontWeight: 'normal' }"
              :value="onBigintToFloat(liquidity.vol.value0, 8, 8)"
              suffix="ICP"
            ></a-statistic>
            <a-statistic
              v-if="
                tokens[
                  getToken(swaps[swapId].token0[0], swaps[swapId].token0[1])
                ]
              "
              :value-style="{ fontSize: '14px', fontWeight: 'normal' }"
              :value="
                onBigintToFloat(
                  liquidity.vol.value0,
                  tokens[
                    getToken(swaps[swapId].token0[0], swaps[swapId].token0[1])
                  ].decimals,
                  tokens[
                    getToken(swaps[swapId].token0[0], swaps[swapId].token0[1])
                  ].decimals
                )
              "
              :suffix="
                tokens[
                  getToken(swaps[swapId].token0[0], swaps[swapId].token0[1])
                ].symbol
              "
            ></a-statistic
            ><span class="span-nbsp"></span><span class="span-nbsp"></span>
            <a-statistic
              v-if="
                getToken(swaps[swapId].token1[0], swaps[swapId].token1[1]) ===
                'Cycles'
              "
              :value-style="{ fontSize: '14px', fontWeight: 'normal' }"
              :value="onBigintToFloat(liquidity.vol.value1, 12, 12)"
              suffix="TCycles"
            ></a-statistic>
            <a-statistic
              v-if="
                getToken(swaps[swapId].token1[0], swaps[swapId].token1[1]) ===
                'ICP'
              "
              :value-style="{ fontSize: '14px', fontWeight: 'normal' }"
              :value="onBigintToFloat(liquidity.vol.value1, 8, 8)"
              suffix="ICP"
            ></a-statistic>
            <a-statistic
              v-if="
                tokens[
                  getToken(swaps[swapId].token1[0], swaps[swapId].token1[1])
                ]
              "
              :value-style="{ fontSize: '14px', fontWeight: 'normal' }"
              :value="
                onBigintToFloat(
                  liquidity.vol.value1,
                  tokens[
                    getToken(swaps[swapId].token1[0], swaps[swapId].token1[1])
                  ].decimals,
                  tokens[
                    getToken(swaps[swapId].token1[0], swaps[swapId].token1[1])
                  ].decimals
                )
              "
              :suffix="
                tokens[
                  getToken(swaps[swapId].token1[0], swaps[swapId].token1[1])
                ].symbol
              "
            ></a-statistic>
          </div>
        </div>
      </div>
    </a-spin>
    <div class="token-tab">
      <a-tabs :active-key="activeKey" @change="changeTab">
        <a-tab-pane key="Transactions" tab="Transactions">
          <div class="a-tab-content">
            <swap-transactions
              :swap-id="swapId"
              ref="transactions"
            ></swap-transactions>
          </div>
        </a-tab-pane>
        <a-tab-pane key="DID" tab="DID">
          <div class="card-container">
            <a-tabs type="card" v-if="did.candid">
              <a-tab-pane v-for="item in didMenu" :key="item" :tab="item">
                <div class="a-tab-did">
                  <div
                    class="copy-did"
                    v-clipboard:copy="did[item]"
                    v-clipboard:success="onCopy"
                  >
                    Copy <a-icon type="copy" />
                  </div>
                  <highlightjs :language="item" :code="did[item]" />
                </div>
              </a-tab-pane>
            </a-tabs>
          </div>
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { IDL } from '@dfinity/candid';
import {
  QueryResponseReplied,
  HttpAgent,
  CanisterStatus
} from '@dfinity/agent';
import SwapTransactions from '@/components/swapTransactions/Index.vue';
import BigNumber from 'bignumber.js';
import { SwapInfo, TokenInfo, TokenStd, TokenType } from '@/ic/common/icType';
import { getSwapInfo } from '@/ic/getSwapInfo';
import { CYCLES_FINANCE_CANISTER_ID } from '@/ic/utils';
import { Principal } from '@dfinity/principal';
import { getTokenInfo } from '@/ic/getTokenInfo';
import { DRC205SwapService } from '@/ic/DRC205Swap/DRC205SwapService';
import { CyclesFinanceService } from '@/ic/cyclesFinance/cyclesFinanceService';
import { KBar, Liquidity } from '@/ic/DRC205Swap/model';
import { CandidEnum, TabKeyType } from '@/views/Token/model';
import { CyclesFinanceLiquidity } from '@/ic/cyclesFinance/model';
import { bigintToFloat } from '@/filters';
import { Chart, init, KLineData, dispose } from 'klinecharts';
import { Route } from 'vue-router';
import { formatDateToDay, formatDateToMinute } from '@/ic/converter';
import { DIDGenerateService } from '@/ic/DIDGenerate/DIDGenerateService';


@Component({
  name: 'Details',
  components: {
    SwapTransactions
  },
  filters: {
    preIcpPrice(liquidity: CyclesFinanceLiquidity): string {
      return new BigNumber(liquidity.cycles.toString())
        .div(10 ** 12)
        .div(liquidity.icpE8s.toString())
        .times(10 ** 8)
        .toString(10);
    },
    prePrice(
      liquidity: Liquidity,
      tokenId0: string,
      tokenId1: string,
      tokens: { [key: string]: TokenInfo }
    ): string {
      let token0Decimals = 0;
      let token1Decimals = 0;
      if (tokenId0 === 'Cycles') {
        token0Decimals = 12;
      } else if (tokenId0 === 'ICP') {
        token0Decimals = 8;
      } else if (tokens[tokenId0]) {
        token0Decimals = tokens[tokenId0].decimals;
      }
      if (tokenId1 === 'Cycles') {
        token1Decimals = 12;
      } else if (tokenId1 === 'ICP') {
        token1Decimals = 8;
      } else if (tokens[tokenId1]) {
        token1Decimals = tokens[tokenId1].decimals;
      }
      return new BigNumber(liquidity.value1.toString())
        .div(10 ** token1Decimals)
        .div(liquidity.value0.toString())
        .times(10 ** token0Decimals)
        .decimalPlaces(token0Decimals)
        .toString(10);
    }
  }
})
export default class extends Vue {
  private DIDGenerateService: DIDGenerateService = null;
  private tokens: { [key: string]: TokenInfo } = {};
  private swaps: { [key: string]: SwapInfo } = {};
  private swapId = '';
  private fee = '';
  private liquidity: Liquidity | CyclesFinanceLiquidity = null;
  private didMenu = CandidEnum;
  private did = {
    candid: '',
    motoko: '',
    javascript: '',
    typescript: ''
  };
  private spinning = false;
  private activeKey = 'Transactions';
  private KIntervals: Array<KBar> = [];
  private kLineChart: Chart;
  private kIntervalList = [
    {
      value: 'Time',
      key: 60 // seconds
    },
    {
      value: '5m',
      key: 5 * 60
    },
    {
      value: '1H',
      key: 60 * 60
    },
    // {
    //   value: '4H',
    //   key: 4 * 60 * 60
    // },
    {
      value: '1D',
      key: 24 * 60 * 60
    },
    {
      value: '1W',
      key: 7 * 24 * 60 * 60
    }
  ];
  private currentKInterval = {
    value: '1D',
    key: 60 * 60 * 24
  };
  private chartSpinning = false;
  @Watch('$route')
  private onRouteChange(to: Route, from: Route) {
    if (
      (to.name === 'Swap' && to.params.swapId !== this.swapId) ||
      from.name === 'Swaps' ||
      from.name === 'SwapTransactions'
    ) {
      this.liquidity = null;
      this.fee = '';
      this.did = {
        candid: '',
        motoko: '',
        javascript: '',
        typescript: ''
      };
      this.activeKey = 'Transactions';
      this.init();
      this.getCandidInterfaceTmpHack();
      dispose('echarts-responsive-container');
      this.$nextTick(() => {
        this.resetChart();
      });
    }
  }
  created(): void {
    this.DIDGenerateService = new DIDGenerateService();
    this.init();
    this.getCandidInterfaceTmpHack();
    this.$nextTick(() => {
      this.resetChart();
    });
  }
  private async init(): Promise<void> {
    this.spinning = true;
    try {
      this.tokens = JSON.parse(localStorage.getItem('tokens')) || {};
      this.swapId = this.$route.params.swapId;
      this.swaps = JSON.parse(localStorage.getItem('swaps')) || {};
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
      if (this.swapId) {
        this.getLiquidity();
        this.getQuotes();
      }
      this.$nextTick(() => {
        (this.$refs.transactions as any).init();
      });
    } catch (e) {
      console.log(e);
    }
    this.spinning = false;
  }
  private onBigintToFloat(val: bigint | string, num = 4, decimal = 8): string {
    return bigintToFloat(val, num, decimal);
  }
  private changeTab(activeKey: TabKeyType) {
    console.log(activeKey);
    this.activeKey = activeKey;
    // if (activeKey === 'Transactions') {
    //   (this.$refs.transactions as any).init();
    // }
  }
  private async getLiquidity(): Promise<void> {
    if (this.swapId === CYCLES_FINANCE_CANISTER_ID) {
      const cyclesFinanceService = new CyclesFinanceService(this.swapId);
      this.liquidity = await cyclesFinanceService.liquidity();
    } else {
      const swapService = new DRC205SwapService(this.swapId);
      this.liquidity = await swapService.liquidity();
    }
    console.log(this.liquidity);
  }
  private async getQuotes(): Promise<void> {
    this.chartSpinning = true;
    const swapService = new DRC205SwapService(this.swapId);
    const KIntervals = await swapService.getQuotes(
      BigInt(this.currentKInterval.key)
    );
    this.KIntervals = KIntervals.slice().reverse();
    console.log(this.KIntervals);
    setTimeout(() => {
      this.initEcharts();
      this.chartSpinning = false;
    }, 1000);
  }
  private resetChart(): void {
    this.currentKInterval = {
      value: '1H',
      key: 60 * 60
    };
    let style = {
      candle: {
        margin: {
          top: 0.3,
          bottom: 0.1
        },
        tooltip: {
          labels: ['', 'Open: ', 'Close: ', 'High: ', 'Low: ', 'Change: '],
          text: {
            color: '#646e79',
            marginLeft: 8,
            marginTop: 6,
            marginRight: 0
          },
          values: (kLineData) => {
            let color = '#76808F';
            let change = kLineData.change.toFixed(2);
            let time;
            if (
              this.currentKInterval.value == '1D' ||
              this.currentKInterval.value == '1W'
            ) {
              time = formatDateToDay(new Date(kLineData.timestamp));
            } else {
              time = formatDateToMinute(new Date(kLineData.timestamp));
            }
            return [
              { value: time },
              {
                value: kLineData.open,
                color: color
              },
              {
                value: kLineData.close,
                color: color
              },
              {
                value: kLineData.high,
                color: color
              },
              {
                value: kLineData.low,
                color: color
              },
              {
                value: `${change}%`,
                color: color
              }
            ];
          }
        },
        priceMark: {
          high: {
            color: '#AEB4BC'
          },
          low: {
            color: '#AEB4BC'
          },
          last: {
            downColor: '#D13651',
            upColor: '#21C77D',
            noChangeColor: '#D13651',
            line: {
              show: false
            }
          }
        }
      }
    };
    const width = document.documentElement.clientWidth;
    if (width <= 768) {
      (style.candle.tooltip as any).showRule = 'follow_cross';
      (style.candle.tooltip as any).showType = 'rect';
      (style.candle.tooltip as any).rect = {
        paddingLeft: 5,
        paddingRight: 10,
        paddingTop: 5,
        paddingBottom: 12,
        offsetLeft: 8,
        offsetTop: 8,
        offsetRight: 8,
        borderRadius: 4,
        borderSize: 1,
        color: '#848E9C',
        backgroundColor: '#000000',
        borderColor: '#000000'
      };
    }
    this.kLineChart = init('echarts-responsive-container', style);
  }
  private changeKIntervalList(kInterval): void {
    this.currentKInterval = kInterval;
    this.getQuotes();
  }
  private async initEcharts(): Promise<void> {
    if (this.currentKInterval.value === 'Time') {
      this.kLineChart.setStyleOptions({
        candle: {
          type: 'area',
          area: {
            lineSize: 1,
            lineColor: '#83b2e0',
            value: 'close',
            backgroundColor: [
              {
                offset: 0,
                color: 'rgba(33, 150, 243, 0)'
              },
              {
                offset: 1,
                color: 'rgba(33, 150, 243, 0)'
              }
            ]
          }
        }
      });
    } else {
      this.kLineChart.setStyleOptions({
        candle: {
          type: 'candle_solid',
          bar: {
            downColor: '#f6465d',
            upColor: '#10cb80',
            noChangeColor: '#f6465d'
          }
        }
      });
    }
    const type = Object.keys(this.swaps[this.swapId].mmType)[0];
    let unitSize;
    let buyUnit;
    let tokenMinUnit;
    let token0Decimals = 0;
    let token1Decimals = 0;
    let tokenId0 = this.getToken(
      this.swaps[this.swapId].token0[0],
      this.swaps[this.swapId].token0[1]
    );
    let tokenId1 = this.getToken(
      this.swaps[this.swapId].token1[0],
      this.swaps[this.swapId].token1[1]
    );
    if (tokenId0 === 'Cycles') {
      token0Decimals = 12;
    } else if (tokenId0 === 'ICP') {
      token0Decimals = 8;
    } else if (this.tokens[tokenId0]) {
      token0Decimals = this.tokens[tokenId0].decimals;
    }
    if (tokenId1 === 'Cycles') {
      token1Decimals = 12;
    } else if (tokenId1 === 'ICP') {
      token1Decimals = 8;
    } else if (this.tokens[tokenId1]) {
      token1Decimals = this.tokens[tokenId1].decimals;
    }
    if (type === 'AMM') {
      if (this.swapId === CYCLES_FINANCE_CANISTER_ID) {
        unitSize = 10 ** 12;
        buyUnit = 8;
        tokenMinUnit = 12;
      } else {
        unitSize = 10 ** token0Decimals;
        buyUnit = token1Decimals;
        tokenMinUnit = token0Decimals;
      }
    } else {
      const swapService = new DRC205SwapService(this.swapId);
      const config = await swapService.getConfig();
      unitSize = config.UNIT_SIZE;
      const UNIT_SIZE = config.UNIT_SIZE.toString(10).length - 1;
      if (UNIT_SIZE > token0Decimals) {
        tokenMinUnit = 0;
      } else {
        tokenMinUnit = token0Decimals - UNIT_SIZE;
      }
      buyUnit = Math.max(token1Decimals - tokenMinUnit, 0);
    }
    this.kLineChart.setPriceVolumePrecision(buyUnit, tokenMinUnit);
    this.kLineChart.applyNewData(
      this.splitData(
        this.KIntervals,
        token0Decimals,
        token1Decimals,
        unitSize,
        buyUnit,
        tokenMinUnit
      )
    );
    // this.timerQuotes = setTimeout(async () => {
    //   await this.getQuotes();
    // }, 5 * 1000);
  }
  private filterLevelPrice(
    price: bigint,
    unitSize: bigint,
    token0Decimals: number,
    token1Decimals: number,
    buyUnit: number
  ): string {
    if (price) {
      return new BigNumber(price.toString())
        .div(10 ** token1Decimals)
        .div(new BigNumber(unitSize.toString()).div(10 ** token0Decimals))
        .toFixed(buyUnit);
    }
    return '';
  }
  private splitData(
    rawData: Array<KBar>,
    token0Decimals: number,
    token1Decimals: number,
    unitSize: bigint,
    buyUnit: number,
    tokenMinUnit: number
  ): KLineData[] {
    if (this.swaps && this.swapId && this.swaps[this.swapId]) {
      let data: KLineData[] = [];
      for (let i = 0; i < rawData.length; i++) {
        const open = this.filterLevelPrice(
          rawData[i].open,
          unitSize,
          token0Decimals,
          token1Decimals,
          buyUnit
        );
        const close = this.filterLevelPrice(
          rawData[i].close,
          unitSize,
          token0Decimals,
          token1Decimals,
          buyUnit
        );
        const lowest = this.filterLevelPrice(
          rawData[i].low,
          unitSize,
          token0Decimals,
          token1Decimals,
          buyUnit
        );
        const highest = this.filterLevelPrice(
          rawData[i].high,
          unitSize,
          token0Decimals,
          token1Decimals,
          buyUnit
        );
        const vol = new BigNumber(rawData[i].vol.value0.toString())
          .div(10 ** token0Decimals)
          .toFixed(tokenMinUnit);
        const timestamp =
          Number(rawData[i].kid) * this.currentKInterval.key * 1000;
        let change = 0;
        if (i > 0) {
          const preClose = this.filterLevelPrice(
            rawData[i - 1].close,
            unitSize,
            token0Decimals,
            token1Decimals,
            buyUnit
          );
          change = new BigNumber(close)
            .minus(preClose)
            .div(preClose)
            .times(100)
            .toNumber();
        }
        data.push({
          timestamp: timestamp,
          open: Number(open),
          close: Number(close),
          high: Number(highest),
          low: Number(lowest),
          volume: Number(vol),
          change: change
        });
      }
      return data;
    }
  }
  private getTokenSymbol(token: TokenType, tokenStd: TokenStd): string {
    const tokenId = this.getToken(token, tokenStd);
    if (tokenId === 'ICP') {
      return 'ICP';
    }
    if (tokenId === 'Cycles') {
      return 'Cycles';
    }
    if (this.tokens[tokenId]) {
      return this.tokens[tokenId].symbol;
    }
  }
  private getToken(token: TokenType, tokenStd: TokenStd): string {
    const tokenId = (token as { Token: string }).Token;
    if (tokenId) {
      if (!this.tokens[tokenId]) {
        getTokenInfo(Principal.from(tokenId), tokenStd).then((tokenInfo) => {
          this.$set(this.tokens, tokenId, tokenInfo);
        });
      } else {
        if (this.tokens[tokenId].name && !this.tokens[tokenId].tokenStd) {
          this.tokens[tokenId].tokenStd = tokenStd;
          const tokens = JSON.parse(localStorage.getItem('tokens')) || {};
          tokens[tokenId] = this.tokens[tokenId];
          localStorage.setItem(
            'tokens',
            JSON.stringify(tokens, (key, value) =>
              typeof value === 'bigint'
                ? value.toString()
                : key === 'logo'
                ? ''
                : value
            )
          );
        }
      }
      return tokenId;
    } else {
      if ((token as { Cycles: null }).Cycles === null) {
        return 'Cycles';
      } else if ((token as { Icp: null }).Icp === null) {
        return 'ICP';
      }
    }
    return '-';
  }
  private async getCandidInterfaceTmpHack(): Promise<void> {
    try {
      let candid;
      const agent = new HttpAgent({ host: 'https://ic0.app/' });
      const status = await CanisterStatus.request({
        agent,
        canisterId: Principal.fromText(this.swapId),
        paths: ['candid']
      });
      candid = status.get('candid') as string | null;
      if (!candid) {
        const res = await agent.query(this.swapId, {
          methodName: '__get_candid_interface_tmp_hack',
          arg: Buffer.from([68, 73, 68, 76, 0, 0]) // Null
        });
        if ((res as QueryResponseReplied).status) {
          candid = IDL.decode(
            [IDL.Text],
            Buffer.from((res as QueryResponseReplied).reply.arg)
          )[0] as string;
        }
      }
      if (candid) {
        this.did.candid = candid;
        this.DIDGenerateService.did_to_js(candid).then((res) => {
          if (res && res.length) {
            this.$set(this.did, 'javascript', res[0]);
            // const did = res[0]
            //   .replace(/export default\s+/, 'return ')
            //   .replace('export', '');
          }
        });
        this.DIDGenerateService.binding(candid, 'ts').then((res) => {
          if (res && res.length) {
            this.$set(this.did, 'typescript', res[0]);
          }
        });
        this.DIDGenerateService.binding(candid, 'mo').then((res) => {
          if (res && res.length) {
            this.$set(this.did, 'motoko', res[0]);
          }
        });
      }
    } catch (e) {
      console.log(e);
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
  private jumpTokensTest(url: string): string {
    if (this.$route.meta && this.$route.meta.type === 'Test') {
      url = '/tokensTest' + url;
    }
    return url;
  }
}
</script>

<style scoped lang="scss">
.token-tab {
  background: #fff;
  line-height: 20px;
  box-shadow: 0 2px 4px 0 rgba(0, 140, 238, 0.05);
  border-radius: 4px;
}
.a-tab-content {
  padding: 0 15px;
  overflow-x: auto;
  table {
    width: 100%;
    min-height: 100px;
  }
}
#echarts-responsive-container {
  width: 100%;
  height: calc(100% - 20px);
  background: #fff;
}
.echarts-vol-main {
  width: calc(100% - 520px);
  margin: 20px 0 20px 20px;
  background: #fff;
  ::v-deep .ant-spin-container {
    height: 100%;
  }
}
.tx-details-top {
  display: flex;
  .tx-main {
    width: 500px;
  }
}
.k-interval-time {
  display: flex;
  align-items: center;
  border-bottom: 1px solid #e3e9ed;
  li {
    padding: 0 10px;
    cursor: pointer;
    font-size: 12px;
    color: #333;
    span {
      display: inline-block;
      padding: 3px 5px;
      transition: all 0.3s;
    }
    &.active,
    &:hover {
      span {
        background: #f5f5f5;
        color: #1890ff;
      }
    }
  }
}
@media (max-width: 991px) {
  .tx-item-right {
    > div {
      display: flex;
      a {
        padding-left: 10px;
      }
    }
  }
  .tx-details-top {
    flex-direction: column;
    .tx-main {
      width: 100%;
    }
    .echarts-vol-main {
      width: 100%;
      margin-left: 0;
    }
    #echarts-responsive-container {
      height: 260px;
    }
  }
}
</style>
