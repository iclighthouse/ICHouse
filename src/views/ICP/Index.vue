<template>
  <div>
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
                  <td class="transaction-index">
                    <dl>
                      <dd>
                        <span>{{ transaction.block_height }}</span>
                      </dd>
                      <dt>
                        <span>{{
                          transaction.transfer_type | filterType
                        }}</span>
                      </dt>
                    </dl>
                  </td>
                  <td>
                    <dl>
                      <dt>
                        <router-link
                          :to="`/ICP/tx/${transaction.transaction_hash}`"
                        >
                          {{
                            transaction.transaction_hash |
                              ellipsis(ellipsisNumber)
                          }}
                        </router-link>
                      </dt>
                      <dd>
                        <span class="time">
                          {{ transaction.created_at | formatDateFromSecondUTC }}
                        </span>
                      </dd>
                    </dl>
                  </td>
                  <td>
                    <dl>
                      <dt>
                        From
                        <span v-if="transaction.transfer_type === 'mint'">
                          Minting Account</span
                        ><router-link
                          v-if="
                            transaction.transfer_type === 'send' ||
                            transaction.transfer_type === 'burn' ||
                            transaction.transfer_type === 'approve'
                          "
                          :to="`/ICP/address/${transaction.from_account_identifier}`"
                          >{{
                            transaction.from_account_identifier |
                              ellipsis(ellipsisNumber)
                          }}</router-link
                        >
                      </dt>
                      <dd>
                        To
                        <span v-if="transaction.transfer_type === 'burn'">
                          Minting Account</span
                        ><router-link
                          v-if="
                            transaction.transfer_type === 'send' ||
                            transaction.transfer_type === 'mint'
                          "
                          :to="`/ICP/address/${transaction.to_account_identifier}`"
                          >{{
                            transaction.to_account_identifier |
                              ellipsis(ellipsisNumber)
                          }}</router-link
                        >
                      </dd>
                    </dl>
                  </td>
                  <td>
                    <div class="transaction-value">
                      {{ transaction.amount | bigintToFloat(8) | formatNum }}
                      ICP
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </a-spin>
        </div>
        <div class="view-all">
          <router-link to="/ICP/txs">
            <a-button type="primary">View all transactions</a-button>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import RosettaApi from '@/ic/RosettaApi';
import { getTransactions } from '@/ic/ledgerApi';
import { ICPTransaction } from '@/ic/common/transaction';
const rosettaApi = new RosettaApi();

@Component({
  name: 'Index',
  components: {},
  filters: {
    filterType(type: string): string {
      if (type === 'send') {
        return 'Transfer';
      } else if (type === 'mint') {
        return 'Mint';
      } else if (type === 'burn') {
        return 'Burn';
      } else if (type === 'approve') {
        return 'Approve';
      }
      return '';
    }
  }
})
export default class extends Vue {
  private latestTransactions: Array<ICPTransaction> = [];
  private spinning = false;
  private ellipsisNumber = 40;
  private timer = null;
  @Watch('innerWidth')
  private onresize(innerWidth: number) {
    if (innerWidth >= 1100) {
      this.ellipsisNumber = 40;
    } else if (innerWidth >= 768) {
      this.ellipsisNumber = 20;
    } else {
      this.ellipsisNumber = 4;
    }
  }
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
    };
    if (this.innerWidth >= 1100) {
      this.ellipsisNumber = 40;
    } else if (this.innerWidth >= 768) {
      this.ellipsisNumber = 20;
    } else {
      this.ellipsisNumber = 4;
    }
  }
  beforeDestroy(): void {
    window.clearTimeout(this.timer);
    this.timer = null;
  }
  created(): void {
    this.getTransactionList();
  }
  private async getTransactionList(isInit = true): Promise<void> {
    if (isInit) {
      this.spinning = true;
    }
    try {
      let lastBlock = 0;
      const res = await rosettaApi.getLastBlockIndex();
      if (typeof res === 'number') {
        lastBlock = res as number;
      }
      const transactions = await getTransactions(lastBlock);
      if (transactions) {
        this.latestTransactions = transactions.blocks;
      } else {
        this.latestTransactions = [];
      }
      console.log(transactions);
      this.timer = window.setTimeout(() => {
        console.log('getTransactionList');
        this.getTransactionList(false);
      }, 60 * 1000);
    } catch (e) {
      console.log(e);
    }
    this.spinning = false;
  }
}
</script>

<style scoped lang="scss">
.latest-transactions-main {
  /* height: 530px;
  overflow-y: auto;*/
}
</style>
