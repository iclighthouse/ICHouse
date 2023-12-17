<template>
  <div class="tx-details">
    <div class="tx-main">
      <div class="tx-main-title">Overview</div>
      <div class="tx-item">
        <div class="tx-item-left">AccountId:</div>
        <div class="tx-item-right">
          {{ accountId }}
          <a-icon
            type="copy"
            v-clipboard:copy="accountId"
            v-clipboard:success="onCopy"
          />
        </div>
      </div>
      <div class="tx-item">
        <div class="tx-item-left">Principal:</div>
        <div class="tx-item-right tx-item-right-column" v-if="principal">
          <div>
            {{ principal }}
            <a-icon
              v-if="principal !== '-'"
              type="copy"
              v-clipboard:copy="principal"
              v-clipboard:success="onCopy"
            />
          </div>
          <div v-show="subaccount">(subaccount: {{ subaccount }})</div>
        </div>
      </div>
      <div class="tx-item">
        <div class="tx-item-left">ICP Balance:</div>
        <div class="tx-item-right">{{ icp }}</div>
      </div>
      <div class="tx-item">
        <div class="tx-item-left">Transactions:</div>
        <div class="tx-item-right">{{ transactionCount }}</div>
      </div>
    </div>
    <div class="icp-transactions-main">
      <div class="icp-transactions-main-tile">Transactions</div>
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
            <span v-if="text.from_account_identifier === accountId">{{
              text.from_account_identifier | ellipsis(6)
            }}</span>
            <router-link
              v-else
              :to="`/ICP/address/${text.from_account_identifier}`"
              >{{ text.from_account_identifier | ellipsis(6) }}</router-link
            >
          </div>
        </div>
        <div slot="To" slot-scope="text">
          <span v-if="text.transfer_type === 'burn'"> Minting Account</span>
          <div v-if="text.transfer_type === 'send'">
            <span v-if="text.to_account_identifier === accountId">{{
              text.to_account_identifier | ellipsis(6)
            }}</span>
            <router-link
              v-else
              :to="`/ICP/address/${text.to_account_identifier}`"
              >{{ text.to_account_identifier | ellipsis(6) }}</router-link
            >
          </div>
          <div v-if="text.transfer_type === 'mint'">
            <span v-if="text.to_account_identifier === accountId">{{
              text.to_account_identifier | ellipsis(6)
            }}</span>
            <router-link
              v-else
              :to="`/ICP/address/${text.to_account_identifier}`"
              >{{ text.to_account_identifier | ellipsis(6) }}</router-link
            >
          </div>
          <div v-if="text.transfer_type === 'approve'">
            <span v-if="text.spender_account_identifier === accountId">{{
              text.spender_account_identifier | ellipsis(6)
            }}</span>
            <router-link
              v-else
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
          :showSizeChanger="true"
          @change="pageChange"
          @showSizeChange="showSizeChange"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import BigNumber from 'bignumber.js';
import {
  hexToBytes,
  toHexString,
  toPrincipalAndAccountId
} from '@/ic/converter';
import { LedgerService } from '@/ic/ledger/ledgerService';
import RosettaApi from '@/ic/RosettaApi';
import { Route } from 'vue-router/types/router';
import { fromAccountId } from '@/ic/fromAccountId';
import { formatNum } from '@/filters';
import { getTransactionsByAccount } from '@/ic/ledgerApi';
import { ICPTransaction } from '@/ic/common/transaction';
const rosettaApi = new RosettaApi();

@Component({
  name: 'Address',
  components: {}
})
export default class extends Vue {
  private ledgerService: LedgerService;
  private accountId = '';
  private principal = '-';
  private subaccount = '';
  private icp = '';
  private decimals = 8;
  private transactionCount: number = null;
  private lastBlock: number = null;
  private spinning = false;
  private transactions: Array<ICPTransaction> = [];
  private page = {
    current: 1,
    pageSize: 10
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
  @Watch('$route')
  private onRouteChange(route: Route) {
    console.log(route);
    this.icp = '';
    this.principal = '-';
    this.accountId = '';
    this.subaccount = '';
    this.transactionCount = null;
    this.lastBlock = null;
    this.transactions = [];
    this.page = {
      current: 1,
      pageSize: 10
    };
    this.init();
  }
  created(): void {
    this.init();
  }
  private async init(): Promise<void> {
    this.ledgerService = new LedgerService();
    const id = this.$route.params.id.trim();
    const res = toPrincipalAndAccountId(id);
    console.log(res);
    this.accountId = res.accountId;
    this.principal = res.principal;
    this.subaccount = res.subaccount;
    if (this.accountId) {
      this.getIcp();
      this.getLastBlockIndex();
    }
    if (this.accountId && !this.principal) {
      const account = await fromAccountId(hexToBytes(this.accountId));
      if (account) {
        this.principal = account.owner.toString();
        if (account.subaccount && account.subaccount.length) {
          this.subaccount = toHexString(new Uint8Array(account.subaccount[0]));
        }
      } else {
        this.principal = '-';
      }
    }
  }
  private async getLastBlockIndex(): Promise<void> {
    try {
      const res = await rosettaApi.getLastBlockIndex();
      if (typeof res === 'number') {
        this.lastBlock = res as number;
        this.getTransactionList();
      }
    } catch (e) {
      console.log(e);
    }
  }
  private async getTransactionList(): Promise<void> {
    this.spinning = true;
    try {
      const res = await getTransactionsByAccount(
        this.accountId,
        this.lastBlock,
        this.page.pageSize,
        (this.page.current - 1) * this.page.pageSize
      );
      console.log(res);
      if (res && res.blocks && res.blocks.length) {
        this.transactions = res.blocks;
        this.transactionCount = res.total;
      } else {
        this.transactions = [];
        this.transactionCount = 0;
      }
    } catch (e) {
      console.log(e);
    }
    this.spinning = false;
  }
  private async getIcp(): Promise<void> {
    const balanceRes = await this.ledgerService.getBalance(this.accountId);
    console.log(balanceRes);
    if (balanceRes?.e8s || Number(balanceRes?.e8s) === 0) {
      this.icp =
        formatNum(
          new BigNumber(balanceRes?.e8s.toString())
            .div(10 ** this.decimals)
            .toString(10)
        ) + ' ICP';
    } else {
      this.icp = '-';
    }
  }
  private onCopy(): void {
    this.$message.success('Copied');
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
.icp-transactions-main {
  background: #fff;
  line-height: 20px;
  box-shadow: 0 2px 4px 0 rgba(0, 140, 238, 0.05);
  border-radius: 4px;
  padding: 10px 20px;
  .icp-transactions-main-tile {
    font-weight: bold;
    padding: 20px 0;
  }
  ::v-deep.ant-table td {
    white-space: nowrap;
  }
}
.icp-transactions-pagination-bottom {
  display: flex;
  .icp-transactions-pagination {
    margin: 15px 0 15px auto;
  }
}
.tx-item-right-column {
  align-items: flex-start !important;
  flex-direction: column;
  line-height: 22px;
}
</style>
