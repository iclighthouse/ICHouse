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
            <table>
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
                    {{ total - pageSize * (page - 1) - index - 1 }}
                  </td>
                  <td class="table-time">
                    {{ Object.keys(item.payload)[0] }}
                  </td>
                  <td style="word-break: break-all">
                    <div v-if="Object.keys(item.payload)[0] === 'SkippedBlock'">
                      <div>
                        {{ Object.values(item.payload)[0] | filterJson }}
                      </div>
                    </div>
                    <div
                      v-if="
                        Object.keys(item.payload)[0] === 'SignedTransaction'
                      "
                    >
                      <div>
                        withdrawal_id:
                        {{ Object.values(item.payload)[0].withdrawal_id }}
                      </div>
                      <div>
                        raw_transaction:
                        {{ Object.values(item.payload)[0].raw_transaction }}
                      </div>
                    </div>
                    <div v-if="Object.keys(item.payload)[0] === 'Upgrade'">
                      <div>
                        {{ Object.values(item.payload)[0] | filterJson }}
                      </div>
                    </div>
                    <div v-if="Object.keys(item.payload)[0] === 'Init'">
                      <div>
                        {{ Object.values(item.payload)[0] | filterJson }}
                      </div>
                    </div>
                    <div
                      v-if="Object.keys(item.payload)[0] === 'SyncedToBlock'"
                    >
                      <div>
                        {{ Object.values(item.payload)[0] | filterJson }}
                      </div>
                    </div>
                    <div
                      v-if="Object.keys(item.payload)[0] === 'AcceptedDeposit'"
                    >
                      <div>
                        principal:
                        <a
                          :href="`https://ic.house/address/${icTokens[
                            currentIcTokenIndex
                          ][1].ckLedgerId.toString()}/${Object.values(
                            item.payload
                          )[0].principal.toString()}`"
                          target="_blank"
                        >
                          {{
                            Object.values(item.payload)[0].principal.toString()
                          }}
                        </a>
                      </div>
                      <div
                        v-if="
                          tokens &&
                          tokens[
                            icTokens[
                              currentIcTokenIndex
                            ][1].ckLedgerId.toString()
                          ]
                        "
                      >
                        value:
                        {{
                          Object.values(item.payload)[0].value |
                            bigintToFloat(
                              tokens[
                                icTokens[
                                  currentIcTokenIndex
                                ][1].ckLedgerId.toString()
                              ].decimals,
                              tokens[
                                icTokens[
                                  currentIcTokenIndex
                                ][1].ckLedgerId.toString()
                              ].decimals
                            )
                        }}
                        {{
                          tokens[
                            icTokens[
                              currentIcTokenIndex
                            ][1].ckLedgerId.toString()
                          ].symbol
                        }}
                      </div>
                      <div>
                        log_index:
                        {{ Object.values(item.payload)[0].log_index }}
                      </div>
                      <div>
                        from_address:
                        <a
                          :href="`${ethLink}/address/${
                            Object.values(item.payload)[0].from_address
                          }`"
                          target="_blank"
                        >
                          {{ Object.values(item.payload)[0].from_address }}
                        </a>
                      </div>
                      <div>
                        block_number:
                        {{ Object.values(item.payload)[0].block_number }}
                      </div>
                      <div>
                        transaction_hash:
                        <a
                          :href="`${ethLink}/tx/${
                            Object.values(item.payload)[0].transaction_hash
                          }`"
                          target="_blank"
                        >
                          {{ Object.values(item.payload)[0].transaction_hash }}
                        </a>
                      </div>
                    </div>
                    <div
                      v-if="
                        Object.keys(item.payload)[0] === 'ReplacedTransaction'
                      "
                    >
                      <div>
                        {{ Object.values(item.payload)[0] | filterJson }}
                      </div>
                    </div>
                    <div v-if="Object.keys(item.payload)[0] === 'MintedCkEth'">
                      <div>
                        mint_block_index:
                        {{ Object.values(item.payload)[0].mint_block_index }}
                      </div>
                      <div>
                        log_index:
                        {{
                          Object.values(item.payload)[0].event_source.log_index
                        }}
                      </div>
                      <div>
                        transaction_hash:
                        <a
                          :href="`${ethLink}/tx/${
                            Object.values(item.payload)[0].event_source
                              .transaction_hash
                          }`"
                          target="_blank"
                        >
                          {{
                            Object.values(item.payload)[0].event_source
                              .transaction_hash
                          }}
                        </a>
                      </div>
                    </div>
                    <div
                      v-if="
                        Object.keys(item.payload)[0] ===
                        'ReimbursedEthWithdrawal'
                      "
                    >
                      <div>
                        {{ Object.values(item.payload)[0] | filterJson }}
                      </div>
                    </div>
                    <div
                      v-if="
                        Object.keys(item.payload)[0] === 'CreatedTransaction'
                      "
                    >
                      <div>
                        {{ Object.values(item.payload)[0] | filterJson }}
                      </div>
                    </div>
                    <div
                      v-if="Object.keys(item.payload)[0] === 'InvalidDeposit'"
                    >
                      <div>
                        reason:
                        {{ Object.values(item.payload)[0].reason }}
                      </div>
                      <div>
                        log_index:
                        {{
                          Object.values(item.payload)[0].event_source.log_index
                        }}
                      </div>
                      <div>
                        transaction_hash:
                        <a
                          :href="`${ethLink}/tx/${
                            Object.values(item.payload)[0].event_source
                              .transaction_hash
                          }`"
                          target="_blank"
                        >
                          {{
                            Object.values(item.payload)[0].event_source
                              .transaction_hash
                          }}
                        </a>
                      </div>
                    </div>
                    <div
                      v-if="
                        Object.keys(item.payload)[0] ===
                        'AcceptedEthWithdrawalRequest'
                      "
                    >
                      <div>
                        account:{
                        <a
                          :href="`https://ic.house/address/${icTokens[
                            currentIcTokenIndex
                          ][1].ckLedgerId.toString()}/${Object.values(
                            item.payload
                          )[0].from.toString()}.${arrayToHexString(
                            Object.values(item.payload)[0].from_subaccount[0]
                          )}`"
                          target="_blank"
                        >
                          owner:
                          {{ Object.values(item.payload)[0].from.toString() }},
                          subaccount:
                          {{
                            arrayToHexString(
                              Object.values(item.payload)[0].from_subaccount[0]
                            )
                          }}
                        </a>
                        }
                      </div>
                      <div
                        v-if="
                          tokens &&
                          tokens[
                            icTokens[
                              currentIcTokenIndex
                            ][1].ckLedgerId.toString()
                          ]
                        "
                      >
                        withdrawal_amount:
                        {{
                          Object.values(item.payload)[0].withdrawal_amount |
                            bigintToFloat(
                              tokens[
                                icTokens[
                                  currentIcTokenIndex
                                ][1].ckLedgerId.toString()
                              ].decimals,
                              tokens[
                                icTokens[
                                  currentIcTokenIndex
                                ][1].ckLedgerId.toString()
                              ].decimals
                            )
                        }}
                        {{
                          tokens[
                            icTokens[
                              currentIcTokenIndex
                            ][1].ckLedgerId.toString()
                          ].symbol
                        }}
                      </div>
                      <div>
                        ledger_burn_index:
                        {{ Object.values(item.payload)[0].ledger_burn_index }}
                      </div>
                      <div>
                        destination:
                        {{ Object.values(item.payload)[0].destination }}
                      </div>
                      <div
                        v-if="
                          Object.values(item.payload)[0].created_at &&
                          Object.values(item.payload)[0].created_at.length
                        "
                      >
                        created_at:
                        {{
                          Object.values(item.payload)[0].created_at[0] |
                            formatDateFromNanosecond
                        }}
                      </div>
                    </div>
                    <div
                      v-if="
                        Object.keys(item.payload)[0] === 'FinalizedTransaction'
                      "
                    >
                      <div>
                        transaction_hash:
                        <a
                          :href="`${ethLink}/tx/${
                            Object.values(item.payload)[0].transaction_receipt
                              .transaction_hash
                          }`"
                          target="_blank"
                        >
                          {{
                            Object.values(item.payload)[0].transaction_receipt
                              .transaction_hash
                          }}
                        </a>
                      </div>
                      <div>
                        {{ Object.values(item.payload)[0] | filterJson }}
                      </div>
                    </div>
                  </td>
                  <td class="table-time">
                    {{ item.timestamp | formatDateFromNanosecond }}
                  </td>
                </tr>
              </tbody>
            </table>
            <div class="transactions-pagination-bottom">
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
          </a-spin>
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { CkToken, IcTokenInfo } from '@/ic/icETHMinter/model';
import { TokenInfo } from '@/ic/common/icType';
import { getTokenInfo } from '@/ic/getTokenInfo';
import { CK_ETH_LEDGER_CANISTER_ID } from '@/ic/utils';
import { toHexString } from '@/ic/converter';
import { Principal } from '@dfinity/principal';
import { ckETHMinterDfiService } from '@/ic/ckETHMinter/ckETHMinterDfiService';
import BigNumber from 'bignumber.js';
import { ETHEvent } from '@/ic/ckETHMinter/model';

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
  private ckETHMinterService: ckETHMinterDfiService = null;
  private activeKey = 'Activities';
  private icTokens: Array<CkToken> = [];
  private currentIcTokenIndex: number = null;
  private tokens: { [key: string]: TokenInfo } = {};
  private loading = false;
  private page = 1;
  private pageSize = 100;
  private total = 0;
  private events: Array<ETHEvent> = [];
  private ethLink = 'https://etherscan.io';
  private ethAddressToIcEthAddress: { [key: string]: string } = {};
  private icEthAddressToEthAddress: { [key: string]: string } = {};
  private tokenInfo: { [key: string]: IcTokenInfo } = {};
  created(): void {
    this.tokens = JSON.parse(localStorage.getItem('tokens')) || {};
    this.ckETHMinterService = new ckETHMinterDfiService();
    this.getCkTokens();
  }
  private changeTab(activeKey: string) {
    this.activeKey = activeKey;
    if (activeKey === 'Activities') {
      //
    }
  }
  private async getCkTokens(): Promise<void> {
    const smart_contract_address =
      await this.ckETHMinterService.smart_contract_address();
    this.currentIcTokenIndex = 0;
    this.icTokens = [
      [
        smart_contract_address,
        {
          fee: null,
          std: { ETH: null },
          decimals: 18,
          dexPrice: null,
          tokenId: smart_contract_address,
          minAmount: BigInt('10000000000000000'),
          totalSupply: null,
          ckLedgerId: Principal.fromText(CK_ETH_LEDGER_CANISTER_ID),
          ckSymbol: '',
          symbol: '',
          dexPair: null
        }
      ]
    ];
    this.icTokens.forEach((item) => {
      this.ethAddressToIcEthAddress[item[0]] = item[1].ckLedgerId.toString();
      this.icEthAddressToEthAddress[item[1].ckLedgerId.toString()] = item[0];
      this.tokenInfo[item[0]] = item[1];
      getTokenInfo(item[1].ckLedgerId).then((tokenInfo) => {
        this.$set(this.tokens, item[1].ckLedgerId.toString(), tokenInfo);
      });
    });
    this.getEvents();
  }
  private pageChange(): void {
    this.getEvents();
  }
  private async getEvents(): Promise<void> {
    this.loading = true;
    this.events = [];
    if (!this.total) {
      const events = await this.ckETHMinterService.get_events({
        start: BigInt(0),
        length: BigInt(1)
      });
      if (events) {
        this.total = Number(events.total_event_count);
      }
    }
    let start = new BigNumber(this.total.toString(10))
      .minus(this.pageSize * this.page)
      .toString();
    if (new BigNumber(start).lt(0)) {
      start = '0';
    }
    let length = this.pageSize;
    if (this.pageSize * this.page > this.total) {
      length = this.pageSize + this.total - this.pageSize * this.page;
    }
    console.log(start, length);
    const res = await this.ckETHMinterService.get_events({
      start: BigInt(start),
      length: BigInt(length)
    });
    if (res) {
      this.events = res.events.sort((a, b) => -1);
    }
    console.log(this.events);
    this.loading = false;
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
