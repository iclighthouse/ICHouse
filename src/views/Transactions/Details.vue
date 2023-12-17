<template>
  <div class="tx-details">
    <div class="tx-main">
      <div class="tx-main-title"><a-icon type="swap" /> Transaction</div>
      <a-spin v-if="tokenId && rosettaTokens[tokenId]" :spinning="spinning">
        <div class="tx-item">
          <div class="tx-item-left">Transaction Hash:</div>
          <div class="tx-item-right" v-if="transactionRosetta">
            {{ transactionRosetta.hash }}
            <a-icon
              type="copy"
              v-clipboard:copy="transactionRosetta.hash"
              v-clipboard:success="onCopy"
            />
          </div>
          <div class="tx-item-right" v-else>-</div>
        </div>
        <div class="tx-item">
          <div class="tx-item-left">Type:</div>
          <div class="tx-item-right" v-if="transactionRosetta">
            {{ transactionRosetta.type | filterType }}
          </div>
          <div class="tx-item-right" v-else>-</div>
        </div>
        <div class="tx-item">
          <div class="tx-item-left">Status:</div>
          <div class="tx-item-right" v-if="transactionRosetta">
            {{ transactionRosetta.status | filterType }}
          </div>
          <div class="tx-item-right" v-else>-</div>
        </div>
        <div class="tx-item">
          <div class="tx-item-left">Block:</div>
          <div class="tx-item-right" v-if="transactionRosetta">
            <a-statistic
              v-if="transactionRosetta"
              :value="transactionRosetta.blockIndex"
              :value-style="{ fontSize: '14px', fontWeight: 'normal' }"
            ></a-statistic>
          </div>
          <div class="tx-item-right" v-else>-</div>
        </div>
        <div class="tx-item">
          <div class="tx-item-left">Timestamp:</div>
          <div class="tx-item-right" v-if="transactionRosetta">
            {{ transactionRosetta.timestamp | formatDateFromNanosecond }}
          </div>
          <div class="tx-item-right" v-else>-</div>
        </div>
        <div class="tx-item">
          <div class="tx-item-left">From:</div>
          <div class="tx-item-right" v-if="transactionRosetta">
            <span v-if="transactionRosetta.type === 'MINT'">
              Minting Account</span
            >
            <div
              v-if="
                transactionRosetta.type === 'TRANSACTION' ||
                transactionRosetta.type === 'BURN'
              "
            >
              <router-link
                :to="`/address/${tokenId}/${transactionRosetta.account1Address}`"
                >{{ transactionRosetta.account1Address }}</router-link
              ><span class="span-nbsp"></span
              ><a-icon
                type="copy"
                v-clipboard:copy="transactionRosetta.account1Address"
                v-clipboard:success="onCopy"
              />
            </div>
          </div>
          <div class="tx-item-right" v-else>-</div>
        </div>
        <div class="tx-item">
          <div class="tx-item-left">To:</div>
          <div class="tx-item-right" v-if="transactionRosetta">
            <span v-if="transactionRosetta.type === 'BURN'">
              Minting Account</span
            ><router-link
              v-if="transactionRosetta.type === 'TRANSACTION'"
              :to="`/address/${tokenId}/${transactionRosetta.account2Address}`"
              >{{ transactionRosetta.account2Address }}</router-link
            ><router-link
              v-if="transactionRosetta.type === 'MINT'"
              :to="`/address/${tokenId}/${transactionRosetta.account1Address}`"
              >{{ transactionRosetta.account1Address }}</router-link
            ><span class="span-nbsp"></span
            ><a-icon
              v-if="transactionRosetta.type === 'TRANSACTION'"
              type="copy"
              v-clipboard:copy="transactionRosetta.account2Address"
              v-clipboard:success="onCopy"
            /><a-icon
              v-if="transactionRosetta.type === 'MINT'"
              type="copy"
              v-clipboard:copy="transactionRosetta.account1Address"
              v-clipboard:success="onCopy"
            />
          </div>
          <div class="tx-item-right" v-else>-</div>
        </div>
        <div class="tx-item">
          <div class="tx-item-left">Amount:</div>
          <div
            class="tx-item-right"
            v-if="transactionRosetta && tokens && tokenId && tokens[tokenId]"
          >
            {{
              transactionRosetta.amount.toString() |
                bigintToFloat(
                  tokens[tokenId].decimals,
                  tokens[tokenId].decimals
                )
            }}<span class="span-nbsp"></span>{{ tokens[tokenId].symbol }}
          </div>
          <div class="tx-item-right" v-else>-</div>
        </div>
        <div class="tx-item">
          <div class="tx-item-left">Fee:</div>
          <div class="tx-item-right" v-if="transactionRosetta">
            {{
              transactionRosetta.fee.toString() |
                bigintToFloat(
                  tokens[tokenId].decimals,
                  tokens[tokenId].decimals
                )
            }}<span class="span-nbsp"></span>{{ tokens[tokenId].symbol }}
          </div>
          <div class="tx-item-right" v-else>-</div>
        </div>
        <div class="tx-item">
          <div class="tx-item-left">Memo:</div>
          <div class="tx-item-right" v-if="transactionRosetta">
            {{ transactionRosetta.memo.toString() }}
          </div>
          <div class="tx-item-right" v-else>-</div>
        </div>
      </a-spin>
      <a-spin v-else :spinning="spinning">
        <div class="tx-item">
          <div class="tx-item-left">TokenId:</div>
          <div class="tx-item-right" v-if="tokenId">
            <div v-if="tokens && tokens[tokenId]">
              <img
                class="logo"
                v-if="tokens[tokenId].logo"
                :src="tokens[tokenId].logo"
                alt=""
              />{{ tokens[tokenId].symbol }}<span class="span-nbsp"></span>({{
                tokens[tokenId].name
              }})<span class="span-nbsp"></span>
            </div>
            <router-link :to="jumpRouter(`/token/${tokenId}`)">
              {{ tokenId }} </router-link
            ><span class="span-nbsp"></span
            ><a-icon
              type="copy"
              v-clipboard:copy="tokenId"
              v-clipboard:success="onCopy"
            />
          </div>
        </div>
        <div class="tx-item">
          <div class="tx-item-left">Txid:</div>
          <div class="tx-item-right" v-if="transaction">
            {{ transaction.txid | txidToHex }}<span class="span-nbsp"></span
            ><a-icon
              type="copy"
              v-clipboard:copy="arrayToHexString(transaction.txid)"
              v-clipboard:success="onCopy"
            />
          </div>
        </div>
        <div class="tx-item">
          <div class="tx-item-left">Caller:</div>
          <div class="tx-item-right" v-if="transaction">
            {{ transaction.caller | txidToHex }}<span class="span-nbsp"></span
            ><a-icon
              type="copy"
              v-clipboard:copy="arrayToHexString(transaction.caller)"
              v-clipboard:success="onCopy"
            />
          </div>
          <div class="tx-item-right" v-else>-</div>
        </div>
        <div class="tx-item">
          <div class="tx-item-left">From:</div>
          <div class="tx-item-right tx-item-right-column" v-if="transaction">
            <div>
              <router-link
                :to="
                  jumpRouter(
                    `/address/${tokenId}/${arrayToHexString(
                      transaction.transaction.from
                    )}`
                  )
                "
              >
                {{ transaction.transaction.from | txidToHex }}
              </router-link>
              <span class="span-nbsp"></span
              ><a-icon
                type="copy"
                v-clipboard:copy="
                  arrayToHexString(transaction.transaction.from)
                "
                v-clipboard:success="onCopy"
              />
            </div>
            <span v-if="transactionFrom">
              {{ transactionFrom }}
              <a-icon
                type="copy"
                v-clipboard:copy="transactionFrom"
                v-clipboard:success="onCopy"
              />
            </span>
          </div>
          <div class="tx-item-right" v-else>-</div>
        </div>
        <div class="tx-item">
          <div class="tx-item-left">To:</div>
          <div class="tx-item-right tx-item-right-column" v-if="transaction">
            <div>
              <router-link
                :to="
                  jumpRouter(
                    `/address/${tokenId}/${arrayToHexString(
                      transaction.transaction.to
                    )}`
                  )
                "
              >
                {{ transaction.transaction.to | txidToHex }}
              </router-link>
              <span class="span-nbsp"></span
              ><a-icon
                type="copy"
                v-clipboard:copy="arrayToHexString(transaction.transaction.to)"
                v-clipboard:success="onCopy"
              />
            </div>
            <span v-if="transactionTo">
              {{ transactionTo }}
              <a-icon
                type="copy"
                v-clipboard:copy="transactionTo"
                v-clipboard:success="onCopy"
              />
            </span>
          </div>
          <div class="tx-item-right" v-else>-</div>
        </div>
        <div class="tx-item">
          <div class="tx-item-left">Value:</div>
          <div
            class="tx-item-right"
            v-if="transaction && tokens && tokens[tokenId]"
          >
            {{ filterTransactionVal(transaction) }}
          </div>
          <div class="tx-item-right" v-else>-</div>
        </div>
        <div class="tx-item">
          <div class="tx-item-left">Nonce:</div>
          <div class="tx-item-right" v-if="transaction">
            {{ transaction.nonce.toString() }}
          </div>
          <div class="tx-item-right" v-else>-</div>
        </div>
        <div class="tx-item">
          <div class="tx-item-left">Index:</div>
          <div class="tx-item-right" v-if="transaction">
            {{ transaction.index }}
          </div>
          <div class="tx-item-right" v-else>-</div>
        </div>
        <div class="tx-item">
          <div class="tx-item-left">Operation:</div>
          <div class="tx-item-right" v-if="transaction && tokens[tokenId]">
            {{
              transaction.transaction.operation |
                filterOperation(tokens[tokenId])
            }}
          </div>
          <div class="tx-item-right" v-else>-</div>
        </div>
        <div class="tx-item">
          <div class="tx-item-left">Fee:</div>
          <div class="tx-item-right" v-if="transaction && tokens[tokenId]">
            {{ transaction.gas | gasToString(tokens[tokenId]) }}
          </div>
          <div class="tx-item-right" v-else>-</div>
        </div>
        <div class="tx-item">
          <div class="tx-item-left">Timestamp:</div>
          <div class="tx-item-right" v-if="transaction">
            {{ transaction.timestamp | formatDateFromNanosecond }}
          </div>
          <div class="tx-item-right" v-else>-</div>
        </div>
        <div class="tx-item">
          <div class="tx-item-left">Data:</div>
          <div class="tx-item-right" v-if="transaction">
            {{ transaction.transaction.data[0] | txidToHex }}
          </div>
          <div class="tx-item-right" v-else>-</div>
        </div>
      </a-spin>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { Principal } from '@dfinity/principal';
import BigNumber from 'bignumber.js';
import { DRC202ProxyService } from '@/ic/DRC202Proxy/DRC202ProxyService';
import { DRC202BucketService } from '@/ic/DRC202Bucket/DRC202BucketService';
import { DRC20TokenService } from '@/ic/DRC20Token/DRC20TokenService';
import {
  AccountId,
  Icrc1Account,
  Time,
  TokenId,
  TokenInfo,
  Txid
} from '@/ic/common/icType';
import { hexToBytes, toHexString } from '@/ic/converter';
import { Operation, TxnRecord } from '@/ic/DRC202Bucket/model';
import { getLogo, getTokenInfo } from '@/ic/getTokenInfo';
import { formatDateFromNanosecond } from '@/filters';
import { Route } from 'vue-router/types/router';
import RosettaApi, { Transaction } from '@/ic/RosettaApi';
import { rosettaTokens } from '@/ic/utils';
import { fromAccountId } from '@/ic/fromAccountId';

@Component({
  name: 'Details',
  components: {},
  filters: {
    filterType(type: string): string {
      if (type) {
        type = type.slice(0, 1) + type.slice(1).toLocaleLowerCase();
        return type;
      }
      return '';
    },
    filterOperation(val: Operation, token: TokenInfo): string {
      if (val) {
        const type = Object.keys(val)[0];
        if (type === 'approve') {
          const allowance = new BigNumber(
            (
              val as {
                approve: { allowance: bigint };
              }
            ).approve.allowance.toString()
          )
            .div(10 ** Number(token.decimals))
            .toString(10);
          return `${type}: ${allowance} ${token.symbol}`;
        } else if (type === 'lockTransfer') {
          const lockTransfer = (
            val as {
              lockTransfer: {
                locked: bigint;
                expiration: Time;
                decider: AccountId;
              };
            }
          ).lockTransfer;
          const expiration = formatDateFromNanosecond(lockTransfer.expiration);
          const decider = toHexString(new Uint8Array(lockTransfer.decider));
          const locked = new BigNumber(lockTransfer.locked.toString())
            .div(10 ** Number(token.decimals))
            .toString(10);
          return `${type}: {locked: ${locked} ${token.symbol}, decider: ${decider}, expiration: ${expiration}}`;
        } else if (type === 'transfer') {
          const action = Object.keys(
            (
              val as {
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
          return `${type}: ${action}`;
        } else if (type === 'executeTransfer') {
          const executeTransfer = (
            val as {
              executeTransfer: {
                fallback: bigint;
                lockedTxid: Txid;
              };
            }
          ).executeTransfer;
          const fallback = new BigNumber(executeTransfer.fallback.toString())
            .div(10 ** Number(token.decimals))
            .toString(10);
          const lockedTxid = toHexString(
            new Uint8Array(executeTransfer.lockedTxid)
          );
          return `${type}: {fallback: ${fallback} ${token.symbol}, lockedTxid: ${lockedTxid}}`;
        }
      }
      return '';
    }
  }
})
export default class extends Vue {
  private DRC202ProxyService: DRC202ProxyService;
  private DRC202BucketService: DRC202BucketService;
  private transaction: TxnRecord = null;
  private transactionFrom: string = null;
  private transactionTo: string = null;
  private transactionRosetta: Transaction = null;
  private spinning = false;
  private txid = '';
  private tokens: { [key: string]: TokenInfo };
  private tokenId = '';
  private rosettaTokens = rosettaTokens;
  @Watch('$route')
  private onRouteChange(route: Route) {
    console.log(route);
    this.transaction = null;
    this.init();
  }
  created(): void {
    this.init();
  }
  private jumpRouter(url: string): string {
    if (this.$route.meta && this.$route.meta.type === 'Test') {
      url = '/tokensTest' + url;
    }
    return url;
  }
  private init(): void {
    this.DRC202ProxyService = new DRC202ProxyService();
    this.tokenId = this.$route.params.tokenId;
    this.txid = this.$route.params.id;
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
      getTokenInfo(Principal.fromText(this.tokenId)).then(async (tokenInfo) => {
        this.tokens[this.tokenId] = tokenInfo;
        await this.getLogo(this.tokenId);
        this.$forceUpdate();
      });
    } else {
      this.getLogo(this.tokenId);
    }
    this.getTransactionDetails();
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
  private filterTransactionVal(val: TxnRecord): string {
    if (val) {
      const tokenId = this.$route.params.tokenId;
      const amount = new BigNumber(val.transaction.value.toString())
        .div(10 ** this.tokens[tokenId].decimals)
        .toString(10);
      const symbol = this.tokens[tokenId].symbol;
      if (Object.keys(val.transaction.operation)[0] === 'lockTransfer') {
        const locked = (
          val.transaction.operation as {
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
        return `locked ${lockedAmount} ${symbol}`;
      } else if (
        Object.keys(val.transaction.operation)[0] === 'executeTransfer'
      ) {
        const fallback = (
          val.transaction.operation as {
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
          return `${amount} ${symbol}`;
        } else {
          return `${amount} ${symbol}(fallback ${fallbackAmount} ${symbol})`;
        }
      } else {
        return `${amount} ${symbol}`;
      }
    }
    return '';
  }
  private arrayToHexString = (val: Array<number>): string => {
    return toHexString(new Uint8Array(val));
  };
  private async getTransactionDetails(): Promise<void> {
    this.spinning = true;
    try {
      const txid = Array.from(hexToBytes(this.txid));
      if (rosettaTokens[this.tokenId]) {
        console.log(rosettaTokens[this.tokenId]);
        const rosettaApi = new RosettaApi(
          rosettaTokens[this.tokenId].url,
          rosettaTokens[this.tokenId].blockchain
        );
        console.log(rosettaApi);
        const res = await rosettaApi.getTransaction(this.txid);
        if ((res as Transaction).hash) {
          this.transactionRosetta = res as Transaction;
        }
      } else {
        const bucketList = await this.DRC202ProxyService.bucketList();
        const tokenId = Principal.fromText(this.$route.params.tokenId);
        if (/^[0-9]*$/.test(this.txid.trim())) {
          console.log(bucketList);
          for (let i = 0; i < bucketList.length; i++) {
            const currentDRC202BucketService = new DRC202BucketService(
              bucketList[i].toString()
            );
            const res = await currentDRC202BucketService.txnByIndex(
              Principal.from(tokenId),
              BigInt(this.txid.trim())
            );
            if (res && res.length) {
              console.log(res);
              this.transaction = res[0][0];
              break;
            }
          }
        } else {
          for (let i = 0; i < bucketList.length; i++) {
            const currentDRC202BucketService = new DRC202BucketService(
              bucketList[i].toString()
            );
            const tokenId = Principal.fromText(this.$route.params.tokenId);
            const res = await currentDRC202BucketService.txn(
              Principal.from(tokenId),
              txid
            );
            if (res && res.length) {
              this.transaction = res[0][0];
              break;
            }
          }
          if (!this.transaction) {
            const DRC20Token = new DRC20TokenService(this.tokenId);
            const res = await DRC20Token.drc202_txn(txid);
            if (res && res.length) {
              this.transaction = res[0];
            } else {
              const res = await DRC20Token.txnQuery({ getTxn: { txid: txid } });
              if ((res as { getTxn: Array<TxnRecord> }).getTxn) {
                this.transaction = (
                  res as { getTxn: Array<TxnRecord> }
                ).getTxn[0];
              } else {
                this.transaction = null;
              }
            }
          }
        }
      }
    } catch (e) {
      console.log(e);
    }
    if (this.transaction) {
      fromAccountId(this.transaction.transaction.from).then((res) => {
        if (res) {
          this.transactionFrom = res.owner.toString();
          if (res.subaccount && res.subaccount.length) {
            const subaccount = res.subaccount;
            if (subaccount && subaccount.length) {
              const flag = subaccount[0].every((item) => {
                return item === 0;
              });
              if (!flag) {
                this.transactionFrom += `.${this.arrayToHexString(
                  res.subaccount[0]
                )}`;
              }
            }
          }
        }
      });
      fromAccountId(this.transaction.transaction.to).then((res) => {
        if (res) {
          this.transactionTo = res.owner.toString();
          if (res.subaccount && res.subaccount.length) {
            const subaccount = res.subaccount;
            if (subaccount && subaccount.length) {
              const flag = subaccount[0].every((item) => {
                return item === 0;
              });
              if (!flag) {
                this.transactionTo += `.${this.arrayToHexString(
                  res.subaccount[0]
                )}`;
              }
            }
          }
        }
      });
    }
    this.spinning = false;
  }
  private onCopy(): void {
    this.$message.success('Copied');
  }
}
</script>

<style scoped lang="scss">
.tx-item-right {
  display: flex;
  align-items: center;
  .logo {
    width: 20px;
    height: 20px;
    margin-right: 5px;
    border-radius: 10px;
    object-fit: contain;
  }
}
</style>
