<template>
  <div class="tx-details">
    <div class="tx-main">
      <div class="tx-main-title">
        <img
          class="logo"
          v-if="tokens && tokenId && tokens[tokenId] && tokens[tokenId].logo"
          :src="tokens[tokenId].logo"
          alt=""
        />
        Token
      </div>
      <div class="tx-item">
        <div class="tx-item-left">TokenId:</div>
        <div class="tx-item-right" v-if="tokenId">
          {{ tokenId }}<span class="span-nbsp"></span>
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
        <div class="tx-item-left">Decimals:</div>
        <div class="tx-item-right" v-if="tokens && tokenId && tokens[tokenId]">
          {{ tokens[tokenId].decimals }}
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
      <div class="tx-item">
        <div class="tx-item-left">Max Supply:</div>
        <div
          class="tx-item-right"
          v-if="
            tokens && tokenId && tokens[tokenId] && tokens[tokenId].maxSupply
          "
        >
          {{
            tokens[tokenId].maxSupply |
              bigintToFloat(
                tokens[tokenId].decimals,
                tokens[tokenId].decimals
              ) |
              formatNum
          }}
        </div>
        <div v-else>-</div>
      </div>
      <div class="tx-item">
        <div class="tx-item-left">Fee:</div>
        <div class="tx-item-right" v-if="tokens && tokenId && tokens[tokenId]">
          {{ tokens[tokenId] | filterGas }}
        </div>
      </div>
      <div class="tx-item">
        <div class="tx-item-left">Social Profiles:</div>
        <div class="tx-item-right" v-if="tokens && tokenId && tokens[tokenId]">
          <div
            class="metadata-item"
            v-for="(item, index) in metadata"
            :key="index"
          >
            <div class="metadata-item-info" v-if="item.name !== 'logo'">
              <span v-show="!item.content">
                <a-icon v-if="item.name === 'webUrl'" type="global" />
                <a-icon v-if="item.name === 'twitter'" type="twitter" />
                <svg
                  style="margin-bottom: -2px"
                  v-if="item.name === 'medium'"
                  t="1641868703609"
                  class="icon"
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  p-id="3423"
                  width="14"
                  height="14"
                  fill="currentColor"
                >
                  <path
                    d="M544 512c0 149.98-114.84 272-256 272S32 661.98 32 512s114.84-272 256-272 256 122.02 256 272z m416-256a32 32 0 0 0-32 32v448a32 32 0 0 0 64 0V288a32 32 0 0 0-32-32z m-224 0c-22.732 0-65.6 11.04-97.296 85.004C618.904 387.204 608 447.932 608 512s10.904 124.8 30.704 170.996C670.404 756.956 713.268 768 736 768s65.6-11.04 97.296-85.004C853.096 636.796 864 576.068 864 512s-10.904-124.8-30.704-170.996C801.596 267.044 758.732 256 736 256z"
                    p-id="3424"
                  ></path>
                </svg>
                <svg
                  style="margin-bottom: -2px"
                  v-if="item.name === 'forum'"
                  t="1641868970469"
                  class="icon"
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  p-id="4309"
                  width="14"
                  height="14"
                  fill="currentColor"
                >
                  <path
                    d="M896 256l-85.333333 0 0 384L256 640l0 85.333333c0 25.6 17.066667 42.666667 42.666667 42.666667l469.333333 0 170.666667 170.666667L938.666667 298.666667C938.666667 273.066667 921.6 256 896 256zM725.333333 512 725.333333 128c0-25.6-17.066667-42.666667-42.666667-42.666667L128 85.333333C102.4 85.333333 85.333333 102.4 85.333333 128l0 597.333333 170.666667-170.666667 426.666667 0C708.266667 554.666667 725.333333 537.6 725.333333 512z"
                    p-id="4310"
                  ></path>
                </svg>
              </span>
              <a
                v-show="item.content"
                :href="item.content"
                target="_blank"
                rel="nofollow noreferrer noopener"
              >
                <a-icon v-if="item.name === 'webUrl'" type="global" />
                <a-icon v-if="item.name === 'twitter'" type="twitter" />
                <svg
                  v-if="item.name === 'medium'"
                  t="1641868703609"
                  class="icon"
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  p-id="3423"
                  width="14"
                  height="14"
                  fill="currentColor"
                >
                  <path
                    d="M544 512c0 149.98-114.84 272-256 272S32 661.98 32 512s114.84-272 256-272 256 122.02 256 272z m416-256a32 32 0 0 0-32 32v448a32 32 0 0 0 64 0V288a32 32 0 0 0-32-32z m-224 0c-22.732 0-65.6 11.04-97.296 85.004C618.904 387.204 608 447.932 608 512s10.904 124.8 30.704 170.996C670.404 756.956 713.268 768 736 768s65.6-11.04 97.296-85.004C853.096 636.796 864 576.068 864 512s-10.904-124.8-30.704-170.996C801.596 267.044 758.732 256 736 256z"
                    p-id="3424"
                  ></path>
                </svg>
                <svg
                  v-if="item.name === 'forum'"
                  t="1641868970469"
                  class="icon"
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  p-id="4309"
                  width="14"
                  height="14"
                  fill="currentColor"
                >
                  <path
                    d="M896 256l-85.333333 0 0 384L256 640l0 85.333333c0 25.6 17.066667 42.666667 42.666667 42.666667l469.333333 0 170.666667 170.666667L938.666667 298.666667C938.666667 273.066667 921.6 256 896 256zM725.333333 512 725.333333 128c0-25.6-17.066667-42.666667-42.666667-42.666667L128 85.333333C102.4 85.333333 85.333333 102.4 85.333333 128l0 597.333333 170.666667-170.666667 426.666667 0C708.266667 554.666667 725.333333 537.6 725.333333 512z"
                    p-id="4310"
                  ></path>
                </svg>
              </a>
            </div>
          </div>
          <div v-if="!metadata">-</div>
        </div>
      </div>
      <div class="tx-item">
        <div class="tx-item-left">Account Id:</div>
        <div class="tx-item-right" v-if="tokenId">
          {{ tokenId | tokenIdToAccount }}
        </div>
      </div>
      <div class="tx-item">
        <div class="tx-item-left">ICP Balance:</div>
        <div class="tx-item-right" v-if="tokenId">
          {{ icp }}
        </div>
      </div>
      <div class="tx-item">
        <div class="tx-item-left">Canister Status:</div>
        <div class="tx-item-right" v-if="isController && status">
          <span class="token-status" :class="Object.keys(status.status)[0]">{{
            Object.keys(status.status)[0]
          }}</span>
        </div>
        <div class="tx-item-right" v-if="!isController">
          <a-popover trigger="click" placement="bottom">
            <template slot="content">
              <div class="set-controller">
                <p>
                  Implement the
                  <a
                    href="https://github.com/iclighthouse/DRC_standards/tree/main/DRC207"
                    target="_blank"
                    >DRC207</a
                  >
                  standard to allow querying the token canister status.
                </p>
                <!--<div>
                                                Set Blackhole (7hdtw-jqaaa-aaaak-aaccq-cai) as controller of
                                                canister. For example.
                                              </div>
                                              <div class="code-img">
                                                <span v-clipboard:copy="code" v-clipboard:success="onCopy"
                                                  >Copy <a-icon type="copy"
                                                /></span>
                                                <img src="@/assets/img/code.png" alt="" />
                                              </div>
                                              <p>About the blackhole canister:</p>
                                              <div>Canister id: 7hdtw-jqaaa-aaaak-aaccq-cai</div>
                                              <div>
                                                ModuleHash(dfx: 0.8.4):
                                                603692eda4a0c322caccaff93cf4a21dc44aebad6d71b40ecefebef89e55f3be
                                              </div>
                                              <div>Controllers: 7hdtw-jqaaa-aaaak-aaccq-cai</div>
                                              &lt;!&ndash;<div><a-icon type="github" /></div>&ndash;&gt;
                                              <div>
                                                <a
                                                  href="https://github.com/iclighthouse/ICMonitor/blob/main/Blackhole.mo"
                                                  target="_blank"
                                                  >Github</a
                                                >
                                              </div>-->
              </div> </template
            ><span class="show-status"
              >If you are the controller of the canister, how to allow showing
              the canister status?</span
            ></a-popover
          >
        </div>
      </div>
      <div class="tx-item">
        <div class="tx-item-left">Module Hash:</div>
        <div class="tx-item-right" v-if="tokenInfo">
          {{ tokenInfo.moduleHash }}
        </div>
      </div>
      <div class="tx-item">
        <div class="tx-item-left">Controllers:</div>
        <div class="tx-item-right tx-item-right-controllers" v-if="tokenInfo">
          <div v-for="(item, index) in tokenInfo.controllers" :key="index">
            {{ item }}
          </div>
        </div>
      </div>
      <div class="tx-item">
        <div class="tx-item-left">Cycles Balance:</div>
        <div class="tx-item-right" v-if="status && status.cycles">
          <a-statistic
            :value="status.cycles.toString()"
            :value-style="{ fontSize: '14px', fontWeight: 'normal' }"
            suffix="Cycles"
          ></a-statistic>
        </div>
        <div class="tx-item-right" v-else>-</div>
      </div>
      <div class="tx-item">
        <div class="tx-item-left">Memory Size:</div>
        <div class="tx-item-right" v-if="status && status.memory_size">
          <a-statistic
            :value="status.memory_size.toString()"
            :value-style="{ fontSize: '14px', fontWeight: 'normal' }"
            suffix="Bytes"
          ></a-statistic>
        </div>
        <div class="tx-item-right" v-else>-</div>
      </div>
    </div>
    <!--<div class="token-main">
        <div class="token-pairs">
          <div class="tx-item">
            <div class="tx-item-left">Trading Pairs:</div>
            <div class="tx-item-right">
              <span v-for="(pair, index) in pairs" :key="index">{{ index }}</span>
            </div>
          </div>
        </div>
    </div>-->
    <div class="token-tab">
      <a-tabs :active-key="activeKey" @change="changeTab">
        <a-tab-pane key="Transactions" tab="Transactions">
          <div class="a-tab-content">
            <transactions :token-id="tokenId" ref="transactions"></transactions>
          </div>
        </a-tab-pane>
        <a-tab-pane key="Top100" tab="Top100 Holders">
          <a-spin :spinning="top100Loading">
            <div class="a-tab-content">
              <table>
                <thead class="ant-table-thead">
                  <tr>
                    <th>Rank</th>
                    <th>Address</th>
                    <th>Quantity</th>
                    <th>Percentage</th>
                  </tr>
                </thead>
                <tbody class="ant-table-tbody">
                  <tr v-for="(item, index) in currentHolders" :key="index">
                    <td>{{ (current - 1) * pageSize + 1 + index }}</td>
                    <td>
                      <router-link
                        :to="jumpRouter(`/address/${tokenId}/${item[0]}`)"
                        >{{ item[0] }}</router-link
                      >
                    </td>
                    <td>
                      <span v-if="tokenId && tokens[tokenId]">
                        {{
                          item[1] |
                            bigintToFloat(
                              tokens[tokenId].decimals,
                              tokens[tokenId].decimals
                            )
                        }}
                        <!--{{ tokens[tokenId].symbol }}-->
                      </span>
                    </td>
                    <td>{{ percentage(item[1]) }}</td>
                  </tr>
                  <tr v-if="!currentHolders.length">
                    <td colspan="4" class="no-tokens">No data</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <a-pagination
              v-if="total > pageSize"
              style="margin-right: 15px"
              class="ant-table-pagination ant-pagination"
              v-model="current"
              :total="total"
              :defaultPageSize="pageSize"
              @change="pageChange"
            />
          </a-spin>
        </a-tab-pane>
        <a-tab-pane key="DID" tab="DID">
          <div class="card-container">
            <a-tabs type="card" v-if="did.candid">
              <a-tab-pane v-for="item in didMenu" :key="item" :tab="item">
                <div class="a-tab-did">
                  <div
                    class="copy-did"
                    v-clipboard:copy="did[item]"
                    v-clipboard:success="onCopy"
                  >
                    Copy <a-icon type="copy" />
                  </div>
                  <highlightjs :language="item" :code="did[item]" />
                </div>
              </a-tab-pane>
            </a-tabs>
          </div>
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { Principal } from '@dfinity/principal';
import { IDL } from '@dfinity/candid';
import {
  QueryResponseReplied,
  HttpAgent,
  CanisterStatus
} from '@dfinity/agent';
import BigNumber from 'bignumber.js';
import { TokenInfo, Metadata, PrincipalString } from '@/ic/common/icType';
import { getLogo, getTokenInfo } from '@/ic/getTokenInfo';
import { DRC20TokenService } from '@/ic/DRC20Token/DRC20TokenService';
import { BlackholeService } from '@/ic/blackhole/blackholeService';
import { CanisterStatusToken, Top100Record } from '@/ic/DRC20Token/model';
import { CandidEnum, TabKeyType } from '@/views/Token/model';
import Transactions from '@/components/transactions/Index.vue';
import { readState } from '@/ic/readState';
import { principalToAccountIdentifier } from '@/ic/converter';
import { LedgerService } from '@/ic/ledger/ledgerService';
import { Route } from 'vue-router';
import { SwapPair } from '@/ic/ICSwapRouter/model';
import { DIDGenerateService } from '@/ic/DIDGenerate/DIDGenerateService';

@Component({
  name: 'Index',
  components: {
    Transactions
  },
  filters: {
    tokenIdToAccount(tokenId: string): string {
      if (tokenId) {
        return principalToAccountIdentifier(Principal.fromText(tokenId));
      }
      return '';
    },
    filterGas(tokenInfo: TokenInfo): string {
      if (tokenInfo && tokenInfo.fee) {
        const gas = tokenInfo.fee;
        if (typeof gas === 'string' || typeof gas === 'bigint') {
          return `token: ${new BigNumber(gas.toString())
            .div(10 ** tokenInfo.decimals)
            .toString(10)}`;
        }
        const { token } = gas as { token: bigint };
        if (token) {
          return `token: ${new BigNumber(token.toString())
            .div(10 ** tokenInfo.decimals)
            .toString(10)}`;
        }
        const { cycles } = gas as { cycles: bigint };
        if (cycles) {
          return `cycles: ${cycles}`;
        }
        return 'noFee';
      }
      return '-';
    }
  }
})
export default class extends Vue {
  private ledgerService: LedgerService;
  private DIDGenerateService: DIDGenerateService = null;
  private tokenId = '';
  private decimals = 8;
  private icp = '';
  private tokens: { [key: string]: TokenInfo } = {};
  private metadata: Array<Metadata> = [];
  private didMenu = CandidEnum;
  private did = {
    candid: '',
    motoko: '',
    javascript: '',
    typescript: ''
  };
  private activeKey = 'Transactions';
  private isController = true;
  private status: CanisterStatusToken = null;
  private tokenInfo: {
    controllers: Array<PrincipalString>;
    moduleHash: string;
  } = null;
  private top100Loading = false;
  private current = 1;
  private total = 0;
  private pageSize = 20;
  private top100Holders: Array<Top100Record> = [];
  private currentHolders: Array<Top100Record> = [];
  private pairs: Array<[Principal, [SwapPair, bigint]]> = [];
  @Watch('$route')
  private onRouteChange(to: Route, from: Route) {
    if (
      (to.name === 'Token' && to.params.tokenId !== this.tokenId) ||
      from.name === 'Home' ||
      from.name === 'Transactions'
    ) {
      this.metadata = [];
      this.did = {
        candid: '',
        motoko: '',
        javascript: '',
        typescript: ''
      };
      this.activeKey = 'Transactions';
      this.isController = true;
      this.status = null;
      this.tokenInfo = null;
      this.current = 1;
      this.total = 0;
      this.pageSize = 10;
      this.top100Holders = [];
      this.currentHolders = [];
      this.init();
      this.getCanisterStatus();
      this.getCandidInterfaceTmpHack();
    }
  }
  created(): void {
    this.ledgerService = new LedgerService();
    this.DIDGenerateService = new DIDGenerateService();
    this.init();
    this.getCanisterStatus();
    this.getCandidInterfaceTmpHack();
  }
  private async getPairs(): Promise<void> {
    const currentDRC20TokenService = new DRC20TokenService(this.tokenId);
    this.pairs = await currentDRC20TokenService.drc204Pairs();
    console.log(this.pairs);
  }
  private async getIcp(): Promise<void> {
    const balanceRes = await this.ledgerService.getBalance(
      principalToAccountIdentifier(Principal.fromText(this.tokenId))
    );
    console.log(balanceRes);
    if (balanceRes?.e8s || Number(balanceRes?.e8s) === 0) {
      this.icp =
        new BigNumber(balanceRes?.e8s.toString())
          .div(10 ** this.decimals)
          .toString(10) + ' ICP';
    } else {
      this.icp = '-';
    }
  }
  private jumpRouter(url: string): string {
    if (this.$route.meta && this.$route.meta.type === 'Test') {
      url = '/tokensTest' + url;
    }
    return url;
  }
  private async getCandidInterfaceTmpHack(): Promise<void> {
    try {
      let candid;
      const agent = new HttpAgent({ host: 'https://ic0.app/' });
      const status = await CanisterStatus.request({
        agent,
        canisterId: Principal.fromText(this.tokenId),
        paths: ['candid']
      });
      candid = status.get('candid') as string | null;
      if (!candid) {
        const DRC20Token = new DRC20TokenService(this.tokenId);
        const res = await DRC20Token.getCandidInterfaceTmpHack(
          this.tokenId,
          '__get_candid_interface_tmp_hack',
          Buffer.from([68, 73, 68, 76, 0, 0]) // Null
        );
        if ((res as QueryResponseReplied).status) {
          candid = IDL.decode(
            [IDL.Text],
            Buffer.from((res as QueryResponseReplied).reply.arg)
          )[0] as string;
        }
      }
      if (candid) {
        this.did.candid = candid;
        this.DIDGenerateService.did_to_js(candid).then((res) => {
          if (res && res.length) {
            this.$set(this.did, 'javascript', res[0]);
            // const did = res[0]
            //   .replace(/export default\s+/, 'return ')
            //   .replace('export', '');
          }
        });
        this.DIDGenerateService.binding(candid, 'ts').then((res) => {
          if (res && res.length) {
            this.$set(this.did, 'typescript', res[0]);
          }
        });
        this.DIDGenerateService.binding(candid, 'mo').then((res) => {
          if (res && res.length) {
            this.$set(this.did, 'motoko', res[0]);
          }
        });
      }
    } catch (e) {
      console.log(e);
    }
  }
  private changeTab(activeKey: TabKeyType) {
    console.log(activeKey);
    this.activeKey = activeKey;
    // if (activeKey === 'Transactions') {
    //   (this.$refs.transactions as any).init();
    // } else if (activeKey === 'Top100') {
    //   this.current = 1;
    //   this.top100Holders = [];
    //   this.currentHolders = [];
    //   this.total = 0;
    //   this.getTop100();
    // }
  }
  private percentage(quantity: bigint): string {
    if (quantity && this.tokens && this.tokenId && this.tokens[this.tokenId]) {
      return (
        new BigNumber(quantity.toString())
          .div(this.tokens[this.tokenId].totalSupply.toString())
          .times(100)
          .decimalPlaces(4)
          .toString(10) + '%'
      );
    } else {
      return '';
    }
  }
  private async getTop100(): Promise<void> {
    this.top100Loading = true;
    try {
      const DRC20Token = new DRC20TokenService(this.tokenId);
      this.top100Holders = await DRC20Token.top100();
      this.currentHolders = this.top100Holders.slice(0, this.pageSize);
      this.total = this.top100Holders.length;
    } catch (e) {
      console.log(e);
    }
    this.top100Loading = false;
  }
  private pageChange(page: number): void {
    const max = Math.min(page * this.pageSize, this.top100Holders.length);
    this.currentHolders = this.top100Holders.slice(
      (page - 1) * this.pageSize,
      max
    );
  }
  private init(): void {
    this.tokenId = this.$route.params.tokenId;
    this.tokens = JSON.parse(localStorage.getItem('tokens')) || {};
    if (this.tokenId) {
      this.getIcp();
      let tokenStd = null;
      if (this.tokens[this.tokenId] && this.tokens[this.tokenId].tokenStd) {
        tokenStd = this.tokens[this.tokenId].tokenStd;
      }
      getTokenInfo(Principal.fromText(this.tokenId), tokenStd).then(
        async (tokenInfo) => {
          this.$set(this.tokens, this.tokenId, tokenInfo);
          await this.getLogo(this.tokenId);
        }
      );
      console.log(this.tokens[this.tokenId]);
      this.getTokenMetadata();
    }
    this.$nextTick(() => {
      (this.$refs.transactions as any).init();
    });
    this.getTop100();
    // this.getPairs();
  }
  private async getLogo(tokenId: string): Promise<void> {
    let logo = '';
    if (this.tokens[tokenId] && !this.tokens[tokenId].logo) {
      logo = await getLogo(
        Principal.fromText(tokenId),
        this.tokens[tokenId].tokenStd
      );
      this.$set(this.tokens[tokenId], 'logo', logo);
    }
  }
  private async getCanisterStatusFromBlackhole(
    blackholeId: string
  ): Promise<void> {
    const blackholeService = new BlackholeService(blackholeId);
    this.status = await blackholeService.getCanisterStatus(this.tokenId);
  }
  private async getCanisterStatus(): Promise<void> {
    const res = await readState(this.tokenId);
    if (res) {
      this.tokenInfo = {
        moduleHash: res.moduleHash,
        controllers: res.controllers
      };
    }
    const DRC20Token = new DRC20TokenService(this.tokenId);
    if (this.tokenInfo.controllers.includes('7hdtw-jqaaa-aaaak-aaccq-cai')) {
      this.getCanisterStatusFromBlackhole('7hdtw-jqaaa-aaaak-aaccq-cai');
    } else if (
      this.tokenInfo.controllers.includes('e3mmv-5qaaa-aaaah-aadma-cai')
    ) {
      this.getCanisterStatusFromBlackhole('e3mmv-5qaaa-aaaah-aadma-cai');
    } else if (this.tokenInfo.controllers.includes(this.tokenId)) {
      try {
        this.status = await DRC20Token.canister_status();
      } catch (e) {
        if (e.message.includes('is stopped')) {
          if (!this.status) {
            this.status = {};
          }
          this.status.status = { stopped: null };
        }
      }
    } else {
      try {
        const drc207 = await DRC20Token.drc207();
        if (drc207) {
          console.log(drc207);
          const blackhole =
            drc207.monitorable_by_blackhole.canister_id[0].toString();
          if (this.tokenInfo.controllers.includes(blackhole)) {
            this.getCanisterStatusFromBlackhole(blackhole);
          } else {
            this.isController = false;
            this.status = null;
          }
        } else {
          this.isController = false;
          this.status = null;
        }
      } catch (e) {
        if (e.message.includes('is stopped')) {
          if (!this.status) {
            this.status = {};
          }
          this.status.status = { stopped: null };
        } else {
          this.isController = false;
          this.status = null;
        }
      }
    }
  }
  private async getTokenMetadata(): Promise<void> {
    try {
      const DRC20Token = new DRC20TokenService(this.tokenId.toString());
      this.metadata = await DRC20Token.metadata();
      const metadataType = [];
      this.metadata.forEach((val) => {
        metadataType.push(val.name);
      });
      // todo
      if (!metadataType.includes('webUrl')) {
        this.metadata.push({ name: 'webUrl', content: '' });
      }
      if (!metadataType.includes('twitter')) {
        this.metadata.push({ name: 'twitter', content: '' });
      }
      if (!metadataType.includes('medium')) {
        this.metadata.push({ name: 'medium', content: '' });
      }
      if (!metadataType.includes('forum')) {
        this.metadata.push({ name: 'forum', content: '' });
      }
      console.log(this.metadata);
    } catch (e) {
      console.log(e);
    }
  }
  private onCopy(): void {
    this.$message.success('Copied');
  }
}
</script>

<style scoped lang="scss">
.token-main {
  display: flex;
  /*.tx-main {
    width: 67%;
  }
  .token-pairs {
    width: 33%;
    margin: 20px 0 20px 10px;
    background: #fff;
    line-height: 20px;
    box-shadow: 0 2px 4px 0 rgba(0, 140, 238, 0.05);
    border-radius: 4px;
    .tx-item {
      padding: 10px 20px;
      font-size: 14px;
      border-bottom: 1px solid #e3e9ed;
    }
  }*/
}
.tx-main-title {
  line-height: 30px;
  .logo {
    width: 30px;
    height: 30px;
    margin-right: 8px;
    border-radius: 15px;
    object-fit: contain;
  }
}
.tx-item-right {
  ::v-deep .ant-statistic-content-suffix {
    font-size: 14px;
    font-weight: normal;
  }
  .metadata-item {
    display: inline-block;
    a,
    span {
      padding: 0 3px;
    }
  }
  i {
    cursor: default !important;
  }
  a {
    i {
      cursor: pointer !important;
    }
  }
}
.set-controller {
  padding: 5px;
  p {
    color: #333;
    font-weight: bold;
    font-size: 16px;
  }
}
.code-img {
  position: relative;
  width: 600px;
  margin: 10px 0 20px;
  span {
    position: absolute;
    right: 10px;
    top: 8px;
    cursor: pointer;
    color: #0862bc;
  }
  img {
    width: 600px;
    border-radius: 3px;
  }
}
.show-status {
  cursor: pointer;
  color: #0862bc;
}
.token-tab {
  background: #fff;
  line-height: 20px;
  box-shadow: 0 2px 4px 0 rgba(0, 140, 238, 0.05);
  border-radius: 4px;
}
.a-tab-content {
  padding: 0 15px;
  overflow-x: auto;
  table {
    width: 100%;
    min-height: 100px;
  }
}
.no-tokens {
  text-align: center;
  line-height: 60px;
  font-size: 14px;
}
.tx-item-right-controllers {
  align-items: flex-start !important;
  flex-direction: column;
}
</style>
