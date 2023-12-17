<template>
  <div class="home">
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
          <dt>Tokens</dt>
          <dd>
            <a-statistic
              v-if="stats"
              :value-style="{ color: '#008CEE' }"
              :value="stats.tokenCount.toString()"
            ></a-statistic>
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
    <div class="token-list"></div>
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
                    <dl v-if="transaction[0]">
                      <dd>
                        <span>{{ transaction[0][2].toString() }}</span>
                      </dd>
                      <dt>
                        <span>{{
                          Object.keys(
                            transaction[0][0].transaction.operation
                          )[0]
                        }}</span>
                      </dt>
                    </dl>
                  </td>
                  <td>
                    <router-link
                      v-if="
                        transaction[0] &&
                        tokens &&
                        tokens[transaction[0][3].toString()]
                      "
                      class="token-name"
                      :to="jumpRouter(`/token/${transaction[0][3].toString()}`)"
                    >
                      <img
                        class="token-img"
                        v-if="tokens[transaction[0][3].toString()].logo"
                        :src="tokens[transaction[0][3].toString()].logo"
                        alt=""
                      />
                    </router-link>
                  </td>
                  <td>
                    <div
                      v-if="
                        transaction[0] &&
                        tokens &&
                        tokens[transaction[0][3].toString()]
                      "
                    >
                      <router-link
                        class="token-name"
                        :to="
                          jumpRouter(`/token/${transaction[0][3].toString()}`)
                        "
                      >
                        <dl>
                          <dt>
                            {{ tokens[transaction[0][3].toString()].symbol }}
                          </dt>
                          <dd>
                            {{ tokens[transaction[0][3].toString()].name }}
                          </dd>
                        </dl>
                      </router-link>
                    </div>
                  </td>
                  <td>
                    <dl v-if="transaction[0]">
                      <dt>
                        <router-link
                          :to="
                            jumpRouter(
                              `/tx/${transaction[0][3].toString()}/${txidToHexString(
                                transaction[0][0].txid
                              )}`
                            )
                          "
                          >{{
                            transaction[0][0].txid |
                              txidToHex |
                              ellipsis(ellipsisNumber)
                          }}
                        </router-link>
                      </dt>
                      <dd>
                        <span class="time">{{
                          transaction[0][0].timestamp | formatDateFromNanosecond
                        }}</span>
                      </dd>
                    </dl>
                  </td>
                  <td>
                    <dl v-if="transaction[0]">
                      <dt>
                        From
                        <router-link
                          :to="
                            jumpRouter(
                              `/address/${transaction[0][3].toString()}/${txidToHexString(
                                transaction[0][0].transaction.from
                              )}`
                            )
                          "
                          >{{
                            transaction[0][0].transaction.from |
                              txidToHex |
                              ellipsis(ellipsisNumber)
                          }}</router-link
                        >
                      </dt>
                      <dd>
                        To
                        <router-link
                          :to="
                            jumpRouter(
                              `/address/${transaction[0][3].toString()}/${txidToHexString(
                                transaction[0][0].transaction.to
                              )}`
                            )
                          "
                          >{{
                            transaction[0][0].transaction.to |
                              txidToHex |
                              ellipsis(ellipsisNumber)
                          }}</router-link
                        >
                      </dd>
                    </dl>
                  </td>
                  <td>
                    <div
                      class="transaction-value"
                      v-if="
                        transaction[0] &&
                        tokens &&
                        tokens[transaction[0][3].toString()]
                      "
                    >
                      {{ filterTransaction(transaction[0]) }}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </a-spin>
        </div>
        <div class="view-all">
          <router-link :to="jumpRouter('/txs')">
            <a-button type="primary">View more transactions</a-button>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { DRC202ProxyService } from '@/ic/DRC202Proxy/DRC202ProxyService';
import { DRC202BucketService } from '@/ic/DRC202Bucket/DRC202BucketService';
import { Stats } from '@/ic/DRC202Proxy/model';
import { AccountId, Time, TokenId, TokenInfo, Txid } from '@/ic/common/icType';
import { LatestTransaction } from '@/views/model';
import { getLogo, getTokenInfo } from '@/ic/getTokenInfo';
import BigNumber from 'bignumber.js';
import { toHexString } from '@/ic/converter';
import { Principal } from '@dfinity/principal/lib/cjs';
import { formatNum } from '@/filters';

let tokenIds = [];

@Component({
  components: {}
})
export default class Home extends Vue {
  private DRC202ProxyService: DRC202ProxyService;
  private DRC202BucketService: DRC202BucketService;
  private tokenId = '';
  private stats: Stats = null;
  private spinning = false;
  private latestTransactions: Array<LatestTransaction> = [];
  private tokens: { [key: string]: TokenInfo } = {};
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
      this.ellipsisNumber = 30;
    } else if (this.innerWidth >= 768) {
      this.ellipsisNumber = 20;
    } else {
      this.ellipsisNumber = 4;
    }
  }
  private ellipsisNumber = 30;
  private timer = null;
  @Watch('innerWidth')
  private onresize(innerWidth: number) {
    if (innerWidth >= 1100) {
      this.ellipsisNumber = 30;
    } else if (innerWidth >= 768) {
      this.ellipsisNumber = 10;
    } else {
      this.ellipsisNumber = 4;
    }
  }
  @Watch('$route')
  private onRouteChange() {
    this.init();
  }
  beforeDestroy(): void {
    window.clearTimeout(this.timer);
    this.timer = null;
  }
  created(): void {
    this.init();
  }
  private init(): void {
    this.DRC202ProxyService = new DRC202ProxyService();
    this.stats = JSON.parse(localStorage.getItem('stats'));
    this.tokens = JSON.parse(localStorage.getItem('tokens')) || {};
    this.getStats();
    this.getLatestTransactions(true);
  }
  private jumpRouter(url: string): string {
    if (this.$route.meta && this.$route.meta.type === 'Test') {
      url = '/tokensTest' + url;
    }
    return url;
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
  private async getStats(): Promise<void> {
    this.stats = await this.DRC202ProxyService.stats();
    localStorage.setItem(
      'stats',
      JSON.stringify(
        this.stats,
        (key, value) => (typeof value === 'bigint' ? value.toString() : value) // return everything else unchanged
      )
    );
  }
  private async getLatestTransactions(isInit = false): Promise<void> {
    if (isInit) {
      this.spinning = true;
    }
    try {
      const lastTxns = await this.DRC202ProxyService.getLastTxns();
      console.log(lastTxns);
      if (lastTxns && lastTxns.length) {
        const bucketList = await this.DRC202ProxyService.bucketList();
        const lastIndex = Math.min(lastTxns.length, 10);
        const promiseAllValue = [];
        for (let i = 0; i < lastIndex; i++) {
          promiseAllValue.push(
            this.getTransaction(
              lastTxns[i][0],
              lastTxns[i][1],
              lastTxns[i][3],
              bucketList
            )
          );
          const tokenId = lastTxns[i][1].toString();
          if (!this.tokens[tokenId]) {
            getTokenInfo(lastTxns[i][1]).then((tokenInfo) => {
              this.$set(this.tokens, lastTxns[i][1].toString(), tokenInfo);
            });
          } else if (!this.tokens[tokenId].logo) {
            this.getLogo(tokenId);
          }
        }
        console.log(this.tokens);
        this.latestTransactions = await Promise.all(promiseAllValue);
        console.log(this.latestTransactions);
        if (this.timer) {
          window.clearTimeout(this.timer);
          this.timer = null;
        }
        this.timer = window.setTimeout(() => {
          console.log('setTimeout');
          this.getLatestTransactions();
        }, 60 * 1000);
      }
    } catch (e) {
      console.log(e);
    }
    this.spinning = false;
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
  private async getTxn(
    tokenId: TokenId,
    txid: Txid,
    index: bigint,
    bucketList: Array<Principal>
  ): Promise<Array<LatestTransaction>> {
    console.log(bucketList);
    if ((bucketList && !bucketList[0]) || !bucketList) {
      return [];
    } else {
      let latestTransaction: Array<LatestTransaction> = [];
      for (let i = 0; i < bucketList.length; i++) {
        const currentDRC202BucketService = new DRC202BucketService(
          bucketList[i].toString().toString()
        );
        const txn = await currentDRC202BucketService.txn(tokenId, txid);
        if (txn && txn[0]) {
          latestTransaction = [[...txn[0], index, tokenId]];
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
    bucketList: Array<Principal>
  ): Promise<Array<LatestTransaction> | []> {
    try {
      return await this.getTxn(tokenId, txid, index, bucketList);
    } catch (e) {
      console.log(e);
      return [];
    }
  }
  private onSearch(): void {
    console.log(this.tokenId);
  }
}
</script>
<style lang="scss" scoped>
.token-name {
  display: flex;
  align-items: center;
  dl {
    padding: 0 10px;
  }
  dd {
    font-size: 12px;
  }
}
.token-img {
  width: 30px;
  height: 30px;
  border-radius: 15px;
  object-fit: contain;
  cursor: pointer;
}
.transaction-type {
  word-break: keep-all;
  white-space: nowrap;
  dl {
    padding-right: 10px;
  }
}
</style>
