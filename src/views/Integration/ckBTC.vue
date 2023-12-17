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
      <a-tabs :active-key="activeKey">
        <a-tab-pane key="Activities" tab="Activities">
          <div class="a-tab-content">
            <a-table
              :locale="{
                emptyText: 'no Data'
              }"
              :columns="columns"
              :data-source="data"
              :loading="loading"
              :pagination="page"
              :rowKey="
                (record, index) => {
                  return index;
                }
              "
            >
              <div slot="Event" slot-scope="text, record">
                <div v-if="Object.keys(record)[0] === 'received_utxos'">
                  <div>
                    to_account: {
                    <a
                      :href="`https://ic.house/address/mxzaz-hqaaa-aaaar-qaada-cai/${Object.values(
                        record
                      )[0].to_account.owner.toString()}.${arrayToHexString(
                        Object.values(record)[0].to_account.subaccount[0]
                      )}`"
                      target="_blank"
                    >
                      owner:
                      {{
                        Object.values(record)[0].to_account.owner.toString()
                      }}, subaccount:
                      {{
                        arrayToHexString(
                          Object.values(record)[0].to_account.subaccount[0]
                        )
                      }}
                    </a>
                    }
                  </div>
                  <div
                    v-if="
                      Object.values(record)[0].mint_txid &&
                      Object.values(record)[0].mint_txid.length
                    "
                  >
                    mint_txid: {{ Object.values(record)[0].mint_txid[0] }}
                  </div>
                  <div>
                    utxos: {<span
                      v-for="(item, index) in Object.values(record)[0].utxos"
                      :key="index"
                    >
                      height: {{ item.height.toString(10) }}, value:
                      {{ item.value | bigintToFloat(8, 8) }}, outpoint: { txid:
                      <a
                        :href="`https://www.blockchain.com/explorer/transactions/btc/${btcTxid(
                          item.outpoint.txid
                        )}`"
                        target="_blank"
                        >{{ btcTxid(item.outpoint.txid) }}</a
                      >, vout: {{ item.outpoint.vout.toString(10) }} } </span
                    >}
                  </div>
                </div>
                <div
                  v-if="
                    Object.keys(record)[0] === 'schedule_deposit_reimbursement'
                  "
                >
                  <div>
                    burn_block_index:
                    {{ Object.values(record)[0].burn_block_index }}
                  </div>
                  <div>
                    account: {
                    <a
                      :href="`https://ic.house/address/mxzaz-hqaaa-aaaar-qaada-cai/${Object.values(
                        record
                      )[0].account.owner.toString()}.${arrayToHexString(
                        Object.values(record)[0].account.subaccount[0]
                      )}`"
                      target="_blank"
                    >
                      owner:
                      {{ Object.values(record)[0].account.owner.toString() }},
                      subaccount:
                      {{
                        arrayToHexString(
                          Object.values(record)[0].account.subaccount[0]
                        )
                      }}
                    </a>
                    }
                  </div>
                  <div>
                    amount:
                    {{ Object.values(record)[0].amount | bigintToFloat(8, 8) }}
                  </div>
                  <div>
                    reason:
                    <span
                      v-if="
                        Object.keys(Object.values(record)[0].reason)[0] ===
                        'CallFailed'
                      "
                    >
                      CallFailed
                    </span>
                    <span
                      v-if="
                        Object.keys(Object.values(record)[0].reason)[0] ===
                        'TaintedDestination'
                      "
                    >
                      { kyt_provider:
                      {{
                        Object.values(
                          Object.values(record)[0].reason
                        )[0].kyt_provider.toString()
                      }}, kyt_fee:
                      {{
                        Object.values(Object.values(record)[0].reason)[0]
                          .kyt_fee | bigintToFloat(8, 8)
                      }}
                      }
                    </span>
                  </div>
                </div>
                <div v-if="Object.keys(record)[0] === 'sent_transaction'">
                  <div>
                    txid:
                    <a
                      :href="`https://www.blockchain.com/explorer/transactions/btc/${btcTxid(
                        Object.values(record)[0].txid
                      )}`"
                      target="_blank"
                      >{{ btcTxid(Object.values(record)[0].txid) }}</a
                    >
                  </div>
                  <div>
                    utxos: {<span
                      v-for="(item, index) in Object.values(record)[0].utxos"
                      :key="index"
                    >
                      height: {{ item.height.toString(10) }}, value:
                      {{ item.value | bigintToFloat(8, 8) }}, outpoint: { txid:
                      <a
                        :href="`https://www.blockchain.com/explorer/transactions/btc/${btcTxid(
                          item.outpoint.txid
                        )}`"
                        target="_blank"
                        >{{ btcTxid(item.outpoint.txid) }}</a
                      >, vout: {{ item.outpoint.vout.toString(10) }} } </span
                    >}
                  </div>
                  <div>
                    requests:
                    <span v-if="Object.values(record)[0].requests.length">{{
                      Object.values(record)[0].requests[0] | bigintToFloat(8, 8)
                    }}</span>
                    <span v-if="!Object.values(record)[0].requests.length"
                      >0</span
                    >
                  </div>
                  <div>
                    fee:
                    <span v-if="Object.values(record)[0].fee.length">{{
                      Object.values(record)[0].fee[0] | bigintToFloat(8, 8)
                    }}</span>
                    <span v-if="!Object.values(record)[0].fee.length">0</span>
                  </div>
                  <div>
                    change_output:
                    <span v-if="Object.values(record)[0].change_output.length">
                      { value:
                      {{
                        Object.values(record)[0].change_output[0].value |
                          bigintToFloat(8, 8)
                      }}, vout:
                      {{ Object.values(record)[0].change_output[0].vout }} }
                    </span>
                    <span v-if="!Object.values(record)[0].change_output.length"
                      >-</span
                    >
                  </div>
                  <div>
                    submitted_at:
                    {{
                      Object.values(record)[0].submitted_at |
                        formatDateFromNanosecond
                    }}
                  </div>
                </div>
                <div v-if="Object.keys(record)[0] === 'distributed_kyt_fee'">
                  <div>
                    block_index: {{ Object.values(record)[0].block_index }}
                  </div>
                  <div>
                    amount:
                    {{ Object.values(record)[0].amount | bigintToFloat(8, 8) }}
                  </div>
                  <div>
                    kyt_provider:
                    {{ Object.values(record)[0].kyt_provider.toString() }}
                  </div>
                </div>
                <div v-if="Object.keys(record)[0] === 'init'">
                  <div>
                    kyt_principal:
                    <span
                      v-if="Object.values(record)[0].kyt_principal.length"
                      >{{
                        Object.values(record)[0].kyt_principal.toString()
                      }}</span
                    >
                    <span v-if="!Object.values(record)[0].kyt_principal.length"
                      >-</span
                    >
                  </div>
                  <div>
                    ecdsa_key_name:
                    {{ Object.values(record)[0].ecdsa_key_name }}
                  </div>
                  <div>
                    mode:
                    <span
                      v-if="
                        Object.keys(Object.values(record)[0].mode)[0] ===
                        'RestrictedTo'
                      "
                    >
                      { RestrictedTo:
                      <span
                        v-for="(item, index) in Object.values(record)[0].mode
                          .RestrictedTo"
                        :key="index"
                      >
                        {{ item }}
                        <span
                          v-if="
                            Object.values(record)[0].mode.RestrictedTo.length >
                            index + 1
                          "
                          >,
                        </span>
                      </span>
                      }
                    </span>
                    <span
                      v-if="
                        Object.keys(Object.values(record)[0].mode)[0] ===
                        'DepositsRestrictedTo'
                      "
                    >
                      { DepositsRestrictedTo:
                      <span
                        v-for="(item, index) in Object.values(record)[0].mode
                          .DepositsRestrictedTo"
                        :key="index"
                      >
                        {{ item }}
                        <span
                          v-if="
                            Object.values(record)[0].mode.DepositsRestrictedTo
                              .length >
                            index + 1
                          "
                          >,
                        </span>
                      </span>
                      }
                    </span>
                    <span
                      v-if="
                        Object.keys(Object.values(record)[0].mode)[0] ===
                        'ReadOnly'
                      "
                    >
                      ReadOnly
                    </span>
                    <span
                      v-if="
                        Object.keys(Object.values(record)[0].mode)[0] ===
                        'GeneralAvailability'
                      "
                    >
                      GeneralAvailability
                    </span>
                  </div>
                  <div>
                    retrieve_btc_min_amount:
                    {{
                      Object.values(record)[0].retrieve_btc_min_amount |
                        bigintToFloat(8, 8)
                    }}
                  </div>
                  <div>
                    ledger_id:
                    {{ Object.values(record)[0].ledger_id.toString() }}
                  </div>
                  <div>
                    max_time_in_queue_nanos:
                    {{ Object.values(record)[0].max_time_in_queue_nanos }}
                  </div>
                  <div>
                    btc_network:
                    {{ Object.keys(Object.values(record)[0].btc_network)[0] }}
                  </div>
                  <div>
                    min_confirmations:
                    <span
                      v-if="Object.values(record)[0].min_confirmations.length"
                    >
                      {{ Object.values(record)[0].min_confirmations[0] }}
                    </span>
                    <span
                      v-if="!Object.values(record)[0].min_confirmations.length"
                    >
                      -
                    </span>
                  </div>
                  <div>
                    kyt_fee:
                    <span v-if="Object.values(record)[0].kyt_fee.length">
                      {{
                        Object.values(record)[0].kyt_fee[0] |
                          bigintToFloat(8, 8)
                      }}
                    </span>
                    <span v-if="!Object.values(record)[0].kyt_fee.length">
                      -
                    </span>
                  </div>
                </div>
                <div v-if="Object.keys(record)[0] === 'upgrade'">
                  <div>
                    kyt_principal:
                    <span
                      v-if="Object.values(record)[0].kyt_principal.length"
                      >{{
                        Object.values(record)[0].kyt_principal.toString()
                      }}</span
                    >
                    <span v-if="!Object.values(record)[0].kyt_principal.length"
                      >-</span
                    >
                  </div>
                  <div>
                    mode:
                    <span v-if="Object.values(record)[0].mode.length">
                      <span
                        v-if="
                          Object.keys(Object.values(record)[0].mode[0])[0] ===
                          'RestrictedTo'
                        "
                      >
                        { RestrictedTo:
                        <span
                          v-for="(item, index) in Object.values(record)[0]
                            .mode[0].RestrictedTo"
                          :key="index"
                        >
                          {{ item }}
                          <span
                            v-if="
                              Object.values(record)[0].mode[0].RestrictedTo
                                .length >
                              index + 1
                            "
                            >,
                          </span>
                        </span>
                        }
                      </span>
                      <span
                        v-if="
                          Object.keys(Object.values(record)[0].mode[0])[0] ===
                          'DepositsRestrictedTo'
                        "
                      >
                        { DepositsRestrictedTo:
                        <span
                          v-for="(item, index) in Object.values(record)[0]
                            .mode[0].DepositsRestrictedTo"
                          :key="index"
                        >
                          {{ item }}
                          <span
                            v-if="
                              Object.values(record)[0].mode[0]
                                .DepositsRestrictedTo.length >
                              index + 1
                            "
                            >,
                          </span>
                        </span>
                        }
                      </span>
                      <span
                        v-if="
                          Object.keys(Object.values(record)[0].mode[0])[0] ===
                          'ReadOnly'
                        "
                      >
                        ReadOnly
                      </span>
                      <span
                        v-if="
                          Object.keys(Object.values(record)[0].mode[0])[0] ===
                          'GeneralAvailability'
                        "
                      >
                        GeneralAvailability
                      </span>
                    </span>
                    <span v-if="!Object.values(record)[0].mode.length">-</span>
                  </div>
                  <div>
                    retrieve_btc_min_amount:
                    <span
                      v-if="
                        Object.values(record)[0].retrieve_btc_min_amount.length
                      "
                    >
                      {{
                        Object.values(record)[0].retrieve_btc_min_amount[0] |
                          bigintToFloat(8, 8)
                      }}
                    </span>
                    <span
                      v-if="
                        !Object.values(record)[0].retrieve_btc_min_amount.length
                      "
                    >
                      -</span
                    >
                  </div>
                  <div>
                    max_time_in_queue_nanos:
                    <span
                      v-if="
                        Object.values(record)[0].max_time_in_queue_nanos.length
                      "
                      >{{
                        Object.values(record)[0].max_time_in_queue_nanos[0]
                      }}</span
                    >
                    <span
                      v-if="
                        !Object.values(record)[0].max_time_in_queue_nanos.length
                      "
                      >-</span
                    >
                  </div>
                  <div>
                    min_confirmations:
                    <span
                      v-if="Object.values(record)[0].min_confirmations.length"
                    >
                      {{ Object.values(record)[0].min_confirmations[0] }}
                    </span>
                    <span
                      v-if="!Object.values(record)[0].min_confirmations.length"
                    >
                      -
                    </span>
                  </div>
                  <div>
                    kyt_fee:
                    <span v-if="Object.values(record)[0].kyt_fee.length">
                      {{
                        Object.values(record)[0].kyt_fee[0] |
                          bigintToFloat(8, 8)
                      }}
                    </span>
                    <span v-if="!Object.values(record)[0].kyt_fee.length"
                      >-</span
                    >
                  </div>
                </div>
                <div
                  v-if="Object.keys(record)[0] === 'retrieve_btc_kyt_failed'"
                >
                  <div>
                    block_index: {{ Object.values(record)[0].block_index }}
                  </div>
                  <div>
                    owner: {{ Object.values(record)[0].owner.toString() }}
                  </div>
                  <div>uuid: {{ Object.values(record)[0].uuid }}</div>
                  <div>address: {{ Object.values(record)[0].address }}</div>
                  <div>
                    amount:
                    {{ Object.values(record)[0].amount | bigintToFloat(8, 8) }}
                  </div>
                  <div>
                    kyt_provider:
                    {{ Object.values(record)[0].kyt_provider.toString() }}
                  </div>
                </div>
                <div
                  v-if="
                    Object.keys(record)[0] === 'accepted_retrieve_btc_request'
                  "
                >
                  <div>
                    block_index: {{ Object.values(record)[0].block_index }}
                  </div>
                  <div>
                    address:
                    <span>
                      <a
                        :href="`https://www.blockchain.com/explorer/addresses/btc/${toBTCAddress(
                          Object.keys(Object.values(record)[0].address)[0],
                          Object.values(Object.values(record)[0].address)[0]
                        )}`"
                        target="_blank"
                      >
                        {{
                          toBTCAddress(
                            Object.keys(Object.values(record)[0].address)[0],
                            Object.values(Object.values(record)[0].address)[0]
                          )
                        }}
                      </a>
                    </span>
                  </div>
                  <div>
                    amount:
                    {{ Object.values(record)[0].amount | bigintToFloat(8, 8) }}
                  </div>
                  <div>
                    kyt_provider:
                    <span v-if="Object.values(record)[0].kyt_provider.length">
                      {{ Object.values(record)[0].kyt_provider[0].toString() }}
                    </span>
                    <span v-if="!Object.values(record)[0].kyt_provider.length">
                      -
                    </span>
                  </div>
                  <div>
                    received_at:
                    {{
                      Object.values(record)[0].received_at |
                        formatDateFromNanosecond
                    }}
                  </div>
                </div>
                <div v-if="Object.keys(record)[0] === 'checked_utxo'">
                  <div>
                    utxo: {
                    <span>
                      height:
                      {{ Object.values(record)[0].utxo.height.toString(10) }},
                      value:
                      {{
                        Object.values(record)[0].utxo.value |
                          bigintToFloat(8, 8)
                      }}, outpoint: { txid:
                      <a
                        :href="`https://www.blockchain.com/explorer/transactions/btc/${btcTxid(
                          Object.values(record)[0].utxo.outpoint.txid
                        )}`"
                        target="_blank"
                        >{{
                          btcTxid(Object.values(record)[0].utxo.outpoint.txid)
                        }} </a
                      >, vout:
                      {{
                        Object.values(record)[0].utxo.outpoint.vout.toString(10)
                      }}
                      }
                    </span>
                    }
                  </div>
                </div>
                <div
                  v-if="
                    Object.keys(record)[0] === 'removed_retrieve_btc_request'
                  "
                >
                  block_index: {{ Object.values(record)[0].block_index }}
                </div>
                <div v-if="Object.keys(record)[0] === 'confirmed_transaction'">
                  txid:
                  <a
                    :href="`https://www.blockchain.com/explorer/transactions/btc/${btcTxid(
                      Object.values(record)[0].txid
                    )}`"
                    target="_blank"
                    >{{ btcTxid(Object.values(record)[0].txid) }}
                  </a>
                </div>
                <div v-if="Object.keys(record)[0] === 'replaced_transaction'">
                  <div>
                    new_txid:
                    <a
                      :href="`https://www.blockchain.com/explorer/transactions/btc/${btcTxid(
                        Object.values(record)[0].new_txid
                      )}`"
                      target="_blank"
                      >{{ btcTxid(Object.values(record)[0].new_txid) }}
                    </a>
                  </div>
                  <div>
                    old_txid:
                    <a
                      :href="`https://www.blockchain.com/explorer/transactions/btc/${btcTxid(
                        Object.values(record)[0].old_txid
                      )}`"
                      target="_blank"
                      >{{ btcTxid(Object.values(record)[0].old_txid) }}
                    </a>
                  </div>
                  <div>
                    change_output: { value:
                    {{
                      Object.values(record)[0].change_output.value |
                        bigintToFloat(8, 8)
                    }}, vout: {{ Object.values(record)[0].change_output.vout }}
                    }
                  </div>
                  <div>
                    fee:
                    {{ Object.values(record)[0].fee | bigintToFloat(8, 8) }}
                  </div>
                  <div>
                    submitted_at:
                    {{
                      Object.values(record)[0].submitted_at |
                        formatDateFromNanosecond
                    }}
                  </div>
                </div>
                <div v-if="Object.keys(record)[0] === 'ignored_utxo'">
                  utxo: {
                  <span>
                    height:
                    {{ Object.values(record)[0].utxo.height.toString(10) }},
                    value:
                    {{
                      Object.values(record)[0].utxo.value | bigintToFloat(8, 8)
                    }}, outpoint: { txid:
                    <a
                      :href="`https://www.blockchain.com/explorer/transactions/btc/${btcTxid(
                        Object.values(record)[0].utxo.outpoint.txid
                      )}`"
                      target="_blank"
                      >{{
                        btcTxid(Object.values(record)[0].utxo.outpoint.txid)
                      }} </a
                    >, vout:
                    {{
                      Object.values(record)[0].utxo.outpoint.vout.toString(10)
                    }}
                    }
                  </span>
                  }
                </div>
              </div>
            </a-table>
          </div>
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { ckBTCMinterService } from '@/ic/ckbtcMinter/ckBTCMinterService';
import { MinterEvent } from '@/ic/ckbtcMinter/model';
import BigNumber from 'bignumber.js';
import { toHexString } from '@/ic/converter';
import { TokenInfo } from '@/ic/common/icType';
import { CK_BTC_CANISTER_ID } from '@/ic/utils';
import { getTokenInfo } from '@/ic/getTokenInfo';
import { Principal } from '@dfinity/principal';
import { bech32 } from 'bech32';
import { binary_to_base58 } from 'base58-js';
import { sha256 } from '@noble/hashes/sha256';

const defaultLength = 2000;

@Component({
  name: 'ckBTC',
  components: {}
})
export default class extends Vue {
  private ckBTCMinterService: ckBTCMinterService = null;
  private activeKey = 'Activities';
  private tokens: { [key: string]: TokenInfo };
  private tokenId = CK_BTC_CANISTER_ID;
  private page = {
    currentPage: 1,
    pageSize: 100,
    total: 0,
    onChange: this.pageChange,
    hideOnSinglePage: true,
    showQuickJumper: true
  };
  private data: Array<MinterEvent> = [];
  private loading = false;
  private columns = [
    {
      title: 'Index',
      dataIndex: 'index',
      width: '100px',
      customRender: (text, record: MinterEvent, index: number): string => {
        if (this.page.total) {
          const num = new BigNumber(this.page.total)
            .minus((this.page.currentPage - 1) * this.page.pageSize)
            .minus(index)
            .minus(1)
            .toString(10);
          if (new BigNumber(num).gte(0)) {
            return num;
          }
        }
        return null;
      }
    },
    {
      title: 'Type',
      dataIndex: 'type',
      width: '205px',
      customRender: (text, record: MinterEvent): string => {
        if (record) {
          return Object.keys(record)[0];
        }
        return null;
      }
    },
    {
      title: 'Event',
      dataIndex: 'event',
      scopedSlots: { customRender: 'Event' }
    }
  ];
  created(): void {
    this.ckBTCMinterService = new ckBTCMinterService();
    this.tokens = JSON.parse(localStorage.getItem('tokens')) || {};
    console.log(this.tokens);
    getTokenInfo(Principal.fromText(this.tokenId)).then(async (tokenInfo) => {
      this.tokens[this.tokenId] = tokenInfo;
      this.$forceUpdate();
    });
    // todo
    const start = 414000;
    const length = 1;
    this.getEvent(start, length, 'init');
  }
  private toBTCAddress(type: string, curVal: Uint8Array): string {
    const val = Array.from(curVal);
    if (type === 'p2wpkh_v0') {
      const words = bech32.toWords(val);
      return bech32.encode('bc', [0].concat(words));
    } else if (type === 'p2tr_v1') {
      const words = bech32.toWords(val);
      return bech32.encode('bc', [0].concat(words));
    } else if (type === 'p2wsh_v0') {
      const words = bech32.toWords(val);
      return bech32.encode('bc', [0].concat(words));
    } else if (type === 'p2pkh') {
      const shaObj = sha256.create();
      const s2 = shaObj.update(new Uint8Array([0x00, ...val]));
      const checksumHash = sha256.create();
      const s3 = Array.from(checksumHash.update(s2.digest()).digest());
      const s4 = [0].concat(val.concat(s3.slice(0, 4)));
      return binary_to_base58(new Uint8Array(s4));
    } else if (type === 'p2sh') {
      const shaObj = sha256.create();
      const s2 = shaObj.update(new Uint8Array([0x05, ...val]));
      const checksumHash = sha256.create();
      const s3 = Array.from(checksumHash.update(s2.digest()).digest());
      const s4 = [5].concat(val.concat(s3.slice(0, 4)));
      return binary_to_base58(new Uint8Array(s4));
    }
  }
  private btcTxid = (val: Uint8Array): string => {
    const newVal = [].concat(Array.from(val)).reverse();
    return toHexString(new Uint8Array(newVal));
  };
  private arrayToHexString = (val: Uint8Array): string => {
    if (val && val.length) {
      return toHexString(val);
    }
    return '';
  };
  private async getEvent(
    start: number,
    length: number,
    type?: string
  ): Promise<void> {
    this.loading = true;
    try {
      console.log(start, length);
      const res = await this.ckBTCMinterService.getEvents(
        BigInt(start),
        BigInt(length)
      );
      console.log(res);
      if (type) {
        if (res.length) {
          if (length === 1) {
            this.getEvent(start, defaultLength, 'init');
          } else {
            if (res.length === defaultLength) {
              this.getEvent(start + defaultLength - 1, defaultLength, 'init');
            } else {
              this.page.total = start + res.length;
              const lastStart = Math.max(
                this.page.total - this.page.pageSize,
                0
              );
              this.getEvent(lastStart, this.page.pageSize);
            }
          }
        } else {
          this.getEvent(Math.max(start - defaultLength, 0), length, 'init');
        }
      } else {
        this.data = res.reverse();
        console.log(this.data);
        console.log(this.page.total);
        this.loading = false;
      }
    } catch (e) {
      this.loading = false;
      console.log(e);
    }
  }
  private pageChange(page: number): void {
    this.page.currentPage = page;
    const start = Math.max(
      this.page.total - this.page.pageSize * this.page.currentPage,
      0
    );
    console.log(start);
    let length = this.page.pageSize;
    if (this.page.pageSize * this.page.currentPage > this.page.total) {
      length =
        this.page.pageSize +
        this.page.total -
        this.page.pageSize * this.page.currentPage;
    }
    this.data = [];
    this.getEvent(start, length);
  }
  private onCopy(): void {
    this.$message.success('Copied');
  }
}
</script>

<style scoped lang="scss">
.integration-event {
  background: #fff;
  line-height: 20px;
  box-shadow: 0 2px 4px 0 rgba(0, 140, 238, 0.05);
  border-radius: 4px;
}
.a-tab-content {
  padding: 0 15px;
}
</style>
