<template>
  <div class="ic-ethereum-main main-width">
    <div class="tx-main">
      <div class="tx-item">
        <div class="tx-item-left">Token Name:</div>
        <div class="tx-item-right">
          <a-select class="ic-tokens-select" v-model="currentIcTokenIndex">
            <a-select-option v-for="(item, index) in icTokens" :key="index">
              <span v-if="tokens && tokens[item[1].ckLedgerId.toString()]">
                {{ tokens[item[1].ckLedgerId.toString()].name }}
              </span>
            </a-select-option>
          </a-select>
        </div>
      </div>
      <div
        v-if="
          icTokens.length &&
          currentIcTokenIndex !== null &&
          icTokens[currentIcTokenIndex] &&
          Object.keys(icTokens[currentIcTokenIndex][1].std)[0] === 'ERC20'
        "
        class="tx-item"
      >
        <div class="tx-item-left">Token Contract:</div>
        <div class="tx-item-right" v-if="icTokens.length">
          <a
            :href="`${ethLink}/token/${icTokens[currentIcTokenIndex][0]}`"
            target="_blank"
          >
            {{ icTokens[currentIcTokenIndex][0] }} </a
          ><span class="span-nbsp"></span>
          <a-icon
            style="cursor: pointer !important"
            type="copy"
            v-clipboard:copy="
              icTokens[currentIcTokenIndex][1].ckLedgerId.toString()
            "
            v-clipboard:success="onCopy"
          />
        </div>
      </div>
      <div class="tx-item">
        <div class="tx-item-left">Token Id:</div>
        <div class="tx-item-right" v-if="icTokens.length">
          <router-link
            :to="`/token/${icTokens[
              currentIcTokenIndex
            ][1].ckLedgerId.toString()}`"
          >
            {{
              icTokens[currentIcTokenIndex][1].ckLedgerId.toString()
            }} </router-link
          ><span class="span-nbsp"></span>
          <a-icon
            style="cursor: pointer !important"
            type="copy"
            v-clipboard:copy="
              icTokens[currentIcTokenIndex][1].ckLedgerId.toString()
            "
            v-clipboard:success="onCopy"
          />
        </div>
      </div>
      <div class="tx-item">
        <div class="tx-item-left">Symbol:</div>
        <div
          class="tx-item-right"
          v-if="
            icTokens.length &&
            tokens &&
            tokens[icTokens[currentIcTokenIndex][1].ckLedgerId.toString()]
          "
        >
          {{
            tokens[icTokens[currentIcTokenIndex][1].ckLedgerId.toString()]
              .symbol
          }}
        </div>
      </div>
      <div class="tx-item">
        <div class="tx-item-left">Total Supply:</div>
        <div
          class="tx-item-right"
          v-if="
            icTokens.length &&
            tokens &&
            tokens[icTokens[currentIcTokenIndex][1].ckLedgerId.toString()]
          "
        >
          {{
            tokens[icTokens[currentIcTokenIndex][1].ckLedgerId.toString()]
              .totalSupply |
              bigintToFloat(
                tokens[icTokens[currentIcTokenIndex][1].ckLedgerId.toString()]
                  .decimals,
                tokens[icTokens[currentIcTokenIndex][1].ckLedgerId.toString()]
                  .decimals
              ) |
              formatNum
          }}
        </div>
      </div>
    </div>
    <div class="integration-event">
      <a-tabs :active-key="activeKey" @change="changeTab">
        <a-tab-pane key="Activities" tab="Activities">
          <a-spin :spinning="loading">
            <form @submit.prevent="">
              <a-input-group class="search-group" compact>
                <button
                  v-show="showAccountEvents"
                  type="button"
                  @click="searchAll"
                >
                  All
                </button>
                <a-input
                  v-model="searchAccount"
                  type="text"
                  @pressEnter="search"
                  allow-clear
                  placeholder="AccountId/Principal"
                  class="search-account"
                  name="icTokensSearchAccountId"
                  :allowClear="true"
                />
                <button type="button" @click="search">
                  <a-icon type="search" />
                </button>
              </a-input-group>
            </form>
            <table v-show="!showAccountEvents">
              <thead>
                <tr>
                  <th class="table-index">Index</th>
                  <th class="table-time">Type</th>
                  <th>Event</th>
                  <th class="table-time">Time</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in events" :key="index">
                  <td class="table-index">
                    {{ item[0].toString(10) }}
                  </td>
                  <td class="table-time">
                    {{ Object.keys(item[1][0])[0] }}
                  </td>
                  <td style="word-break: break-all">
                    <div v-if="Object.keys(item[1][0])[0] === 'depositGas'">
                      <div>
                        txIndex:
                        {{ Object.values(item[1][0])[0].txIndex.toString(10) }}
                      </div>
                      <div>
                        address:
                        <a
                          :href="`${ethLink}/address/${
                            Object.values(item[1][0])[0].address
                          }`"
                          target="_blank"
                        >
                          {{ Object.values(item[1][0])[0].address }}
                        </a>
                        <!--<a
                                        :href="
                                          Object.values(item[1][0])[0].token ===
                                          '0x0000000000000000000000000000000000000000'
                                            ? `${ethLink}/address/${
                                                Object.values(item[1][0])[0].address
                                              }`
                                            : `${ethLink}/token/${
                                                Object.values(item[1][0])[0].token
                                              }?a=${Object.values(item[1][0])[0].address}`
                                        "
                                        target="_blank"
                                      >
                                        {{ Object.values(item[1][0])[0].address }}
                                      </a>-->
                      </div>
                      <div>
                        account: {
                        <span>
                          owner:
                          {{
                            Object.values(
                              item[1][0]
                            )[0].account.owner.toString()
                          }}, subaccount:
                          {{
                            arrayToHexString(
                              Object.values(item[1][0])[0].account.subaccount[0]
                            )
                          }}
                        </span>
                        }
                      </div>
                      <div>
                        amount:
                        {{
                          Object.values(item[1][0])[0].amount |
                            bigintToFloat(18, 18)
                        }}
                        ETH
                      </div>
                      <div>
                        toid:
                        <a
                          :href="`https://cmqwp-uiaaa-aaaaj-aihzq-cai.raw.ic0.app/saga/TO/nhgv3-fiaaa-aaaak-aer5q-cai/${
                            Object.values(item[1][0])[0].toid
                          }`"
                          target="_blank"
                          >{{ Object.values(item[1][0])[0].toid }}</a
                        >
                      </div>
                    </div>
                    <div v-if="Object.keys(item[1][0])[0] === 'withdraw'">
                      <div>
                        txIndex:
                        {{ Object.values(item[1][0])[0].txIndex.toString(10) }}
                      </div>
                      <div>
                        token:
                        <span
                          v-if="
                            Object.values(item[1][0])[0].token ===
                            '0x0000000000000000000000000000000000000000'
                          "
                        >
                          {{ Object.values(item[1][0])[0].token }}
                          <span
                            v-if="tokenInfo[Object.values(item[1][0])[0].token]"
                          >
                            ({{
                              tokenInfo[Object.values(item[1][0])[0].token]
                                .symbol
                            }})
                          </span>
                        </span>
                        <a
                          v-if="
                            Object.values(item[1][0])[0].token !==
                            '0x0000000000000000000000000000000000000000'
                          "
                          :href="`${ethLink}/token/${
                            Object.values(item[1][0])[0].token
                          }`"
                          target="_blank"
                        >
                          {{ Object.values(item[1][0])[0].token }}
                          <span
                            v-if="tokenInfo[Object.values(item[1][0])[0].token]"
                          >
                            ({{
                              tokenInfo[Object.values(item[1][0])[0].token]
                                .symbol
                            }})
                          </span>
                        </a>
                      </div>
                      <div>
                        address:
                        <a
                          :href="
                            Object.values(item[1][0])[0].token ===
                            '0x0000000000000000000000000000000000000000'
                              ? `${ethLink}/address/${
                                  Object.values(item[1][0])[0].address
                                }`
                              : `${ethLink}/token/${
                                  Object.values(item[1][0])[0].token
                                }?a=${Object.values(item[1][0])[0].address}`
                          "
                          target="_blank"
                        >
                          {{ Object.values(item[1][0])[0].address }}
                        </a>
                      </div>
                      <div>
                        account: {
                        <a
                          :href="`https://ic.house/address/${
                            ethAddressToIcEthAddress[
                              Object.values(item[1][0])[0].token
                            ]
                          }/${Object.values(
                            item[1][0]
                          )[0].account.owner.toString()}.${arrayToHexString(
                            Object.values(item[1][0])[0].account.subaccount[0]
                          )}`"
                          target="_blank"
                        >
                          owner:
                          {{
                            Object.values(
                              item[1][0]
                            )[0].account.owner.toString()
                          }}, subaccount:
                          {{
                            arrayToHexString(
                              Object.values(item[1][0])[0].account.subaccount[0]
                            )
                          }}
                        </a>
                        }
                      </div>
                      <div
                        v-if="
                          tokens &&
                          ethAddressToIcEthAddress[
                            Object.values(item[1][0])[0].token
                          ] &&
                          tokens[
                            ethAddressToIcEthAddress[
                              Object.values(item[1][0])[0].token
                            ]
                          ]
                        "
                      >
                        amount:
                        {{
                          Object.values(item[1][0])[0].amount |
                            bigintToFloat(
                              tokens[
                                ethAddressToIcEthAddress[
                                  Object.values(item[1][0])[0].token
                                ]
                              ].decimals,
                              tokens[
                                ethAddressToIcEthAddress[
                                  Object.values(item[1][0])[0].token
                                ]
                              ].decimals
                            )
                        }}
                        {{
                          tokens[
                            ethAddressToIcEthAddress[
                              Object.values(item[1][0])[0].token
                            ]
                          ].symbol
                        }}
                      </div>
                      <div
                        v-if="
                          tokens &&
                          ethAddressToIcEthAddress[
                            Object.values(item[1][0])[0].token
                          ] &&
                          tokens[
                            ethAddressToIcEthAddress[
                              Object.values(item[1][0])[0].token
                            ]
                          ]
                        "
                      >
                        fee:
                        <span
                          v-if="
                            Object.values(item[1][0])[0].fee &&
                            Object.values(item[1][0])[0].fee.length
                          "
                        >
                          {{
                            Object.values(item[1][0])[0].fee[0] |
                              bigintToFloat(
                                tokens[
                                  ethAddressToIcEthAddress[
                                    Object.values(item[1][0])[0].token
                                  ]
                                ].decimals,
                                tokens[
                                  ethAddressToIcEthAddress[
                                    Object.values(item[1][0])[0].token
                                  ]
                                ].decimals
                              )
                          }}
                          {{
                            tokens[
                              ethAddressToIcEthAddress[
                                Object.values(item[1][0])[0].token
                              ]
                            ].symbol
                          }}
                        </span>
                        <span v-else>-</span>
                      </div>
                      <div>
                        toid:
                        <a
                          :href="`https://cmqwp-uiaaa-aaaaj-aihzq-cai.raw.ic0.app/saga/TO/nhgv3-fiaaa-aaaak-aer5q-cai/${
                            Object.values(item[1][0])[0].toid
                          }`"
                          target="_blank"
                          >{{ Object.values(item[1][0])[0].toid }}</a
                        >
                      </div>
                    </div>
                    <div v-if="Object.keys(item[1][0])[0] === 'keeper'">
                      <div>
                        <span> setRpc : </span>
                        <span>
                          { keeper: { owner:
                          {{
                            Object.values(
                              item[1][0]
                            )[0].operation.setRpc.keeper.owner.toString()
                          }}, subaccount:
                          {{
                            arrayToHexString(
                              Object.values(item[1][0])[0].operation.setRpc
                                .keeper.subaccount[0]
                            )
                          }}
                          }, operation:
                          <span
                            v-if="
                              Object.keys(
                                Object.values(item[1][0])[0].operation.setRpc
                                  .operation
                              )[0] === 'remove'
                            "
                          >
                            remove
                          </span>
                          <span
                            v-if="
                              Object.keys(
                                Object.values(item[1][0])[0].operation.setRpc
                                  .operation
                              )[0] === 'put'
                            "
                          >
                            put:
                            {{
                              Object.values(
                                Object.values(item[1][0])[0].operation.setRpc
                                  .operation
                              )[0][0]
                            }},
                            {{
                              Object.values(
                                Object.values(item[1][0])[0].operation.setRpc
                                  .operation
                              )[0][1]
                            }}
                          </span>
                          }
                        </span>
                      </div>
                    </div>
                    <div v-if="Object.keys(item[1][0])[0] === 'depositResult'">
                      <div>
                        type: {{ Object.keys(Object.values(item[1][0])[0])[0] }}
                      </div>
                      <div>
                        txIndex:
                        {{
                          Object.values(
                            Object.values(item[1][0])[0]
                          )[0].txIndex.toString()
                        }}
                      </div>
                      <div>
                        token:
                        <span
                          v-if="
                            Object.values(Object.values(item[1][0])[0])[0]
                              .token ===
                            '0x0000000000000000000000000000000000000000'
                          "
                        >
                          {{
                            Object.values(Object.values(item[1][0])[0])[0].token
                          }}
                          <span
                            v-if="
                              tokenInfo[
                                Object.values(Object.values(item[1][0])[0])[0]
                                  .token
                              ]
                            "
                          >
                            ({{
                              tokenInfo[
                                Object.values(Object.values(item[1][0])[0])[0]
                                  .token
                              ].symbol
                            }})
                          </span>
                        </span>
                        <a
                          v-if="
                            Object.values(Object.values(item[1][0])[0])[0]
                              .token !==
                            '0x0000000000000000000000000000000000000000'
                          "
                          :href="`${ethLink}/token/${
                            Object.values(Object.values(item[1][0])[0])[0].token
                          }`"
                          target="_blank"
                        >
                          {{
                            Object.values(Object.values(item[1][0])[0])[0].token
                          }}
                          <span
                            v-if="
                              tokenInfo[
                                Object.values(Object.values(item[1][0])[0])[0]
                                  .token
                              ]
                            "
                          >
                            ({{
                              tokenInfo[
                                Object.values(Object.values(item[1][0])[0])[0]
                                  .token
                              ].symbol
                            }})
                          </span>
                        </a>
                      </div>
                      <div>
                        account: {
                        <a
                          :href="`https://ic.house/address/${
                            ethAddressToIcEthAddress[
                              Object.values(Object.values(item[1][0])[0])[0]
                                .token
                            ]
                          }/${Object.values(
                            Object.values(item[1][0])[0]
                          )[0].account.owner.toString()}.${arrayToHexString(
                            Object.values(Object.values(item[1][0])[0])[0]
                              .account.subaccount[0]
                          )}`"
                          target="_blank"
                          >owner:
                          {{
                            Object.values(
                              Object.values(item[1][0])[0]
                            )[0].account.owner.toString()
                          }}, subaccount:
                          {{
                            arrayToHexString(
                              Object.values(Object.values(item[1][0])[0])[0]
                                .account.subaccount[0]
                            )
                          }}
                        </a>
                        }
                      </div>
                      <div
                        v-if="
                          tokens &&
                          ethAddressToIcEthAddress[
                            Object.values(Object.values(item[1][0])[0])[0].token
                          ] &&
                          tokens[
                            ethAddressToIcEthAddress[
                              Object.values(Object.values(item[1][0])[0])[0]
                                .token
                            ]
                          ]
                        "
                      >
                        amount:
                        {{
                          Object.values(Object.values(item[1][0])[0])[0]
                            .amount |
                            bigintToFloat(
                              tokens[
                                ethAddressToIcEthAddress[
                                  Object.values(Object.values(item[1][0])[0])[0]
                                    .token
                                ]
                              ].decimals,
                              tokens[
                                ethAddressToIcEthAddress[
                                  Object.values(Object.values(item[1][0])[0])[0]
                                    .token
                                ]
                              ].decimals
                            )
                        }}
                        {{
                          tokens[
                            ethAddressToIcEthAddress[
                              Object.values(Object.values(item[1][0])[0])[0]
                                .token
                            ]
                          ].symbol
                        }}
                      </div>
                      <div
                        v-if="
                          tokens &&
                          ethAddressToIcEthAddress[
                            Object.values(Object.values(item[1][0])[0])[0].token
                          ] &&
                          tokens[
                            ethAddressToIcEthAddress[
                              Object.values(Object.values(item[1][0])[0])[0]
                                .token
                            ]
                          ]
                        "
                      >
                        fee:
                        <span
                          v-if="
                            Object.values(Object.values(item[1][0])[0])[0]
                              .fee &&
                            Object.values(Object.values(item[1][0])[0])[0].fee
                              .length
                          "
                        >
                          {{
                            Object.values(Object.values(item[1][0])[0])[0]
                              .fee[0] |
                              bigintToFloat(
                                tokens[
                                  ethAddressToIcEthAddress[
                                    Object.values(
                                      Object.values(item[1][0])[0]
                                    )[0].token
                                  ]
                                ].decimals,
                                tokens[
                                  ethAddressToIcEthAddress[
                                    Object.values(
                                      Object.values(item[1][0])[0]
                                    )[0].token
                                  ]
                                ].decimals
                              )
                          }}
                          {{
                            tokens[
                              ethAddressToIcEthAddress[
                                Object.values(Object.values(item[1][0])[0])[0]
                                  .token
                              ]
                            ].symbol
                          }}
                        </span>
                        <span v-else>-</span>
                      </div>
                      <div>
                        txid:
                        <div
                          v-for="(item, index) in Object.values(
                            Object.values(item[1][0])[0]
                          )[0].txid"
                          :key="index"
                        >
                          <a :href="`${ethLink}/tx/${item}`" target="_blank">
                            {{ item }}
                          </a>
                        </div>
                      </div>
                    </div>
                    <div v-if="Object.keys(item[1][0])[0] === 'burn'">
                      <div>
                        icTokenCanisterId:
                        <a
                          :href="`https://ic.house/token/${Object.values(
                            item[1][0]
                          )[0].icTokenCanisterId.toString()}`"
                          target="_blank"
                        >
                          {{
                            Object.values(
                              item[1][0]
                            )[0].icTokenCanisterId.toString()
                          }}
                        </a>
                      </div>
                      <div>
                        tokenBlockIndex:
                        {{
                          Object.values(item[1][0])[0].tokenBlockIndex.toString(
                            10
                          )
                        }}
                      </div>
                      <div>
                        account: {
                        <a
                          :href="`https://ic.house/address/${Object.values(
                            item[1][0]
                          )[0].icTokenCanisterId.toString()}/${Object.values(
                            item[1][0]
                          )[0].account.owner.toString()}.${arrayToHexString(
                            Object.values(item[1][0])[0].account.subaccount[0]
                          )}`"
                          target="_blank"
                        >
                          owner:
                          {{
                            Object.values(
                              item[1][0]
                            )[0].account.owner.toString()
                          }}, subaccount:
                          {{
                            arrayToHexString(
                              Object.values(item[1][0])[0].account.subaccount[0]
                            )
                          }}
                        </a>
                        }
                      </div>
                      <div>
                        address:
                        <a
                          v-if="Object.values(item[1][0])[0].address"
                          :href="
                            icEthAddressToEthAddress[
                              Object.values(
                                item[1][0]
                              )[0].icTokenCanisterId.toString()
                            ] === '0x0000000000000000000000000000000000000000'
                              ? `${ethLink}/address/${
                                  Object.values(item[1][0])[0].address
                                }`
                              : `${ethLink}/token/${
                                  icEthAddressToEthAddress[
                                    Object.values(
                                      item[1][0]
                                    )[0].icTokenCanisterId.toString()
                                  ]
                                }?a=${Object.values(item[1][0])[0].address}`
                          "
                          target="_blank"
                        >
                          {{ Object.values(item[1][0])[0].address }}
                        </a>
                        <span v-if="!Object.values(item[1][0])[0].address"
                          >-</span
                        >
                      </div>
                      <div
                        v-if="
                          tokens &&
                          tokens[
                            Object.values(
                              item[1][0]
                            )[0].icTokenCanisterId.toString()
                          ]
                        "
                      >
                        amount:
                        {{
                          Object.values(item[1][0])[0].amount |
                            bigintToFloat(
                              tokens[
                                Object.values(
                                  item[1][0]
                                )[0].icTokenCanisterId.toString()
                              ].decimals,
                              tokens[
                                Object.values(
                                  item[1][0]
                                )[0].icTokenCanisterId.toString()
                              ].decimals
                            )
                        }}
                        {{
                          tokens[
                            Object.values(
                              item[1][0]
                            )[0].icTokenCanisterId.toString()
                          ].symbol
                        }}
                      </div>
                      <div
                        v-if="
                          Object.values(item[1][0])[0].toid &&
                          Object.values(item[1][0])[0].toid.length
                        "
                      >
                        toid:
                        <a
                          :href="`https://cmqwp-uiaaa-aaaaj-aihzq-cai.raw.ic0.app/saga/TO/nhgv3-fiaaa-aaaak-aer5q-cai/${
                            Object.values(item[1][0])[0].toid[0]
                          }`"
                          target="_blank"
                          >{{ Object.values(item[1][0])[0].toid[0] }}</a
                        >
                      </div>
                    </div>
                    <div v-if="Object.keys(item[1][0])[0] === 'init'">
                      <div>
                        initArgs: { rpc_canister_id:
                        {{
                          Object.values(
                            item[1][0]
                          )[0].initArgs.rpc_canister_id.toString()
                        }}, rpc_confirmations:
                        {{
                          Object.values(
                            item[1][0]
                          )[0].initArgs.rpc_confirmations.toString(10)
                        }}, utils_canister_id:
                        {{
                          Object.values(
                            item[1][0]
                          )[0].initArgs.utils_canister_id.toString()
                        }}, deposit_method:
                        {{
                          Object.values(
                            item[1][0]
                          )[0].initArgs.deposit_method.toString(10)
                        }}, min_confirmations:
                        {{
                          Object.values(
                            item[1][0]
                          )[0].initArgs.min_confirmations.toString(10)
                        }}
                        }
                      </div>
                    </div>
                    <div v-if="Object.keys(item[1][0])[0] === 'mint'">
                      <div>
                        icTokenCanisterId:
                        <a
                          :href="`https://ic.house/token/${Object.values(
                            item[1][0]
                          )[0].icTokenCanisterId.toString()}`"
                          target="_blank"
                        >
                          {{
                            Object.values(
                              item[1][0]
                            )[0].icTokenCanisterId.toString()
                          }}
                        </a>
                      </div>
                      <div>
                        account: {
                        <a
                          :href="`https://ic.house/address/${Object.values(
                            item[1][0]
                          )[0].icTokenCanisterId.toString()}/${Object.values(
                            item[1][0]
                          )[0].account.owner.toString()}.${arrayToHexString(
                            Object.values(item[1][0])[0].account.subaccount[0]
                          )}`"
                          target="_blank"
                        >
                          owner:
                          {{
                            Object.values(
                              item[1][0]
                            )[0].account.owner.toString()
                          }}, subaccount:
                          {{
                            arrayToHexString(
                              Object.values(item[1][0])[0].account.subaccount[0]
                            )
                          }}
                        </a>
                        }
                      </div>
                      <div
                        v-if="
                          tokens &&
                          tokens[
                            Object.values(
                              item[1][0]
                            )[0].icTokenCanisterId.toString()
                          ]
                        "
                      >
                        amount:
                        {{
                          Object.values(item[1][0])[0].amount |
                            bigintToFloat(
                              tokens[
                                Object.values(
                                  item[1][0]
                                )[0].icTokenCanisterId.toString()
                              ].decimals,
                              tokens[
                                Object.values(
                                  item[1][0]
                                )[0].icTokenCanisterId.toString()
                              ].decimals
                            )
                        }}
                        {{
                          tokens[
                            Object.values(
                              item[1][0]
                            )[0].icTokenCanisterId.toString()
                          ].symbol
                        }}
                      </div>
                      <div>
                        toid:
                        <a
                          :href="`https://cmqwp-uiaaa-aaaaj-aihzq-cai.raw.ic0.app/saga/TO/nhgv3-fiaaa-aaaak-aer5q-cai/${
                            Object.values(item[1][0])[0].toid
                          }`"
                          target="_blank"
                          >{{ Object.values(item[1][0])[0].toid }}</a
                        >
                      </div>
                    </div>
                    <div v-if="Object.keys(item[1][0])[0] === 'send'">
                      <div>
                        icTokenCanisterId:
                        <a
                          :href="`https://ic.house/token/${Object.values(
                            item[1][0]
                          )[0].icTokenCanisterId.toString()}`"
                          target="_blank"
                        >
                          {{
                            Object.values(
                              item[1][0]
                            )[0].icTokenCanisterId.toString()
                          }}
                        </a>
                      </div>
                      <div>
                        to: {
                        <a
                          :href="`https://ic.house/address/${Object.values(
                            item[1][0]
                          )[0].icTokenCanisterId.toString()}/${Object.values(
                            item[1][0]
                          )[0].to.owner.toString()}.${arrayToHexString(
                            Object.values(item[1][0])[0].to.subaccount[0]
                          )}`"
                          target="_blank"
                        >
                          owner:
                          {{
                            Object.values(item[1][0])[0].to.owner.toString()
                          }}, subaccount:
                          {{
                            arrayToHexString(
                              Object.values(item[1][0])[0].to.subaccount[0]
                            )
                          }}
                        </a>
                        }
                      </div>
                      <div
                        v-if="
                          tokens &&
                          tokens[
                            Object.values(
                              item[1][0]
                            )[0].icTokenCanisterId.toString()
                          ]
                        "
                      >
                        amount:
                        {{
                          Object.values(item[1][0])[0].amount |
                            bigintToFloat(
                              tokens[
                                Object.values(
                                  item[1][0]
                                )[0].icTokenCanisterId.toString()
                              ].decimals,
                              tokens[
                                Object.values(
                                  item[1][0]
                                )[0].icTokenCanisterId.toString()
                              ].decimals
                            )
                        }}
                        {{
                          tokens[
                            Object.values(
                              item[1][0]
                            )[0].icTokenCanisterId.toString()
                          ].symbol
                        }}
                      </div>
                      <!--<div
                                      v-if="
                                        Object.values(item[1][0])[0].toid &&
                                        Object.values(item[1][0])[0].toid.length
                                      "
                                    >
                                      toid:
                                      <a
                                        :href="`https://cmqwp-uiaaa-aaaaj-aihzq-cai.raw.ic0.app/saga/TO/nhgv3-fiaaa-aaaak-aer5q-cai/${
                                          Object.values(item[1][0])[0].toid[0]
                                        }`"
                                        target="_blank"
                                        >{{ Object.values(item[1][0])[0].toid[0] }}</a
                                      >
                                    </div>-->
                    </div>
                    <div
                      v-if="Object.keys(item[1][0])[0] === 'coverTransaction'"
                    >
                      <div>
                        txIndex: {{ Object.values(item[1][0])[0].txIndex }}
                      </div>
                      <div>
                        account: {
                        <span>
                          owner:
                          {{
                            Object.values(
                              item[1][0]
                            )[0].account.owner.toString()
                          }}, subaccount:
                          {{
                            arrayToHexString(
                              Object.values(item[1][0])[0].account.subaccount[0]
                            )
                          }}
                        </span>
                        }
                      </div>
                      <div>
                        updateTx:
                        <span
                          v-if="
                            Object.values(item[1][0])[0].updateTx &&
                            Object.values(item[1][0])[0].updateTx.length
                          "
                        >
                          {{
                            Object.values(item[1][0])[0].updateTx[0] |
                              filterJson
                          }}
                        </span>
                      </div>
                      <div>
                        preTxid:
                        <div
                          v-for="(item, index) in Object.values(item[1][0])[0]
                            .preTxid"
                          :key="index"
                        >
                          <a :href="`${ethLink}/tx/${item}`" target="_blank">
                            {{ item }}
                          </a>
                        </div>
                      </div>
                      <div>
                        toid:
                        <a
                          :href="`https://cmqwp-uiaaa-aaaaj-aihzq-cai.raw.ic0.app/saga/TO/nhgv3-fiaaa-aaaak-aer5q-cai/${
                            Object.values(item[1][0])[0].toid
                          }`"
                          target="_blank"
                          >{{ Object.values(item[1][0])[0].toid }}</a
                        >
                      </div>
                    </div>
                    <div
                      v-if="Object.keys(item[1][0])[0] === 'claimDepositResult'"
                    >
                      <div>
                        type: {{ Object.keys(Object.values(item[1][0])[0])[0] }}
                      </div>
                      <div
                        v-if="
                          Object.keys(Object.values(item[1][0])[0])[0] === 'ok'
                        "
                      >
                        <div>
                          token:
                          <span
                            v-if="
                              Object.values(item[1][0])[0].ok.token ===
                              '0x0000000000000000000000000000000000000000'
                            "
                          >
                            {{ Object.values(item[1][0])[0].ok.token }}
                            <span
                              v-if="
                                tokenInfo[Object.values(item[1][0])[0].ok.token]
                              "
                            >
                              ({{
                                tokenInfo[Object.values(item[1][0])[0].ok.token]
                                  .symbol
                              }})
                            </span>
                          </span>
                          <a
                            v-if="
                              Object.values(item[1][0])[0].ok.token !==
                              '0x0000000000000000000000000000000000000000'
                            "
                            :href="`${ethLink}/token/${
                              Object.values(item[1][0])[0].ok.token
                            }`"
                            target="_blank"
                          >
                            {{ Object.values(item[1][0])[0].ok.token }}
                            <span
                              v-if="
                                tokenInfo[Object.values(item[1][0])[0].ok.token]
                              "
                            >
                              ({{
                                tokenInfo[Object.values(item[1][0])[0].ok.token]
                                  .symbol
                              }})
                            </span>
                          </a>
                        </div>
                        <div>
                          from:
                          <a
                            :href="
                              Object.values(item[1][0])[0].ok.token ===
                              '0x0000000000000000000000000000000000000000'
                                ? `${ethLink}/address/${
                                    Object.values(item[1][0])[0].ok.from
                                  }`
                                : `${ethLink}/token/${
                                    Object.values(item[1][0])[0].ok.token
                                  }?a=${Object.values(item[1][0])[0].address}`
                            "
                            target="_blank"
                          >
                            {{ Object.values(item[1][0])[0].ok.from }}
                          </a>
                        </div>
                        <div>
                          account: {
                          <a
                            :href="`https://ic.house/address/${
                              ethAddressToIcEthAddress[
                                Object.values(item[1][0])[0].ok.token
                              ]
                            }/${Object.values(
                              item[1][0]
                            )[0].ok.account.owner.toString()}.${arrayToHexString(
                              Object.values(item[1][0])[0].ok.account
                                .subaccount[0]
                            )}`"
                            target="_blank"
                            >owner:
                            {{
                              Object.values(
                                item[1][0]
                              )[0].ok.account.owner.toString()
                            }}, subaccount:
                            {{
                              arrayToHexString(
                                Object.values(item[1][0])[0].ok.account
                                  .subaccount[0]
                              )
                            }}
                          </a>
                          }
                        </div>
                        <div
                          v-if="
                            tokens &&
                            ethAddressToIcEthAddress[
                              Object.values(item[1][0])[0].ok.token
                            ] &&
                            tokens[
                              ethAddressToIcEthAddress[
                                Object.values(item[1][0])[0].ok.token
                              ]
                            ]
                          "
                        >
                          amount:
                          {{
                            Object.values(item[1][0])[0].ok.amount |
                              bigintToFloat(
                                tokens[
                                  ethAddressToIcEthAddress[
                                    Object.values(item[1][0])[0].ok.token
                                  ]
                                ].decimals,
                                tokens[
                                  ethAddressToIcEthAddress[
                                    Object.values(item[1][0])[0].ok.token
                                  ]
                                ].decimals
                              )
                          }}
                          {{
                            tokens[
                              ethAddressToIcEthAddress[
                                Object.values(item[1][0])[0].ok.token
                              ]
                            ].symbol
                          }}
                        </div>
                        <div
                          v-if="
                            tokens &&
                            ethAddressToIcEthAddress[
                              Object.values(item[1][0])[0].ok.token
                            ] &&
                            tokens[
                              ethAddressToIcEthAddress[
                                Object.values(item[1][0])[0].ok.token
                              ]
                            ]
                          "
                        >
                          fee:
                          <span
                            v-if="
                              Object.values(item[1][0])[0].ok.fee &&
                              Object.values(item[1][0])[0].ok.fee.length
                            "
                          >
                            {{
                              Object.values(item[1][0])[0].ok.fee[0] |
                                bigintToFloat(
                                  tokens[
                                    ethAddressToIcEthAddress[
                                      Object.values(item[1][0])[0].ok.token
                                    ]
                                  ].decimals,
                                  tokens[
                                    ethAddressToIcEthAddress[
                                      Object.values(item[1][0])[0].ok.token
                                    ]
                                  ].decimals
                                )
                            }}
                            {{
                              tokens[
                                ethAddressToIcEthAddress[
                                  Object.values(item[1][0])[0].ok.token
                                ]
                              ].symbol
                            }}
                          </span>
                          <span v-else>-</span>
                        </div>
                        <div>
                          txHash:
                          <a
                            :href="`${ethLink}/tx/${
                              Object.values(item[1][0])[0].ok.txHash
                            }`"
                            target="_blank"
                          >
                            {{ Object.values(item[1][0])[0].ok.txHash }}
                          </a>
                        </div>
                        <div>
                          signature:
                          {{ Object.values(item[1][0])[0].ok.signature }}
                        </div>
                      </div>
                      <div
                        v-if="
                          Object.keys(Object.values(item[1][0])[0])[0] === 'err'
                        "
                      >
                        <div>
                          error: {{ Object.values(item[1][0])[0].err.error }}
                        </div>
                        <div>
                          account: { owner:
                          {{
                            Object.values(
                              item[1][0]
                            )[0].err.account.owner.toString()
                          }}, subaccount:
                          {{
                            arrayToHexString(
                              Object.values(item[1][0])[0].err.account
                                .subaccount[0]
                            )
                          }}
                          }
                        </div>
                        <div>
                          txHash:
                          <a
                            :href="`${ethLink}/tx/${
                              Object.values(item[1][0])[0].err.txHash
                            }`"
                            target="_blank"
                          >
                            {{ Object.values(item[1][0])[0].err.txHash }}
                          </a>
                        </div>
                        <div>
                          signature:
                          {{ Object.values(item[1][0])[0].err.signature }}
                        </div>
                      </div>
                    </div>
                    <div v-if="Object.keys(item[1][0])[0] === 'changeOwner'">
                      newOwner:
                      {{ Object.values(item[1][0])[0].newOwner.toString() }}
                    </div>
                    <div v-if="Object.keys(item[1][0])[0] === 'deposit'">
                      <div>
                        txIndex: {{ Object.values(item[1][0])[0].txIndex }}
                      </div>
                      <div>
                        token:
                        <span
                          v-if="
                            Object.values(item[1][0])[0].token ===
                            '0x0000000000000000000000000000000000000000'
                          "
                        >
                          {{ Object.values(item[1][0])[0].token }}
                          <span
                            v-if="tokenInfo[Object.values(item[1][0])[0].token]"
                          >
                            ({{
                              tokenInfo[Object.values(item[1][0])[0].token]
                                .symbol
                            }})
                          </span>
                        </span>
                        <a
                          v-if="
                            Object.values(item[1][0])[0].token !==
                            '0x0000000000000000000000000000000000000000'
                          "
                          :href="`${ethLink}/token/${
                            Object.values(item[1][0])[0].token
                          }`"
                          target="_blank"
                        >
                          {{ Object.values(item[1][0])[0].token }}
                          <span
                            v-if="tokenInfo[Object.values(item[1][0])[0].token]"
                          >
                            ({{
                              tokenInfo[Object.values(item[1][0])[0].token]
                                .symbol
                            }})
                          </span>
                        </a>
                      </div>
                      <div>
                        address:
                        <a
                          :href="
                            Object.values(item[1][0])[0].token ===
                            '0x0000000000000000000000000000000000000000'
                              ? `${ethLink}/address/${
                                  Object.values(item[1][0])[0].address
                                }`
                              : `${ethLink}/token/${
                                  Object.values(item[1][0])[0].token
                                }?a=${Object.values(item[1][0])[0].address}`
                          "
                          target="_blank"
                        >
                          {{ Object.values(item[1][0])[0].address }}
                        </a>
                      </div>
                      <div>
                        account: {
                        <a
                          :href="`https://ic.house/address/${
                            ethAddressToIcEthAddress[
                              Object.values(item[1][0])[0].token
                            ]
                          }/${Object.values(
                            item[1][0]
                          )[0].account.owner.toString()}.${arrayToHexString(
                            Object.values(item[1][0])[0].account.subaccount[0]
                          )}`"
                          target="_blank"
                        >
                          owner:
                          {{
                            Object.values(
                              item[1][0]
                            )[0].account.owner.toString()
                          }}, subaccount:
                          {{
                            arrayToHexString(
                              Object.values(item[1][0])[0].account.subaccount[0]
                            )
                          }}
                        </a>
                        }
                      </div>
                      <div
                        v-if="
                          tokens &&
                          ethAddressToIcEthAddress[
                            Object.values(item[1][0])[0].token
                          ] &&
                          tokens[
                            ethAddressToIcEthAddress[
                              Object.values(item[1][0])[0].token
                            ]
                          ]
                        "
                      >
                        amount:
                        {{
                          Object.values(item[1][0])[0].amount |
                            bigintToFloat(
                              tokens[
                                ethAddressToIcEthAddress[
                                  Object.values(item[1][0])[0].token
                                ]
                              ].decimals,
                              tokens[
                                ethAddressToIcEthAddress[
                                  Object.values(item[1][0])[0].token
                                ]
                              ].decimals
                            )
                        }}
                        {{
                          tokens[
                            ethAddressToIcEthAddress[
                              Object.values(item[1][0])[0].token
                            ]
                          ].symbol
                        }}
                      </div>
                      <div>
                        fee:
                        <span
                          v-if="
                            Object.values(item[1][0])[0].fee &&
                            Object.values(item[1][0])[0].fee.length
                          "
                        >
                          {{
                            Object.values(item[1][0])[0].fee[0] |
                              bigintToFloat(
                                tokens[
                                  ethAddressToIcEthAddress[
                                    Object.values(item[1][0])[0].token
                                  ]
                                ].decimals,
                                tokens[
                                  ethAddressToIcEthAddress[
                                    Object.values(item[1][0])[0].token
                                  ]
                                ].decimals
                              )
                          }}
                          {{
                            tokens[
                              ethAddressToIcEthAddress[
                                Object.values(item[1][0])[0].token
                              ]
                            ].symbol
                          }}
                        </span>
                        <span v-else>-</span>
                      </div>
                      <div>
                        toid:
                        <a
                          :href="`https://cmqwp-uiaaa-aaaaj-aihzq-cai.raw.ic0.app/saga/TO/nhgv3-fiaaa-aaaak-aer5q-cai/${
                            Object.values(item[1][0])[0].toid
                          }`"
                          target="_blank"
                          >{{ Object.values(item[1][0])[0].toid }}</a
                        >
                      </div>
                    </div>
                    <div v-if="Object.keys(item[1][0])[0] === 'start'">
                      message: {{ Object.values(item[1][0])[0].message }}
                    </div>
                    <div
                      v-if="Object.keys(item[1][0])[0] === 'updateTokenPrice'"
                    >
                      <div
                        v-if="Object.keys(item[1][0])[0] === 'updateTokenPrice'"
                      >
                        <div>
                          {"token":
                          <span
                            v-if="
                              Object.values(item[1][0])[0].token ===
                              '0x0000000000000000000000000000000000000000'
                            "
                          >
                            {{ Object.values(item[1][0])[0].token }}
                            <span
                              v-if="
                                tokenInfo[Object.values(item[1][0])[0].token]
                              "
                            >
                              ({{
                                tokenInfo[Object.values(item[1][0])[0].token]
                                  .symbol
                              }})
                            </span>
                          </span>
                          <a
                            v-if="
                              Object.values(item[1][0])[0].token !==
                              '0x0000000000000000000000000000000000000000'
                            "
                            :href="`${ethLink}/token/${
                              Object.values(item[1][0])[0].token
                            }`"
                            target="_blank"
                          >
                            {{ Object.values(item[1][0])[0].token }}
                            <span
                              v-if="
                                tokenInfo[Object.values(item[1][0])[0].token]
                              "
                            >
                              ({{
                                tokenInfo[Object.values(item[1][0])[0].token]
                                  .symbol
                              }})
                            </span> </a
                          >, "ethRatio": "{{
                            Object.values(item[1][0])[0].ethRatio
                          }}", "price": "{{
                            Object.values(item[1][0])[0].price
                          }}"}
                        </div>
                      </div>
                    </div>
                    <div v-if="Object.keys(item[1][0])[0] === 'withdrawResult'">
                      <div>
                        type: {{ Object.keys(Object.values(item[1][0])[0])[0] }}
                      </div>
                      <div>
                        txIndex:
                        {{
                          Object.values(
                            Object.values(item[1][0])[0]
                          )[0].txIndex.toString()
                        }}
                      </div>
                      <div>
                        token:
                        <span
                          v-if="
                            Object.values(Object.values(item[1][0])[0])[0]
                              .token ===
                            '0x0000000000000000000000000000000000000000'
                          "
                        >
                          {{
                            Object.values(Object.values(item[1][0])[0])[0].token
                          }}
                          <span
                            v-if="
                              tokenInfo[
                                Object.values(Object.values(item[1][0])[0])[0]
                                  .token
                              ]
                            "
                          >
                            ({{
                              tokenInfo[
                                Object.values(Object.values(item[1][0])[0])[0]
                                  .token
                              ].symbol
                            }})
                          </span>
                        </span>
                        <a
                          v-if="
                            Object.values(Object.values(item[1][0])[0])[0]
                              .token !==
                            '0x0000000000000000000000000000000000000000'
                          "
                          :href="`${ethLink}/token/${
                            Object.values(Object.values(item[1][0])[0])[0].token
                          }`"
                          target="_blank"
                        >
                          {{
                            Object.values(Object.values(item[1][0])[0])[0].token
                          }}
                          <span
                            v-if="
                              tokenInfo[
                                Object.values(Object.values(item[1][0])[0])[0]
                                  .token
                              ]
                            "
                          >
                            ({{
                              tokenInfo[
                                Object.values(Object.values(item[1][0])[0])[0]
                                  .token
                              ].symbol
                            }})
                          </span>
                        </a>
                      </div>
                      <div>
                        account: {
                        <a
                          :href="`https://ic.house/address/${
                            ethAddressToIcEthAddress[
                              Object.values(Object.values(item[1][0])[0])[0]
                                .token
                            ]
                          }/${Object.values(
                            Object.values(item[1][0])[0]
                          )[0].account.owner.toString()}.${arrayToHexString(
                            Object.values(Object.values(item[1][0])[0])[0]
                              .account.subaccount[0]
                          )}`"
                          target="_blank"
                          >owner:
                          {{
                            Object.values(
                              Object.values(item[1][0])[0]
                            )[0].account.owner.toString()
                          }}, subaccount:
                          {{
                            arrayToHexString(
                              Object.values(Object.values(item[1][0])[0])[0]
                                .account.subaccount[0]
                            )
                          }}
                        </a>
                        }
                      </div>
                      <div
                        v-if="
                          tokens &&
                          ethAddressToIcEthAddress[
                            Object.values(Object.values(item[1][0])[0])[0].token
                          ] &&
                          tokens[
                            ethAddressToIcEthAddress[
                              Object.values(Object.values(item[1][0])[0])[0]
                                .token
                            ]
                          ]
                        "
                      >
                        amount:
                        {{
                          Object.values(Object.values(item[1][0])[0])[0]
                            .amount |
                            bigintToFloat(
                              tokens[
                                ethAddressToIcEthAddress[
                                  Object.values(Object.values(item[1][0])[0])[0]
                                    .token
                                ]
                              ].decimals,
                              tokens[
                                ethAddressToIcEthAddress[
                                  Object.values(Object.values(item[1][0])[0])[0]
                                    .token
                                ]
                              ].decimals
                            )
                        }}
                        {{
                          tokens[
                            ethAddressToIcEthAddress[
                              Object.values(Object.values(item[1][0])[0])[0]
                                .token
                            ]
                          ].symbol
                        }}
                      </div>
                      <div>
                        txid:
                        <div
                          v-for="(item, index) in Object.values(
                            Object.values(item[1][0])[0]
                          )[0].txid"
                          :key="index"
                        >
                          <a :href="`${ethLink}/tx/${item}`" target="_blank">
                            {{ item }}
                          </a>
                        </div>
                      </div>
                    </div>
                    <div
                      v-if="Object.keys(item[1][0])[0] === 'depositGasResult'"
                    >
                      <div>
                        type: {{ Object.keys(Object.values(item[1][0])[0])[0] }}
                      </div>
                      <div>
                        txIndex:
                        {{
                          Object.values(
                            Object.values(item[1][0])[0]
                          )[0].txIndex.toString()
                        }}
                      </div>
                      <div>
                        token:
                        <span
                          v-if="
                            Object.values(Object.values(item[1][0])[0])[0]
                              .token ===
                            '0x0000000000000000000000000000000000000000'
                          "
                        >
                          {{
                            Object.values(Object.values(item[1][0])[0])[0].token
                          }}
                          <span
                            v-if="
                              tokenInfo[
                                Object.values(Object.values(item[1][0])[0])[0]
                                  .token
                              ]
                            "
                          >
                            ({{
                              tokenInfo[
                                Object.values(Object.values(item[1][0])[0])[0]
                                  .token
                              ].symbol
                            }})
                          </span>
                        </span>
                        <a
                          v-if="
                            Object.values(Object.values(item[1][0])[0])[0]
                              .token !==
                            '0x0000000000000000000000000000000000000000'
                          "
                          :href="`${ethLink}/token/${
                            Object.values(Object.values(item[1][0])[0])[0].token
                          }`"
                          target="_blank"
                        >
                          {{
                            Object.values(Object.values(item[1][0])[0])[0].token
                          }}
                          <span
                            v-if="
                              tokenInfo[
                                Object.values(Object.values(item[1][0])[0])[0]
                                  .token
                              ]
                            "
                          >
                            ({{
                              tokenInfo[
                                Object.values(Object.values(item[1][0])[0])[0]
                                  .token
                              ].symbol
                            }})
                          </span>
                        </a>
                      </div>
                      <div>
                        account: {
                        <a
                          :href="`https://ic.house/address/${
                            ethAddressToIcEthAddress[
                              Object.values(Object.values(item[1][0])[0])[0]
                                .token
                            ]
                          }/${Object.values(
                            Object.values(item[1][0])[0]
                          )[0].account.owner.toString()}.${arrayToHexString(
                            Object.values(Object.values(item[1][0])[0])[0]
                              .account.subaccount[0]
                          )}`"
                          target="_blank"
                          >owner:
                          {{
                            Object.values(
                              Object.values(item[1][0])[0]
                            )[0].account.owner.toString()
                          }}, subaccount:
                          {{
                            arrayToHexString(
                              Object.values(Object.values(item[1][0])[0])[0]
                                .account.subaccount[0]
                            )
                          }}
                        </a>
                        }
                      </div>
                      <div
                        v-if="
                          tokens &&
                          ethAddressToIcEthAddress[
                            Object.values(Object.values(item[1][0])[0])[0].token
                          ] &&
                          tokens[
                            ethAddressToIcEthAddress[
                              Object.values(Object.values(item[1][0])[0])[0]
                                .token
                            ]
                          ]
                        "
                      >
                        amount:
                        {{
                          Object.values(Object.values(item[1][0])[0])[0]
                            .amount |
                            bigintToFloat(
                              tokens[
                                ethAddressToIcEthAddress[
                                  Object.values(Object.values(item[1][0])[0])[0]
                                    .token
                                ]
                              ].decimals,
                              tokens[
                                ethAddressToIcEthAddress[
                                  Object.values(Object.values(item[1][0])[0])[0]
                                    .token
                                ]
                              ].decimals
                            )
                        }}
                        {{
                          tokens[
                            ethAddressToIcEthAddress[
                              Object.values(Object.values(item[1][0])[0])[0]
                                .token
                            ]
                          ].symbol
                        }}
                      </div>
                      <div
                        v-if="
                          Object.keys(Object.values(item[1][0])[0])[0] === 'ok'
                        "
                      >
                        txid:
                        <div
                          v-for="(item, index) in Object.values(
                            Object.values(item[1][0])[0]
                          )[0].txid"
                          :key="index"
                        >
                          <a :href="`${ethLink}/tx/${item}`" target="_blank">
                            {{ item }}
                          </a>
                        </div>
                      </div>
                    </div>
                    <div v-if="Object.keys(item[1][0])[0] === 'claimDeposit'">
                      <div>
                        account: {
                        <span>
                          owner:
                          {{
                            Object.values(
                              item[1][0]
                            )[0].account.owner.toString()
                          }}, subaccount:
                          {{
                            arrayToHexString(
                              Object.values(item[1][0])[0].account.subaccount[0]
                            )
                          }}
                        </span>
                        }
                      </div>
                      <div>
                        txHash:
                        <a
                          :href="`${ethLink}/tx/${
                            Object.values(item[1][0])[0].txHash
                          }`"
                          target="_blank"
                        >
                          {{ Object.values(item[1][0])[0].txHash }}
                        </a>
                      </div>
                      <div>
                        signature: {{ Object.values(item[1][0])[0].signature }}
                      </div>
                    </div>
                    <div v-if="Object.keys(item[1][0])[0] === 'config'">
                      {{ Object.values(item[1][0])[0] | filterJson }}
                    </div>
                    <div v-if="Object.keys(item[1][0])[0] === 'suspend'">
                      {{ Object.values(item[1][0])[0] | filterJson }}
                    </div>
                  </td>
                  <td class="table-time">
                    {{ item[1][1] | formatDateFromSecondUTC }}
                  </td>
                </tr>
              </tbody>
            </table>
            <table v-show="showAccountEvents">
              <thead>
                <tr>
                  <th class="table-time">Type</th>
                  <th>Event</th>
                  <th class="table-time">Time</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(item, index) in accountEvents.slice(
                    (accountPage - 1) * pageSize,
                    accountPage * pageSize
                  )"
                  :key="index"
                >
                  <td class="table-time">
                    {{ Object.keys(item[0])[0] }}
                  </td>
                  <td style="word-break: break-all">
                    <div v-if="Object.keys(item[0])[0] === 'depositGas'">
                      <div>
                        txIndex:
                        {{ Object.values(item[0])[0].txIndex.toString(10) }}
                      </div>
                      <div>
                        address:
                        <a
                          :href="`${ethLink}/address/${
                            Object.values(item[0])[0].address
                          }`"
                          target="_blank"
                        >
                          {{ Object.values(item[0])[0].address }}
                        </a>
                        <!--<a
                                                  :href="
                                                    Object.values(item[0])[0].token ===
                                                    '0x0000000000000000000000000000000000000000'
                                                      ? `${ethLink}/address/${
                                                          Object.values(item[0])[0].address
                                                        }`
                                                      : `${ethLink}/token/${
                                                          Object.values(item[0])[0].token
                                                        }?a=${Object.values(item[0])[0].address}`
                                                  "
                                                  target="_blank"
                                                >
                                                  {{ Object.values(item[0])[0].address }}
                                                </a>-->
                      </div>
                      <div>
                        account: {
                        <span>
                          owner:
                          {{
                            Object.values(item[0])[0].account.owner.toString()
                          }}, subaccount:
                          {{
                            arrayToHexString(
                              Object.values(item[0])[0].account.subaccount[0]
                            )
                          }}
                        </span>
                        }
                      </div>
                      <div>
                        amount:
                        {{
                          Object.values(item[0])[0].amount |
                            bigintToFloat(18, 18)
                        }}
                        ETH
                      </div>
                      <div>
                        toid:
                        <a
                          :href="`https://cmqwp-uiaaa-aaaaj-aihzq-cai.raw.ic0.app/saga/TO/nhgv3-fiaaa-aaaak-aer5q-cai/${
                            Object.values(item[0])[0].toid
                          }`"
                          target="_blank"
                          >{{ Object.values(item[0])[0].toid }}</a
                        >
                      </div>
                    </div>
                    <div v-if="Object.keys(item[0])[0] === 'withdraw'">
                      <div>
                        txIndex:
                        {{ Object.values(item[0])[0].txIndex.toString(10) }}
                      </div>
                      <div>
                        token:
                        <span
                          v-if="
                            Object.values(item[0])[0].token ===
                            '0x0000000000000000000000000000000000000000'
                          "
                        >
                          {{ Object.values(item[0])[0].token }}
                          <span
                            v-if="tokenInfo[Object.values(item[0])[0].token]"
                          >
                            ({{
                              tokenInfo[Object.values(item[0])[0].token].symbol
                            }})
                          </span>
                        </span>
                        <a
                          v-if="
                            Object.values(item[0])[0].token !==
                            '0x0000000000000000000000000000000000000000'
                          "
                          :href="`${ethLink}/token/${
                            Object.values(item[0])[0].token
                          }`"
                          target="_blank"
                        >
                          {{ Object.values(item[0])[0].token }}
                          <span
                            v-if="tokenInfo[Object.values(item[0])[0].token]"
                          >
                            ({{
                              tokenInfo[Object.values(item[0])[0].token].symbol
                            }})
                          </span>
                        </a>
                      </div>
                      <div>
                        address:
                        <a
                          :href="
                            Object.values(item[0])[0].token ===
                            '0x0000000000000000000000000000000000000000'
                              ? `${ethLink}/address/${
                                  Object.values(item[0])[0].address
                                }`
                              : `${ethLink}/token/${
                                  Object.values(item[0])[0].token
                                }?a=${Object.values(item[0])[0].address}`
                          "
                          target="_blank"
                        >
                          {{ Object.values(item[0])[0].address }}
                        </a>
                      </div>
                      <div>
                        account: {
                        <a
                          :href="`https://ic.house/address/${
                            ethAddressToIcEthAddress[
                              Object.values(item[0])[0].token
                            ]
                          }/${Object.values(
                            item[0]
                          )[0].account.owner.toString()}.${arrayToHexString(
                            Object.values(item[0])[0].account.subaccount[0]
                          )}`"
                          target="_blank"
                        >
                          owner:
                          {{
                            Object.values(item[0])[0].account.owner.toString()
                          }}, subaccount:
                          {{
                            arrayToHexString(
                              Object.values(item[0])[0].account.subaccount[0]
                            )
                          }}
                        </a>
                        }
                      </div>
                      <div
                        v-if="
                          tokens &&
                          ethAddressToIcEthAddress[
                            Object.values(item[0])[0].token
                          ] &&
                          tokens[
                            ethAddressToIcEthAddress[
                              Object.values(item[0])[0].token
                            ]
                          ]
                        "
                      >
                        amount:
                        {{
                          Object.values(item[0])[0].amount |
                            bigintToFloat(
                              tokens[
                                ethAddressToIcEthAddress[
                                  Object.values(item[0])[0].token
                                ]
                              ].decimals,
                              tokens[
                                ethAddressToIcEthAddress[
                                  Object.values(item[0])[0].token
                                ]
                              ].decimals
                            )
                        }}
                        {{
                          tokens[
                            ethAddressToIcEthAddress[
                              Object.values(item[0])[0].token
                            ]
                          ].symbol
                        }}
                      </div>
                      <div
                        v-if="
                          tokens &&
                          ethAddressToIcEthAddress[
                            Object.values(item[0])[0].token
                          ] &&
                          tokens[
                            ethAddressToIcEthAddress[
                              Object.values(item[0])[0].token
                            ]
                          ]
                        "
                      >
                        fee:
                        <span
                          v-if="
                            Object.values(item[0])[0].fee &&
                            Object.values(item[0])[0].fee.length
                          "
                        >
                          {{
                            Object.values(item[0])[0].fee[0] |
                              bigintToFloat(
                                tokens[
                                  ethAddressToIcEthAddress[
                                    Object.values(item[0])[0].token
                                  ]
                                ].decimals,
                                tokens[
                                  ethAddressToIcEthAddress[
                                    Object.values(item[0])[0].token
                                  ]
                                ].decimals
                              )
                          }}
                          {{
                            tokens[
                              ethAddressToIcEthAddress[
                                Object.values(item[0])[0].token
                              ]
                            ].symbol
                          }}
                        </span>
                        <span v-else>-</span>
                      </div>
                      <div>
                        toid:
                        <a
                          :href="`https://cmqwp-uiaaa-aaaaj-aihzq-cai.raw.ic0.app/saga/TO/nhgv3-fiaaa-aaaak-aer5q-cai/${
                            Object.values(item[0])[0].toid
                          }`"
                          target="_blank"
                          >{{ Object.values(item[0])[0].toid }}</a
                        >
                      </div>
                    </div>
                    <div v-if="Object.keys(item[0])[0] === 'keeper'">
                      <div>
                        <span> setRpc : </span>
                        <span>
                          { keeper: { owner:
                          {{
                            Object.values(
                              item[0]
                            )[0].operation.setRpc.keeper.owner.toString()
                          }}, subaccount:
                          {{
                            arrayToHexString(
                              Object.values(item[0])[0].operation.setRpc.keeper
                                .subaccount[0]
                            )
                          }}
                          }, operation:
                          <span
                            v-if="
                              Object.keys(
                                Object.values(item[0])[0].operation.setRpc
                                  .operation
                              )[0] === 'remove'
                            "
                          >
                            remove
                          </span>
                          <span
                            v-if="
                              Object.keys(
                                Object.values(item[0])[0].operation.setRpc
                                  .operation
                              )[0] === 'put'
                            "
                          >
                            put:
                            {{
                              Object.values(
                                Object.values(item[0])[0].operation.setRpc
                                  .operation
                              )[0][0]
                            }},
                            {{
                              Object.values(
                                Object.values(item[0])[0].operation.setRpc
                                  .operation
                              )[0][1]
                            }}
                          </span>
                          }
                        </span>
                      </div>
                    </div>
                    <div v-if="Object.keys(item[0])[0] === 'depositResult'">
                      <div>
                        type: {{ Object.keys(Object.values(item[0])[0])[0] }}
                      </div>
                      <div>
                        txIndex:
                        {{
                          Object.values(
                            Object.values(item[0])[0]
                          )[0].txIndex.toString()
                        }}
                      </div>
                      <div>
                        token:
                        <span
                          v-if="
                            Object.values(Object.values(item[0])[0])[0]
                              .token ===
                            '0x0000000000000000000000000000000000000000'
                          "
                        >
                          {{
                            Object.values(Object.values(item[0])[0])[0].token
                          }}
                          <span
                            v-if="
                              tokenInfo[
                                Object.values(Object.values(item[0])[0])[0]
                                  .token
                              ]
                            "
                          >
                            ({{
                              tokenInfo[
                                Object.values(Object.values(item[0])[0])[0]
                                  .token
                              ].symbol
                            }})
                          </span>
                        </span>
                        <a
                          v-if="
                            Object.values(Object.values(item[0])[0])[0]
                              .token !==
                            '0x0000000000000000000000000000000000000000'
                          "
                          :href="`${ethLink}/token/${
                            Object.values(Object.values(item[0])[0])[0].token
                          }`"
                          target="_blank"
                        >
                          {{
                            Object.values(Object.values(item[0])[0])[0].token
                          }}
                          <span
                            v-if="
                              tokenInfo[
                                Object.values(Object.values(item[0])[0])[0]
                                  .token
                              ]
                            "
                          >
                            ({{
                              tokenInfo[
                                Object.values(Object.values(item[0])[0])[0]
                                  .token
                              ].symbol
                            }})
                          </span>
                        </a>
                      </div>
                      <div>
                        account: {
                        <a
                          :href="`https://ic.house/address/${
                            ethAddressToIcEthAddress[
                              Object.values(Object.values(item[0])[0])[0].token
                            ]
                          }/${Object.values(
                            Object.values(item[0])[0]
                          )[0].account.owner.toString()}.${arrayToHexString(
                            Object.values(Object.values(item[0])[0])[0].account
                              .subaccount[0]
                          )}`"
                          target="_blank"
                          >owner:
                          {{
                            Object.values(
                              Object.values(item[0])[0]
                            )[0].account.owner.toString()
                          }}, subaccount:
                          {{
                            arrayToHexString(
                              Object.values(Object.values(item[0])[0])[0]
                                .account.subaccount[0]
                            )
                          }}
                        </a>
                        }
                      </div>
                      <div
                        v-if="
                          tokens &&
                          ethAddressToIcEthAddress[
                            Object.values(Object.values(item[0])[0])[0].token
                          ] &&
                          tokens[
                            ethAddressToIcEthAddress[
                              Object.values(Object.values(item[0])[0])[0].token
                            ]
                          ]
                        "
                      >
                        amount:
                        {{
                          Object.values(Object.values(item[0])[0])[0].amount |
                            bigintToFloat(
                              tokens[
                                ethAddressToIcEthAddress[
                                  Object.values(Object.values(item[0])[0])[0]
                                    .token
                                ]
                              ].decimals,
                              tokens[
                                ethAddressToIcEthAddress[
                                  Object.values(Object.values(item[0])[0])[0]
                                    .token
                                ]
                              ].decimals
                            )
                        }}
                        {{
                          tokens[
                            ethAddressToIcEthAddress[
                              Object.values(Object.values(item[0])[0])[0].token
                            ]
                          ].symbol
                        }}
                      </div>
                      <div
                        v-if="
                          tokens &&
                          ethAddressToIcEthAddress[
                            Object.values(Object.values(item[0])[0])[0].token
                          ] &&
                          tokens[
                            ethAddressToIcEthAddress[
                              Object.values(Object.values(item[0])[0])[0].token
                            ]
                          ]
                        "
                      >
                        fee:
                        <span
                          v-if="
                            Object.values(Object.values(item[0])[0])[0].fee &&
                            Object.values(Object.values(item[0])[0])[0].fee
                              .length
                          "
                        >
                          {{
                            Object.values(Object.values(item[0])[0])[0].fee[0] |
                              bigintToFloat(
                                tokens[
                                  ethAddressToIcEthAddress[
                                    Object.values(Object.values(item[0])[0])[0]
                                      .token
                                  ]
                                ].decimals,
                                tokens[
                                  ethAddressToIcEthAddress[
                                    Object.values(Object.values(item[0])[0])[0]
                                      .token
                                  ]
                                ].decimals
                              )
                          }}
                          {{
                            tokens[
                              ethAddressToIcEthAddress[
                                Object.values(Object.values(item[0])[0])[0]
                                  .token
                              ]
                            ].symbol
                          }}
                        </span>
                        <span v-else>-</span>
                      </div>
                      <div>
                        txid:
                        <div
                          v-for="(item, index) in Object.values(
                            Object.values(item[0])[0]
                          )[0].txid"
                          :key="index"
                        >
                          <a :href="`${ethLink}/tx/${item}`" target="_blank">
                            {{ item }}
                          </a>
                        </div>
                      </div>
                    </div>
                    <div v-if="Object.keys(item[0])[0] === 'burn'">
                      <div>
                        icTokenCanisterId:
                        <a
                          :href="`https://ic.house/token/${Object.values(
                            item[0]
                          )[0].icTokenCanisterId.toString()}`"
                          target="_blank"
                        >
                          {{
                            Object.values(
                              item[0]
                            )[0].icTokenCanisterId.toString()
                          }}
                        </a>
                      </div>
                      <div>
                        tokenBlockIndex:
                        {{
                          Object.values(item[0])[0].tokenBlockIndex.toString(10)
                        }}
                      </div>
                      <div>
                        account: {
                        <a
                          :href="`https://ic.house/address/${Object.values(
                            item[0]
                          )[0].icTokenCanisterId.toString()}/${Object.values(
                            item[0]
                          )[0].account.owner.toString()}.${arrayToHexString(
                            Object.values(item[0])[0].account.subaccount[0]
                          )}`"
                          target="_blank"
                        >
                          owner:
                          {{
                            Object.values(item[0])[0].account.owner.toString()
                          }}, subaccount:
                          {{
                            arrayToHexString(
                              Object.values(item[0])[0].account.subaccount[0]
                            )
                          }}
                        </a>
                        }
                      </div>
                      <div>
                        address:
                        <a
                          v-if="Object.values(item[0])[0].address"
                          :href="
                            icEthAddressToEthAddress[
                              Object.values(
                                item[0]
                              )[0].icTokenCanisterId.toString()
                            ] === '0x0000000000000000000000000000000000000000'
                              ? `${ethLink}/address/${
                                  Object.values(item[0])[0].address
                                }`
                              : `${ethLink}/token/${
                                  icEthAddressToEthAddress[
                                    Object.values(
                                      item[0]
                                    )[0].icTokenCanisterId.toString()
                                  ]
                                }?a=${Object.values(item[0])[0].address}`
                          "
                          target="_blank"
                        >
                          {{ Object.values(item[0])[0].address }}
                        </a>
                        <span v-if="!Object.values(item[0])[0].address">-</span>
                      </div>
                      <div
                        v-if="
                          tokens &&
                          tokens[
                            Object.values(
                              item[0]
                            )[0].icTokenCanisterId.toString()
                          ]
                        "
                      >
                        amount:
                        {{
                          Object.values(item[0])[0].amount |
                            bigintToFloat(
                              tokens[
                                Object.values(
                                  item[0]
                                )[0].icTokenCanisterId.toString()
                              ].decimals,
                              tokens[
                                Object.values(
                                  item[0]
                                )[0].icTokenCanisterId.toString()
                              ].decimals
                            )
                        }}
                        {{
                          tokens[
                            Object.values(
                              item[0]
                            )[0].icTokenCanisterId.toString()
                          ].symbol
                        }}
                      </div>
                      <div
                        v-if="
                          Object.values(item[0])[0].toid &&
                          Object.values(item[0])[0].toid.length
                        "
                      >
                        toid:
                        <a
                          :href="`https://cmqwp-uiaaa-aaaaj-aihzq-cai.raw.ic0.app/saga/TO/nhgv3-fiaaa-aaaak-aer5q-cai/${
                            Object.values(item[0])[0].toid[0]
                          }`"
                          target="_blank"
                          >{{ Object.values(item[0])[0].toid[0] }}</a
                        >
                      </div>
                    </div>
                    <div v-if="Object.keys(item[0])[0] === 'init'">
                      <div>
                        initArgs: { rpc_canister_id:
                        {{
                          Object.values(
                            item[0]
                          )[0].initArgs.rpc_canister_id.toString()
                        }}, rpc_confirmations:
                        {{
                          Object.values(
                            item[0]
                          )[0].initArgs.rpc_confirmations.toString(10)
                        }}, utils_canister_id:
                        {{
                          Object.values(
                            item[0]
                          )[0].initArgs.utils_canister_id.toString()
                        }}, deposit_method:
                        {{
                          Object.values(
                            item[0]
                          )[0].initArgs.deposit_method.toString(10)
                        }}, min_confirmations:
                        {{
                          Object.values(
                            item[0]
                          )[0].initArgs.min_confirmations.toString(10)
                        }}
                        }
                      </div>
                    </div>
                    <div v-if="Object.keys(item[0])[0] === 'mint'">
                      <div>
                        icTokenCanisterId:
                        <a
                          :href="`https://ic.house/token/${Object.values(
                            item[0]
                          )[0].icTokenCanisterId.toString()}`"
                          target="_blank"
                        >
                          {{
                            Object.values(
                              item[0]
                            )[0].icTokenCanisterId.toString()
                          }}
                        </a>
                      </div>
                      <div>
                        account: {
                        <a
                          :href="`https://ic.house/address/${Object.values(
                            item[0]
                          )[0].icTokenCanisterId.toString()}/${Object.values(
                            item[0]
                          )[0].account.owner.toString()}.${arrayToHexString(
                            Object.values(item[0])[0].account.subaccount[0]
                          )}`"
                          target="_blank"
                        >
                          owner:
                          {{
                            Object.values(item[0])[0].account.owner.toString()
                          }}, subaccount:
                          {{
                            arrayToHexString(
                              Object.values(item[0])[0].account.subaccount[0]
                            )
                          }}
                        </a>
                        }
                      </div>
                      <div
                        v-if="
                          tokens &&
                          tokens[
                            Object.values(
                              item[0]
                            )[0].icTokenCanisterId.toString()
                          ]
                        "
                      >
                        amount:
                        {{
                          Object.values(item[0])[0].amount |
                            bigintToFloat(
                              tokens[
                                Object.values(
                                  item[0]
                                )[0].icTokenCanisterId.toString()
                              ].decimals,
                              tokens[
                                Object.values(
                                  item[0]
                                )[0].icTokenCanisterId.toString()
                              ].decimals
                            )
                        }}
                        {{
                          tokens[
                            Object.values(
                              item[0]
                            )[0].icTokenCanisterId.toString()
                          ].symbol
                        }}
                      </div>
                      <div>
                        toid:
                        <a
                          :href="`https://cmqwp-uiaaa-aaaaj-aihzq-cai.raw.ic0.app/saga/TO/nhgv3-fiaaa-aaaak-aer5q-cai/${
                            Object.values(item[0])[0].toid
                          }`"
                          target="_blank"
                          >{{ Object.values(item[0])[0].toid }}</a
                        >
                      </div>
                    </div>
                    <div v-if="Object.keys(item[0])[0] === 'send'">
                      <div>
                        icTokenCanisterId:
                        <a
                          :href="`https://ic.house/token/${Object.values(
                            item[0]
                          )[0].icTokenCanisterId.toString()}`"
                          target="_blank"
                        >
                          {{
                            Object.values(
                              item[0]
                            )[0].icTokenCanisterId.toString()
                          }}
                        </a>
                      </div>
                      <div>
                        to: {
                        <a
                          :href="`https://ic.house/address/${Object.values(
                            item[0]
                          )[0].icTokenCanisterId.toString()}/${Object.values(
                            item[0]
                          )[0].to.owner.toString()}.${arrayToHexString(
                            Object.values(item[0])[0].to.subaccount[0]
                          )}`"
                          target="_blank"
                        >
                          owner:
                          {{ Object.values(item[0])[0].to.owner.toString() }},
                          subaccount:
                          {{
                            arrayToHexString(
                              Object.values(item[0])[0].to.subaccount[0]
                            )
                          }}
                        </a>
                        }
                      </div>
                      <div
                        v-if="
                          tokens &&
                          tokens[
                            Object.values(
                              item[0]
                            )[0].icTokenCanisterId.toString()
                          ]
                        "
                      >
                        amount:
                        {{
                          Object.values(item[0])[0].amount |
                            bigintToFloat(
                              tokens[
                                Object.values(
                                  item[0]
                                )[0].icTokenCanisterId.toString()
                              ].decimals,
                              tokens[
                                Object.values(
                                  item[0]
                                )[0].icTokenCanisterId.toString()
                              ].decimals
                            )
                        }}
                        {{
                          tokens[
                            Object.values(
                              item[0]
                            )[0].icTokenCanisterId.toString()
                          ].symbol
                        }}
                      </div>
                      <!--<div
                                              v-if="
                                                Object.values(item[0])[0].toid &&
                                                Object.values(item[0])[0].toid.length
                                              "
                                            >
                                              toid:
                                              <a
                                                :href="`https://cmqwp-uiaaa-aaaaj-aihzq-cai.raw.ic0.app/saga/TO/nhgv3-fiaaa-aaaak-aer5q-cai/${
                                                  Object.values(item[0])[0].toid[0]
                                                }`"
                                                target="_blank"
                                                >{{ Object.values(item[0])[0].toid[0] }}</a
                                              >
                                            </div>-->
                    </div>
                    <div v-if="Object.keys(item[0])[0] === 'coverTransaction'">
                      <div>
                        txIndex: {{ Object.values(item[0])[0].txIndex }}
                      </div>
                      <div>
                        account: {
                        <span>
                          owner:
                          {{
                            Object.values(item[0])[0].account.owner.toString()
                          }}, subaccount:
                          {{
                            arrayToHexString(
                              Object.values(item[0])[0].account.subaccount[0]
                            )
                          }}
                        </span>
                        }
                      </div>
                      <div>
                        updateTx:
                        <span
                          v-if="
                            Object.values(item[0])[0].updateTx &&
                            Object.values(item[0])[0].updateTx.length
                          "
                        >
                          {{
                            Object.values(item[0])[0].updateTx[0] | filterJson
                          }}
                        </span>
                      </div>
                      <div>
                        preTxid:
                        <div
                          v-for="(item, index) in Object.values(item[0])[0]
                            .preTxid"
                          :key="index"
                        >
                          <a :href="`${ethLink}/tx/${item}`" target="_blank">
                            {{ item }}
                          </a>
                        </div>
                      </div>
                      <div>
                        toid:
                        <a
                          :href="`https://cmqwp-uiaaa-aaaaj-aihzq-cai.raw.ic0.app/saga/TO/nhgv3-fiaaa-aaaak-aer5q-cai/${
                            Object.values(item[0])[0].toid
                          }`"
                          target="_blank"
                          >{{ Object.values(item[0])[0].toid }}</a
                        >
                      </div>
                    </div>
                    <div
                      v-if="Object.keys(item[0])[0] === 'claimDepositResult'"
                    >
                      <div>
                        type: {{ Object.keys(Object.values(item[0])[0])[0] }}
                      </div>
                      <div
                        v-if="
                          Object.keys(Object.values(item[0])[0])[0] === 'ok'
                        "
                      >
                        <div>
                          token:
                          <span
                            v-if="
                              Object.values(item[0])[0].ok.token ===
                              '0x0000000000000000000000000000000000000000'
                            "
                          >
                            {{ Object.values(item[0])[0].ok.token }}
                            <span
                              v-if="
                                tokenInfo[Object.values(item[0])[0].ok.token]
                              "
                            >
                              ({{
                                tokenInfo[Object.values(item[0])[0].ok.token]
                                  .symbol
                              }})
                            </span>
                          </span>
                          <a
                            v-if="
                              Object.values(item[0])[0].ok.token !==
                              '0x0000000000000000000000000000000000000000'
                            "
                            :href="`${ethLink}/token/${
                              Object.values(item[0])[0].ok.token
                            }`"
                            target="_blank"
                          >
                            {{ Object.values(item[0])[0].ok.token }}
                            <span
                              v-if="
                                tokenInfo[Object.values(item[0])[0].ok.token]
                              "
                            >
                              ({{
                                tokenInfo[Object.values(item[0])[0].ok.token]
                                  .symbol
                              }})
                            </span>
                          </a>
                        </div>
                        <div>
                          from:
                          <a
                            :href="
                              Object.values(item[0])[0].ok.token ===
                              '0x0000000000000000000000000000000000000000'
                                ? `${ethLink}/address/${
                                    Object.values(item[0])[0].ok.from
                                  }`
                                : `${ethLink}/token/${
                                    Object.values(item[0])[0].ok.token
                                  }?a=${Object.values(item[0])[0].address}`
                            "
                            target="_blank"
                          >
                            {{ Object.values(item[0])[0].ok.from }}
                          </a>
                        </div>
                        <div>
                          account: {
                          <a
                            :href="`https://ic.house/address/${
                              ethAddressToIcEthAddress[
                                Object.values(item[0])[0].ok.token
                              ]
                            }/${Object.values(
                              item[0]
                            )[0].ok.account.owner.toString()}.${arrayToHexString(
                              Object.values(item[0])[0].ok.account.subaccount[0]
                            )}`"
                            target="_blank"
                            >owner:
                            {{
                              Object.values(
                                item[0]
                              )[0].ok.account.owner.toString()
                            }}, subaccount:
                            {{
                              arrayToHexString(
                                Object.values(item[0])[0].ok.account
                                  .subaccount[0]
                              )
                            }}
                          </a>
                          }
                        </div>
                        <div
                          v-if="
                            tokens &&
                            ethAddressToIcEthAddress[
                              Object.values(item[0])[0].ok.token
                            ] &&
                            tokens[
                              ethAddressToIcEthAddress[
                                Object.values(item[0])[0].ok.token
                              ]
                            ]
                          "
                        >
                          amount:
                          {{
                            Object.values(item[0])[0].ok.amount |
                              bigintToFloat(
                                tokens[
                                  ethAddressToIcEthAddress[
                                    Object.values(item[0])[0].ok.token
                                  ]
                                ].decimals,
                                tokens[
                                  ethAddressToIcEthAddress[
                                    Object.values(item[0])[0].ok.token
                                  ]
                                ].decimals
                              )
                          }}
                          {{
                            tokens[
                              ethAddressToIcEthAddress[
                                Object.values(item[0])[0].ok.token
                              ]
                            ].symbol
                          }}
                        </div>
                        <div
                          v-if="
                            tokens &&
                            ethAddressToIcEthAddress[
                              Object.values(item[0])[0].ok.token
                            ] &&
                            tokens[
                              ethAddressToIcEthAddress[
                                Object.values(item[0])[0].ok.token
                              ]
                            ]
                          "
                        >
                          fee:
                          <span
                            v-if="
                              Object.values(item[0])[0].ok.fee &&
                              Object.values(item[0])[0].ok.fee.length
                            "
                          >
                            {{
                              Object.values(item[0])[0].ok.fee[0] |
                                bigintToFloat(
                                  tokens[
                                    ethAddressToIcEthAddress[
                                      Object.values(item[0])[0].ok.token
                                    ]
                                  ].decimals,
                                  tokens[
                                    ethAddressToIcEthAddress[
                                      Object.values(item[0])[0].ok.token
                                    ]
                                  ].decimals
                                )
                            }}
                            {{
                              tokens[
                                ethAddressToIcEthAddress[
                                  Object.values(item[0])[0].ok.token
                                ]
                              ].symbol
                            }}
                          </span>
                          <span v-else>-</span>
                        </div>
                        <div>
                          txHash:
                          <a
                            :href="`${ethLink}/tx/${
                              Object.values(item[0])[0].ok.txHash
                            }`"
                            target="_blank"
                          >
                            {{ Object.values(item[0])[0].ok.txHash }}
                          </a>
                        </div>
                        <div>
                          signature:
                          {{ Object.values(item[0])[0].ok.signature }}
                        </div>
                      </div>
                      <div
                        v-if="
                          Object.keys(Object.values(item[0])[0])[0] === 'err'
                        "
                      >
                        <div>
                          error: {{ Object.values(item[0])[0].err.error }}
                        </div>
                        <div>
                          account: { owner:
                          {{
                            Object.values(
                              item[0]
                            )[0].err.account.owner.toString()
                          }}, subaccount:
                          {{
                            arrayToHexString(
                              Object.values(item[0])[0].err.account
                                .subaccount[0]
                            )
                          }}
                          }
                        </div>
                        <div>
                          txHash:
                          <a
                            :href="`${ethLink}/tx/${
                              Object.values(item[0])[0].err.txHash
                            }`"
                            target="_blank"
                          >
                            {{ Object.values(item[0])[0].err.txHash }}
                          </a>
                        </div>
                        <div>
                          signature:
                          {{ Object.values(item[0])[0].err.signature }}
                        </div>
                      </div>
                    </div>
                    <div v-if="Object.keys(item[0])[0] === 'changeOwner'">
                      newOwner:
                      {{ Object.values(item[0])[0].newOwner.toString() }}
                    </div>
                    <div v-if="Object.keys(item[0])[0] === 'deposit'">
                      <div>
                        txIndex: {{ Object.values(item[0])[0].txIndex }}
                      </div>
                      <div>
                        token:
                        <span
                          v-if="
                            Object.values(item[0])[0].token ===
                            '0x0000000000000000000000000000000000000000'
                          "
                        >
                          {{ Object.values(item[0])[0].token }}
                          <span
                            v-if="tokenInfo[Object.values(item[0])[0].token]"
                          >
                            ({{
                              tokenInfo[Object.values(item[0])[0].token].symbol
                            }})
                          </span>
                        </span>
                        <a
                          v-if="
                            Object.values(item[0])[0].token !==
                            '0x0000000000000000000000000000000000000000'
                          "
                          :href="`${ethLink}/token/${
                            Object.values(item[0])[0].token
                          }`"
                          target="_blank"
                        >
                          {{ Object.values(item[0])[0].token }}
                          <span
                            v-if="tokenInfo[Object.values(item[0])[0].token]"
                          >
                            ({{
                              tokenInfo[Object.values(item[0])[0].token].symbol
                            }})
                          </span>
                        </a>
                      </div>
                      <div>
                        address:
                        <a
                          :href="
                            Object.values(item[0])[0].token ===
                            '0x0000000000000000000000000000000000000000'
                              ? `${ethLink}/address/${
                                  Object.values(item[0])[0].address
                                }`
                              : `${ethLink}/token/${
                                  Object.values(item[0])[0].token
                                }?a=${Object.values(item[0])[0].address}`
                          "
                          target="_blank"
                        >
                          {{ Object.values(item[0])[0].address }}
                        </a>
                      </div>
                      <div>
                        account: {
                        <a
                          :href="`https://ic.house/address/${
                            ethAddressToIcEthAddress[
                              Object.values(item[0])[0].token
                            ]
                          }/${Object.values(
                            item[0]
                          )[0].account.owner.toString()}.${arrayToHexString(
                            Object.values(item[0])[0].account.subaccount[0]
                          )}`"
                          target="_blank"
                        >
                          owner:
                          {{
                            Object.values(item[0])[0].account.owner.toString()
                          }}, subaccount:
                          {{
                            arrayToHexString(
                              Object.values(item[0])[0].account.subaccount[0]
                            )
                          }}
                        </a>
                        }
                      </div>
                      <div
                        v-if="
                          tokens &&
                          ethAddressToIcEthAddress[
                            Object.values(item[0])[0].token
                          ] &&
                          tokens[
                            ethAddressToIcEthAddress[
                              Object.values(item[0])[0].token
                            ]
                          ]
                        "
                      >
                        amount:
                        {{
                          Object.values(item[0])[0].amount |
                            bigintToFloat(
                              tokens[
                                ethAddressToIcEthAddress[
                                  Object.values(item[0])[0].token
                                ]
                              ].decimals,
                              tokens[
                                ethAddressToIcEthAddress[
                                  Object.values(item[0])[0].token
                                ]
                              ].decimals
                            )
                        }}
                        {{
                          tokens[
                            ethAddressToIcEthAddress[
                              Object.values(item[0])[0].token
                            ]
                          ].symbol
                        }}
                      </div>
                      <div
                        v-if="
                          tokens &&
                          ethAddressToIcEthAddress[
                            Object.values(item[0])[0].token
                          ] &&
                          tokens[
                            ethAddressToIcEthAddress[
                              Object.values(item[0])[0].token
                            ]
                          ]
                        "
                      >
                        fee:
                        <span
                          v-if="
                            Object.values(item[0])[0].fee &&
                            Object.values(item[0])[0].fee.length
                          "
                        >
                          {{
                            Object.values(item[0])[0].fee[0] |
                              bigintToFloat(
                                tokens[
                                  ethAddressToIcEthAddress[
                                    Object.values(item[0])[0].token
                                  ]
                                ].decimals,
                                tokens[
                                  ethAddressToIcEthAddress[
                                    Object.values(item[0])[0].token
                                  ]
                                ].decimals
                              )
                          }}
                          {{
                            tokens[
                              ethAddressToIcEthAddress[
                                Object.values(item[0])[0].token
                              ]
                            ].symbol
                          }}
                        </span>
                        <span v-else>-</span>
                      </div>
                      <div>
                        toid:
                        <a
                          :href="`https://cmqwp-uiaaa-aaaaj-aihzq-cai.raw.ic0.app/saga/TO/nhgv3-fiaaa-aaaak-aer5q-cai/${
                            Object.values(item[0])[0].toid
                          }`"
                          target="_blank"
                          >{{ Object.values(item[0])[0].toid }}</a
                        >
                      </div>
                    </div>
                    <div v-if="Object.keys(item[0])[0] === 'start'">
                      message: {{ Object.values(item[0])[0].message }}
                    </div>
                    <div v-if="Object.keys(item[0])[0] === 'updateTokenPrice'">
                      <div>
                        {"token":
                        <span
                          v-if="
                            Object.values(item[0])[0].token ===
                            '0x0000000000000000000000000000000000000000'
                          "
                        >
                          {{ Object.values(item[0])[0].token }}
                          <span
                            v-if="tokenInfo[Object.values(item[0])[0].token]"
                          >
                            ({{
                              tokenInfo[Object.values(item[0])[0].token].symbol
                            }})
                          </span>
                        </span>
                        <a
                          v-if="
                            Object.values(item[0])[0].token !==
                            '0x0000000000000000000000000000000000000000'
                          "
                          :href="`${ethLink}/token/${
                            Object.values(item[0])[0].token
                          }`"
                          target="_blank"
                        >
                          {{ Object.values(item[0])[0].token }}
                          <span
                            v-if="tokenInfo[Object.values(item[0])[0].token]"
                          >
                            ({{
                              tokenInfo[Object.values(item[0])[0].token].symbol
                            }})
                          </span> </a
                        >, "ethRatio": "{{
                          Object.values(item[0])[0].ethRatio
                        }}", "price": "{{ Object.values(item[0])[0].price }}"}
                      </div>
                    </div>
                    <div v-if="Object.keys(item[0])[0] === 'withdrawResult'">
                      <div>
                        type: {{ Object.keys(Object.values(item[0])[0])[0] }}
                      </div>
                      <div>
                        txIndex:
                        {{
                          Object.values(
                            Object.values(item[0])[0]
                          )[0].txIndex.toString()
                        }}
                      </div>
                      <div>
                        token:
                        <span
                          v-if="
                            Object.values(Object.values(item[0])[0])[0]
                              .token ===
                            '0x0000000000000000000000000000000000000000'
                          "
                        >
                          {{
                            Object.values(Object.values(item[0])[0])[0].token
                          }}
                          <span
                            v-if="
                              tokenInfo[
                                Object.values(Object.values(item[0])[0])[0]
                                  .token
                              ]
                            "
                          >
                            ({{
                              tokenInfo[
                                Object.values(Object.values(item[0])[0])[0]
                                  .token
                              ].symbol
                            }})
                          </span>
                        </span>
                        <a
                          v-if="
                            Object.values(Object.values(item[0])[0])[0]
                              .token !==
                            '0x0000000000000000000000000000000000000000'
                          "
                          :href="`${ethLink}/token/${
                            Object.values(Object.values(item[0])[0])[0].token
                          }`"
                          target="_blank"
                        >
                          {{
                            Object.values(Object.values(item[0])[0])[0].token
                          }}
                          <span
                            v-if="
                              tokenInfo[
                                Object.values(Object.values(item[0])[0])[0]
                                  .token
                              ]
                            "
                          >
                            ({{
                              tokenInfo[
                                Object.values(Object.values(item[0])[0])[0]
                                  .token
                              ].symbol
                            }})
                          </span>
                        </a>
                      </div>
                      <div>
                        account: {
                        <a
                          :href="`https://ic.house/address/${
                            ethAddressToIcEthAddress[
                              Object.values(Object.values(item[0])[0])[0].token
                            ]
                          }/${Object.values(
                            Object.values(item[0])[0]
                          )[0].account.owner.toString()}.${arrayToHexString(
                            Object.values(Object.values(item[0])[0])[0].account
                              .subaccount[0]
                          )}`"
                          target="_blank"
                          >owner:
                          {{
                            Object.values(
                              Object.values(item[0])[0]
                            )[0].account.owner.toString()
                          }}, subaccount:
                          {{
                            arrayToHexString(
                              Object.values(Object.values(item[0])[0])[0]
                                .account.subaccount[0]
                            )
                          }}
                        </a>
                        }
                      </div>
                      <div
                        v-if="
                          tokens &&
                          ethAddressToIcEthAddress[
                            Object.values(Object.values(item[0])[0])[0].token
                          ] &&
                          tokens[
                            ethAddressToIcEthAddress[
                              Object.values(Object.values(item[0])[0])[0].token
                            ]
                          ]
                        "
                      >
                        amount:
                        {{
                          Object.values(Object.values(item[0])[0])[0].amount |
                            bigintToFloat(
                              tokens[
                                ethAddressToIcEthAddress[
                                  Object.values(Object.values(item[0])[0])[0]
                                    .token
                                ]
                              ].decimals,
                              tokens[
                                ethAddressToIcEthAddress[
                                  Object.values(Object.values(item[0])[0])[0]
                                    .token
                                ]
                              ].decimals
                            )
                        }}
                        {{
                          tokens[
                            ethAddressToIcEthAddress[
                              Object.values(Object.values(item[0])[0])[0].token
                            ]
                          ].symbol
                        }}
                      </div>
                      <div>
                        txid:
                        <div
                          v-for="(item, index) in Object.values(
                            Object.values(item[0])[0]
                          )[0].txid"
                          :key="index"
                        >
                          <a :href="`${ethLink}/tx/${item}`" target="_blank">
                            {{ item }}
                          </a>
                        </div>
                      </div>
                    </div>
                    <div v-if="Object.keys(item[0])[0] === 'depositGasResult'">
                      <div>
                        type: {{ Object.keys(Object.values(item[0])[0])[0] }}
                      </div>
                      <div>
                        txIndex:
                        {{
                          Object.values(
                            Object.values(item[0])[0]
                          )[0].txIndex.toString()
                        }}
                      </div>
                      <div>
                        token:
                        <span
                          v-if="
                            Object.values(Object.values(item[0])[0])[0]
                              .token ===
                            '0x0000000000000000000000000000000000000000'
                          "
                        >
                          {{
                            Object.values(Object.values(item[0])[0])[0].token
                          }}
                          <span
                            v-if="
                              tokenInfo[
                                Object.values(Object.values(item[0])[0])[0]
                                  .token
                              ]
                            "
                          >
                            ({{
                              tokenInfo[
                                Object.values(Object.values(item[0])[0])[0]
                                  .token
                              ].symbol
                            }})
                          </span>
                        </span>
                        <a
                          v-if="
                            Object.values(Object.values(item[0])[0])[0]
                              .token !==
                            '0x0000000000000000000000000000000000000000'
                          "
                          :href="`${ethLink}/token/${
                            Object.values(Object.values(item[0])[0])[0].token
                          }`"
                          target="_blank"
                        >
                          {{
                            Object.values(Object.values(item[0])[0])[0].token
                          }}
                          <span
                            v-if="
                              tokenInfo[
                                Object.values(Object.values(item[0])[0])[0]
                                  .token
                              ]
                            "
                          >
                            ({{
                              tokenInfo[
                                Object.values(Object.values(item[0])[0])[0]
                                  .token
                              ].symbol
                            }})
                          </span>
                        </a>
                      </div>
                      <div>
                        account: {
                        <a
                          :href="`https://ic.house/address/${
                            ethAddressToIcEthAddress[
                              Object.values(Object.values(item[0])[0])[0].token
                            ]
                          }/${Object.values(
                            Object.values(item[0])[0]
                          )[0].account.owner.toString()}.${arrayToHexString(
                            Object.values(Object.values(item[0])[0])[0].account
                              .subaccount[0]
                          )}`"
                          target="_blank"
                          >owner:
                          {{
                            Object.values(
                              Object.values(item[0])[0]
                            )[0].account.owner.toString()
                          }}, subaccount:
                          {{
                            arrayToHexString(
                              Object.values(Object.values(item[0])[0])[0]
                                .account.subaccount[0]
                            )
                          }}
                        </a>
                        }
                      </div>
                      <div
                        v-if="
                          tokens &&
                          ethAddressToIcEthAddress[
                            Object.values(Object.values(item[0])[0])[0].token
                          ] &&
                          tokens[
                            ethAddressToIcEthAddress[
                              Object.values(Object.values(item[0])[0])[0].token
                            ]
                          ]
                        "
                      >
                        amount:
                        {{
                          Object.values(Object.values(item[0])[0])[0].amount |
                            bigintToFloat(
                              tokens[
                                ethAddressToIcEthAddress[
                                  Object.values(Object.values(item[0])[0])[0]
                                    .token
                                ]
                              ].decimals,
                              tokens[
                                ethAddressToIcEthAddress[
                                  Object.values(Object.values(item[0])[0])[0]
                                    .token
                                ]
                              ].decimals
                            )
                        }}
                        {{
                          tokens[
                            ethAddressToIcEthAddress[
                              Object.values(Object.values(item[0])[0])[0].token
                            ]
                          ].symbol
                        }}
                      </div>
                      <div
                        v-if="
                          Object.keys(Object.values(item[0])[0])[0] === 'ok'
                        "
                      >
                        txid:
                        <div
                          v-for="(item, index) in Object.values(
                            Object.values(item[0])[0]
                          )[0].txid"
                          :key="index"
                        >
                          <a :href="`${ethLink}/tx/${item}`" target="_blank">
                            {{ item }}
                          </a>
                        </div>
                      </div>
                    </div>
                    <div v-if="Object.keys(item[0])[0] === 'claimDeposit'">
                      <div>
                        account: {
                        <span>
                          owner:
                          {{
                            Object.values(item[0])[0].account.owner.toString()
                          }}, subaccount:
                          {{
                            arrayToHexString(
                              Object.values(item[0])[0].account.subaccount[0]
                            )
                          }}
                        </span>
                        }
                      </div>
                      <div>
                        txHash:
                        <a
                          :href="`${ethLink}/tx/${
                            Object.values(item[0])[0].txHash
                          }`"
                          target="_blank"
                        >
                          {{ Object.values(item[0])[0].txHash }}
                        </a>
                      </div>
                      <div>
                        signature: {{ Object.values(item[0])[0].signature }}
                      </div>
                    </div>
                    <div v-if="Object.keys(item[0])[0] === 'config'">
                      {{ Object.values(item[0])[0] | filterJson }}
                    </div>
                    <div v-if="Object.keys(item[0])[0] === 'suspend'">
                      {{ Object.values(item[0])[0] | filterJson }}
                    </div>
                  </td>
                  <td class="table-time">
                    {{ item[1] | formatDateFromSecondUTC }}
                  </td>
                </tr>
                <tr v-if="!loading && !accountEvents.length">
                  <td colspan="3" style="text-align: center; font-size: 14px">
                    No record
                  </td>
                </tr>
              </tbody>
            </table>
            <div
              v-show="!showAccountEvents"
              class="transactions-pagination-bottom"
            >
              <a-pagination
                v-if="total > pageSize"
                class="transactions-pagination"
                v-model="page"
                :total="total"
                :defaultPageSize="pageSize"
                :showQuickJumper="true"
                @change="pageChange"
              />
            </div>
            <div
              v-show="showAccountEvents"
              class="transactions-pagination-bottom"
            >
              <a-pagination
                v-if="accountEvents.length > pageSize"
                class="transactions-pagination"
                v-model="accountPage"
                :total="accountEvents.length"
                :defaultPageSize="pageSize"
                :showQuickJumper="true"
                @change="accountPageChange"
              />
            </div>
          </a-spin>
        </a-tab-pane>
        <!--<a-tab-pane key="AccountTracing" tab="Account Tracing">
          <form @submit.prevent="">
            <a-input-group class="search-group search-group-trace" compact>
              <a-input
                v-model="searchAccountTrace"
                type="text"
                @pressEnter="searchTrace"
                allow-clear
                placeholder="Address/AccountId/Principal/TxHash"
                class="search-account"
                name="accountTrace"
                :allowClear="true"
              />
              <button type="button" @click="searchTrace">Trace</button>
            </a-input-group>
          </form>
          <div id="trace-tree"></div>
        </a-tab-pane>-->
      </a-tabs>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { icETHMinterService } from '@/ic/icETHMinter/icETHMinterService';
import {
  ChainAccount,
  CkToken,
  EventData,
  ICAccount,
  IcEvent,
  IcTokenInfo
} from '@/ic/icETHMinter/model';
import { Icrc1Account, Time, TokenInfo } from '@/ic/common/icType';
import { getTokenInfo } from '@/ic/getTokenInfo';
import { IC_ETH_MINTER_CANISTER_ID, validatePrincipal } from '@/ic/utils';
import {
  calculateCrc32,
  hexToBytes,
  principalToAccount,
  toAccountId,
  toHexString
} from '@/ic/converter';
import { isAddress } from 'web3-utils';
import { Principal } from '@dfinity/principal';
import * as echarts from 'echarts/core';
import {
  TitleComponentOption,
  TooltipComponentOption,
  LegendComponentOption
} from 'echarts/components';
import { GraphSeriesOption } from 'echarts/charts';
import { EChartsType } from 'echarts/types/dist/shared';
import {
  GraphEdgeItemOption,
  GraphNodeItemOption
} from 'echarts/types/src/chart/graph/GraphSeries';

type TreeData = {
  nodes: GraphNodeItemOption[];
  links: GraphEdgeItemOption[];
};

@Component({
  name: 'icEthereum',
  components: {},
  filters: {
    filterJson(val): string {
      return JSON.stringify(val, (key, value) =>
        value instanceof Array && value.length >= 16 // todo 16
          ? toHexString(new Uint8Array(value))
          : typeof value === 'bigint'
          ? value.toString()
          : value && value._isPrincipal
          ? value.toString()
          : value
      );
    }
  }
})
export default class extends Vue {
  private icETHMinterService: icETHMinterService = null;
  private activeKey = 'Activities';
  private icTokens: Array<CkToken> = [];
  private currentIcTokenIndex: number = null;
  private searchAccount = '';
  private tokens: { [key: string]: TokenInfo } = {};
  private loading = false;
  private page = 1;
  private pageSize = 100;
  private total = 0;
  private accountPage = 1;
  private events: Array<EventData> = [];
  private accountEvents: Array<[IcEvent, Time]> = [];
  private showAccountEvents = false;
  private ethLink = 'https://etherscan.io';
  private ethAddressToIcEthAddress: { [key: string]: string } = {};
  private icEthAddressToEthAddress: { [key: string]: string } = {};
  private tokenInfo: { [key: string]: IcTokenInfo } = {};
  private searchAccountTrace = '';
  private treeChart: EChartsType = null;
  private treeData: TreeData = { nodes: [], links: [] };
  private treeDataAccount: Array<string> = [];
  created(): void {
    if (IC_ETH_MINTER_CANISTER_ID === 'nhgv3-fiaaa-aaaak-aer5q-cai') {
      this.ethLink = 'https://goerli.etherscan.io';
    }
    this.tokens = JSON.parse(localStorage.getItem('tokens')) || {};
    this.icETHMinterService = new icETHMinterService();
    this.getCkTokens();
    // this.initTree();
  }
  private changeTab(activeKey: string) {
    this.activeKey = activeKey;
    if (activeKey === 'Activities') {
      //
    } else if (activeKey === 'AccountTracing') {
      this.initTree();
    }
  }
  private initTree(): void {
    this.$nextTick(() => {
      const chart = document.getElementById('trace-tree');
      this.treeChart = echarts.init(chart);
    });
  }
  private async getCkTokens(): Promise<void> {
    const res = await this.icETHMinterService.getCkTokens();
    this.currentIcTokenIndex = 0;
    if (res) {
      this.icTokens = res;
      this.icTokens.forEach((item) => {
        this.ethAddressToIcEthAddress[item[0]] = item[1].ckLedgerId.toString();
        this.icEthAddressToEthAddress[item[1].ckLedgerId.toString()] = item[0];
        this.tokenInfo[item[0]] = item[1];
        getTokenInfo(item[1].ckLedgerId).then((tokenInfo) => {
          this.$set(this.tokens, item[1].ckLedgerId.toString(), tokenInfo);
        });
      });
    } else {
      this.icTokens = [];
    }
    this.getEvents();
  }
  private pageChange(): void {
    this.getEvents();
  }
  private accountPageChange(val: number): void {
    this.accountPage = val;
  }
  private async getEvents(): Promise<void> {
    this.loading = true;
    const res = await this.icETHMinterService.getEvents(
      [BigInt(this.page)],
      [BigInt(this.pageSize)]
    );
    console.log(res);
    if (res) {
      this.events = res.data;
      this.total = Number(res.total);
    } else {
      this.events = [];
      this.total = 0;
    }
    this.loading = false;
  }
  private async getAccountEvents(accountId: string): Promise<void> {
    this.loading = true;
    const res = await this.icETHMinterService.getAccountEvents(
      hexToBytes(accountId)
    );
    console.log(res);
    if (res) {
      this.accountEvents = res;
    }
    this.loading = false;
  }
  private loadChart(isInit = false): void {
    if (isInit) {
      let option: echarts.ComposeOption<
        | TitleComponentOption
        | TooltipComponentOption
        | LegendComponentOption
        | GraphSeriesOption
      >;
      console.log(this.treeData);
      this.treeChart.setOption(
        (option = {
          series: [
            {
              type: 'graph',
              layout: 'force',
              data: this.treeData.nodes,
              links: this.treeData.links,
              roam: true,
              force: {
                repulsion: [10, 400],
                edgeLength: [10, 200]
              },
              label: {
                position: 'right',
                formatter: '{b}'
              },
              lineStyle: {
                color: 'source',
                curveness: 0.3
              },
              emphasis: {
                focus: 'adjacency',
                lineStyle: {
                  width: 10
                }
              }
            }
          ]
        })
      );
      // this.treeChart.on('click', (p): void | boolean => {
      //   console.log(p);
      //   if (!p.collapsed) {
      //     let promiseAll = [];
      //     if (p.value && p.value[3] && p.value[3] === 'address') {
      //       (p.data as TreeSeriesNodeItemOption).collapsed = false;
      //       (p.data as TreeSeriesNodeItemOption).children.forEach((item) => {
      //         const account = item.value[2].split('.');
      //         const principal = account[0];
      //         let subaccount = [];
      //         if (account[1]) {
      //           subaccount = [hexToBytes(account[1])];
      //         }
      //         const accountId = principalToAccount(
      //           Principal.from(principal),
      //           subaccount[0] ? new Uint8Array(subaccount[0]) : null
      //         );
      //         if (
      //           !this.treeDataAccount.includes(
      //             toHexString(new Uint8Array(accountId))
      //           ) &&
      //           !item.children.length
      //         ) {
      //           promiseAll.push(this.getCachedAddress(accountId, item));
      //         }
      //       });
      //     } else if (p.value && p.value[3] && p.value[3] === 'accountId') {
      //       (p.data as TreeSeriesNodeItemOption).collapsed = false;
      //       (p.data as TreeSeriesNodeItemOption).children.forEach((item) => {
      //         if (
      //           !this.treeDataAccount.includes(item.value[2]) &&
      //           !item.children.length
      //         ) {
      //           promiseAll.push(this.getCachedAccount(item.value[2], item));
      //         }
      //       });
      //     }
      //     Promise.all(promiseAll).then((res) => {
      //       let needSetOption = res.some((item) => item.length);
      //       console.log(needSetOption);
      //       if (needSetOption) {
      //         const curData = this.treeChart.getOption().series[0].data;
      //         console.log(curData);
      //         this.treeData = curData[0];
      //         option.series[0].data = curData;
      //         this.treeChart.setOption(option);
      //       }
      //     });
      //   }
      // });
    }
  }
  private async setCachedAddressChild(
    res: Array<ICAccount>,
    node: GraphNodeItemOption
  ): Promise<void> {
    let promiseAll = [];
    const MAX_CONCURRENCY = 30;
    for (let i = 0; i < res.length; i++) {
      const item = res[i];
      let accountId = item[1].owner.toString();
      if (item[1].subaccount[0]) {
        accountId += `.${toHexString(new Uint8Array(item[1].subaccount[0]))}`;
      }
      const id = Number(node.category) + 1;
      const data = {
        id: id.toString(10),
        name: accountId,
        category: id
      };
      const link = {
        target: id.toString(10),
        source: node.category.toString(10)
      };
      this.treeData.nodes.push(data);
      this.treeData.links.push(link);
      promiseAll.push(
        this.getCachedAddress(
          principalToAccount(
            Principal.from(item[1].owner.toString()),
            item[1].subaccount[0] ? new Uint8Array(item[1].subaccount[0]) : null
          ),
          data
        )
      );
      if (promiseAll.length === MAX_CONCURRENCY) {
        await Promise.all(promiseAll);
        promiseAll = [];
      }
      if (i === res.length - 1 && promiseAll.length) {
        await Promise.all(promiseAll);
        promiseAll = [];
      }
    }
  }
  private async setCachedAccountChild(
    res: Array<ChainAccount>,
    node: GraphNodeItemOption
  ): Promise<void> {
    let promiseAll = [];
    const MAX_CONCURRENCY = 30;
    for (let i = 0; i < res.length; i++) {
      const item = res[i];
      const id = Number(node.category) + 1;
      const data = {
        id: id.toString(10),
        name: item[2],
        category: id,
        symbolSize: Number(node.symbolSize) / 2
      };
      const link = {
        target: id.toString(10),
        source: node.category.toString(10)
      };
      this.treeData.nodes.push(data);
      this.treeData.links.push(link);
      promiseAll.push(this.getCachedAccount(item[2], data));
      if (promiseAll.length === MAX_CONCURRENCY) {
        await Promise.all(promiseAll);
        promiseAll = [];
      }
      if (i === res.length - 1 && promiseAll.length) {
        await Promise.all(promiseAll);
        promiseAll = [];
      }
    }
  }
  private async getMoreAddress(
    account: Array<{
      node: GraphNodeItemOption;
      account: ChainAccount;
    }>
  ): Promise<void> {
    let promiseAll = [];
    let addressList: Array<{
      node: GraphNodeItemOption;
      account: Array<ICAccount>;
    }> = [];
    const MAX_CONCURRENCY = 30;
    for (let i = 0; i < account.length; i++) {
      const item = account[i];
      promiseAll.push(this.getCachedAccount(item.account[2], item.node));
      if (promiseAll.length === MAX_CONCURRENCY) {
        const res = await Promise.all(promiseAll);
        addressList = addressList.concat(...res);
        promiseAll = [];
      }
      if (i === account.length - 1 && promiseAll.length) {
        const res = await Promise.all(promiseAll);
        addressList = addressList.concat(...res);
        promiseAll = [];
      }
    }
    console.log(addressList);
    let moreAddress: Array<{ node: GraphNodeItemOption; account: ICAccount }> =
      [];
    let currentId = Number(
      this.treeData.nodes[this.treeData.nodes.length - 1].id
    );
    addressList.forEach((address) => {
      if (address && address.account && address.account.length) {
        address.account.forEach((item) => {
          let accountId = item[1].owner.toString();
          if (item[1].subaccount[0]) {
            accountId += `.${toHexString(
              new Uint8Array(item[1].subaccount[0])
            )}`;
          }
          const id = ++currentId;
          const data = {
            id: id.toString(10),
            name: accountId,
            category: 1,
            symbolSize: Number(address.node.symbolSize) / 2
            // label: {
            //   show: true
            // }
          };
          const link = {
            target: id.toString(10),
            source: address.node.id
          };
          moreAddress.push({ node: data, account: item });
          this.treeData.nodes.push(data);
          this.treeData.links.push(link);
        });
      }
    });
    console.log(this.treeData);
    if (!moreAddress.length) {
      this.loadChart(true);
    } else {
      this.getMoreAccount(moreAddress);
    }
  }
  private async getMoreAccount(
    address: Array<{ node: GraphNodeItemOption; account: ICAccount }>
  ): Promise<void> {
    let promiseAll = [];
    let accountList: Array<{
      node: GraphNodeItemOption;
      account: Array<ChainAccount>;
    }> = [];
    const MAX_CONCURRENCY = 30;
    for (let i = 0; i < address.length; i++) {
      const item = address[i];
      promiseAll.push(
        this.getCachedAddress(
          principalToAccount(
            Principal.from(item.account[1].owner.toString()),
            item.account[1].subaccount[0]
              ? new Uint8Array(item.account[1].subaccount[0])
              : null
          ),
          item.node
        )
      );
      if (promiseAll.length === MAX_CONCURRENCY) {
        const res = await Promise.all(promiseAll);
        accountList = accountList.concat(...res);
        promiseAll = [];
      }
      if (i === accountList.length - 1 && promiseAll.length) {
        const res = await Promise.all(promiseAll);
        accountList = accountList.concat(...res);
        promiseAll = [];
      }
    }
    console.log(accountList);
    let moreAccount: Array<{
      node: GraphNodeItemOption;
      account: ChainAccount;
    }> = [];
    let currentId = Number(
      this.treeData.nodes[this.treeData.nodes.length - 1].id
    );
    accountList.forEach((account) => {
      if (account && account.account && account.account.length) {
        account.account.forEach((item) => {
          const id = ++currentId;
          const data = {
            id: id.toString(10),
            name: item[2],
            category: 1,
            symbolSize: Number(account.node.symbolSize) / 2
            // label: {
            //   show: true
            // }
          };
          const link = {
            target: id.toString(10),
            source: account.node.id
          };
          moreAccount.push({ node: data, account: item });
          this.treeData.nodes.push(data);
          this.treeData.links.push(link);
        });
      }
    });
    console.log(this.treeData);
    if (!moreAccount.length) {
      this.loadChart(true);
    } else {
      this.getMoreAddress(moreAccount);
    }
  }
  private async getCachedAccount(
    ethAddress: string,
    node: GraphNodeItemOption
  ): Promise<{ node: GraphNodeItemOption; account: Array<ICAccount> }> {
    if (!this.treeDataAccount.includes(ethAddress)) {
      this.treeDataAccount.push(ethAddress);
    } else {
      return null;
    }
    const res = await this.icETHMinterService.getCachedAccount(ethAddress);
    if (res && res.length) {
      return {
        node: node,
        account: res[0]
      };
    }
    return null;
  }
  private async searchTrace(): Promise<void> {
    if (this.searchAccountTrace) {
      this.treeData = { nodes: [], links: [] };
      const searchAccountTrace = this.searchAccountTrace.trim();
      // the checksum of the hash
      const accountId = hexToBytes(searchAccountTrace.trim());
      const data = {
        id: '0',
        name: searchAccountTrace.trim(),
        category: 0,
        symbolSize: 50
        // label: {
        //   show: true
        // }
      };
      this.treeData.nodes.push(data);
      this.treeDataAccount = [searchAccountTrace];
      if (validatePrincipal(searchAccountTrace)) {
        const res = await this.getCachedAddress(
          principalToAccount(Principal.from(searchAccountTrace)),
          data
        );
        console.log(res);
        let account: Array<{
          node: GraphNodeItemOption;
          account: ChainAccount;
        }> = [];
        let currentId = Number(
          this.treeData.nodes[this.treeData.nodes.length - 1].id
        );
        res.address.forEach((item) => {
          const id = ++currentId;
          const data = {
            id: id.toString(10),
            name: item[2],
            category: res.node.category,
            symbolSize: Number(res.node.symbolSize) / 2
            // label: {
            //   show: true
            // }
          };
          const link = {
            target: id.toString(10),
            source: res.node.id
          };
          this.treeData.nodes.push(data);
          this.treeData.links.push(link);
          account.push({ node: data, account: item });
        });
        this.getMoreAddress(account);
      } else if (
        Buffer.from(
          calculateCrc32(new Uint8Array(accountId.slice(4)))
        ).toString('hex') === Buffer.from(accountId.slice(0, 4)).toString('hex')
      ) {
        // accountId
        const res = await this.getCachedAddress(accountId, data);
        console.log(res);
        // await this.setCachedAccountChild(res, data);
        this.loadChart(true);
      } else if (isAddress(searchAccountTrace)) {
        // const res = await this.getCachedAccount(searchAccountTrace, data);
        // console.log(res);
        // await this.setCachedAddressChild(res, data);
        this.loadChart(true);
      } else {
        // txHash
        const res = await this.getCachedTxAccount(searchAccountTrace);
        console.log(res);
        this.loadChart(true);
      }
    }
  }
  private async getCachedAddress(
    accountId: Array<number>,
    node: GraphNodeItemOption
  ): Promise<{ node: GraphNodeItemOption; address: Array<ChainAccount> }> {
    const res = await this.icETHMinterService.getCachedAddress(accountId);
    if (
      !this.treeDataAccount.includes(toHexString(new Uint8Array(accountId)))
    ) {
      this.treeDataAccount.push(toHexString(new Uint8Array(accountId)));
    } else {
      return null;
    }
    if (res && res.length) {
      // if (node) {
      //   const id = Number(node.category) + 1;
      //   res[0].forEach((item, index) => {
      //     const currentId = id + index;
      //     const data = {
      //       id: currentId.toString(10),
      //       name: item[2],
      //       category: id,
      //       symbolSize: Number(node.symbolSize) / 2
      //     };
      //     const link = {
      //       target: currentId.toString(10),
      //       source: node.category.toString(10)
      //     };
      //     this.treeData.nodes.push(data);
      //     this.treeData.links.push(link);
      //   });
      // }
      return {
        node: node,
        address: res[0]
      };
    }
    return null;
  }
  private async getCachedTxAccount(
    txHash: string
  ): Promise<Array<[ChainAccount, Icrc1Account]>> {
    const res = await this.icETHMinterService.getCachedTxAccount(txHash);
    if (res && res.length) {
      return res[0];
    }
    return [];
  }
  private searchAll(): void {
    this.searchAccount = '';
    this.showAccountEvents = false;
    this.accountPage = 1;
    this.getEvents();
  }
  private search(): void {
    if (this.searchAccount.trim()) {
      const accountId = toAccountId(this.searchAccount.trim());
      console.log(accountId);
      if (accountId) {
        this.showAccountEvents = true;
        this.page = 1;
        this.accountEvents = [];
        this.getAccountEvents(accountId);
      } else {
        this.$message.error('Invalid accountId.');
      }
    } else {
      this.showAccountEvents = false;
      this.accountPage = 1;
      this.getEvents();
    }
  }
  private arrayToHexString = (val: Array<number>): string => {
    if (val && val.length) {
      return toHexString(new Uint8Array(val));
    }
    return '';
  };
  private onCopy(): void {
    this.$message.success('Copied');
  }
}
</script>

<style scoped lang="scss">
.search-group {
  display: flex !important;
  align-items: center;
  justify-content: center;
  width: 350px;
  margin: 0 0 20px auto;
  ::v-deep input {
    height: 44px !important;
  }
  button {
    line-height: 1.499;
    position: relative;
    display: inline-block;
    height: 44px;
    font-weight: 400;
    white-space: nowrap;
    text-align: center;
    background-image: none;
    outline: 0;
    padding: 0 15px;
    color: #fff;
    background-color: #1890ff;
    border: none;
    text-shadow: none;
    box-shadow: none;
  }
  .search-account {
    width: 300px;
  }
}
.search-group-trace {
  width: 500px;
  margin: 0 auto 20px;
  .search-account {
    width: 450px;
  }
}
.integration-event {
  margin-top: 40px;
  background: #fff;
  line-height: 20px;
  box-shadow: 0 2px 4px 0 rgba(0, 140, 238, 0.05);
  border-radius: 4px;
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
.transactions-pagination-bottom {
  display: flex;
  .transactions-pagination {
    margin: 15px 0 15px auto;
  }
}
#trace-tree {
  width: 100%;
  height: calc(100vh - 400px);
  min-height: 500px;
}
::v-deep .ic-tokens-select {
  width: 450px;
}
</style>
