<template>
  <div class="integration-main main-width">
    <div class="tx-main">
      <div class="tx-item">
        <div class="tx-item-left">TokenId:</div>
        <div class="tx-item-right" v-if="tokenId">
          <router-link :to="`/token/${tokenId}`">{{ tokenId }}</router-link
          ><span class="span-nbsp"></span>
          <a-icon
            style="cursor: pointer !important"
            type="copy"
            v-clipboard:copy="tokenId"
            v-clipboard:success="onCopy"
          />
        </div>
      </div>
      <div class="tx-item">
        <div class="tx-item-left">Name:</div>
        <div class="tx-item-right" v-if="tokenId && tokens[tokenId]">
          {{ tokens[tokenId].name }}
        </div>
      </div>
      <div class="tx-item">
        <div class="tx-item-left">Symbol:</div>
        <div class="tx-item-right" v-if="tokenId && tokens[tokenId]">
          {{ tokens[tokenId].symbol }}
        </div>
      </div>
      <div class="tx-item">
        <div class="tx-item-left">Total Supply:</div>
        <div class="tx-item-right" v-if="tokens && tokenId && tokens[tokenId]">
          {{
            tokens[tokenId].totalSupply |
              bigintToFloat(
                tokens[tokenId].decimals,
                tokens[tokenId].decimals
              ) |
              formatNum
          }}
        </div>
      </div>
    </div>
    <div class="integration-event">
      <a-tabs :active-key="activeKey" @change="changeTab">
        <a-tab-pane key="Activities" tab="Activities">
          <div class="a-tab-content a-tab-content-activities">
            <a-spin :spinning="loading">
              <form @submit.prevent="">
                <a-input-group class="search-group" compact>
                  <a-input
                    v-model="searchAccount"
                    type="text"
                    @pressEnter="search"
                    allow-clear
                    placeholder="AccountId/Principal"
                    class="search-account"
                    name="icBTCSearchAccountId"
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
                  <tr v-for="item in data" :key="item[0].toString(10)">
                    <td class="table-index">{{ item[0].toString(10) }}</td>
                    <td class="table-time">{{ Object.keys(item[1][0])[0] }}</td>
                    <td style="word-break: break-all">
                      <div
                        v-if="Object.keys(item[1][0])[0] === 'received_utxos'"
                      >
                        <div>
                          <span>deposit_address: </span>
                          <a
                            :href="`https://www.blockchain.com/explorer/addresses/btc/${
                              Object.values(item[1][0])[0].deposit_address
                            }`"
                            target="_blank"
                            >{{
                              Object.values(item[1][0])[0].deposit_address
                            }}</a
                          >
                        </div>
                        <div>
                          <span>to_account: </span>
                          {
                          <a
                            :href="`https://ic.house/address/3fwop-7iaaa-aaaak-adzca-cai/${Object.values(
                              item[1][0]
                            )[0].to_account.owner.toString()}.${arrayToHexString(
                              Object.values(item[1][0])[0].to_account
                                .subaccount[0]
                            )}`"
                            target="_blank"
                          >
                            owner:
                            {{
                              Object.values(
                                item[1][0]
                              )[0].to_account.owner.toString()
                            }}, subaccount:
                            {{
                              arrayToHexString(
                                Object.values(item[1][0])[0].to_account
                                  .subaccount[0]
                              )
                            }}
                          </a>
                          }
                        </div>
                        <div>
                          amount:
                          {{
                            Object.values(item[1][0])[0].amount |
                              bigintToFloat(8, 8)
                          }}
                          icBTC
                        </div>
                        <div>
                          total_fee:
                          {{
                            Object.values(item[1][0])[0].total_fee |
                              bigintToFloat(8, 8)
                          }}
                          icBTC
                        </div>
                        <div>
                          utxos: {
                          <span
                            v-for="(item, index) in Object.values(item[1][0])[0]
                              .utxos"
                            :key="index"
                          >
                            height: {{ item.height.toString(10) }}, value:
                            {{ item.value | bigintToFloat(8, 8) }}, outpoint: {
                            txid:
                            <a
                              :href="`https://www.blockchain.com/explorer/transactions/btc/${btcTxid(
                                item.outpoint.txid
                              )}`"
                              target="_blank"
                              >{{ btcTxid(item.outpoint.txid) }}</a
                            >, vout: {{ item.outpoint.vout.toString(10) }} }
                          </span>
                          }
                        </div>
                      </div>
                      <div
                        v-if="Object.keys(item[1][0])[0] === 'sent_transaction'"
                      >
                        <div>
                          txid:
                          <a
                            :href="`https://www.blockchain.com/explorer/transactions/btc/${
                              Object.values(item[1][0])[0].txid
                            }`"
                            target="_blank"
                            >{{ Object.values(item[1][0])[0].txid }}</a
                          >
                        </div>
                        <div>
                          address:
                          <a
                            :href="`https://www.blockchain.com/explorer/addresses/btc/${
                              Object.values(item[1][0])[0].address
                            }`"
                            target="_blank"
                            >{{ Object.values(item[1][0])[0].address }}</a
                          >
                        </div>
                        <div>
                          account: {
                          <a
                            :href="`https://ic.house/address/3fwop-7iaaa-aaaak-adzca-cai/${Object.values(
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
                                Object.values(item[1][0])[0].account
                                  .subaccount[0]
                              )
                            }}
                          </a>
                          }
                        </div>
                        <div>
                          retrieveAccount: {
                          <a
                            :href="`https://ic.house/address/3fwop-7iaaa-aaaak-adzca-cai/${Object.values(
                              item[1][0]
                            )[0].retrieveAccount.owner.toString()}.${arrayToHexString(
                              Object.values(item[1][0])[0].retrieveAccount
                                .subaccount[0]
                            )}`"
                            target="_blank"
                          >
                            owner:
                            {{
                              Object.values(
                                item[1][0]
                              )[0].retrieveAccount.owner.toString()
                            }}, subaccount:
                            {{
                              arrayToHexString(
                                Object.values(item[1][0])[0].retrieveAccount
                                  .subaccount[0]
                              )
                            }}
                          </a>
                          }
                        </div>
                        <div>
                          requests:
                          {{
                            Object.values(item[1][0])[0].requests | filterJson
                          }}
                        </div>
                        <div>
                          utxos: {
                          <span
                            v-for="(item, index) in Object.values(item[1][0])[0]
                              .utxos"
                            :key="index"
                          >
                            height: {{ item.height.toString(10) }}, value:
                            {{ item.value | bigintToFloat(8, 8) }}, outpoint: {
                            txid:
                            <a
                              :href="`https://www.blockchain.com/explorer/transactions/btc/${btcTxid(
                                item.outpoint.txid
                              )}`"
                              target="_blank"
                              >{{ btcTxid(item.outpoint.txid) }}</a
                            >, vout: {{ item.outpoint.vout.toString(10) }} }
                          </span>
                          }
                        </div>
                        <div>
                          change_output: {
                          <span
                            v-if="
                              Object.values(item[1][0])[0].change_output.length
                            "
                            >value:
                            {{
                              Object.values(item[1][0])[0].change_output[0]
                                .value | bigintToFloat(8, 8)
                            }}, vout:
                            {{
                              Object.values(item[1][0])[0].change_output[0].vout
                            }}
                            }
                          </span>
                          <span
                            v-if="
                              !Object.values(item[1][0])[0].change_output.length
                            "
                            >value: -, vout: -</span
                          >
                        </div>
                      </div>
                      <div v-if="Object.keys(item[1][0])[0] === 'burn'">
                        <div>
                          tokenBlockIndex:
                          {{
                            Object.values(
                              item[1][0]
                            )[0].tokenBlockIndex.toString(10)
                          }}
                        </div>
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
                            :href="`https://ic.house/address/3fwop-7iaaa-aaaak-adzca-cai/${Object.values(
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
                                Object.values(item[1][0])[0].account
                                  .subaccount[0]
                              )
                            }}
                          </a>
                          }
                        </div>
                        <div>
                          address:
                          <a
                            v-if="Object.values(item[1][0])[0].address"
                            :href="`https://www.blockchain.com/explorer/addresses/btc/${
                              Object.values(item[1][0])[0].address
                            }`"
                            target="_blank"
                            >{{ Object.values(item[1][0])[0].address }}</a
                          >
                          <span v-if="!Object.values(item[1][0])[0].address"
                            >-</span
                          >
                        </div>
                        <div>
                          amount:
                          {{
                            Object.values(item[1][0])[0].amount |
                              bigintToFloat(8, 8)
                          }}
                          icBTC
                        </div>
                        <div
                          v-if="
                            Object.values(item[1][0])[0].toid &&
                            Object.values(item[1][0])[0].toid.length
                          "
                        >
                          toid:
                          <a
                            :href="`https://cmqwp-uiaaa-aaaaj-aihzq-cai.raw.ic0.app/saga/TO/36tsk-fqaaa-aaaak-adzaq-cai/${
                              Object.values(item[1][0])[0].toid[0]
                            }`"
                            target="_blank"
                            >{{ Object.values(item[1][0])[0].toid[0] }}</a
                          >
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
                            :href="`https://ic.house/address/3fwop-7iaaa-aaaak-adzca-cai/${Object.values(
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
                                Object.values(item[1][0])[0].account
                                  .subaccount[0]
                              )
                            }}
                          </a>
                          }
                        </div>
                        <div>
                          address:
                          <a
                            v-if="Object.values(item[1][0])[0].address"
                            :href="`https://www.blockchain.com/explorer/addresses/btc/${
                              Object.values(item[1][0])[0].address
                            }`"
                            target="_blank"
                            >{{ Object.values(item[1][0])[0].address }}</a
                          >
                          <span v-if="!Object.values(item[1][0])[0].address"
                            >-</span
                          >
                        </div>
                        <div>
                          amount:
                          {{
                            Object.values(item[1][0])[0].amount |
                              bigintToFloat(8, 8)
                          }}
                          icBTC
                        </div>
                        <div
                          v-if="
                            Object.values(item[1][0])[0].toid &&
                            Object.values(item[1][0])[0].toid.length
                          "
                        >
                          toid:
                          <a
                            :href="`https://cmqwp-uiaaa-aaaaj-aihzq-cai.raw.ic0.app/saga/TO/36tsk-fqaaa-aaaak-adzaq-cai/${
                              Object.values(item[1][0])[0].toid[0]
                            }`"
                            target="_blank"
                            >{{ Object.values(item[1][0])[0].toid[0] }}</a
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
                            :href="`https://ic.house/address/3fwop-7iaaa-aaaak-adzca-cai/${Object.values(
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
                        <div>
                          amount:
                          {{
                            Object.values(item[1][0])[0].amount |
                              bigintToFloat(8, 8)
                          }}
                          icBTC
                        </div>
                        <div
                          v-if="
                            Object.values(item[1][0])[0].toid &&
                            Object.values(item[1][0])[0].toid.length
                          "
                        >
                          toid:
                          <a
                            :href="`https://cmqwp-uiaaa-aaaaj-aihzq-cai.raw.ic0.app/saga/TO/36tsk-fqaaa-aaaak-adzaq-cai/${
                              Object.values(item[1][0])[0].toid[0]
                            }`"
                            target="_blank"
                            >{{ Object.values(item[1][0])[0].toid[0] }}</a
                          >
                        </div>
                      </div>
                      <div v-if="Object.keys(item[1][0])[0] === 'changeOwner'">
                        newOwner:
                        {{ Object.values(item[1][0])[0].newOwner.toString() }}
                      </div>
                      <div
                        v-if="
                          Object.keys(item[1][0])[0] ===
                          'accepted_retrieve_btc_request'
                        "
                      >
                        <div>txi: {{ Object.values(item[1][0])[0].txi }}</div>
                        <div>
                          icrc1_burned_txid:
                          {{ Object.values(item[1][0])[0].icrc1_burned_txid }}
                        </div>
                        <div>
                          account: {
                          <a
                            :href="`https://ic.house/address/3fwop-7iaaa-aaaak-adzca-cai/${Object.values(
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
                                Object.values(item[1][0])[0].account
                                  .subaccount[0]
                              )
                            }}
                          </a>
                          }
                        </div>
                        <div>
                          address:
                          <a
                            v-if="Object.values(item[1][0])[0].address"
                            :href="`https://www.blockchain.com/explorer/addresses/btc/${
                              Object.values(item[1][0])[0].address
                            }`"
                            target="_blank"
                            >{{ Object.values(item[1][0])[0].address }}</a
                          >
                          <span v-if="!Object.values(item[1][0])[0].address"
                            >-</span
                          >
                        </div>
                        <div>
                          amount:
                          {{
                            Object.values(item[1][0])[0].amount |
                              bigintToFloat(8, 8)
                          }}
                          icBTC
                        </div>
                        <div>
                          total_fee:
                          {{
                            Object.values(item[1][0])[0].total_fee |
                              bigintToFloat(8, 8)
                          }}
                          icBTC
                        </div>
                      </div>
                      <div v-if="Object.keys(item[1][0])[0] === 'start'">
                        message: {{ Object.values(item[1][0])[0].message }}
                      </div>
                      <div
                        v-if="Object.keys(item[1][0])[0] === 'initOrUpgrade'"
                      >
                        initArgs:
                        {{ Object.values(item[1][0])[0].initArgs | filterJson }}
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
                      (accountPage.currentPage - 1) * accountPage.pageSize,
                      accountPage.currentPage * accountPage.pageSize
                    )"
                    :key="index"
                  >
                    <td class="table-time">{{ Object.keys(item[0])[0] }}</td>
                    <td style="word-break: break-all">
                      <div v-if="Object.keys(item[0])[0] === 'received_utxos'">
                        <div>
                          <span>deposit_address: </span>
                          <a
                            :href="`https://www.blockchain.com/explorer/addresses/btc/${
                              Object.values(item[0])[0].deposit_address
                            }`"
                            target="_blank"
                            >{{ Object.values(item[0])[0].deposit_address }}</a
                          >
                        </div>
                        <div>
                          <span>to_account: </span>
                          {
                          <a
                            :href="`https://ic.house/address/3fwop-7iaaa-aaaak-adzca-cai/${Object.values(
                              item[0]
                            )[0].to_account.owner.toString()}.${arrayToHexString(
                              Object.values(item[0])[0].to_account.subaccount[0]
                            )}`"
                            target="_blank"
                          >
                            owner:
                            {{
                              Object.values(
                                item[0]
                              )[0].to_account.owner.toString()
                            }}, subaccount:
                            {{
                              arrayToHexString(
                                Object.values(item[0])[0].to_account
                                  .subaccount[0]
                              )
                            }}
                          </a>
                          }
                        </div>
                        <div>
                          amount:
                          {{
                            Object.values(item[0])[0].amount |
                              bigintToFloat(8, 8)
                          }}
                          icBTC
                        </div>
                        <div>
                          total_fee:
                          {{
                            Object.values(item[0])[0].total_fee |
                              bigintToFloat(8, 8)
                          }}
                          icBTC
                        </div>
                        <div>
                          utxos: {
                          <span
                            v-for="(item, index) in Object.values(item[0])[0]
                              .utxos"
                            :key="index"
                          >
                            height: {{ item.height.toString(10) }}, value:
                            {{ item.value | bigintToFloat(8, 8) }}, outpoint: {
                            txid:
                            <a
                              :href="`https://www.blockchain.com/explorer/transactions/btc/${btcTxid(
                                item.outpoint.txid
                              )}`"
                              target="_blank"
                              >{{ btcTxid(item.outpoint.txid) }}</a
                            >, vout: {{ item.outpoint.vout.toString(10) }} }
                          </span>
                          }
                        </div>
                      </div>
                      <div
                        v-if="Object.keys(item[0])[0] === 'sent_transaction'"
                      >
                        <div>
                          txid:
                          <a
                            :href="`https://www.blockchain.com/explorer/transactions/btc/${
                              Object.values(item[0])[0].txid
                            }`"
                            target="_blank"
                            >{{ Object.values(item[0])[0].txid }}</a
                          >
                        </div>
                        <div>
                          address:
                          <a
                            :href="`https://www.blockchain.com/explorer/addresses/btc/${
                              Object.values(item[0])[0].address
                            }`"
                            target="_blank"
                            >{{ Object.values(item[0])[0].address }}</a
                          >
                        </div>
                        <div>
                          account: {
                          <a
                            :href="`https://ic.house/address/3fwop-7iaaa-aaaak-adzca-cai/${Object.values(
                              item[0]
                            )[0].account.owner.toString()}.${arrayToHexString(
                              Object.values(item[0])[0].account.subaccount[0]
                            )}`"
                            target="_blank"
                          >
                            owner:
                            {{
                              Object.values(
                                item[0]
                              )[0].account.owner.toString()
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
                          retrieveAccount: {
                          <a
                            :href="`https://ic.house/address/3fwop-7iaaa-aaaak-adzca-cai/${Object.values(
                              item[0]
                            )[0].retrieveAccount.owner.toString()}.${arrayToHexString(
                              Object.values(item[0])[0].retrieveAccount
                                .subaccount[0]
                            )}`"
                            target="_blank"
                          >
                            owner:
                            {{
                              Object.values(
                                item[0]
                              )[0].retrieveAccount.owner.toString()
                            }}, subaccount:
                            {{
                              arrayToHexString(
                                Object.values(item[0])[0].retrieveAccount
                                  .subaccount[0]
                              )
                            }}
                          </a>
                          }
                        </div>
                        <div>
                          requests:
                          {{ Object.values(item[0])[0].requests | filterJson }}
                        </div>
                        <div>
                          utxos: {
                          <span
                            v-for="(item, index) in Object.values(item[0])[0]
                              .utxos"
                            :key="index"
                          >
                            height: {{ item.height.toString(10) }}, value:
                            {{ item.value | bigintToFloat(8, 8) }}, outpoint: {
                            txid:
                            <a
                              :href="`https://www.blockchain.com/explorer/transactions/btc/${btcTxid(
                                item.outpoint.txid
                              )}`"
                              target="_blank"
                              >{{ btcTxid(item.outpoint.txid) }}</a
                            >, vout: {{ item.outpoint.vout.toString(10) }} }
                          </span>
                          }
                        </div>
                        <div>
                          change_output: {
                          <span
                            v-if="
                              Object.values(item[0])[0].change_output.length
                            "
                            >value:
                            {{
                              Object.values(item[0])[0].change_output[0].value |
                                bigintToFloat(8, 8)
                            }}, vout:
                            {{
                              Object.values(item[0])[0].change_output[0].vout
                            }}
                            }
                          </span>
                          <span
                            v-if="
                              !Object.values(item[0])[0].change_output.length
                            "
                            >value: -, vout: -</span
                          >
                        </div>
                      </div>
                      <div v-if="Object.keys(item[0])[0] === 'burn'">
                        <div>
                          tokenBlockIndex:
                          {{
                            Object.values(item[0])[0].tokenBlockIndex.toString(
                              10
                            )
                          }}
                        </div>
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
                            :href="`https://ic.house/address/3fwop-7iaaa-aaaak-adzca-cai/${Object.values(
                              item[0]
                            )[0].account.owner.toString()}.${arrayToHexString(
                              Object.values(item[0])[0].account.subaccount[0]
                            )}`"
                            target="_blank"
                          >
                            owner:
                            {{
                              Object.values(
                                item[0]
                              )[0].account.owner.toString()
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
                            :href="`https://www.blockchain.com/explorer/addresses/btc/${
                              Object.values(item[0])[0].address
                            }`"
                            target="_blank"
                            >{{ Object.values(item[0])[0].address }}</a
                          >
                          <span v-if="!Object.values(item[0])[0].address"
                            >-</span
                          >
                        </div>
                        <div>
                          amount:
                          {{
                            Object.values(item[0])[0].amount |
                              bigintToFloat(8, 8)
                          }}
                          icBTC
                        </div>
                        <div
                          v-if="
                            Object.values(item[0])[0].toid &&
                            Object.values(item[0])[0].toid.length
                          "
                        >
                          toid:
                          <a
                            :href="`https://cmqwp-uiaaa-aaaaj-aihzq-cai.raw.ic0.app/saga/TO/36tsk-fqaaa-aaaak-adzaq-cai/${
                              Object.values(item[0])[0].toid[0]
                            }`"
                            target="_blank"
                            >{{ Object.values(item[0])[0].toid[0] }}</a
                          >
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
                            :href="`https://ic.house/address/3fwop-7iaaa-aaaak-adzca-cai/${Object.values(
                              item[0]
                            )[0].account.owner.toString()}.${arrayToHexString(
                              Object.values(item[0])[0].account.subaccount[0]
                            )}`"
                            target="_blank"
                          >
                            owner:
                            {{
                              Object.values(
                                item[0]
                              )[0].account.owner.toString()
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
                            :href="`https://www.blockchain.com/explorer/addresses/btc/${
                              Object.values(item[0])[0].address
                            }`"
                            target="_blank"
                            >{{ Object.values(item[0])[0].address }}</a
                          >
                          <span v-if="!Object.values(item[0])[0].address"
                            >-</span
                          >
                        </div>
                        <div>
                          amount:
                          {{
                            Object.values(item[0])[0].amount |
                              bigintToFloat(8, 8)
                          }}
                          icBTC
                        </div>
                        <div
                          v-if="
                            Object.values(item[0])[0].toid &&
                            Object.values(item[0])[0].toid.length
                          "
                        >
                          toid:
                          <a
                            :href="`https://cmqwp-uiaaa-aaaaj-aihzq-cai.raw.ic0.app/saga/TO/36tsk-fqaaa-aaaak-adzaq-cai/${
                              Object.values(item[0])[0].toid[0]
                            }`"
                            target="_blank"
                            >{{ Object.values(item[0])[0].toid[0] }}</a
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
                            :href="`https://ic.house/address/3fwop-7iaaa-aaaak-adzca-cai/${Object.values(
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
                        <div>
                          amount:
                          {{
                            Object.values(item[0])[0].amount |
                              bigintToFloat(8, 8)
                          }}
                          icBTC
                        </div>
                        <div
                          v-if="
                            Object.values(item[0])[0].toid &&
                            Object.values(item[0])[0].toid.length
                          "
                        >
                          toid:
                          <a
                            :href="`https://cmqwp-uiaaa-aaaaj-aihzq-cai.raw.ic0.app/saga/TO/36tsk-fqaaa-aaaak-adzaq-cai/${
                              Object.values(item[0])[0].toid[0]
                            }`"
                            target="_blank"
                            >{{ Object.values(item[0])[0].toid[0] }}</a
                          >
                        </div>
                      </div>
                      <div v-if="Object.keys(item[0])[0] === 'changeOwner'">
                        newOwner:
                        {{ Object.values(item[0])[0].newOwner.toString() }}
                      </div>
                      <div
                        v-if="
                          Object.keys(item[0])[0] ===
                          'accepted_retrieve_btc_request'
                        "
                      >
                        <div>txi: {{ Object.values(item[0])[0].txi }}</div>
                        <div>
                          icrc1_burned_txid:
                          {{ Object.values(item[0])[0].icrc1_burned_txid }}
                        </div>
                        <div>
                          account: {
                          <a
                            :href="`https://ic.house/address/3fwop-7iaaa-aaaak-adzca-cai/${Object.values(
                              item[0]
                            )[0].account.owner.toString()}.${arrayToHexString(
                              Object.values(item[0])[0].account.subaccount[0]
                            )}`"
                            target="_blank"
                          >
                            owner:
                            {{
                              Object.values(
                                item[0]
                              )[0].account.owner.toString()
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
                            :href="`https://www.blockchain.com/explorer/addresses/btc/${
                              Object.values(item[0])[0].address
                            }`"
                            target="_blank"
                            >{{ Object.values(item[0])[0].address }}</a
                          >
                          <span v-if="!Object.values(item[0])[0].address"
                            >-</span
                          >
                        </div>
                        <div>
                          amount:
                          {{
                            Object.values(item[0])[0].amount |
                              bigintToFloat(8, 8)
                          }}
                          icBTC
                        </div>
                        <div>
                          total_fee:
                          {{
                            Object.values(item[0])[0].total_fee |
                              bigintToFloat(8, 8)
                          }}
                          icBTC
                        </div>
                      </div>
                      <div v-if="Object.keys(item[0])[0] === 'start'">
                        message: {{ Object.values(item[0])[0].message }}
                      </div>
                      <div v-if="Object.keys(item[0])[0] === 'initOrUpgrade'">
                        initArgs:
                        {{ Object.values(item[0])[0].initArgs | filterJson }}
                      </div>
                      <div v-if="Object.keys(item[0])[0] === 'config'">
                        {{ Object.values(item[0])[0] | filterJson }}
                      </div>
                      <div v-if="Object.keys(item[0])[0] === 'suspend'">
                        {{ Object.values(item[0])[0] | filterJson }}
                      </div>
                    </td>
                    <td class="table-time">
                      {{ item[0][1] | formatDateFromSecondUTC }}
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
                v-show="showAccountEvents"
                class="transactions-pagination-bottom"
              >
                <a-pagination
                  v-if="accountPage.total > accountPage.pageSize"
                  class="transactions-pagination"
                  v-model="accountPage.currentPage"
                  :total="accountPage.total"
                  :defaultPageSize="accountPage.pageSize"
                  :showQuickJumper="true"
                  @change="accountPageChange"
                />
              </div>
              <div
                v-show="!showAccountEvents"
                class="transactions-pagination-bottom"
              >
                <a-pagination
                  v-if="page.total > page.pageSize"
                  class="transactions-pagination"
                  v-model="page.currentPage"
                  :total="page.total"
                  :defaultPageSize="page.pageSize"
                  :showQuickJumper="true"
                  @change="pageChange"
                />
              </div>
            </a-spin>
          </div>
        </a-tab-pane>
        <a-tab-pane key="RetrieveLog" tab="Retrieve Log">
          <div class="a-tab-content a-tab-content-activities">
            <a-spin :spinning="logLoadingRetrieve">
              <form @submit.prevent="">
                <a-input-group class="search-group" compact>
                  <a-input
                    v-model="eventBlockHeight"
                    type="text"
                    @pressEnter="searchRetrieve"
                    allow-clear
                    placeholder="EventBlockHeight"
                    class="search-account"
                    :allowClear="true"
                  />
                  <button type="button" @click="searchRetrieve">
                    <a-icon type="search" />
                  </button>
                </a-input-group>
              </form>
              <table>
                <thead>
                  <tr>
                    <th>EventBlockHeight</th>
                    <th>TxIndex</th>
                    <th>BurnedBlockIndex</th>
                    <th>BtcAddress</th>
                    <th>Account</th>
                    <th>RetrieveAccount</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in logRetrieve" :key="index">
                    <td>{{ item[0].toString(10) }}</td>
                    <td>
                      {{ item[1].txIndex.toString(10) }}
                    </td>
                    <td>
                      {{ item[1].burnedBlockIndex.toString(10) }}
                    </td>
                    <td>
                      <a
                        v-if="item[1].btcAddress"
                        :href="`https://www.blockchain.com/explorer/addresses/btc/${item[1].btcAddress}`"
                        target="_blank"
                        >{{ item[1].btcAddress | ellipsis }}</a
                      >
                      <span v-if="!item[1].btcAddress">-</span>
                    </td>
                    <td>
                      <a
                        :href="`https://ic.house/address/3fwop-7iaaa-aaaak-adzca-cai/${item[1].account.owner.toString()}.${arrayToHexString(
                          item[1].account.subaccount[0]
                        )}`"
                        target="_blank"
                      >
                        <span>
                          {{ item[1].account | filterAccountId | ellipsis(10) }}
                        </span>
                      </a>
                    </td>
                    <td>
                      <a
                        :href="`https://ic.house/address/3fwop-7iaaa-aaaak-adzca-cai/${item[1].retrieveAccount.owner.toString()}.${arrayToHexString(
                          item[1].retrieveAccount.subaccount[0]
                        )}`"
                        target="_blank"
                      >
                        <span>
                          {{
                            item[1].retrieveAccount |
                              filterAccountId |
                              ellipsis(10)
                          }}
                        </span>
                      </a>
                    </td>
                    <td>{{ item[1].amount | bigintToFloat(8, 8) }} icBTC</td>
                  </tr>
                  <tr v-if="!logLoadingRetrieve && !logRetrieve.length">
                    <td colspan="7" style="text-align: center; font-size: 14px">
                      No record
                    </td>
                  </tr>
                </tbody>
              </table>
              <div class="transactions-pagination-bottom">
                <a-pagination
                  v-if="retrieveLogPage.total > retrieveLogPage.pageSize"
                  class="transactions-pagination"
                  v-model="retrieveLogPage.currentPage"
                  :total="retrieveLogPage.total"
                  :defaultPageSize="retrieveLogPage.pageSize"
                  :showQuickJumper="true"
                  @change="logRetrievePageChange"
                />
              </div>
            </a-spin>
          </div>
        </a-tab-pane>
        <a-tab-pane key="SendingLog" tab="Sending Log">
          <div class="a-tab-content a-tab-content-activities">
            <a-spin :spinning="logLoading">
              <form @submit.prevent="">
                <a-input-group class="search-group" compact>
                  <a-input
                    v-model="txIndex"
                    type="text"
                    @pressEnter="searchSending"
                    allow-clear
                    placeholder="TxIndex"
                    class="search-account"
                    :allowClear="true"
                  />
                  <button type="button" @click="searchSending">
                    <a-icon type="search" />
                  </button>
                </a-input-group>
              </form>
              <table>
                <thead>
                  <tr>
                    <th>TxIndex</th>
                    <th>Status</th>
                    <th>Destinations</th>
                    <!--<th>ScriptSigs</th>
                    <th>SignedTx</th>
                    <th>Utxos</th>-->
                    <th>TotalAmount</th>
                    <th>Fee</th>
                    <th>Toids</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in logSending" :key="index">
                    <td>
                      {{ item[0].toString(10) }}
                    </td>
                    <td>
                      <span>{{ Object.keys(item[1].status)[0] }}</span>
                      <div
                        v-if="
                          Object.keys(item[1].status)[0] === 'Confirmed' ||
                          Object.keys(item[1].status)[0] === 'Sending' ||
                          Object.keys(item[1].status)[0] === 'Submitted'
                        "
                      >
                        <a
                          :href="`https://www.blockchain.com/explorer/transactions/btc/${arrayToHexString(
                            Object.values(item[1].status)[0].txid
                          )}`"
                          target="_blank"
                        >
                          {{
                            arrayToHexString(
                              Object.values(item[1].status)[0].txid
                            ) | ellipsis(10)
                          }}
                        </a>
                      </div>
                    </td>
                    <td>
                      <div
                        v-for="(destination, destinationIndex) in item[1]
                          .destinations"
                        :key="destinationIndex"
                      >
                        <span>{{ destination[0].toString(10) }}</span>
                        <div>
                          <a
                            :href="`https://www.blockchain.com/explorer/addresses/btc/${destination[1]}`"
                            target="_blank"
                            >{{ destination[1] | ellipsis(10) }}
                          </a>
                        </div>
                        <span>{{ destination[2].toString(10) }}</span>
                      </div>
                    </td>
                    <!--<td style="word-break: break-all">
                      {{ item[1].scriptSigs | filterJson }}
                    </td>
                    <td style="word-break: break-all">
                      {{ item[1].signedTx | filterJson }}
                    </td>
                    <td style="word-break: break-all">
                      <div
                        v-for="(utxo, utxoIndex) in item[1].utxos"
                        :key="utxoIndex"
                      >
                        <div>
                          <a
                            :href="`https://www.blockchain.com/explorer/addresses/btc/${utxo[0]}`"
                            target="_blank"
                            >{{ utxo[0] | ellipsis }}
                          </a>
                        </div>
                        <div>
                          {{ arrayToHexString(utxo[1]) }}
                        </div>
                          <div>

                          </div>
                      </div>
                    </td>-->
                    <td>
                      {{ item[1].totalAmount | bigintToFloat(8, 8) }} icBTC
                    </td>
                    <td>{{ item[1].fee | bigintToFloat(8, 8) }} icBTC</td>
                    <td>
                      <div
                        v-for="toid in item[1].toids"
                        :key="toid.toString(10)"
                      >
                        <a
                          :href="`https://cmqwp-uiaaa-aaaaj-aihzq-cai.raw.ic0.app/saga/TO/36tsk-fqaaa-aaaak-adzaq-cai/${toid}`"
                          target="_blank"
                          >{{ toid }}</a
                        >
                      </div>
                    </td>
                  </tr>
                  <tr v-if="!logLoading && !logSending.length">
                    <td colspan="6" style="text-align: center; font-size: 14px">
                      No record
                    </td>
                  </tr>
                </tbody>
              </table>
              <div class="transactions-pagination-bottom">
                <a-pagination
                  v-if="logPage.total > logPage.pageSize"
                  class="transactions-pagination"
                  v-model="logPage.currentPage"
                  :total="logPage.total"
                  :defaultPageSize="logPage.pageSize"
                  :showQuickJumper="true"
                  @change="logPageChange"
                />
              </div>
            </a-spin>
          </div>
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { IcBTCMinterService } from '@/ic/ckbtcMinter/icBTCMinterService';
import { hexToBytes, toAccountId, toHexString } from '@/ic/converter';
import { Icrc1Account, TokenInfo } from '@/ic/common/icType';
import { IC_BTC_CANISTER_ID, IC_BTC_MINTER_CANISTER_ID } from '@/ic/utils';
import { getTokenInfo } from '@/ic/getTokenInfo';
import { Principal } from '@dfinity/principal';
import {
  EventBlockHeight,
  icBTCEvents,
  RetrieveStatus,
  SendingBtcStatus
} from '@/ic/ckbtcMinter/icBTCModel';

@Component({
  name: 'ckBTC',
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
    },
    filterAccountId(val: Icrc1Account): string {
      if (val) {
        let accountId = val.owner.toString();
        if (val.subaccount[0]) {
          accountId += `.${toHexString(new Uint8Array(val.subaccount[0]))}`;
        }
        return accountId;
      }
      return '';
    }
  }
})
export default class extends Vue {
  private icBTCMinterService: IcBTCMinterService = null;
  private activeKey = 'Activities';
  private tokens: { [key: string]: TokenInfo };
  private tokenId = IC_BTC_CANISTER_ID;
  private page = {
    currentPage: 1,
    pageSize: 20,
    total: 0,
    onChange: this.pageChange,
    hideOnSinglePage: true,
    showQuickJumper: true
  };
  private accountPage = {
    currentPage: 1,
    pageSize: 20,
    total: 0
  };
  private data: Array<[EventBlockHeight, icBTCEvents]> = [];
  private loading = false;
  private logLoading = false;
  private logPage = {
    currentPage: 1,
    pageSize: 20,
    total: 0
  };
  private logSending: Array<[bigint, SendingBtcStatus]> = [];
  private logLoadingRetrieve = false;
  private retrieveLogPage = {
    currentPage: 1,
    pageSize: 20,
    total: 0
  };
  private logRetrieve: Array<[bigint, RetrieveStatus]> = [];
  private searchAccount = '';
  private eventBlockHeight = '';
  private txIndex = '';
  private showAccountEvents = false;
  private accountEvents: Array<icBTCEvents> = [];
  created(): void {
    this.icBTCMinterService = new IcBTCMinterService(
      'https://ic0.app/',
      IC_BTC_MINTER_CANISTER_ID
    );
    this.tokens = JSON.parse(localStorage.getItem('tokens')) || {};
    console.log(this.tokens);
    getTokenInfo(Principal.fromText(this.tokenId)).then(async (tokenInfo) => {
      this.tokens[this.tokenId] = tokenInfo;
      this.$forceUpdate();
    });
    this.getEvent();
  }
  private async getEvent(): Promise<void> {
    this.loading = true;
    const res = await this.icBTCMinterService.getEvents(
      [BigInt(this.page.currentPage)],
      [BigInt(this.page.pageSize)]
    );
    console.log(res);
    if (res) {
      this.data = res.data;
      this.page.total = Number(res.total);
    }
    this.loading = false;
  }
  private async getAccountEvents(accountId: string): Promise<void> {
    this.loading = true;
    const res = await this.icBTCMinterService.getAccountEvents(
      hexToBytes(accountId)
    );
    if (res) {
      this.accountEvents = res;
      this.accountPage.total = this.accountEvents.length;
    } else {
      this.accountEvents = [];
      this.accountPage.total = 0;
    }
    this.loading = false;
  }
  private search(): void {
    if (this.searchAccount.trim()) {
      const accountId = toAccountId(this.searchAccount.trim());
      console.log(accountId);
      if (accountId) {
        this.showAccountEvents = true;
        this.accountPage.currentPage = 1;
        this.getAccountEvents(accountId);
      } else {
        this.$message.error('Invalid accountId.');
      }
    } else {
      this.showAccountEvents = false;
      this.page.currentPage = 1;
      this.getEvent();
    }
  }
  private accountPageChange(page: number): void {
    this.accountPage.currentPage = page;
  }
  private pageChange(): void {
    this.getEvent();
  }
  private logPageChange(): void {
    this.getSendingLog();
  }
  private logRetrievePageChange(): void {
    this.getRetrieveLog();
  }
  private onCopy(): void {
    this.$message.success('Copied');
  }
  private changeTab(activeKey: string) {
    console.log(activeKey);
    this.activeKey = activeKey;
    if (activeKey === 'Activities') {
      this.showAccountEvents = false;
      this.page.currentPage = 1;
      this.getEvent();
    } else if (activeKey === 'SendingLog') {
      this.logPage.currentPage = 1;
      this.logPage.total = 0;
      this.txIndex = '';
      this.getSendingLog();
    } else if (activeKey === 'RetrieveLog') {
      this.retrieveLogPage.currentPage = 1;
      this.retrieveLogPage.total = 0;
      this.eventBlockHeight = '';
      this.getRetrieveLog();
    }
  }
  private searchRetrieve(): void {
    this.retrieveLogPage.currentPage = 1;
    this.retrieveLogPage.total = 0;
    if (this.eventBlockHeight) {
      this.retrieveLog();
    } else {
      this.getRetrieveLog();
    }
  }
  private searchSending(): void {
    this.logPage.currentPage = 1;
    this.logPage.total = 0;
    if (this.txIndex) {
      this.sendingLog();
    } else {
      this.getSendingLog();
    }
  }
  private async retrieveLog(): Promise<void> {
    this.logLoadingRetrieve = true;
    const res = await this.icBTCMinterService.retrieveLog([
      BigInt(this.eventBlockHeight)
    ]);
    if (res && res.length) {
      this.logRetrieve = [[BigInt(this.eventBlockHeight), res[0]]];
      this.retrieveLogPage.total = 1;
    } else {
      this.logRetrieve = [];
      this.retrieveLogPage.total = 0;
    }
    this.logLoadingRetrieve = false;
  }
  private async getRetrieveLog(): Promise<void> {
    this.logLoadingRetrieve = true;
    const res = await this.icBTCMinterService.retrievalLogList(
      [BigInt(this.retrieveLogPage.currentPage)],
      [BigInt(this.retrieveLogPage.pageSize)]
    );
    console.log(res);
    if (res) {
      this.logRetrieve = res.data;
      this.retrieveLogPage.total = Number(res.total);
    } else {
      this.logRetrieve = [];
      this.retrieveLogPage.total = 0;
    }
    this.logLoadingRetrieve = false;
  }
  private async sendingLog(): Promise<void> {
    this.logLoading = true;
    const res = await this.icBTCMinterService.sendingLog([
      BigInt(this.txIndex)
    ]);
    console.log(res);
    if (res && res.length) {
      this.logSending = [[BigInt(this.txIndex), res[0]]];
      this.logPage.total = 1;
    } else {
      this.logSending = [];
      this.logPage.total = 0;
    }
    this.logLoading = false;
  }
  private async getSendingLog(): Promise<void> {
    this.logLoading = true;
    const res = await this.icBTCMinterService.sendingLogList(
      [BigInt(this.logPage.currentPage)],
      [BigInt(this.logPage.pageSize)]
    );
    console.log(res);
    if (res) {
      this.logSending = res.data;
      this.logPage.total = Number(res.total);
    } else {
      this.logSending = [];
      this.logPage.total = 0;
    }
    this.logLoading = false;
  }
  private arrayToHexString = (val: Array<number>): string => {
    if (val && val.length) {
      return toHexString(new Uint8Array(val));
    }
    return '';
  };
  private btcTxid = (val: Array<number>): string => {
    const newVal = [].concat(val).reverse();
    return toHexString(new Uint8Array(newVal));
  };
}
</script>

<style scoped lang="scss">
.integration-event {
  background: #fff;
  line-height: 20px;
  box-shadow: 0 2px 4px 0 rgba(0, 140, 238, 0.05);
  border-radius: 4px;
  .a-tab-content-activities {
    ::v-deep td {
      white-space: normal;
    }
  }
  ::v-deep {
    .ant-table-body {
      overflow-x: auto;
    }
    td {
      white-space: nowrap;
    }
  }
}
.a-tab-content {
  padding: 0 15px;
}
.destinations-item {
  word-break: keep-all;
  white-space: nowrap;
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
</style>
