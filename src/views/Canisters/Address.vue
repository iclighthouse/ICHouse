<template>
  <div class="tx-details">
    <div class="tx-main">
      <div class="tx-main-title">Canister</div>
      <div class="tx-item">
        <div class="tx-item-left">Canister Id:</div>
        <div class="tx-item-right" v-if="canisterId">
          {{ canisterId }}
          <a-icon
            style="cursor: pointer !important"
            type="copy"
            v-clipboard:copy="canisterId"
            v-clipboard:success="onCopy"
          />
        </div>
      </div>
      <div class="tx-item">
        <div class="tx-item-left">Account Id:</div>
        <div class="tx-item-right" v-if="accountId">
          {{ accountId }}
        </div>
      </div>
      <div class="tx-item">
        <div class="tx-item-left">ICP Balance:</div>
        <div class="tx-item-right" v-if="accountId">
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
    <!--<div v-if="candidMethods.length" class="canister-methods">
      <div class="canister-methods-header">Canister Methods</div>
      <a-collapse expand-icon-position="right">
        <a-collapse-panel v-for="(item, index) in candidMethods" :key="index">
          <div slot="header" @click="change(index)">
            <span
              class="method-type"
              :class="{ 'method-type-update': !item[1].annotations[0] }"
            >
              {{ item[1].annotations[0] ? item[1].annotations[0] : 'update' }}
            </span>
            <span>
              {{ item[0] }}
            </span>
          </div>
          <div class="method-main">
            <div class="method-main-header">
              <highlightjs
                class="method-info"
                v-if="item[1].argTypes && item[1].retTypes"
                language="candid"
                :code="getCode(item)"
              />
            </div>
            <div class="method-item">
              <div
                v-for="(arg, index) in item[1].argTypes"
                :key="index"
                :ref="`${item[0]}${index}`"
              ></div>
            </div>
          </div>
        </a-collapse-panel>
      </a-collapse>
    </div>-->
    <div class="card-container">
      <a-tabs v-if="did.candid">
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
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { Principal } from '@dfinity/principal';
import { IDL, renderInput } from '@dfinity/candid';
import {
  QueryResponseReplied,
  HttpAgent,
  CanisterStatus
} from '@dfinity/agent';
import { principalToAccountIdentifier } from '@/ic/converter';
import { getIcp } from '@/ic/getIcp';
import { CanisterStatusToken } from '@/ic/DRC20Token/model';
import { PrincipalString } from '@/ic/common/icType';
import { readState } from '@/ic/readState';
import { DRC20TokenService } from '@/ic/DRC20Token/DRC20TokenService';
import { BlackholeService } from '@/ic/blackhole/blackholeService';
import { CandidEnum } from '@/views/Token/model';
import { getPrincipalType, IC_MANAGEMENT_CANISTER_ID } from '@/ic/utils';
import { ICManagement } from '@/ic/ICManagement.did.js';
import { FuncClass, Type } from '@dfinity/candid/lib/cjs/idl';
import { DIDGenerateService } from '@/ic/DIDGenerate/DIDGenerateService';

@Component({
  name: 'Address',
  components: {}
})
export default class extends Vue {
  private DIDGenerateService: DIDGenerateService = null;
  private candidMethods: Array<[string, FuncClass]> = [];
  private did = {
    candid: '',
    motoko: '',
    javascript: '',
    typescript: ''
  };
  private didMenu = CandidEnum;
  private canisterId = '';
  private accountId = '';
  private icp = '';
  private isController = true;
  private status: CanisterStatusToken = null;
  private tokenInfo: {
    controllers: Array<PrincipalString>;
    moduleHash: string;
  } = null;
  @Watch('$route')
  private onRouteChange() {
    console.log(1);
    this.icp = '';
    this.canisterId = '';
    this.accountId = '';
    this.did = {
      candid: '',
      motoko: '',
      javascript: '',
      typescript: ''
    };
    this.status = null;
    this.tokenInfo = null;
    this.isController = true;
    this.init();
  }
  created(): void {
    this.DIDGenerateService = new DIDGenerateService();
    this.init();
  }
  private async init(): Promise<void> {
    this.canisterId = this.$route.params.id;
    if (this.canisterId) {
      const type = getPrincipalType(this.canisterId);
      if (!type) {
        return;
      }
      this.accountId = principalToAccountIdentifier(
        Principal.fromText(this.canisterId)
      );
    }
    this.icp = await getIcp(this.accountId);
    this.getCanisterStatus();
    this.getCandidInterfaceTmpHack();
  }
  private async getCandidInterfaceTmpHack(): Promise<void> {
    try {
      let candid;
      if (this.canisterId.trim() === IC_MANAGEMENT_CANISTER_ID) {
        candid = ICManagement;
      } else {
        const canisterId = this.canisterId.trim();
        const agent = new HttpAgent({ host: 'https://ic0.app/' });
        const res = await agent.query(this.canisterId, {
          methodName: '__get_candid_interface_tmp_hack',
          arg: Buffer.from([68, 73, 68, 76, 0, 0]) // Null
        });
        if ((res as QueryResponseReplied).status) {
          candid = IDL.decode(
            [IDL.Text],
            Buffer.from((res as QueryResponseReplied).reply.arg)
          )[0] as string;
        }
        if (!candid) {
          const status = await CanisterStatus.request({
            agent,
            canisterId: Principal.fromText(canisterId),
            paths: ['candid']
          });
          candid = status.get('candid') as string | null;
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
      // await didc.then((mod) => {
      //   const bindings = mod.generate(candid); // Bindings { js: "...", ts: "...", motoko: "..." }
      //   console.log(bindings);
      //   this.did.candid = candid;
      //   this.did.motoko = bindings.motoko;
      //   this.did.javascript = bindings.js;
      //   this.did.typescript = bindings.ts;
      //   const did = bindings.js
      //     .replace(/export default\s+/, 'return ')
      //     .replace('export', '');
      //   const actor_ = Actor.createActor(new Function(did)(), {
      //     agent: null,
      //     canisterId: this.canisterId
      //   });
      //   const candidMethods = Actor.interfaceOf(actor_)._fields;
      //   this.candidMethods = candidMethods.sort((a, b) => {
      //     return a[0].localeCompare(b[0]);
      //   });
      //   console.log(this.candidMethods);
      //   // if (this.candidMethods.length) {
      //   //   this.candidMethods.forEach((method) => {
      //   //     if (method[1].argTypes && method[1].argTypes.length) {
      //   //       method[1].argTypes.forEach((arg) => {
      //   //         // this.setParams(arg);
      //   //         const inputFiles = renderInput(arg);
      //   //         console.log(inputFiles);
      //   //       });
      //   //     }
      //   //   });
      //   // }
      // });
    } catch (e) {
      console.log(e);
    }
  }
  private change(index: number): void {
    if (
      this.candidMethods[index][1] &&
      this.candidMethods[index][1].argTypes &&
      this.candidMethods[index][1].argTypes.length
    ) {
      this.candidMethods[index][1].argTypes.forEach((arg, argIndex) => {
        this.setParams(arg);
        const inputFiles = renderInput(arg);
        this.$nextTick(() => {
          setTimeout(() => {
            if (
              !this.$refs[`${this.candidMethods[index][0]}${argIndex}`][0]
                .innerHTML
            ) {
              inputFiles.render(
                this.$refs[
                  `${this.candidMethods[index][0]}${argIndex}`
                ][0] as HTMLElement
              );
            }
          }, 20);
        });
      });
    }
  }
  private async getCanisterStatus(): Promise<void> {
    try {
      if (this.canisterId !== IC_MANAGEMENT_CANISTER_ID) {
        const res = await readState(this.canisterId);
        console.log(res);
        if (res) {
          this.tokenInfo = {
            moduleHash: res.moduleHash,
            controllers: res.controllers
          };
        } else {
          this.tokenInfo = null;
        }
      }
    } catch (e) {
      this.tokenInfo = null;
    }
    if (this.tokenInfo) {
      const DRC20Token = new DRC20TokenService(this.canisterId);
      if (this.tokenInfo.controllers.includes('7hdtw-jqaaa-aaaak-aaccq-cai')) {
        this.getCanisterStatusFromBlackhole('7hdtw-jqaaa-aaaak-aaccq-cai');
      } else if (
        this.tokenInfo.controllers.includes('e3mmv-5qaaa-aaaah-aadma-cai')
      ) {
        this.getCanisterStatusFromBlackhole('e3mmv-5qaaa-aaaah-aadma-cai');
      } else if (this.tokenInfo.controllers.includes(this.canisterId)) {
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
          console.log(e);
          if (e.message.includes('is stopped')) {
            if (!this.status) {
              this.status = {};
            }
            this.status.status = { stopped: null };
          } else {
            this.status = null;
            this.isController = false;
          }
        }
      }
    }
  }
  private setParams(idType: Type): Type {
    if (
      idType instanceof IDL.RecClass ||
      idType instanceof IDL.VecClass ||
      idType instanceof IDL.OptClass
    ) {
      if (idType instanceof IDL.VecClass) {
        if (
          idType['_type'] instanceof IDL.FixedNatClass &&
          idType['_type']._bits === 8
        ) {
          const obj = {};
          obj['vec nat8 hex'] = new IDL.TextClass();
          idType = new IDL.RecordClass(obj);
          return idType;
        }
      }
      let idlType;
      if (idType instanceof IDL.RecClass) {
        idlType = new IDL.RecClass();
      } else if (idType instanceof IDL.VecClass) {
        idlType = new IDL.VecClass(idType['_type']);
      } else if (idType instanceof IDL.OptClass) {
        idlType = new IDL.OptClass(idType['_type']);
      }
      idlType['_type'] = this.setParams(idType['_type']);
      idType['_type'] = idlType['_type'];
      return idType;
    } else if (
      idType instanceof IDL.RecordClass ||
      idType instanceof IDL.VariantClass ||
      idType instanceof IDL.TupleClass
    ) {
      let temp = [];
      for (let i = 0; i < idType['_fields'].length; i++) {
        let idlType;
        if (idType['_fields'][i][1] instanceof IDL.RecordClass) {
          // if (idType['_fields'][i][1] instanceof IDL.TupleClass) {
          //   const type = [];
          //   types['_fields'].forEach((item) => {
          //     type.push(item[1]);
          //   });
          //   idlType = new IDL.TupleClass(type);
          // } else {
          //   idlType = new IDL.RecordClass();
          // }
          idlType = this.setParams(idType['_fields'][i][1]) as any;
          idType['_fields'][i][1] = idlType;
        } else if (idType['_fields'][i][1] instanceof IDL.VariantClass) {
          // idlType = new IDL.VariantClass();
          idlType = this.setParams(idType['_fields'][i][1]);
          idType['_fields'][i][1] = idlType;
        }
        // else if (idType['_fields'][i][1] instanceof IDL.TupleClass) {
        //   // idlType = new IDL.TupleClass();
        // }
        else {
          idType['_fields'][i][1] = this.setParams(idType['_fields'][i][1]);
        }
        temp.push(idType['_fields'][i]);
      }
      // if (idType instanceof IDL.VariantClass) {
      //   idType = new IDL.VariantClass(temp as any);
      // }
      idType['_fields'] = temp;
      return idType;
    } else {
      return idType;
    }
  }
  private getCode(item: [string, FuncClass]): string {
    let code = item[0];
    if (item[1].argTypes && item[1].argTypes.length) {
      code += ': (';
      item[1].argTypes.forEach((arg, index) => {
        code += arg.name;
        if (index < item[1].argTypes.length - 1) {
          code += ', ';
        } else {
          code += ')';
        }
      });
    } else {
      code += ': ()';
    }
    if (item[1].retTypes && item[1].retTypes.length) {
      code += ' -> (';
      item[1].retTypes.forEach((arg, index) => {
        code += arg.name;
        if (index < item[1].retTypes.length - 1) {
          code += ', ';
        } else {
          code += ')';
        }
      });
    } else {
      code += ' -> ()';
    }
    if (item[1].annotations && item[1].annotations[0]) {
      code += ` ${item[1].annotations[0]}`;
    }
    return code;
  }
  private async getCanisterStatusFromBlackhole(
    blackholeId: string
  ): Promise<void> {
    const blackholeService = new BlackholeService(blackholeId);
    this.status = await blackholeService.getCanisterStatus(this.canisterId);
  }
  private onCopy(): void {
    this.$message.success('Copied');
  }
}
</script>

<style scoped lang="scss">
.method-main-header {
  ::v-deep .hljs {
    background: transparent;
    white-space: pre-wrap;
    padding: 0;
    color: rgba(0, 0, 0, 0.65);
  }
}
.canister-methods-header {
  margin: 30px 0 10px;
  font-size: 20px;
}
.canister-methods {
  margin-bottom: 20px;
}
.method-type {
  display: inline-block;
  width: 80px;
  height: 26px;
  text-align: center;
  background: #21c77d;
  color: #fff;
  border-radius: 3px;
  margin-right: 10px;
  line-height: 20px;
  &.method-type-update {
    background: #d13651;
  }
}
.show-status {
  cursor: pointer;
  color: #0862bc;
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
.card-container {
  background: #fff;
  ::v-deep .ant-tabs-tabpane {
    padding: 0 !important;
  }
}
.tx-item-right {
  ::v-deep .ant-statistic-content-suffix {
    font-size: 14px;
    font-weight: normal;
  }
}
.tx-item-right-controllers {
  align-items: flex-start !important;
  flex-direction: column;
}
</style>
