<template>
  <div class="tx-details">
    <div class="tx-main">
      <div class="tx-main-title"><a-icon type="swap" /> Transaction</div>
      <a-spin :spinning="spinning">
        <div class="tx-item">
          <div class="tx-item-left">Transaction Hash:</div>
          <div class="tx-item-right" v-if="transaction">
            {{ transaction.transaction_hash }}
            <a-icon
              type="copy"
              v-clipboard:copy="transaction.transaction_hash"
              v-clipboard:success="onCopy"
            />
          </div>
          <div class="tx-item-right" v-else>-</div>
        </div>
        <div class="tx-item">
          <div class="tx-item-left">Type:</div>
          <div class="tx-item-right" v-if="transaction">
            {{ transaction.transfer_type | filterType }}
          </div>
          <div class="tx-item-right" v-else>-</div>
        </div>
        <div class="tx-item">
          <div class="tx-item-left">Status:</div>
          <div class="tx-item-right" v-if="transaction">Completed</div>
          <div class="tx-item-right" v-else>-</div>
        </div>
        <div class="tx-item">
          <div class="tx-item-left">Block:</div>
          <div class="tx-item-right" v-if="transaction">
            <a-statistic
              v-if="transaction"
              :value="transaction.block_height"
              :value-style="{ fontSize: '14px', fontWeight: 'normal' }"
            ></a-statistic>
          </div>
          <div class="tx-item-right" v-else>-</div>
        </div>
        <div class="tx-item">
          <div class="tx-item-left">Timestamp:</div>
          <div class="tx-item-right" v-if="transaction">
            {{ transaction.created_at | formatDateFromSecondUTC }}
          </div>
          <div class="tx-item-right" v-else>-</div>
        </div>
        <div class="tx-item">
          <div class="tx-item-left">From:</div>
          <div class="tx-item-right" v-if="transaction">
            <span v-if="transaction.transfer_type === 'mint'">
              Minting Account</span
            >
            <div
              v-if="
                transaction.transfer_type === 'send' ||
                transaction.transfer_type === 'burn' ||
                transaction.transfer_type === 'approve'
              "
            >
              <router-link
                :to="`/ICP/address/${transaction.from_account_identifier}`"
                >{{ transaction.from_account_identifier }}</router-link
              >
              <a-icon
                type="copy"
                v-clipboard:copy="transaction.from_account_identifier"
                v-clipboard:success="onCopy"
              />
            </div>
          </div>
          <div class="tx-item-right" v-else>-</div>
        </div>
        <div class="tx-item">
          <div class="tx-item-left">To:</div>
          <div class="tx-item-right" v-if="transaction">
            <span v-if="transaction.transfer_type === 'approve'"> -</span>
            <span v-if="transaction.transfer_type === 'burn'">
              Minting Account</span
            ><router-link
              v-if="
                transaction.transfer_type === 'send' ||
                transaction.transfer_type === 'mint'
              "
              :to="`/ICP/address/${transaction.to_account_identifier}`"
              >{{ transaction.to_account_identifier }}</router-link
            ><span class="span-nbsp"></span
            ><a-icon
              v-if="
                transaction.transfer_type === 'send' ||
                transaction.transfer_type === 'mint'
              "
              type="copy"
              v-clipboard:copy="transaction.to_account_identifier"
              v-clipboard:success="onCopy"
            />
          </div>
          <div class="tx-item-right" v-else>-</div>
        </div>
        <div
          class="tx-item"
          v-if="transaction && transaction.transfer_type === 'approve'"
        >
          <div class="tx-item-left">Spender:</div>
          <div class="tx-item-right">
            <router-link
              :to="`/ICP/address/${transaction.spender_account_identifier}`"
              >{{ transaction.spender_account_identifier }}</router-link
            ><span class="span-nbsp"></span
            ><a-icon
              type="copy"
              v-clipboard:copy="transaction.spender_account_identifier"
              v-clipboard:success="onCopy"
            />
          </div>
        </div>
        <div class="tx-item">
          <div class="tx-item-left">Amount:</div>
          <div class="tx-item-right" v-if="transaction">
            {{ transaction.amount | bigintToFloat(8) | formatNum
            }}<span class="span-nbsp"></span>ICP
          </div>
          <div class="tx-item-right" v-else>-</div>
        </div>
        <div
          class="tx-item"
          v-if="transaction && transaction.transfer_type === 'approve'"
        >
          <div class="tx-item-left">Expected Allowance:</div>
          <div class="tx-item-right">
            {{ transaction.expected_allowance | bigintToFloat(8) | formatNum }}
            <span class="span-nbsp"></span>ICP
          </div>
        </div>
        <div
          class="tx-item"
          v-if="transaction && transaction.transfer_type === 'approve'"
        >
          <div class="tx-item-left">Allowance:</div>
          <div class="tx-item-right">
            {{ transaction.allowance | bigintToFloat(8) | formatNum }}
            <span class="span-nbsp"></span>ICP
          </div>
        </div>
        <div
          class="tx-item"
          v-if="transaction && transaction.transfer_type === 'approve'"
        >
          <div class="tx-item-left">Expires At:</div>
          <div class="tx-item-right">
            <span v-if="transaction.expires_at">
              {{ transaction.expires_at | formatDateFromSecondUTC }}
            </span>
            <span v-else>-</span>
          </div>
        </div>
        <div class="tx-item">
          <div class="tx-item-left">Fee:</div>
          <div class="tx-item-right" v-if="transaction">
            {{ transaction.fee.toString() | bigintToFloat(8)
            }}<span class="span-nbsp"></span>ICP
          </div>
          <div class="tx-item-right" v-else>-</div>
        </div>
        <div class="tx-item">
          <div class="tx-item-left">Memo:</div>
          <div class="tx-item-right" v-if="transaction">
            {{ transaction.memo.toString() }}
          </div>
          <div class="tx-item-right" v-else>-</div>
        </div>
      </a-spin>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import RosettaApi, { Transaction } from '@/ic/RosettaApi';
import { Route } from 'vue-router/types/router';
import { getTransactionByHash } from '@/ic/ledgerApi';
import { ICPTransaction } from '@/ic/common/transaction';
const rosettaApi = new RosettaApi();

@Component({
  name: 'Transaction',
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
  private spinning = false;
  private transaction: ICPTransaction = null;
  @Watch('$route')
  private onRouteChange(route: Route) {
    console.log(route);
    this.transaction = null;
    const txHash = this.$route.params.hash;
    this.getTxn(txHash);
  }
  created(): void {
    const txHash = this.$route.params.hash;
    this.getTxn(txHash);
  }
  private async getTxn(txHash: string): Promise<void> {
    this.spinning = true;
    try {
      const res = await getTransactionByHash(txHash);
      if (res) {
        this.transaction = res;
      }
      this.spinning = false;
      console.log(res, this.transaction);
    } catch (e) {
      this.spinning = false;
      console.log(e);
    }
  }
  private onCopy(): void {
    this.$message.success('Copied');
  }
}
</script>

<style scoped lang="scss"></style>
