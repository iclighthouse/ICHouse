<template>
  <div class="swaps-transactions">
    <div class="swaps-transactions-title">Latest Transactions</div>
    <div class="transactions-main">
      <a-spin :spinning="spinning">
        <table>
          <thead class="ant-table-thead">
            <tr>
              <th>Index</th>
              <th>TxnType</th>
              <th>Token</th>
              <th>Txid</th>
              <th>From</th>
              <th>To</th>
              <th>Value</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody class="ant-table-tbody">
            <tr
              v-for="(transaction, index) in currentLatestTransactions"
              :key="index"
            >
              <td>
                <span v-if="transaction && transaction[2]">{{
                  transaction[2].toString()
                }}</span>
              </td>
              <td>
                <span v-if="transaction && transaction[0]">{{
                  Object.keys(transaction[0].transaction.operation)[0]
                }}</span>
              </td>
              <td>
                <router-link
                  v-if="
                    transaction &&
                    transaction[3] &&
                    tokens &&
                    tokens[transaction[3].toString()] &&
                    getLogo(transaction[3].toString())
                  "
                  class="token-name"
                  :to="jumpRouter(`/token/${transaction[3].toString()}`)"
                >
                  <img
                    class="token-img"
                    v-if="tokens[transaction[3].toString()].logo"
                    :src="tokens[transaction[3].toString()].logo"
                    alt=""
                  />
                  <span class="span-nbsp"></span
                  >{{ tokens[transaction[3].toString()].symbol }} ({{
                    tokens[transaction[3].toString()].name
                  }})
                </router-link>
              </td>
              <td>
                <router-link
                  v-if="transaction && transaction[0] && transaction[3]"
                  :to="
                    jumpRouter(
                      `/tx/${transaction[3].toString()}/${txidToHexString(
                        transaction[0].txid
                      )}`
                    )
                  "
                  >{{ transaction[0].txid | txidToHex | ellipsis }}
                </router-link>
              </td>
              <td>
                <router-link
                  v-if="transaction && transaction[0] && transaction[3]"
                  :to="
                    jumpRouter(
                      `/address/${transaction[3].toString()}/${txidToHexString(
                        transaction[0].transaction.from
                      )}`
                    )
                  "
                  >{{
                    transaction[0].transaction.from | txidToHex | ellipsis
                  }}</router-link
                >
              </td>
              <td>
                <router-link
                  v-if="transaction && transaction[0] && transaction[3]"
                  :to="
                    jumpRouter(
                      `/address/${transaction[3].toString()}/${txidToHexString(
                        transaction[0].transaction.to
                      )}`
                    )
                  "
                  >{{
                    transaction[0].transaction.to | txidToHex | ellipsis
                  }}</router-link
                >
              </td>
              <td>
                <div
                  class="transaction-value"
                  v-if="
                    transaction &&
                    transaction[3] &&
                    tokens &&
                    tokens[transaction[3].toString()]
                  "
                >
                  {{ filterTransaction(transaction) }}
                </div>
              </td>

              <td>
                <span v-if="transaction && transaction[0]">{{
                  transaction[0].timestamp | formatDateFromNanosecond
                }}</span>
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
import { DRC202ProxyService } from '@/ic/DRC202Proxy/DRC202ProxyService';
import { DRC202BucketService } from '@/ic/DRC202Bucket/DRC202BucketService';
import { LatestTransaction } from '@/views/model';
import { AccountId, Time, TokenId, TokenInfo, Txid } from '@/ic/common/icType';
import { toHexString } from '@/ic/converter';
import { getLogo, getTokenInfo } from '@/ic/getTokenInfo';
import { LastTxns } from '@/ic/DRC202Proxy/model';
import { Principal } from '@dfinity/principal/lib/cjs';
import { Route } from 'vue-router';
import { formatNum } from '@/filters';

let tokenIds = [];

@Component({
  name: 'Index',
  components: {}
})
export default class extends Vue {
  private DRC202ProxyService: DRC202ProxyService;
  private DRC202BucketService: DRC202BucketService;
  private spinning = false;
  private lastTxns: Array<LastTxns> = [];
  private latestTransactions: Array<LatestTransaction> = [];
  private currentLatestTransactions: Array<LatestTransaction> = [];
  private tokens: { [key: string]: TokenInfo };
  private bucketList: Array<Principal> = [];
  private page = {
    current: 1,
    pageSize: 20,
    showQuickJumper: true
  };
  @Watch('$route')
  private onRouteChange(to: Route, from: Route) {
    if (to.meta.type !== from.meta.type || from.path === '/tokens') {
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
    tokenIds = [];
    this.DRC202ProxyService = new DRC202ProxyService();
    this.tokens = JSON.parse(localStorage.getItem('tokens')) || {};
    this.getBucketList().then(() => {
      this.getLatestTransactions();
    });
  }
  private async getBucketList(): Promise<void> {
    this.bucketList = await this.DRC202ProxyService.bucketList();
  }
  private jumpRouter(url: string): string {
    if (this.$route.meta && this.$route.meta.type === 'Test') {
      url = '/tokensTest' + url;
    }
    return url;
  }
  private pageChange(page: number): void {
    this.page.current = page;
    this.spinning = true;
    this.getCurrentPageTransactions();
  }
  private async getCurrentPageTransactions(): Promise<void> {
    try {
      if (this.lastTxns && this.lastTxns.length) {
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
                i
              )
            );
          }
          const tokenId = this.lastTxns[i][1].toString();
          if (!this.tokens[tokenId]) {
            this.tokens[tokenId.toString()] = {
              name: '',
              symbol: '',
              decimals: 8,
              fee: { noFee: null },
              totalSupply: null,
              maxSupply: null,
              logo: ''
            };
            getTokenInfo(this.lastTxns[i][1]).then((tokenInfo) => {
              this.tokens[this.lastTxns[i][1].toString()] = tokenInfo;
              this.$forceUpdate();
            });
          }
        }
        await Promise.all(promiseAllValue);
        this.currentLatestTransactions = this.latestTransactions.slice(
          (this.page.current - 1) * this.page.pageSize,
          lastIndex
        );
      }
    } catch (e) {
      console.log(e);
    }
    this.spinning = false;
  }
  private async getLatestTransactions(): Promise<void> {
    this.spinning = true;
    try {
      this.lastTxns = await this.DRC202ProxyService.getLastTxns();
      this.latestTransactions = new Array(this.lastTxns.length);
      this.getCurrentPageTransactions();
    } catch (e) {
      this.spinning = false;
    }
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
      this.$forceUpdate();
    }
    return !!this.tokens[tokenId].logo;
  }
  private async getTxn(
    tokenId: TokenId,
    txid: Txid,
    index: bigint
  ): Promise<LatestTransaction> {
    if ((this.bucketList && !this.bucketList[0]) || !this.bucketList) {
      return null;
    } else {
      let latestTransaction: LatestTransaction = null;
      for (let i = 0; i < this.bucketList.length - 1; i++) {
        const currentDRC202BucketService = new DRC202BucketService(
          this.bucketList[i].toString().toString()
        );
        const txn = await currentDRC202BucketService.txn(tokenId, txid);
        if (txn && txn[0]) {
          latestTransaction = [...txn[0], index, tokenId];
          break;
        }
      }
      return latestTransaction;
    }
  }
  private async getTransaction(
    index: bigint,
    tokenId: TokenId,
    txid: Txid,
    i: number
  ): Promise<void> {
    try {
      this.latestTransactions[i] = await this.getTxn(tokenId, txid, index);
    } catch (e) {
      console.log(e);
    }
  }
  private txidToHexString = (val: Array<number>): string => {
    return toHexString(new Uint8Array(val));
  };
  private filterTransaction(val: LatestTransaction): string {
    if (val) {
      const amount = new BigNumber(val[0].transaction.value.toString())
        .div(10 ** this.tokens[val[3].toString()].decimals)
        .toString(10);
      let symbol = this.tokens[val[3].toString()].symbol;
      if (symbol === null || symbol === 'null') {
        symbol = '';
      }
      if (Object.keys(val[0].transaction.operation)[0] === 'lockTransfer') {
        const locked = (
          val[0].transaction.operation as {
            lockTransfer: {
              locked: bigint;
              expiration: Time;
              decider: AccountId;
            };
          }
        ).lockTransfer.locked;
        const lockedAmount = new BigNumber(locked.toString())
          .div(10 ** this.tokens[val[3].toString()].decimals)
          .toString(10);
        return `locked ${formatNum(lockedAmount)} ${symbol}`;
      } else if (
        Object.keys(val[0].transaction.operation)[0] === 'executeTransfer'
      ) {
        const fallback = (
          val[0].transaction.operation as {
            executeTransfer: {
              fallback: bigint;
              lockedTxid: Txid;
            };
          }
        ).executeTransfer.fallback;
        const fallbackAmount = new BigNumber(fallback.toString())
          .div(10 ** this.tokens[val[3].toString()].decimals)
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
}
</script>

<style scoped lang="scss">
.token-name {
  display: flex;
  align-items: center;
  cursor: pointer;
  .token-img {
    width: 20px;
    height: 20px;
    border-radius: 10px;
    object-fit: contain;
  }
}
</style>
