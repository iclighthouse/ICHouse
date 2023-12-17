<template>
  <div class="icp-transactions">
    <div class="icp-transactions-title">
      <a-icon type="swap" /> Transactions
    </div>
    <div class="icp-transactions-main">
      <div class="icp-transactions-main-header">
        <div class="icp-transactions-main-header-left">
          <a-statistic
            v-if="transactionCount"
            :value="transactionCount"
            :value-style="{ fontSize: '14px' }"
          ></a-statistic>
          <span class="span-nbsp"></span>transactions found
        </div>
        <a-pagination
          v-if="transactionCount > page.pageSize"
          class="icp-transactions-pagination-top"
          v-model="page.current"
          :total="transactionCount"
          :showQuickJumper="true"
          :defaultPageSize="page.pageSize"
          @change="pageChange"
        />
      </div>
      <a-table
        :locale="{
          emptyText: 'No transactions'
        }"
        :columns="columns"
        :data-source="transactions"
        :loading="spinning"
        :pagination="false"
        :scroll="scroll"
        :rowKey="
          (record, index) => {
            return index;
          }
        "
      >
        <router-link :to="`/ICP/tx/${hash}`" slot="Hash" slot-scope="hash">
          {{ hash | ellipsis(6) }}
        </router-link>
        <div slot="Time" slot-scope="time">
          {{ time | formatDateFromSecondUTC }}
        </div>
        <div slot="From" slot-scope="text">
          <span v-if="text.transfer_type === 'mint'"> Minting Account</span>
          <div
            v-if="
              text.transfer_type === 'send' ||
              text.transfer_type === 'burn' ||
              text.transfer_type === 'approve'
            "
          >
            <router-link :to="`/ICP/address/${text.from_account_identifier}`">{{
              text.from_account_identifier | ellipsis(6)
            }}</router-link>
          </div>
        </div>
        <div slot="To" slot-scope="text">
          <span v-if="text.transfer_type === 'burn'"> Minting Account</span>
          <div
            v-if="
              text.transfer_type === 'send' || text.transfer_type === 'mint'
            "
          >
            <router-link :to="`/ICP/address/${text.to_account_identifier}`">{{
              text.to_account_identifier | ellipsis(6)
            }}</router-link>
          </div>
          <div v-if="text.transfer_type === 'approve'">
            <router-link
              :to="`/ICP/address/${text.spender_account_identifier}`"
              >{{ text.spender_account_identifier | ellipsis(6) }}</router-link
            >
          </div>
        </div>
      </a-table>
      <div class="icp-transactions-pagination-bottom">
        <a-pagination
          v-if="transactionCount > page.pageSize"
          class="icp-transactions-pagination"
          v-model="page.current"
          :total="transactionCount"
          :showQuickJumper="true"
          :defaultPageSize="page.pageSize"
          @change="pageChange"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import BigNumber from 'bignumber.js';
import RosettaApi from '@/ic/RosettaApi';
import { formatNum } from '@/filters';
import { ICPTransaction } from '@/ic/common/transaction';
import { getTransactions } from '@/ic/ledgerApi';
const rosettaApi = new RosettaApi();

@Component({
  name: 'Transactions',
  components: {}
})
export default class extends Vue {
  private spinning = false;
  private transactionCount: number = null;
  private transactions: Array<ICPTransaction> = [];
  private page = {
    current: 1,
    pageSize: 100
  };
  private columns = [
    {
      title: 'Txn Hash',
      dataIndex: 'transaction_hash',
      scopedSlots: { customRender: 'Hash' }
    },
    {
      title: 'Txn Type',
      dataIndex: 'transfer_type',
      customRender: (text: string): string => {
        if (text === 'send') {
          return 'Transfer';
        } else if (text === 'mint') {
          return 'Mint';
        } else if (text === 'burn') {
          return 'Burn';
        } else if (text === 'approve') {
          return 'Approve';
        }
      }
    },
    {
      title: 'Block',
      dataIndex: 'block_height'
    },
    {
      title: 'Timestamp',
      dataIndex: 'created_at',
      scopedSlots: { customRender: 'Time' }
    },
    {
      title: 'From',
      key: 'from_account_identifier',
      scopedSlots: { customRender: 'From' }
    },
    {
      title: 'To',
      key: 'to_account_identifier',
      scopedSlots: { customRender: 'To' }
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      customRender: (text: string): string => {
        if (text) {
          return (
            formatNum(new BigNumber(text).div(10 ** 8).toString(10)) + ' ICP'
          );
        } else {
          return '';
        }
      }
    },
    {
      title: 'Fee',
      dataIndex: 'fee',
      customRender: (text: BigNumber): string => {
        if (text) {
          return (
            formatNum(new BigNumber(text).div(10 ** 8).toString(10)) + ' ICP'
          );
        } else {
          return '';
        }
      }
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
  created(): void {
    this.getLastBlockIndex();
  }
  private async getLastBlockIndex(): Promise<void> {
    try {
      const res = await rosettaApi.getLastBlockIndex();
      if (typeof res === 'number') {
        this.transactionCount = (res as number) + 1;
        this.getTransactionList();
      }
    } catch (e) {
      console.log(e);
    }
  }
  private async getTransactionList(): Promise<void> {
    this.spinning = true;
    try {
      console.log(this.transactionCount);
      const res = await getTransactions(
        this.transactionCount - 1,
        this.page.pageSize,
        (this.page.current - 1) * this.page.pageSize
      );
      console.log(res);
      if (res) {
        this.transactions = res.blocks;
      }
    } catch (e) {
      console.log(e);
    }
    this.spinning = false;
  }
  private pageChange(): void {
    this.getTransactionList();
  }
  private showSizeChange(current: number, size: number): void {
    this.page = {
      current: current,
      pageSize: size
    };
    this.getTransactionList();
  }
}
</script>

<style scoped lang="scss">
.icp-transactions {
  background: #fff;
  ::v-deep.ant-table td {
    white-space: nowrap;
  }
}
.icp-transactions-title {
  line-height: 20px;
  padding: 10px 0 10px 20px;
  border-bottom: 1px solid #e3e9ed;
  font-weight: bold;
}
.icp-transactions-main {
  background: #fff;
  padding: 15px 20px;
}
.icp-transactions-pagination-bottom {
  display: flex;
  .icp-transactions-pagination {
    margin: 15px 0 15px auto;
  }
}
.icp-transactions-main-header {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  .icp-transactions-pagination-top {
    margin-left: auto;
  }
}
.icp-transactions-main-header-left {
  display: flex;
  align-items: center;
}
@media (max-width: 992px) {
  .icp-transactions-main-header {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
