<template>
  <div>
    <a-table
      v-if="SNSTokenAccountTransactions || SNSTransactionsAccountLoading"
      :locale="{
        emptyText: emptyText
      }"
      :columns="columnsSNSAccountTransactions"
      :data-source="
        SNSTokenAccountTransactions
          ? SNSTokenAccountTransactions.transactions
          : []
      "
      :loading="SNSTransactionsAccountLoading"
      :pagination="SNSTokenAccountPage"
      :scroll="scroll"
      :rowKey="
        (record, index) => {
          return index;
        }
      "
    >
      <div slot="Time" slot-scope="time">
        {{ time | formatDateFromNanosecond }}
      </div>
      <div slot="From" slot-scope="text, record">
        <a-tooltip>
          <template slot="title">
            <div>{{ filterFromOwner(record.transaction) }}</div>
            <div v-show="filterFromSubaccount(record.transaction)">
              (subaccount: {{ filterFromSubaccount(record.transaction) }})
            </div>
          </template>
          <span v-if="accountId === filterFrom(record.transaction)">
            {{ filterFrom(record.transaction) | ellipsis(6) }}
          </span>
          <router-link
            v-else
            :to="
              jumpLink(
                `/address/${tokenId}/${filterFromOwner(
                  record.transaction
                )}.${filterFromSubaccount(record.transaction)}`
              )
            "
          >
            {{ filterFrom(record.transaction) | ellipsis(6) }}
          </router-link>
        </a-tooltip>
      </div>
      <div slot="To" slot-scope="text, record">
        <a-tooltip>
          <template slot="title">
            <div>{{ filterToOwner(record.transaction) }}</div>
            <div v-show="filterToSubaccount(record.transaction)">
              (subaccount: {{ filterToSubaccount(record.transaction) }})
            </div>
          </template>
          <span v-if="accountId === filterTo(record.transaction)">
            {{ filterTo(record.transaction) | ellipsis(6) }}
          </span>
          <router-link
            v-else
            :to="
              jumpLink(
                `/address/${tokenId}/${filterToOwner(
                  record.transaction
                )}.${filterToSubaccount(record.transaction)}`
              )
            "
            >{{ filterTo(record.transaction) | ellipsis(6) }}</router-link
          >
        </a-tooltip>
      </div>
      <div
        v-if="tokens && tokenId && tokens[tokenId]"
        class="nowrap"
        slot="Value"
        slot-scope="text, record"
      >
        <span v-if="tokens && tokenId && tokens[tokenId]">
          <span
            v-if="
              record.transaction[record.transaction.kind][0].amount.toString(10)
                .length -
                tokens[tokenId].decimals >
              11
            "
          >
            >
            {{ 10000000000 | formatNum }}
          </span>
          <span v-else>
            {{
              record.transaction |
                filterValue |
                bigintToFloat(
                  tokens[tokenId].decimals,
                  tokens[tokenId].decimals
                ) |
                formatNum
            }}
          </span>
          {{ tokens[tokenId].symbol }}
        </span>
      </div>
      <div class="nowrap" slot="Fee" slot-scope="text, record">
        <span v-if="tokens && tokenId && tokens[tokenId]">
          {{
            record.transaction |
              filterFee |
              bigintToFloat(tokens[tokenId].decimals, tokens[tokenId].decimals)
          }}
          <span
            v-if="
              record.transaction.kind === 'transfer' ||
              record.transaction.kind === 'approve'
            "
          >
            {{ tokens[tokenId].symbol }}
          </span>
        </span>
      </div>
      <div slot="Memo" slot-scope="text, record">
        <a-tooltip>
          <template slot="title">
            <div>
              {{ filterMemo(record.transaction) }}
            </div>
          </template>
          <span>
            {{ filterMemo(record.transaction) | ellipsis(4) }}
          </span>
        </a-tooltip>
      </div>
    </a-table>
    <a-table
      v-if="SNSTokenTransactions.length || SNSTransactionsLoading"
      :locale="{
        emptyText: emptyText
      }"
      :columns="columnsSNSTransactions"
      :data-source="SNSTokenTransactions"
      :loading="SNSTransactionsLoading"
      :pagination="SNSTokenPage"
      :scroll="scroll"
      :rowKey="
        (record, index) => {
          return index;
        }
      "
    >
      <div slot="Time" slot-scope="time">
        {{ time | formatDateFromNanosecond }}
      </div>
      <div slot="From" slot-scope="text, record">
        <a-tooltip>
          <template slot="title">
            <div>{{ filterFromOwner(record) }}</div>
            <div v-show="filterFromSubaccount(record)">
              (subaccount: {{ filterFromSubaccount(record) }})
            </div>
          </template>
          <router-link
            :to="
              jumpLink(
                `/address/${tokenId}/${filterFromOwner(
                  record
                )}.${filterFromSubaccount(record)}`
              )
            "
          >
            {{ filterFrom(record) | ellipsis(6) }}
          </router-link>
        </a-tooltip>
      </div>
      <div slot="To" slot-scope="text, record">
        <a-tooltip>
          <template slot="title">
            <div>{{ filterToOwner(record) }}</div>
            <div v-show="filterToSubaccount(record)">
              (subaccount: {{ filterToSubaccount(record) }})
            </div>
          </template>
          <router-link
            :to="
              jumpLink(
                `/address/${tokenId}/${filterToOwner(
                  record
                )}.${filterToSubaccount(record)}`
              )
            "
            >{{ filterTo(record) | ellipsis(6) }}</router-link
          >
        </a-tooltip>
      </div>
      <div
        v-if="tokens && tokenId && tokens[tokenId]"
        class="nowrap"
        slot="Value"
        slot-scope="text, record"
      >
        <span v-if="tokens && tokenId && tokens[tokenId]">
          <span
            v-if="
              record[record.kind][0].amount.toString(10).length -
                tokens[tokenId].decimals >
              11
            "
          >
            >
            {{ 10000000000 | formatNum }}
          </span>
          <span v-else>
            {{
              record |
                filterValue |
                bigintToFloat(
                  tokens[tokenId].decimals,
                  tokens[tokenId].decimals
                ) |
                formatNum
            }}
          </span>
          {{ tokens[tokenId].symbol }}
        </span>
      </div>
      <div class="nowrap" slot="Fee" slot-scope="text, record">
        <span v-if="tokens && tokenId && tokens[tokenId]">
          {{
            record |
              filterFee |
              bigintToFloat(tokens[tokenId].decimals, tokens[tokenId].decimals)
          }}
          <span v-if="record.kind === 'transfer' || record.kind === 'approve'">
            {{ tokens[tokenId].symbol }}
          </span>
        </span>
      </div>
      <div slot="Memo" slot-scope="text, record">
        <a-tooltip>
          <template slot="title">
            <div>
              {{ filterMemo(record) }}
            </div>
          </template>
          <span>
            {{ filterMemo(record) | ellipsis(4) }}
          </span>
        </a-tooltip>
      </div>
    </a-table>
    <a-table
      v-if="transactionsRosetta.length || transactionsRosettaLoading"
      :locale="{
        emptyText: 'No transactions'
      }"
      :columns="columnsRosetta"
      :data-source="transactionsRosetta"
      :loading="transactionsRosettaLoading"
      :pagination="rosettaPage"
      :scroll="scroll"
      :rowKey="
        (record, index) => {
          return index;
        }
      "
    >
      <router-link :to="`/tx/${tokenId}/${hash}`" slot="Hash" slot-scope="hash">
        {{ hash | ellipsis(6) }}
      </router-link>
      <div slot="Time" slot-scope="time">
        {{ time | formatDateFromNanosecond }}
      </div>
      <div slot="From" slot-scope="text">
        <span v-if="text.type === 'MINT'"> Minting Account</span>
        <span v-if="text.type === 'TRANSACTION' || text.type === 'BURN'">
          <span v-if="text.account1Address === accountId">{{
            text.account1Address | ellipsis(6)
          }}</span>
          <router-link
            v-else
            :to="`/address/${tokenId}/${text.account1Address}`"
            >{{ text.account1Address | ellipsis(6) }}</router-link
          >
        </span>
      </div>
      <div slot="To" slot-scope="text">
        <span v-if="text.type === 'BURN'"> Minting Account</span>
        <span v-if="text.type === 'TRANSACTION'">
          <span v-if="text.account2Address === accountId">{{
            text.account2Address | ellipsis(6)
          }}</span>
          <router-link
            v-else
            :to="`/address/${tokenId}/${text.account2Address}`"
            >{{ text.account2Address | ellipsis(6) }}</router-link
          >
        </span>
        <span v-if="text.type === 'MINT'">
          <span v-if="text.account1Address === accountId">{{
            text.account1Address | ellipsis(6)
          }}</span>
          <router-link
            v-else
            :to="`/address/${tokenId}/${text.account1Address}`"
            >{{ text.account1Address | ellipsis(6) }}</router-link
          >
        </span>
      </div>
      <div slot="Amount" slot-scope="text">
        <span v-if="tokens && tokenId && tokens[tokenId]">
          {{
            text |
              bigintToFloat(
                tokens[tokenId].decimals,
                tokens[tokenId].decimals
              ) |
              formatNum
          }}
          {{ tokens[tokenId].symbol }}
        </span>
      </div>
      <div slot="Fee" slot-scope="text">
        <span v-if="tokens && tokenId && tokens[tokenId]">
          {{
            text |
              bigintToFloat(tokens[tokenId].decimals, tokens[tokenId].decimals)
          }}
          {{ tokens[tokenId].symbol }}
        </span>
      </div>
    </a-table>
    <a-table
      v-if="
        !SNSTokenTransactions.length &&
        !SNSTokenAccountTransactions &&
        !transactionsRosetta.length &&
        !SNSTransactionsAccountLoading &&
        !SNSTransactionsLoading &&
        !transactionsRosettaLoading
      "
      :locale="{
        emptyText: emptyText
      }"
      :columns="columnsTransactions"
      :data-source="transactions"
      :loading="transactionsLoading"
      :pagination="page"
      :scroll="scroll"
      :rowKey="
        (record, index) => {
          return index;
        }
      "
    >
      <div slot="Time" slot-scope="time">
        {{ time | formatDateFromNanosecond }}
      </div>
      <router-link
        :to="jumpLink(`/tx/${tokenId}/${txidToHexString(txid)}`)"
        slot="Txid"
        slot-scope="txid"
      >
        <a-tooltip>
          <template slot="title">
            {{ txid | txidToHex }}
          </template>
          {{ txid | txidToHex | ellipsis(6) }}
        </a-tooltip>
      </router-link>
      <div slot="From" slot-scope="from">
        <span v-if="txidToHexString(from) === accountId">{{
          from | txidToHex | ellipsis(6)
        }}</span>
        <div
          class="jump"
          v-else
          @click="jump(`/address/${tokenId}/${txidToHexString(from)}`)"
        >
          <template slot="title">
            {{ from | txidToHex }}
          </template>
          {{ from | txidToHex | ellipsis(6) }}
        </div>
      </div>
      <div slot="To" slot-scope="to">
        <span v-if="txidToHexString(to) === accountId">{{
          to | txidToHex | ellipsis(6)
        }}</span>
        <div
          class="jump"
          v-else
          @click="jump(`/address/${tokenId}/${txidToHexString(to)}`)"
        >
          <template slot="title">
            {{ to | txidToHex }}
          </template>
          {{ to | txidToHex | ellipsis(6) }}
        </div>
      </div>
      <div
        v-if="tokens && tokenId && tokens[tokenId]"
        class="nowrap"
        slot="Value"
        slot-scope="value"
      >
        {{ filterTransactionVal(value) }}
      </div>
      <div class="nowrap" slot="Fee" slot-scope="fee">
        <span v-if="tokens && tokenId && tokens[tokenId]">{{
          fee | gasToString(tokens[tokenId])
        }}</span>
      </div>
    </a-table>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { Principal } from '@dfinity/principal';
import { DRC202ProxyService } from '@/ic/DRC202Proxy/DRC202ProxyService';
import BigNumber from 'bignumber.js';
import {
  Operation,
  Transaction,
  TxnRecord,
  MoreTxnRecord
} from '@/ic/DRC202Bucket/model';
import {
  toHexString,
  generateTxid,
  principalToAccountIdentifier,
  hexToBytes
} from '@/ic/converter';
import { AccountId, Time, TokenId, TokenInfo, Txid } from '@/ic/common/icType';
import { DRC20TokenService } from '@/ic/DRC20Token/DRC20TokenService';
import { DRC202BucketService } from '@/ic/DRC202Bucket/DRC202BucketService';
import { getTokenInfo } from '@/ic/getTokenInfo';
import { Transaction2 } from '@/ic/DRC20Token/model';
import { SNSWasmService } from '@/ic/SNSWasm/SNSWasmService';
import { SNSIndexService } from '@/ic/SNSIndex/SNSIndexService';
import { GetTransaction } from '@/ic/SNSIndex/model';
import RosettaApi, { Transaction as RosettaTransaction } from '@/ic/RosettaApi';
import { rosettaTokens } from '@/ic/utils';
import { Route } from 'vue-router';
import { formatNum } from '@/filters';
let SNSTokenStart = null;
let SNSTokenLogLength = null;
@Component({
  name: 'Index',
  components: {},
  filters: {
    filterFee(transaction: Transaction2): string {
      if (transaction.kind === 'transfer') {
        return new BigNumber(
          transaction.transfer[0].fee[0].toString(10)
        ).toString(10);
      } else if (transaction.kind === 'approve') {
        return new BigNumber(
          transaction.approve[0].fee[0].toString(10)
        ).toString(10);
      }
      return '-';
    },
    filterValue(transaction: Transaction2): string {
      const amount = transaction[transaction.kind][0].amount.toString(10);
      return new BigNumber(amount).toString(10);
    }
  }
})
export default class extends Vue {
  @Prop({ type: String, default: '' })
  public id!: string;
  @Prop({ type: String, default: '' })
  public tokenId!: string;
  @Prop({ type: String, default: '' })
  public accountId!: string;
  @Prop({ type: String, default: '' })
  public principal!: string;
  @Prop({ type: String, default: '' })
  public subaccount!: string;
  private DRC202ProxyService: DRC202ProxyService;
  private DRC202BucketService: DRC202BucketService;
  private rosettaApi: RosettaApi = null;
  private tokens: { [key: string]: TokenInfo } = {};
  private transactionsLoading = false;
  private SNSTransactionsLoading = false;
  private SNSTransactionsAccountLoading = false;
  private transactionsRosettaLoading = false;
  private lastBlock: number = null;
  private emptyText = 'No transactions';
  private transactions: Array<TxnRecord> = [];
  private SNSTokenTransactions: Array<Transaction2> = [];
  private SNSTokenAccountTransactions: GetTransaction = null;
  private transactionsRosetta: Array<RosettaTransaction> = [];
  private columnsRosetta = [
    {
      title: 'Txn hash',
      dataIndex: 'hash',
      scopedSlots: { customRender: 'Hash' }
    },
    {
      title: 'Block',
      dataIndex: 'blockIndex'
    },
    {
      title: 'From',
      key: 'from',
      scopedSlots: { customRender: 'From' }
    },
    {
      title: 'To',
      key: 'to',
      scopedSlots: { customRender: 'To' }
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      scopedSlots: { customRender: 'Amount' }
    },
    {
      title: 'Fee',
      dataIndex: 'fee',
      scopedSlots: { customRender: 'Fee' }
    },
    {
      title: 'Timestamp',
      dataIndex: 'timestamp',
      scopedSlots: { customRender: 'Time' }
    }
  ];
  private rosettaPage = {
    current: 1,
    pageSize: 20,
    total: 0,
    onChange: this.rosettaPageChange,
    hideOnSinglePage: true,
    showQuickJumper: true
  };
  private page = {
    current: 1,
    pageSize: 20,
    onChange: this.pageChange,
    hideOnSinglePage: true,
    showQuickJumper: true
  };
  private SNSTokenPage = {
    current: 1,
    pageSize: 20,
    total: 0,
    onChange: this.SNSTokenPageChange,
    hideOnSinglePage: true,
    showQuickJumper: true
  };
  private SNSTokenAccountPage = {
    current: 1,
    pageSize: 20,
    total: 0,
    onChange: this.SNSTokenAccountPageChange,
    hideOnSinglePage: true,
    showQuickJumper: true
  };
  private columnsSNSAccountTransactions = [
    {
      title: 'Index',
      dataIndex: 'id',
      customRender: (text): string => {
        if (text || text === BigInt(0)) {
          return new BigNumber(text.toString(10)).toString(10);
        }
        return null;
      }
    },
    {
      title: 'TxnType',
      dataIndex: 'transaction.kind',
      scopedSlots: { customRender: 'Kind' }
    },
    {
      title: 'From',
      dataIndex: 'from',
      scopedSlots: { customRender: 'From' }
    },
    {
      title: 'To',
      dataIndex: 'to',
      scopedSlots: { customRender: 'To' }
    },
    {
      title: 'Value',
      dataIndex: 'value',
      scopedSlots: { customRender: 'Value' }
    },
    {
      title: 'Fee',
      dataIndex: 'fee',
      scopedSlots: { customRender: 'Fee' }
    },
    {
      title: 'Memo',
      dataIndex: 'memo',
      scopedSlots: { customRender: 'Memo' }
    },
    {
      title: 'Time',
      dataIndex: 'transaction.timestamp',
      scopedSlots: { customRender: 'Time' }
    }
  ];
  private columnsSNSTransactions = [
    {
      title: 'Index',
      dataIndex: 'index',
      customRender: (text, record: Transaction2, index: number): string => {
        if (SNSTokenLogLength) {
          const num = new BigNumber(SNSTokenLogLength.toString(10))
            .minus((this.SNSTokenPage.current - 1) * this.SNSTokenPage.pageSize)
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
      title: 'TxnType',
      dataIndex: 'kind',
      scopedSlots: { customRender: 'Kind' }
    },
    {
      title: 'From',
      dataIndex: 'from',
      scopedSlots: { customRender: 'From' }
    },
    {
      title: 'To',
      dataIndex: 'to',
      scopedSlots: { customRender: 'To' }
    },
    {
      title: 'Value',
      dataIndex: 'value',
      scopedSlots: { customRender: 'Value' }
    },
    {
      title: 'Fee',
      dataIndex: 'fee',
      scopedSlots: { customRender: 'Fee' }
    },
    {
      title: 'Memo',
      dataIndex: 'memo',
      scopedSlots: { customRender: 'Memo' }
    },
    {
      title: 'Time',
      dataIndex: 'timestamp',
      scopedSlots: { customRender: 'Time' }
    }
  ];
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
      title: 'TxnType',
      dataIndex: 'transaction.operation',
      customRender: (text: Operation, record: TxnRecord): string => {
        if (text) {
          let type = Object.keys(text)[0];
          if (
            this.txidToHexString(record.caller) !==
            this.txidToHexString(record.transaction.from)
          ) {
            if (type === 'transfer') {
              const action = Object.keys(
                (
                  text as {
                    transfer: {
                      action:
                        | {
                            burn: null;
                          }
                        | {
                            mint: null;
                          }
                        | {
                            send: null;
                          };
                    };
                  }
                ).transfer.action
              )[0];
              if (action === 'send') {
                type = 'transferFrom';
              }
            } else if (type === 'lockTransfer') {
              type = 'lockTransferFrom';
            }
          } else {
            if (type === 'transfer') {
              const action = Object.keys(
                (
                  text as {
                    transfer: {
                      action:
                        | {
                            burn: null;
                          }
                        | {
                            mint: null;
                          }
                        | {
                            send: null;
                          };
                    };
                  }
                ).transfer.action
              )[0];
              if (action === 'burn') {
                type = 'burn';
              } else if (action === 'mint') {
                type = 'mint';
              }
            }
          }
          return type;
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
      title: 'From',
      dataIndex: 'transaction.from',
      scopedSlots: { customRender: 'From' }
    },
    {
      title: 'To',
      dataIndex: 'transaction.to',
      scopedSlots: { customRender: 'To' }
    },
    {
      title: 'Nonce',
      dataIndex: 'nonce',
      customRender: (text: bigint): string => {
        return text.toString();
      }
    },
    {
      title: 'Value',
      dataIndex: 'transaction',
      scopedSlots: { customRender: 'Value' }
    },
    {
      title: 'Fee',
      dataIndex: 'gas',
      scopedSlots: { customRender: 'Fee' }
    },
    {
      title: 'Time',
      dataIndex: 'timestamp',
      scopedSlots: { customRender: 'Time' }
    }
  ];
  private scroll = {
    x: false
  };
  private innerWidth =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth;
  @Watch('$route')
  private onRouteChange(to: Route) {
    const tokenId = to.params.tokenId || '';
    if (to.name === 'Token' && tokenId !== this.tokenId) {
      this.initData();
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
  private initData(): void {
    this.transactions = [];
    this.SNSTokenTransactions = [];
    this.transactionsRosetta = [];
    this.SNSTokenAccountTransactions = null;
    this.page.current = 1;
    this.SNSTokenPage.current = 1;
    this.SNSTokenAccountPage.current = 1;
    this.rosettaPage.current = 1;
    this.lastBlock = null;
    SNSTokenStart = null;
    SNSTokenLogLength = null;
  }
  private init(): void {
    SNSTokenStart = null;
    SNSTokenLogLength = null;
    this.DRC202ProxyService = new DRC202ProxyService();
    this.tokens = JSON.parse(localStorage.getItem('tokens')) || {};
    if (this.tokenId && !this.tokens[this.tokenId]) {
      this.tokens[this.tokenId] = {
        name: '',
        symbol: '',
        decimals: 8,
        fee: { noFee: null },
        totalSupply: null,
        maxSupply: null,
        logo: ''
      };
      getTokenInfo(Principal.fromText(this.tokenId)).then((tokenInfo) => {
        this.tokens[this.tokenId] = tokenInfo;
        this.$forceUpdate();
      });
    }
    this.emptyText = 'No transactions';
    console.log(this.emptyText);
    this.initData();
    this.getTxns();
  }
  private filterFrom(transaction: Transaction2): string {
    if (transaction.kind !== 'mint') {
      let subAccount = Array(32).fill(0);
      if (
        transaction[transaction.kind][0].from.subaccount &&
        transaction[transaction.kind][0].from.subaccount[0] &&
        transaction[transaction.kind][0].from.subaccount[0].length
      ) {
        subAccount = transaction[transaction.kind][0].from.subaccount[0];
      }
      return principalToAccountIdentifier(
        transaction[transaction.kind][0].from.owner,
        new Uint8Array(subAccount)
      );
    }
    return '-';
  }
  private filterFromOwner(transaction: Transaction2): string {
    if (transaction.kind !== 'mint') {
      return transaction[transaction.kind][0].from.owner.toString();
    }
    return '-';
  }
  private filterFromSubaccount(transaction: Transaction2): string {
    if (transaction.kind !== 'mint') {
      let subAccount = null;
      if (
        transaction[transaction.kind][0].from.subaccount &&
        transaction[transaction.kind][0].from.subaccount[0] &&
        transaction[transaction.kind][0].from.subaccount[0].length
      ) {
        subAccount = transaction[transaction.kind][0].from.subaccount[0];
        return toHexString(subAccount);
      }
    }
    return '';
  }
  private filterTo(transaction: Transaction2): string {
    if (transaction.kind !== 'burn') {
      let subAccount = Array(32).fill(0);
      if (transaction.kind === 'approve') {
        if (
          transaction[transaction.kind][0].spender.subaccount &&
          transaction[transaction.kind][0].spender.subaccount[0] &&
          transaction[transaction.kind][0].spender.subaccount[0].length
        ) {
          subAccount = transaction[transaction.kind][0].spender.subaccount[0];
        }
        return principalToAccountIdentifier(
          transaction[transaction.kind][0].spender.owner,
          new Uint8Array(subAccount)
        );
      } else {
        if (
          transaction[transaction.kind][0].to.subaccount &&
          transaction[transaction.kind][0].to.subaccount[0] &&
          transaction[transaction.kind][0].to.subaccount[0].length
        ) {
          subAccount = transaction[transaction.kind][0].to.subaccount[0];
        }
        return principalToAccountIdentifier(
          transaction[transaction.kind][0].to.owner,
          new Uint8Array(subAccount)
        );
      }
    }
    return '-';
  }
  private filterToOwner(transaction: Transaction2): string {
    if (transaction.kind !== 'burn') {
      if (transaction.kind === 'approve') {
        return transaction[transaction.kind][0].spender.owner.toString();
      } else {
        return transaction[transaction.kind][0].to.owner.toString();
      }
    }
    return '-';
  }
  private filterToSubaccount(transaction: Transaction2): string {
    if (transaction.kind !== 'burn') {
      let subAccount = null;
      if (transaction.kind === 'approve') {
        if (
          transaction[transaction.kind][0].spender.subaccount &&
          transaction[transaction.kind][0].spender.subaccount[0] &&
          transaction[transaction.kind][0].spender.subaccount[0].length
        ) {
          subAccount = transaction[transaction.kind][0].spender.subaccount[0];
          return toHexString(subAccount);
        }
      } else {
        if (
          transaction[transaction.kind][0].to.subaccount &&
          transaction[transaction.kind][0].to.subaccount[0] &&
          transaction[transaction.kind][0].to.subaccount[0].length
        ) {
          subAccount = transaction[transaction.kind][0].to.subaccount[0];
          return toHexString(subAccount);
        }
      }
    }
    return '';
  }
  private filterMemo(transaction: Transaction2): string {
    let memo = [];
    if (transaction.kind === 'burn') {
      memo = transaction.burn[0].memo;
    } else if (transaction.kind === 'mint') {
      memo = transaction.mint[0].memo;
    } else if (transaction.kind === 'transfer') {
      memo = transaction.transfer[0].memo;
    }
    return toHexString(new Uint8Array(memo[0]));
  }
  private SNSTokenAccountPageChange(page: number): void {
    this.SNSTokenAccountPage.current = page;
  }
  private SNSTokenPageChange(page: number): void {
    this.SNSTokenPage.current = page;
    this.SNSTokenTxns();
  }
  private pageChange(page: number): void {
    this.page.current = page;
    this.getTxn();
  }
  private async getCurrentTxn(
    tokenId: TokenId,
    txid: Txid,
    bucketList: Array<Principal>
  ): Promise<TxnRecord> {
    for (let i = 0; i < bucketList.length; i++) {
      const currentDRC202BucketService = new DRC202BucketService(
        bucketList[i].toString().toString()
      );
      const txn = await currentDRC202BucketService.txn(tokenId, txid);
      if (txn && txn[0]) {
        return txn[0][0];
      }
    }
  }
  private async getTxn(): Promise<void> {
    const max = Math.min(
      this.page.current * this.page.pageSize,
      this.transactions.length
    );
    const currentTxns = this.transactions.slice(
      (this.page.current - 1) * this.page.pageSize,
      max
    );
    for (let i = 0; i < currentTxns.length; i++) {
      if (!currentTxns[i].transaction) {
        const bucketList = await this.DRC202ProxyService.bucketList();
        this.getCurrentTxn(
          Principal.fromText(this.tokenId),
          currentTxns[i].txid,
          bucketList
        ).then((txn) => {
          if (txn) {
            this.$set(
              this.transactions,
              (this.page.current - 1) * this.page.pageSize + i,
              txn
            );
          }
        });
      }
    }
    console.log(currentTxns);
  }
  private filterTransactionVal(val: Transaction): string {
    if (val) {
      const tokenId = this.tokenId;
      const amount = new BigNumber(val.value.toString())
        .div(10 ** this.tokens[tokenId].decimals)
        .toString(10);
      const symbol = this.tokens[tokenId].symbol;
      if (Object.keys(val.operation)[0] === 'lockTransfer') {
        const locked = (
          val.operation as {
            lockTransfer: {
              locked: bigint;
              expiration: Time;
              decider: AccountId;
            };
          }
        ).lockTransfer.locked;
        const lockedAmount = new BigNumber(locked.toString())
          .div(10 ** this.tokens[tokenId].decimals)
          .toString(10);
        return `locked ${formatNum(lockedAmount)} ${symbol}`;
      } else if (Object.keys(val.operation)[0] === 'executeTransfer') {
        const fallback = (
          val.operation as {
            executeTransfer: {
              fallback: bigint;
              lockedTxid: Txid;
            };
          }
        ).executeTransfer.fallback;
        const fallbackAmount = new BigNumber(fallback.toString())
          .div(10 ** this.tokens[tokenId].decimals)
          .toString(10);
        if (fallbackAmount === '0') {
          return `${formatNum(amount)} ${symbol}`;
        } else {
          return `${formatNum(amount)} ${symbol}(fallback ${formatNum(
            fallbackAmount
          )} ${symbol})`;
        }
      } else {
        return `${formatNum(amount)} ${symbol}`;
      }
    }
    return '';
  }
  private txidToHexString = (val: Array<number>): string => {
    return toHexString(new Uint8Array(val));
  };
  private async getSNSTokenTxns(): Promise<void> {
    this.SNSTransactionsLoading = true;
    this.SNSTokenTransactions = [];
    try {
      const DRC20Token = new DRC20TokenService(this.tokenId);
      if (!SNSTokenStart) {
        SNSTokenStart = BigInt(0);
        const res = await DRC20Token.getSNSTokenTransactions(this.tokenId, {
          start: SNSTokenStart,
          length: BigInt(this.SNSTokenPage.pageSize)
        });
        if (res) {
          SNSTokenStart = res.first_index;
          SNSTokenLogLength = res.log_length;
          const total = new BigNumber(res.log_length.toString(10))
            .minus(SNSTokenStart.toString(10))
            .toString(10);
          this.$set(this.SNSTokenPage, 'total', Number(total));
        }
      }
      let start = BigInt(
        new BigNumber(SNSTokenLogLength.toString(10))
          .minus(this.SNSTokenPage.current * this.SNSTokenPage.pageSize)
          .toString(10)
      );
      let length = BigInt(this.SNSTokenPage.pageSize);
      if (new BigNumber(SNSTokenStart.toString(10)).gt(start.toString(10))) {
        length = BigInt(
          new BigNumber(this.SNSTokenPage.pageSize)
            .minus(SNSTokenStart.toString(10))
            .plus(start.toString(10))
            .toString(10)
        );
        start = SNSTokenStart;
      }
      console.log(start, length);
      const res = await DRC20Token.getSNSTokenTransactions(this.tokenId, {
        start: start,
        length: length
      });
      this.SNSTokenTransactions = res.transactions.reverse();
      console.log(res);
    } catch (e) {
      console.log(e);
    }
    this.SNSTransactionsLoading = false;
  }
  private async getSNSTokenTxnsByAccount(): Promise<void> {
    this.SNSTransactionsAccountLoading = true;
    try {
      let SNSIndexId;
      if (this.tokenId === 'mxzaz-hqaaa-aaaar-qaada-cai') {
        // ckBTC
        SNSIndexId = 'n5wcd-faaaa-aaaar-qaaea-cai';
      } else {
        const snsWasmService = new SNSWasmService();
        const list = await snsWasmService.listDeployedSnses();
        if (list && list.length) {
          console.log(list);
          for (let i = 0; i < list.length; i++) {
            if (
              list[i].ledger_canister_id &&
              list[i].ledger_canister_id.length
            ) {
              if (list[i].ledger_canister_id[0].toString() === this.tokenId) {
                SNSIndexId = list[i].index_canister_id[0].toString();
                break;
              }
            }
          }
        }
      }
      if (SNSIndexId) {
        const snsIndexService = new SNSIndexService();
        const start = [];
        let subaccount = [];
        if (this.subaccount) {
          subaccount = [hexToBytes(this.subaccount)];
        }
        // todo
        const total = 100;
        const res = await snsIndexService.getAccountTransactions(SNSIndexId, {
          max_results: BigInt(total),
          start: start,
          account: {
            owner: Principal.fromText(this.principal),
            subaccount: subaccount
          }
        });
        console.log(res);
        if ((res as { Ok: GetTransaction }).Ok) {
          this.SNSTokenAccountTransactions = (res as { Ok: GetTransaction }).Ok;
        } else {
          this.SNSTokenAccountTransactions = null;
        }
      }
    } catch (e) {
      console.log(e);
    }
    this.SNSTransactionsAccountLoading = false;
  }
  private async SNSTokenTxns(): Promise<void> {
    if (this.accountId && (!this.principal || this.principal === '-')) {
      const tokenStd = this.tokens[this.tokenId].tokenStd;
      if (tokenStd) {
        const std = Object.keys(tokenStd)[0];
        if (std.toLocaleLowerCase().includes('icrc')) {
          this.emptyText =
            'Transaction records can only be queried by principal.';
        } else {
          this.emptyText =
            'Transaction records can only be queried from this type of standard token using the holder principal.';
        }
      }
      return;
    }
    if (!this.accountId && (!this.principal || this.principal === '-')) {
      this.getSNSTokenTxns();
    } else {
      this.getSNSTokenTxnsByAccount();
    }
  }
  private async getTxns(): Promise<void> {
    if (rosettaTokens[this.tokenId]) {
      this.getRosettaTransactions();
    } else {
      this.transactionsLoading = true;
      try {
        const DRC20Token = new DRC20TokenService(this.tokenId);
        let address = [];
        if (this.accountId) {
          address = [this.accountId];
        }
        DRC20Token.drc202_events(address)
          .then(async (res) => {
            if (res && res.length) {
              this.transactions = res;
            } else {
              const events = {
                getEvents: { owner: [] }
              };
              if (this.accountId) {
                events.getEvents = { owner: [this.accountId] };
              }
              const res = await DRC20Token.txnQuery(events);
              const transition = (res as { getEvents: Array<TxnRecord> })
                .getEvents;
              if (transition && transition.length) {
                this.transactions = transition;
              }
            }
            // todo, address transactions
            if (this.accountId || (this.principal && this.principal !== '-')) {
              let transaction = this.transactions.find((transaction) => {
                return transaction.msgCaller[0];
              });
              console.log(transaction);
              if (transaction) {
                this.$emit('msgCaller', transaction.msgCaller[0].toString());
              }
              let nonceTransaction;
              this.transactions.forEach((transaction, index) => {
                if (
                  this.txidToHexString(this.transactions[index].caller) ===
                  this.accountId
                ) {
                  if (!nonceTransaction) {
                    nonceTransaction = transaction.nonce;
                  } else {
                    if (
                      new BigNumber(transaction.nonce.toString(10)).lt(
                        nonceTransaction.toString(10)
                      )
                    ) {
                      nonceTransaction = transaction.nonce;
                    }
                  }
                }
              });
              if (nonceTransaction) {
                const nonce = Number(Number(nonceTransaction) % 10000000);
                for (let i = nonce - 1; i >= 0; i--) {
                  const moreTxnRecord = new MoreTxnRecord();
                  const j =
                    Math.floor(Number(nonceTransaction) / 10000000) * 10000000 +
                    i;
                  moreTxnRecord.txid = generateTxid(
                    this.tokenId,
                    this.accountId,
                    j
                  );
                  moreTxnRecord.nonce = BigInt(j);
                  this.transactions.push(moreTxnRecord);
                }
              }
              this.getTxn();
            }
            this.transactionsLoading = false;
          })
          .catch(async (e) => {
            // Transaction records can only be queried from this type of standard token using the holder principal.
            if (this.principal && this.principal !== '-') {
              DRC20Token.drc202_events([this.principal])
                .then((res) => {
                  if (res && res.length) {
                    this.transactions = res;
                  }
                  this.transactionsLoading = false;
                })
                .catch(() => {
                  this.SNSTokenTxns();
                  this.transactionsLoading = false;
                });
            } else {
              this.SNSTokenTxns();
              console.log(e);
              this.transactionsLoading = false;
            }
          });
      } catch (e) {
        console.log(e);
        this.transactionsLoading = false;
      }
    }
  }
  private async getRosettaTransactions(): Promise<void> {
    this.rosettaApi = new RosettaApi(
      rosettaTokens[this.tokenId].url,
      rosettaTokens[this.tokenId].blockchain
    );
    try {
      const res = await this.rosettaApi.getLastBlockIndex();
      if (typeof res === 'number') {
        if (this.accountId) {
          this.lastBlock = res as number;
          this.getAddressTransactionList();
        } else {
          this.rosettaPage.total = (res as number) + 1;
          this.getTransactionList();
        }
      }
    } catch (e) {
      console.log(e);
    }
  }
  private async getAddressTransactionList(): Promise<void> {
    this.transactionsRosettaLoading = true;
    try {
      const res = await this.rosettaApi.getTransactionsByAccount(
        this.accountId,
        this.lastBlock,
        this.rosettaPage.pageSize,
        (this.rosettaPage.current - 1) * this.rosettaPage.pageSize
      );
      if (
        res as {
          totalCount: number;
          transactions: Array<RosettaTransaction>;
        }
      ) {
        this.rosettaPage.total = (
          res as {
            totalCount: number;
            transactions: Array<RosettaTransaction>;
          }
        ).totalCount;
        this.transactionsRosetta = (
          res as {
            totalCount: number;
            transactions: Array<RosettaTransaction>;
          }
        ).transactions;
      }
      console.log(res);
    } catch (e) {
      console.log(e);
    }
    this.transactionsRosettaLoading = false;
  }
  private async getTransactionList(): Promise<void> {
    this.transactionsRosettaLoading = true;
    try {
      const maxBlockIndex =
        this.rosettaPage.total -
        1 -
        this.rosettaPage.pageSize * (this.rosettaPage.current - 1);
      const promiseAllValue = [];
      const count = Math.min(maxBlockIndex + 1, this.rosettaPage.pageSize);
      for (let i = 0; i < count; i++) {
        promiseAllValue.push(
          this.rosettaApi.getTransactionByBlock(maxBlockIndex - i)
        );
      }
      this.transactionsRosetta = await Promise.all(promiseAllValue);
      console.log(this.transactionsRosetta);
    } catch (e) {
      console.log(e);
    }
    this.transactionsRosettaLoading = false;
  }
  private rosettaPageChange(val: number): void {
    this.rosettaPage.current = val;
    if (this.accountId) {
      this.getAddressTransactionList();
    } else {
      this.getTransactionList();
    }
  }
  private jumpLink(url: string): string {
    if (this.$route.meta && this.$route.meta.type === 'Test') {
      url = '/tokensTest' + url;
    }
    return url;
  }
  private jump(url: string): void {
    if (this.$route.meta && this.$route.meta.type === 'Test') {
      url = '/tokensTest' + url;
    }
    this.$router.push(url);
    // window.location.href = url;
  }
}
</script>

<style scoped lang="scss">
.jump {
  cursor: pointer;
  color: #0862bc;
}
</style>
