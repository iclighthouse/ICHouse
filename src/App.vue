<template>
  <div id="app">
    <div class="scan-header pc-show">
      <div class="scan-main-content main-width">
        <router-link to="/">
          <div class="scan-header-logo">
            <img src="@/assets/img/logo.png" alt="" />
            <span>House</span>
          </div>
        </router-link>
        <!--tokens swaps createToken-->
        <ul>
          <router-link
            to="/ICP"
            tag="li"
            :class="{ active: $route.meta.type === 'ICP' }"
            >ICP</router-link
          >
          <router-link
            to="/canisters"
            tag="li"
            :class="{
              active:
                ($route.meta.type === 'Canisters')
                | ($route.meta.type === 'Canister')
            }"
            >Canisters</router-link
          >
          <router-link
            to="/tokens"
            tag="li"
            :class="{ active: $route.meta.type === 'Tokens' }"
            >Tokens</router-link
          >
          <router-link
            to="/swaps"
            tag="li"
            :class="{ active: $route.meta.type === 'Swaps' }"
            >Swaps</router-link
          >
          <router-link
            to="/competitions/combinedComp"
            tag="li"
            :class="{
              active:
                $route.meta.type &&
                $route.meta.type.toLocaleLowerCase() === 'combinedcomp'
            }"
            >Competitions</router-link
          >
          <a-dropdown overlay-class-name="ic-test-menu">
            <li :class="{ active: $route.meta.type === 'Integration' }">
              Cross-chain<span class="span-nbsp"></span><a-icon type="down" />
            </li>
            <a-menu slot="overlay">
              <a-menu-item>
                <router-link
                  to="/crossChain/ckBTC"
                  :class="{ active: $route.meta.menu === 'ckBTC' }"
                  >Bitcoin(Foundation)</router-link
                >
              </a-menu-item>
              <a-menu-item>
                <router-link
                  to="/crossChain/icBTC"
                  :class="{ active: $route.meta.menu === 'icBTC' }"
                  >Bitcoin(ICLight)</router-link
                >
              </a-menu-item>
              <a-menu-item>
                <router-link
                  to="/crossChain/ckEthereum"
                  :class="{ active: $route.meta.menu === 'ckEthereum' }"
                  >Ethereum(Foundation)</router-link
                >
              </a-menu-item>
              <a-menu-item>
                <router-link
                  to="/crossChain/ethereum_iclight"
                  :class="{ active: $route.meta.menu === 'icETH' }"
                  >Ethereum(ICLight)</router-link
                >
              </a-menu-item>
            </a-menu>
          </a-dropdown>
          <a-dropdown overlay-class-name="ic-test-menu">
            <li :class="{ active: $route.meta.type === 'Test' }">
              Test<span class="span-nbsp"></span><a-icon type="down" />
            </li>
            <a-menu slot="overlay">
              <a-menu-item>
                <router-link
                  to="/TokensTest"
                  :class="{ active: $route.meta.menu === 'TokensTest' }"
                  >Tokens Test</router-link
                >
              </a-menu-item>
              <a-menu-item>
                <router-link
                  to="/SwapsTest"
                  :class="{ active: $route.meta.menu === 'SwapsTest' }"
                  >Swaps Test</router-link
                >
              </a-menu-item>
            </a-menu>
          </a-dropdown>
          <li>
            <a href="http://ICLight.io/ICTokens" target="_blank">CreateToken</a>
          </li>
          <li :class="{ active: $route.meta.type === 'Tools' }">
            <router-link to="/tools">Tools</router-link>
          </li>
        </ul>
      </div>
    </div>
    <div class="scan-header h5-show">
      <div class="scan-main-content main-width">
        <router-link to="/">
          <div class="scan-header-logo">
            <img src="@/assets/img/logo.png" alt="" />
            <span>House</span>
          </div>
        </router-link>
        <a-dropdown overlay-class-name="ic-test-menu ic-test-menu-h5">
          <a-icon class="ic-test-icon" type="menu" />
          <a-menu slot="overlay">
            <a-menu-item :class="{ active: $route.meta.type === 'ICP' }">
              <router-link to="/ICP" tag="span">ICP</router-link>
            </a-menu-item>
            <a-menu-item
              :class="{
                active:
                  ($route.meta.type === 'Canisters')
                  | ($route.meta.type === 'Canister')
              }"
            >
              <router-link to="/canisters" tag="span">Canisters</router-link>
            </a-menu-item>
            <a-menu-item :class="{ active: $route.meta.type === 'Tokens' }">
              <router-link to="/tokens" tag="span">Tokens</router-link>
            </a-menu-item>
            <a-menu-item :class="{ active: $route.meta.type === 'Swaps' }">
              <router-link to="/swaps" tag="span">Swaps</router-link>
            </a-menu-item>
            <a-menu-item-group title="Cross-chain">
              <a-menu-item :class="{ active: $route.meta.menu === 'ckBTC' }">
                <router-link to="/crossChain/ckBTC" tag="span"
                  >ckBTC</router-link
                >
              </a-menu-item>
              <a-menu-item :class="{ active: $route.meta.menu === 'icBTC' }">
                <router-link to="/crossChain/icBTC" tag="span"
                  >icBTC</router-link
                >
              </a-menu-item>
              <a-menu-item :class="{ active: $route.meta.menu === 'ckETH' }">
                ckETH(coming...)
              </a-menu-item>
            </a-menu-item-group>
            <a-menu-item-group title="Test">
              <a-menu-item
                :class="{ active: $route.meta.menu === 'TokensTest' }"
              >
                <router-link to="/TokensTest" tag="span"
                  >Tokens Test</router-link
                >
              </a-menu-item>
              <a-menu-item
                :class="{ active: $route.meta.menu === 'SwapsTest' }"
              >
                <router-link to="/SwapsTest" tag="span">Swaps Test</router-link>
              </a-menu-item>
            </a-menu-item-group>
            <a-menu-item>
              <a href="http://ICLight.io/ICTokens" target="_blank"
                >CreateToken</a
              >
            </a-menu-item>
            <a-menu-item :class="{ active: $route.meta.menu === 'Tools' }">
              <router-link tag="span" to="/tools">Tools</router-link>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </div>
    </div>
    <div class="search">
      <div v-if="$route.meta.type === 'Tokens'">
        <form @submit.prevent="">
          <a-input-group class="search-group" compact size="large">
            <a-auto-complete
              class="search-token"
              placeholder="Token Canister ID(Principal)"
              v-model="tokenId"
              size="large"
              :allowClear="true"
              option-label-prop="label"
              name="autocomplete"
            >
              <template slot="dataSource">
                <a-select-option
                  v-for="token in tokenList"
                  :key="token.canisterId.toString()"
                  :label="token.canisterId.toString()"
                >
                  <span style="color: #333">{{ token.symbol }}</span>
                  <span
                    ><span class="span-nbsp"></span
                    >{{ token.canisterId.toString() }}</span
                  >
                </a-select-option>
              </template>
            </a-auto-complete>
            <a-input
              v-model="searchText"
              type="text"
              @pressEnter="search"
              allow-clear
              placeholder="AccountId/Txid/Index/Principal"
              name="tokensSearchText"
            />
            <button type="submit" @click="search">
              <a-icon type="search" />
            </button>
          </a-input-group>
        </form>
      </div>
      <div v-if="$route.meta.menu === 'TokensTest'">
        <form @submit.prevent="">
          <a-input-group class="search-group" compact size="large">
            <a-input
              v-model="tokenId"
              type="text"
              class="search-token"
              @pressEnter="search"
              allow-clear
              name="tokenIdSearchText"
              placeholder="Token Canister ID(Principal)"
            ></a-input>
            <a-input
              v-model="searchText"
              type="text"
              @pressEnter="search"
              allow-clear
              placeholder="AccountId/Txid/Index/Principal"
              name="tokensTestSearchText"
            />
            <button type="submit" @click="search">
              <a-icon type="search" /><span class="testnet"
                >(It’s testnet)</span
              >
            </button>
          </a-input-group>
        </form>
      </div>
      <div v-if="$route.meta.type === 'ICP'">
        <a-form @submit.prevent="" ref="icpSearch">
          <a-input-group class="search-group" compact size="large">
            <a-input
              v-model="searchText"
              type="text"
              allow-clear
              @pressEnter="searchIcp"
              name="icpSearchText"
              placeholder="AccountId/Principal/Txn hash"
            />
            <button type="submit" @click="searchIcp">
              <a-icon type="search" />
            </button>
          </a-input-group>
        </a-form>
      </div>
      <div v-if="$route.meta.type === 'Canister'">
        <a-form @submit.prevent="">
          <a-input-group class="search-group" compact size="large">
            <a-input
              v-model="searchText"
              type="text"
              allow-clear
              @pressEnter="searchCanister"
              name="canisterSearch"
              placeholder="Canister Id"
            />
            <button type="submit" @click="searchCanister">
              <a-icon type="search" />
            </button>
          </a-input-group>
        </a-form>
      </div>
      <div v-if="$route.meta.type === 'Swaps'">
        <form @submit.prevent="">
          <a-input-group class="search-group" compact size="large">
            <a-auto-complete
              class="search-token"
              placeholder="Swapping Pair ID(Principal)"
              v-model="swapId"
              size="large"
              :allowClear="true"
              option-label-prop="label"
              name="autocompleteSwaps"
            >
              <template slot="dataSource">
                <a-select-option
                  v-for="swap in swapList"
                  :key="swap.canisterId.toString()"
                  :label="swap.canisterId.toString()"
                >
                  <span style="color: #333">{{ swap.symbol }}</span>
                  {{ swap.canisterId.toString() }}
                </a-select-option>
              </template>
            </a-auto-complete>
            <a-input
              v-model="searchText"
              type="text"
              @pressEnter="searchSwap"
              allow-clear
              name="swapSearchText"
              placeholder="AccountId/Txid/Index/Principal"
            />
            <button type="submit" @click="searchSwap">
              <a-icon type="search" />
            </button>
            <!--<a-button type="primary" size="large" @click="searchSwap"
                      ><a-icon type="search"
                    /></a-button>-->
          </a-input-group>
        </form>
      </div>
      <div v-if="$route.meta.menu === 'SwapsTest'">
        <form @submit.prevent="">
          <a-input-group class="search-group" compact size="large">
            <a-input
              v-model="swapId"
              type="text"
              class="search-token"
              @pressEnter="searchSwap"
              allow-clear
              name="swapIdSearchText"
              placeholder="Swapping Pair ID(Principal)"
            ></a-input>
            <a-input
              v-model="searchText"
              type="text"
              @pressEnter="searchSwap"
              allow-clear
              name="swapTestSearchText"
              placeholder="AccountId/Txid/Index/Principal"
            />
            <button type="submit" @click="searchSwap">
              <a-icon type="search" /><span
                class="testnet"
                v-if="$route.meta.menu === 'SwapsTest'"
                >(It’s testnet)</span
              >
            </button>
          </a-input-group>
        </form>
      </div>
      <a-tooltip>
        <template slot="title">
          <span>
            If you want to enter "principal + subaccount", split it with "|" or
            ".", For example
            "zxeu2-7abaa-aaaaq-aaafa-cai|efa8b68be7d381c070cdc351f8e4165f53f011b7a000b6eb9d0253bca16133e6",
            "zxeu2-7abaa-aaaaq-aaafa-cai.0253bca16133e6".
          </span>
        </template>
        <span
          v-if="
            $route.meta.type === 'Tokens' ||
            $route.meta.menu === 'TokensTest' ||
            $route.meta.type === 'ICP' ||
            $route.meta.type === 'Swaps' ||
            $route.meta.menu === 'SwapsTest'
          "
          class="enter-info"
          :class="{ 'enter-info-right': $route.meta.type !== 'ICP' }"
        >
          You can enter "principal.subaccount".
        </span>
      </a-tooltip>
    </div>
    <div v-if="$route.meta.type === 'Canisters'" class="search-canister-group">
      <div class="search">
        <a-form>
          <a-input-group class="search-group" compact size="large">
            <a-input
              v-model="searchText"
              type="text"
              allow-clear
              @pressEnter="searchCanister"
              name="canistersSearchText"
              placeholder="Canister Id"
            />
            <a-button type="primary" size="large" @click="searchCanister"
              ><a-icon type="search"
            /></a-button>
          </a-input-group>
        </a-form>
        <div class="default-canister-main">
          <div class="default-canister">
            <span>Dfinity:</span>
            <div>
              <router-link to="/canister/aaaaa-aa">ICManagement</router-link>
              <router-link to="/canister/ryjl3-tyaaa-aaaaa-aaaba-cai"
                >Ledger</router-link
              >
              <router-link to="/canister/rrkah-fqaaa-aaaaa-aaaaq-cai"
                >Governance</router-link
              >
              <router-link to="/canister/rdmx6-jaaaa-aaaaa-aaadq-cai"
                >Identity</router-link
              >
            </div>
          </div>
          <div class="default-canister">
            <span>Dapps:</span>
            <div>
              <router-link to="/canister/y5a36-liaaa-aaaak-aacqa-cai"
                >DRC202</router-link
              >
              <router-link to="/canister/6ylab-kiaaa-aaaak-aacga-cai"
                >DRC205</router-link
              >
              <router-link to="/canister/6nmrm-laaaa-aaaak-aacfq-cai"
                >CyclesFinance</router-link
              >
              <router-link to="/canister/j4d4d-pqaaa-aaaak-aanxq-cai"
                >ICDexRouter</router-link
              >
              <router-link to="/canister/y2b5k-gqaaa-aaaak-aacqq-cai"
                >ICTokens</router-link
              >
              <router-link to="/canister/7hdtw-jqaaa-aaaak-aaccq-cai"
                >Blackhole</router-link
              >
              <!--<router-link to="/canister/2dzqi-iyaaa-aaaak-acqna-cai"
                    >ICOracle</router-link
                    >-->
            </div>
          </div>
          <div class="default-canister">
            <span>Tokens:</span>
            <div>
              <router-link to="/canister/5573k-xaaaa-aaaak-aacnq-cai"
                >ICL</router-link
              >
            </div>
          </div>
        </div>
      </div>
    </div>
    <keep-alive>
      <router-view
        v-if="$route.meta.keepAlive"
        class="scan-main main-width"
        :class="{ 'scan-main-canisters': $route.meta.type === 'Canisters' }"
      />
    </keep-alive>
    <router-view
      v-if="!$route.meta.keepAlive"
      class="scan-main main-width"
      :class="{ 'scan-main-canisters': $route.meta.type === 'Canisters' }"
    />
    <div class="scan-footer">
      <div class="scan-footer-main">
        <div class="scan-footer-main-top">
          <div>
            <span>Powered by: </span
            ><a href="http://iclight.house/" target="_blank">ICLighthouse</a
            ><span class="span-nbsp"></span><span class="span-nbsp"></span
            ><span class="span-nbsp"></span><span class="span-nbsp"></span>
          </div>
          <div>
            <span>Links: </span
            ><a
              href="https://github.com/iclighthouse/DRC_standards/tree/main/DRC20"
              target="_blank"
              >DRC20</a
            ><a
              href="https://github.com/iclighthouse/DRC_standards/tree/main/DRC202"
              target="_blank"
              >DRC202</a
            ><a href="http://ictokens.com/" target="_blank">ICTokens</a>
          </div>
        </div>
        <div class="partners">
          <span>Cooperation Partners: </span
          ><a href="https://center.icpl.app/" target="_blank">ICPLeague</a
          ><a href="https://astrox.me/" target="_blank">Astrox</a
          ><a href="http://yumi.io/" target="_blank">Yumi</a>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { ICTokensScanService } from '@/ic/ICTokensScan/ICTokensScanService';
import { getPrincipalType, validatePrincipal } from '@/ic/utils';
import { calculateCrc32, hexToBytes } from '@/ic/converter';
import { SwapItem, TokenItem } from '@/ic/ICTokensScan/model';
import { SNSWasmService } from '@/ic/SNSWasm/SNSWasmService';
@Component({
  name: 'App',
  components: {}
})
export default class extends Vue {
  private SNSWasmService: SNSWasmService;
  private ICTokensScanService: ICTokensScanService;
  private tokenList: Array<TokenItem> = [];
  private swapList: SwapItem = [];
  private tokenId = '';
  private swapId = '';
  private searchText = '';
  private menu = [
    {
      path: '/',
      name: 'Home'
    }
    // ,
    // {
    //   path: '/txs',
    //   name: 'Transactions'
    // }
  ];
  created(): void {
    this.ICTokensScanService = new ICTokensScanService();
    this.getTokenList();
    this.getSwapList();
    this.setSearch();
    this.setDeployedSns();
  }
  @Watch('$route')
  private onRouteChange() {
    this.setSearch();
  }
  private async setDeployedSns(): Promise<void> {
    const snsWasmService = new SNSWasmService();
    const deployedSns = await snsWasmService.listDeployedSnses();
    localStorage.setItem(
      'deployedSnses',
      JSON.stringify(deployedSns, (key, value) =>
        value && value._isPrincipal ? value.toString() : value
      )
    );
  }
  private filterOption(input: string, option): boolean {
    return (
      option.componentOptions.children[0].children[0].text
        .toUpperCase()
        .indexOf(input.toUpperCase()) >= 0 ||
      option.componentOptions.children[1].children[0].text
        .toUpperCase()
        .indexOf(input.toUpperCase()) >= 0
    );
  }
  private setSearch(): void {
    console.log(this.$route);
    this.swapId = '';
    this.tokenId = '';
    this.searchText = '';
    if (
      this.$route.name === 'Swap' ||
      this.$route.name === 'SwapAddress' ||
      this.$route.name === 'SwapTransaction'
    ) {
      this.swapId = this.$route.params.swapId || '';
      this.searchText = this.$route.params.id || '';
    }
    if (
      this.$route.name === 'Token' ||
      this.$route.name === 'Address' ||
      this.$route.name === 'Transaction'
    ) {
      this.tokenId = this.$route.params.tokenId || '';
      this.searchText = this.$route.params.id || '';
    }
    if (this.$route.name === 'ICPAddress') {
      this.searchText = this.$route.params.id;
    }
    if (this.$route.name === 'ICPTransaction') {
      this.searchText = this.$route.params.hash;
    }
    if (this.$route.name === 'CanistersAddress') {
      this.searchText = this.$route.params.id;
    }
  }
  private async getSwapList(): Promise<void> {
    const swapList = await this.ICTokensScanService.getSwapList();
    this.swapList = swapList.sort((a, b) => {
      return a.symbol.localeCompare(b.symbol);
    });
    console.log(this.swapList);
  }
  private async getTokenList(): Promise<void> {
    const tokenList = await this.ICTokensScanService.getTokenList();
    this.tokenList = tokenList.sort((a, b) => {
      return a.symbol.localeCompare(b.symbol);
    });
    console.log(this.tokenList);
    const tokens = JSON.parse(localStorage.getItem('tokens')) || {};
    console.log(tokens);
    this.tokenList.forEach((res) => {
      const tokenId = res.canisterId.toString();
      const std = res.standard.split(';')[0];
      const tokenStd = {};
      tokenStd[std] = null;
      if (tokens[tokenId]) {
        tokens[tokenId].tokenStd = tokenStd;
      }
    });
    localStorage.setItem(
      'tokens',
      JSON.stringify(tokens, (key, value) =>
        typeof value === 'bigint'
          ? value.toString()
          : key === 'logo'
          ? ''
          : value
      )
    );
  }
  private searchCanister(): void {
    if (this.searchText.trim()) {
      const type = getPrincipalType(this.searchText.trim());
      console.log(type);
      if (!type) {
        this.$message.error('Invalid Canister Id');
      } else {
        if (this.$route.params.id !== this.searchText.trim()) {
          this.$router.push(`/canister/${this.searchText.trim()}`);
        }
        // window.location.href = `/canister/${this.searchText.trim()}`;
      }
    }
  }
  private searchIcp(): void {
    if (this.searchText.trim()) {
      if (
        this.searchText.trim().includes('|') ||
        this.searchText.trim().includes('.')
      ) {
        if (this.$route.params.id !== this.searchText.trim()) {
          // (this.$refs.icpSearch as any).$el.submit();
          this.$router.push(`/ICP/address/${this.searchText.trim()}`);
        }
      } else if (validatePrincipal(this.searchText.trim())) {
        if (this.$route.params.id !== this.searchText.trim()) {
          // (this.$refs.icpSearch as any).$el.submit();
          this.$router.push(`/ICP/address/${this.searchText.trim()}`);
        }
        // window.location.href = `/ICP/address/${this.searchText.trim()}`;
      } else {
        // the checksum of the hash
        const searchText = hexToBytes(this.searchText.trim());
        if (
          Buffer.from(
            calculateCrc32(new Uint8Array(searchText.slice(4)))
          ).toString('hex') ===
          Buffer.from(searchText.slice(0, 4)).toString('hex')
        ) {
          if (this.$route.params.id !== this.searchText.trim()) {
            // (this.$refs.icpSearch as any).$el.submit();
            this.$router.push(`/ICP/address/${this.searchText.trim()}`);
          }
          // window.location.href = `/ICP/address/${this.searchText.trim()}`;
        } else {
          if (this.$route.params.hash !== this.searchText.trim()) {
            // (this.$refs.icpSearch as any).$el.submit();
            this.$router.push(`/ICP/tx/${this.searchText.trim()}`);
          }
          // window.location.href = `/ICP/tx/${this.searchText.trim()}`;
        }
      }
    }
  }
  private searchSwap(): void {
    const swapId = this.$route.params.swapId || '';
    const text = this.$route.params.id || '';
    if (this.swapId.trim()) {
      if (
        this.searchText.trim().includes('|') ||
        this.searchText.trim().includes('.')
      ) {
        if (
          !(this.swapId.trim() === swapId && this.searchText.trim() === text)
        ) {
          this.$router.push(
            this.jumpRouter(
              `/swap/address/${this.swapId.trim()}/${this.searchText.trim()}`
            )
          );
        }
      } else if (validatePrincipal(this.swapId.trim())) {
        if (this.searchText.trim()) {
          if (validatePrincipal(this.searchText.trim())) {
            if (
              !(
                this.swapId.trim() === swapId && this.searchText.trim() === text
              )
            ) {
              this.$router.push(
                this.jumpRouter(
                  `/swap/address/${this.swapId.trim()}/${this.searchText.trim()}`
                )
              );
            }
          } else if (/^[0-9]*$/.test(this.searchText.trim())) {
            if (
              !(
                this.swapId.trim() === swapId && this.searchText.trim() === text
              )
            ) {
              this.$router.push(
                this.jumpRouter(
                  `/swap/${this.swapId.trim()}/${this.searchText.trim()}`
                )
              );
            }
          } else {
            // the checksum of the hash
            const searchText = hexToBytes(this.searchText.trim());
            if (
              Buffer.from(
                calculateCrc32(new Uint8Array(searchText.slice(4)))
              ).toString('hex') ===
              Buffer.from(searchText.slice(0, 4)).toString('hex')
            ) {
              if (
                !(
                  this.swapId.trim() === swapId &&
                  this.searchText.trim() === text
                )
              ) {
                this.$router.push(
                  this.jumpRouter(
                    `/swap/address/${this.swapId.trim()}/${this.searchText.trim()}`
                  )
                );
              }
              // window.location.href = `/address/${this.tokenId.trim()}/${this.searchText.trim()}`;
            } else {
              if (
                !(
                  this.swapId.trim() === swapId &&
                  this.searchText.trim() === text
                )
              ) {
                this.$router.push(
                  this.jumpRouter(
                    `/swap/${this.swapId.trim()}/${this.searchText.trim()}`
                  )
                );
              }
              // window.location.href = `/tx/${this.tokenId.trim()}/${this.searchText.trim()}`;
            }
          }
        } else {
          if (
            !(this.swapId.trim() === swapId && this.searchText.trim() === text)
          ) {
            this.$router.push(this.jumpRouter(`/swap/${this.swapId.trim()}`));
          }
          // window.location.href = `/token/${this.tokenId.trim()}`;
        }
      } else {
        this.$message.error('Invalid Swapping Pair Id');
      }
    } else {
      this.$message.error('Please enter Swapping Pair Id ');
    }
  }
  private jumpRouter(url: string): string {
    if (this.$route.meta && this.$route.meta.type === 'Test') {
      url = '/swapsTest' + url;
    }
    return url;
  }
  private jumpTokensTest(url: string): string {
    if (this.$route.meta && this.$route.meta.type === 'Test') {
      url = '/tokensTest' + url;
    }
    return url;
  }
  private search(): void {
    const tokenId = this.$route.params.tokenId || '';
    const text = this.$route.params.id || '';
    if (this.tokenId.trim()) {
      if (
        this.searchText.trim().includes('|') ||
        this.searchText.trim().includes('.')
      ) {
        if (
          !(this.tokenId.trim() === tokenId && this.searchText.trim() === text)
        ) {
          // (this.$refs.icpSearch as any).$el.submit();
          this.$router.push(
            this.jumpTokensTest(
              `/address/${this.tokenId.trim()}/${this.searchText.trim()}`
            )
          );
        }
      } else if (validatePrincipal(this.tokenId.trim())) {
        if (this.searchText.trim()) {
          if (validatePrincipal(this.searchText.trim())) {
            if (
              !(
                this.tokenId.trim() === tokenId &&
                this.searchText.trim() === text
              )
            ) {
              this.$router.push(
                this.jumpTokensTest(
                  `/address/${this.tokenId.trim()}/${this.searchText.trim()}`
                )
              );
            }
            // window.location.href = `/address/${this.tokenId.trim()}/${this.searchText.trim()}`;
          } else if (/^[0-9]*$/.test(this.searchText.trim())) {
            if (
              !(
                this.tokenId.trim() === tokenId &&
                this.searchText.trim() === text
              )
            ) {
              this.$router.push(
                this.jumpTokensTest(
                  `/tx/${this.tokenId.trim()}/${this.searchText.trim()}`
                )
              );
            }
          } else {
            // the checksum of the hash
            const searchText = hexToBytes(this.searchText.trim());
            if (
              Buffer.from(
                calculateCrc32(new Uint8Array(searchText.slice(4)))
              ).toString('hex') ===
              Buffer.from(searchText.slice(0, 4)).toString('hex')
            ) {
              if (
                !(
                  this.tokenId.trim() === tokenId &&
                  this.searchText.trim() === text
                )
              ) {
                this.$router.push(
                  this.jumpTokensTest(
                    `/address/${this.tokenId.trim()}/${this.searchText.trim()}`
                  )
                );
              }
              // window.location.href = `/address/${this.tokenId.trim()}/${this.searchText.trim()}`;
            } else {
              if (
                !(
                  this.tokenId.trim() === tokenId &&
                  this.searchText.trim() === text
                )
              ) {
                this.$router.push(
                  this.jumpTokensTest(
                    `/tx/${this.tokenId.trim()}/${this.searchText.trim()}`
                  )
                );
              }
              // window.location.href = `/tx/${this.tokenId.trim()}/${this.searchText.trim()}`;
            }
          }
        } else {
          if (
            !(
              this.tokenId.trim() === tokenId && this.searchText.trim() === text
            )
          ) {
            this.$router.push(
              this.jumpTokensTest(`/token/${this.tokenId.trim()}`)
            );
          }
          // window.location.href = `/token/${this.tokenId.trim()}`;
        }
      } else {
        this.$message.error('Invalid Token Id');
      }
    } else {
      this.$message.error('Please enter Token Id ');
    }
    console.log(this.tokenId, this.searchText);
  }
}
</script>

<style scoped lang="scss">
.scan-header {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  height: 60px;
  background: #0862bc;
  .scan-main-content {
    display: flex;
    align-items: center;
    height: 100%;
    width: 1200px;
    margin: 0 auto;
  }
  ul {
    display: flex;
    align-items: center;
    height: 100%;
    margin-left: auto;
    li {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      padding: 0 20px;
      color: #fff;
      cursor: pointer;
      transition: all 0.35s;
      background: #0862bc;
      &:hover,
      &.active {
        color: #fff;
        background: rgba(189, 215, 240, 0.16);
      }
      a {
        color: #fff;
      }
      > a {
        width: 100%;
        height: 100%;
        line-height: 60px;
      }
    }
  }
}
.ic-test-menu-h5 {
  li {
    &.active {
      color: #fff;
      background: #1890ff;
    }
  }
}
.scan-main {
  min-height: calc(100vh - 250px);
  margin: 0 auto;
  &.scan-main-canisters {
    min-height: auto;
  }
}
.search-group {
  display: flex !important;
  ::v-deep input {
    height: 50px !important;
    font-size: 18px;
  }
  ::v-deep input::placeholder {
    font-size: 16px !important;
  }
  ::v-deep .ant-select-selection__rendered {
    line-height: 50px !important;
  }
  button {
    height: 50px !important;
  }
}
.search {
  max-width: 1200px;
  margin: 30px auto;
}
.search-token {
  width: 500px !important;
}
.swap-token {
  width: 400px !important;
}
.scan-header-logo {
  display: flex;
  align-items: center;
  color: #fff;
  font-size: 18px;
  cursor: pointer;
  img {
    height: 40px;
  }
  span {
    font-size: 13px;
    font-weight: bold;
  }
}
.scan-footer {
  padding: 50px 0;
  margin-top: 20px;
  background: #e3e9ed;
  .scan-footer-main {
    max-width: 1200px;
    margin: 0 auto;
    line-height: 20px;
    .scan-footer-main-top {
      display: flex;
      align-items: center;
      > div {
        white-space: nowrap;
      }
    }
    .partners {
      margin-top: 10px;
    }
    a {
      padding: 0 5px;
    }
  }
}
.search-canister-group {
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 1000px;
  height: 400px;
  margin: calc(50vh - 305px) auto;
  background: #ffffff;
  box-shadow: 0 1px 10px 0 rgba(0, 71, 121, 0.05);
  border-radius: 4px;
  border: 1px solid #eef6fb;
  .search {
    width: 100%;
    padding: 0 100px;
  }
}
.ic-test-menu {
  a {
    &.active {
      color: #0862bc;
    }
  }
}
.ic-test-icon {
  margin-left: auto;
  color: #fff;
  cursor: pointer;
  font-size: 16px;
}
.pc-show {
  display: flex;
}
.h5-show {
  display: none;
}
.default-canister {
  display: flex;
  margin-top: 10px;
  div {
    display: flex;
    flex-wrap: wrap;
  }

  a {
    padding: 0 10px 5px;
  }
}
form {
  button {
    line-height: 1.499;
    position: relative;
    display: inline-block;
    font-weight: 400;
    white-space: nowrap;
    text-align: center;
    background-image: none;
    outline: 0;
    padding: 0 15px;
    font-size: 16px;
    color: #fff;
    background-color: #1890ff;
    border: none;
    text-shadow: none;
    box-shadow: none;
  }
}
.enter-info {
  line-height: 20px;
  color: #5e6170;
  &.enter-info-right {
    margin-left: 305px;
  }
}
@media (max-width: 1199px) {
  .scan-header {
    .scan-main-content {
      width: 100%;
      /*width: 100%;
      overflow: hidden;*/
    }
  }
  .scan-footer {
    padding: 50px 10px;
  }
  .scan-header {
    padding: 0 10px;
  }
}
@media (min-width: 992px) {
  .search {
    padding: 0 150px;
  }
}
@media (max-width: 991px) {
  .pc-show {
    display: none;
  }
  .h5-show {
    display: block;
  }
}
@media (max-width: 767px) {
  .enter-info {
    display: none;
  }
  .search-canister-group {
    .search {
      padding: 0 10px;
    }
  }
  .scan-footer {
    .scan-footer-main {
      .scan-footer-main-top {
        align-items: flex-start;
        flex-direction: column;
        > div {
          &:last-child {
            margin-top: 10px;
          }
        }
      }
    }
  }
}
</style>
