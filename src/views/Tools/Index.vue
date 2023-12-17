<template>
  <div class="tools-main">
    <div class="tools-did">
      <div class="tools-did-header">Candid binding generator</div>
      <div class="tools-did-tip">
        A GUI version of the didc tool's bind command. Paste Candid text format
        and select Motoko, TypeScript or Javascript to generate a binding.
      </div>
      <ul>
        <li
          :class="{ active: currentType === type.value }"
          v-for="(type, index) in didType"
          :key="index"
          @click="changeType(type.value)"
        >
          {{ type.value }}
        </li>
      </ul>
      <div class="did-content">
        <a-textarea
          v-model="value"
          placeholder="service : {
	greet: (text) -> (text);
}"
          rows="14"
          @change="generate"
          :readonly="currentType !== 'Candid'"
        />
        <a-icon
          class="did-copy"
          type="copy"
          v-clipboard:copy="value"
          v-clipboard:success="onCopy"
        />
      </div>
    </div>
    <div class="tools-converter">
      <div class="tools-did-header">Blob tools</div>
      <ul>
        <li
          :class="{ active: currentConvert === item.value }"
          v-for="(item, index) in convertType"
          :key="index"
          @click="changeConvert(item)"
        >
          {{ item.value }}
        </li>
      </ul>
      <div class="tools-converter-item">
        <!--<div class="tools-converter-header">Blob to Vec nat8</div>-->
        <a-textarea
          v-show="currentConvert !== 'Wasm2Blob'"
          allowClear
          v-model="blobValue0"
          :placeholder="placeholder0"
          rows="3"
        />
        <a-upload-dragger
          v-show="currentConvert === 'Wasm2Blob'"
          name="file"
          :file-list="fileList"
          action="#"
          :before-upload="beforeUpload"
        >
          <p class="ant-upload-drag-icon">
            <a-icon type="inbox" />
          </p>
          <p class="ant-upload-text">Click or drag Wasm to this area</p>
        </a-upload-dragger>
        <div class="tools-converter-button" @click="converter">convert</div>
        <div class="converter-item">
          <a-textarea
            v-model="blobValue1"
            :placeholder="placeholder1"
            readonly="readonly"
            rows="3"
          />
          <a-icon
            class="did-copy"
            type="copy"
            v-clipboard:copy="blobValue1"
            v-clipboard:success="onCopy"
          />
        </div>
      </div>
      <!--<div class="tools-converter-item">
              <div class="tools-converter-header">Wasm to Blob</div>
              <a-textarea v-model="wasm" placeholder="Wasm" rows="3" />
              <div class="tools-converter-button" @click="converterWasm">convert</div>
              <div class="converter-item">
                <a-textarea v-model="wasmBlob" placeholder="hex" readonly />
                <a-icon
                  class="did-copy"
                  type="copy"
                  v-clipboard:copy="wasmBlob"
                  v-clipboard:success="onCopy"
                />
              </div>
            </div>-->
    </div>
    <div class="tools-converter">
      <div class="tools-did-header">Principal tools</div>
      <ul>
        <li
          :class="{ active: currentAccountType === item.value }"
          v-for="(item, index) in convertAccountType"
          :key="index"
          @click="changeAccountConvert(item)"
        >
          {{ item.value }}
        </li>
      </ul>
      <div
        class="tools-converter-item"
        v-show="currentAccountType === 'GenerateAccountId'"
      >
        <a-textarea
          allowClear
          v-model="generatePrincipal"
          placeholder="Principal"
          rows="1"
        />
        <div class="tools-converter-button tools-converter-button-account">
          +
        </div>
        <a-textarea
          allowClear
          v-model="generateSubaccount"
          placeholder="Subaccount(hex)"
          rows="1"
        />
        <div class="tools-converter-button" @click="converterAccountId">
          convert
        </div>
        <div class="converter-item">
          <a-textarea
            v-model="accountId"
            placeholder="Account id"
            readonly="readonly"
            rows="3"
          />
          <a-icon
            class="did-copy"
            type="copy"
            v-clipboard:copy="accountId"
            v-clipboard:success="onCopy"
          />
        </div>
      </div>
      <div
        class="tools-converter-item"
        v-show="currentAccountType === 'GenerateTxid'"
      >
        <ul class="generate-txid-ul">
          <li
            v-for="item in txidType"
            :key="item.value"
            :class="{ active: currentTxidType === item.value }"
            @click="changeTxidConvert(item)"
          >
            {{ item.value }}
          </li>
        </ul>
        <a-textarea
          allowClear
          v-model="tokenId"
          :placeholder="
            currentTxidType === 'TokenTxid'
              ? 'Token canister-id'
              : 'Pair canister-id'
          "
          rows="1"
        />
        <div class="tools-converter-button tools-converter-button-account">
          +
        </div>
        <a-textarea
          allowClear
          v-model="tokenPrincipal"
          placeholder="Principal"
          rows="1"
        />
        <div class="tools-converter-button tools-converter-button-account">
          +
        </div>
        <a-textarea
          allowClear
          v-model="tokenSubaccount"
          placeholder="Subaccount(hex)"
          rows="1"
        />
        <div class="tools-converter-button tools-converter-button-account">
          +
        </div>
        <a-textarea
          allowClear
          v-model="tokenNonce"
          placeholder="Nonce"
          rows="1"
        />
        <div class="tools-converter-button" @click="converterTxId">convert</div>
        <div class="converter-item">
          <a-textarea
            v-model="tokenTxid"
            placeholder="Tx Id"
            readonly="readonly"
            rows="3"
          />
          <a-icon
            class="did-copy"
            type="copy"
            v-clipboard:copy="tokenTxid"
            v-clipboard:success="onCopy"
          />
        </div>
      </div>
      <div
        class="tools-converter-item"
        v-show="currentAccountType === 'GenerateTxAccount'"
      >
        <a-textarea
          allowClear
          v-model="pairId"
          placeholder="Trading Pair Canister Id"
          rows="1"
        />
        <div class="tools-converter-button tools-converter-button-account">
          +
        </div>
        <a-textarea
          allowClear
          v-model="principal"
          placeholder="principal"
          rows="1"
        />
        <div class="tools-converter-button tools-converter-button-account">
          +
        </div>
        <a-textarea
          allowClear
          v-model="subaccount"
          placeholder="Subaccount(hex)"
          rows="1"
        />
        <div class="tools-converter-button tools-converter-button-account">
          +
        </div>
        <a-textarea allowClear v-model="nonce" placeholder="Nonce" rows="1" />
        <div
          class="tools-converter-button"
          @click="principalConverterTxAccount"
        >
          convert
        </div>
        <div class="converter-item">
          <a-textarea
            v-model="txAccount"
            placeholder="Tx Account"
            readonly="readonly"
            rows="3"
          />
          <a-icon
            class="did-copy"
            type="copy"
            v-clipboard:copy="txAccount"
            v-clipboard:success="onCopy"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import {
  hexToBytes,
  blobToHexBytes,
  vecToBlob,
  hexToBlob,
  principalToAccountIdentifier,
  generateToolTxid,
  toHexString,
  generateToolTokenTxid
} from '@/ic/converter';
import { Principal } from '@dfinity/principal';
import { DIDGenerateService } from '@/ic/DIDGenerate/DIDGenerateService';

@Component({
  name: 'Index',
  components: {}
})
export default class extends Vue {
  private DIDGenerateService: DIDGenerateService = null;
  private didType = [
    {
      value: 'Candid'
    },
    {
      value: 'Motoko'
    },
    // {
    //   value: 'Rust'
    // },
    {
      value: 'TypeScript'
    },
    {
      value: 'JavaScript'
    }
  ];
  private currentType = 'Candid';
  private convertType = [
    {
      value: 'Blob2Vec',
      placeholder0: 'Blob',
      placeholder1: 'Vec nat8'
    },
    {
      value: 'Blob2Hex',
      placeholder0: 'Blob',
      placeholder1: 'Hex'
    },
    {
      value: 'Vec2Blob',
      placeholder0: 'Vec nat8',
      placeholder1: 'Blob'
    },
    {
      value: 'Hex2Blob',
      placeholder0: 'Hex',
      placeholder1: 'Blob'
    },
    {
      value: 'Wasm2Blob',
      placeholder0: 'Wasm',
      placeholder1: 'Blob'
    },
    {
      value: 'Vec2Hex',
      placeholder0: 'Vec nat8',
      placeholder1: 'Hex'
    },
    {
      value: 'Hex2Vec',
      placeholder0: 'Hex',
      placeholder1: 'Vec nat8'
    }
  ];
  private currentAccountType = 'GenerateAccountId';
  private convertAccountType = [
    {
      value: 'GenerateAccountId'
    },
    {
      value: 'GenerateTxid'
    },
    {
      value: 'GenerateTxAccount'
    }
  ];
  private txidType = [
    {
      value: 'TokenTxid'
    },
    {
      value: 'SwapTxid'
    }
  ];
  private currentTxidType = 'TokenTxid';
  private currentConvert = 'Blob2Vec';
  private placeholder0 = 'Blob';
  private placeholder1 = 'Vec nat8';
  private value = '';
  private blobValue0 = '';
  private blobValue1 = '';
  private wasm: ArrayBuffer = null;
  private fileList = [];
  private did = {
    Candid: '',
    Motoko: '',
    TypeScript: '',
    JavaScript: ''
  };
  private pairId = '';
  private txid = '';
  private txAccount = '';
  private principal = '';
  private subaccount = '';
  private nonce = '';
  private generatePrincipal = '';
  private generateSubaccount = '';
  private accountId = '';
  private tokenId = '';
  private tokenPrincipal = '';
  private tokenSubaccount = '';
  private tokenNonce = '';
  private tokenTxid = '';
  created(): void {
    this.DIDGenerateService = new DIDGenerateService();
  }
  private async generate(): Promise<void> {
    if (this.currentType === 'Candid') {
      this.did.Candid = this.value;
      this.DIDGenerateService.did_to_js(this.value).then((res) => {
        if (res && res.length) {
          this.$set(this.did, 'JavaScript', res[0]);
        }
      });
      this.DIDGenerateService.binding(this.value, 'ts').then((res) => {
        if (res && res.length) {
          this.$set(this.did, 'TypeScript', res[0]);
        }
      });
      const value = this.value.replaceAll('float32', 'float64');
      this.DIDGenerateService.binding(value, 'mo')
        .then((res) => {
          console.log(res);
          if (res && res.length) {
            this.$set(this.did, 'Motoko', res[0]);
          }
        })
        .catch((e) => {
          console.log(e);
        });
    }
    console.log(this.did);
  }
  private changeType(val: string): void {
    this.currentType = val;
    this.value = this.did[this.currentType];
  }
  private beforeUpload(file): boolean {
    console.log(file);
    this.fileList = [file];
    try {
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onload = (e) => {
        this.wasm = e.target.result as ArrayBuffer;
      };
    } catch (e) {
      console.log(e);
    }
    return false;
  }
  private changeConvert(val): void {
    this.currentConvert = val.value;
    this.blobValue0 = '';
    this.blobValue1 = '';
    this.placeholder0 = val.placeholder0;
    this.placeholder1 = val.placeholder1;
    this.fileList = [];
  }
  private changeAccountConvert(val): void {
    this.currentAccountType = val.value;
    this.pairId = '';
    this.txid = '';
    this.principal = '';
    this.nonce = '';
    this.txAccount = '';
    this.subaccount = '';
    this.accountId = '';
    this.generatePrincipal = '';
    this.generateSubaccount = '';
    this.tokenId = '';
    this.tokenPrincipal = '';
    this.tokenSubaccount = '';
    this.tokenNonce = '';
    this.tokenTxid = '';
  }
  private changeTxidConvert(val): void {
    this.currentTxidType = val.value;
    this.tokenId = '';
    this.tokenPrincipal = '';
    this.tokenSubaccount = '';
    this.tokenNonce = '';
    this.tokenTxid = '';
  }
  private converter(): void {
    if (this.currentConvert === 'Blob2Vec') {
      this.blobValue1 = JSON.stringify(
        hexToBytes(blobToHexBytes(this.blobValue0.trim()).join(''))
      );
    }
    if (this.currentConvert === 'Blob2Hex') {
      this.blobValue1 = blobToHexBytes(this.blobValue0.trim()).join('');
    }
    if (this.currentConvert === 'Vec2Blob') {
      this.blobValue1 = vecToBlob(JSON.parse(this.blobValue0.trim()));
    }
    if (this.currentConvert === 'Hex2Blob') {
      this.blobValue1 = hexToBlob(this.blobValue0.trim());
    }
    if (this.currentConvert === 'Wasm2Blob') {
      this.blobValue1 = vecToBlob(Array.from(new Uint8Array(this.wasm)));
    }
    if (this.currentConvert === 'Vec2Hex') {
      this.blobValue1 = toHexString(
        new Uint8Array(JSON.parse(this.blobValue0.trim()))
      );
    }
    if (this.currentConvert === 'Hex2Vec') {
      this.blobValue1 = JSON.stringify(hexToBytes(this.blobValue0.trim()));
    }
  }
  private converterAccountId(): void {
    if (this.generatePrincipal) {
      if (this.generateSubaccount) {
        console.log(hexToBytes(this.generateSubaccount.trim()));
        let subaccount = hexToBytes(this.generateSubaccount.trim());
        if (subaccount.length < 32) {
          subaccount = subaccount.concat(
            new Array(32 - subaccount.length).fill(0)
          );
        }
        console.log(subaccount);
        this.accountId = principalToAccountIdentifier(
          Principal.fromText(this.generatePrincipal.trim()),
          new Uint8Array(subaccount)
        );
      } else {
        this.accountId = principalToAccountIdentifier(
          Principal.fromText(this.generatePrincipal.trim())
        );
      }
    }
  }
  private converterTxAccount(): void {
    if (this.pairId && this.txid) {
      try {
        this.txAccount = principalToAccountIdentifier(
          Principal.fromText(this.pairId.trim()),
          new Uint8Array(hexToBytes(this.txid.trim()))
        );
      } catch (e) {
        console.log(e);
      }
    }
  }
  private converterTxId(): void {
    if (this.tokenId && this.tokenPrincipal && this.tokenNonce) {
      try {
        let subaccount = hexToBytes(this.tokenSubaccount.trim());
        if (subaccount.length < 32) {
          subaccount = subaccount.concat(
            new Array(32 - subaccount.length).fill(0)
          );
        }
        console.log(subaccount);
        if (this.currentTxidType === 'TokenTxid') {
          this.tokenTxid = toHexString(
            new Uint8Array(
              generateToolTokenTxid(
                this.tokenId.trim(),
                this.tokenPrincipal.trim(),
                BigInt(this.tokenNonce.trim()),
                new Uint8Array(subaccount)
              )
            )
          );
        } else {
          this.tokenTxid = toHexString(
            new Uint8Array(
              generateToolTxid(
                this.tokenId.trim(),
                this.tokenPrincipal.trim(),
                BigInt(this.tokenNonce.trim()),
                new Uint8Array(subaccount)
              )
            )
          );
        }
      } catch (e) {
        console.log(e);
      }
    }
  }
  private principalConverterTxAccount(): void {
    if (this.pairId && this.principal && this.nonce) {
      try {
        let subaccount = hexToBytes(this.generateSubaccount.trim());
        if (subaccount.length < 32) {
          subaccount = subaccount.concat(
            new Array(32 - subaccount.length).fill(0)
          );
        }
        console.log(subaccount);
        const txid = generateToolTxid(
          this.pairId.trim(),
          this.principal.trim(),
          BigInt(this.nonce.trim()),
          new Uint8Array(subaccount)
        );
        console.log(txid);
        this.txAccount = principalToAccountIdentifier(
          Principal.fromText(this.pairId.trim()),
          new Uint8Array(txid)
        );
      } catch (e) {
        console.log(e);
      }
    }
  }
  // private converterWasm(): void {
  //   this.wasmBlob = wasmToBlob(JSON.parse(this.wasm.trim()));
  // }
  private onCopy(): void {
    this.$message.success('Copied');
  }
}
</script>

<style scoped lang="scss">
.tools-did,
.tools-converter {
  ul {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin-bottom: 10px;
    &.generate-txid-ul {
      justify-content: flex-start;
      li {
        &:first-child {
          padding-left: 0;
        }
      }
    }
    li {
      padding: 0 15px;
      border-right: 1px solid #636c73;
      cursor: pointer;
      transition: all 0.35s;
      &:last-child {
        border-right: 0;
      }
      &.active {
        color: #0862bc;
      }
      &:hover {
        color: #0862bc;
      }
    }
  }
}
.tools-converter {
  margin-top: 20px;
  .tools-did-header {
    padding: 20px 0;
  }
}

.did-content {
  position: relative;
}
.did-copy {
  position: absolute;
  right: 20px;
  top: 10px;
  cursor: pointer;
}
.tools-did-header,
.tools-converter-header {
  font-size: 16px;
}
.tools-converter-header {
  margin: 20px 0 10px;
}
.tools-did-tip {
  margin: 20px 0 10px;
  color: #666;
}
.tools-converter-button {
  margin: 10px 0;
  padding: 10px;
  font-size: 16px;
  cursor: pointer;
  text-align: center;
  color: #0862bc;
  &.tools-converter-button-account {
    cursor: default;
    color: #333;
  }
}
.blob-hex {
  margin-top: 10px;
}
.converter-item {
  position: relative;
  textarea {
    padding: 5px 35px 5px 5px;
  }
}
</style>
