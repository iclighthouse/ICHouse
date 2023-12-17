<template>
  <div>
    <!--<a-form>
      <a-input v-model="form.input1" type="text" allow-clear />
      <a-input v-model="form.input2" type="text" allow-clear />
      <button @click="enter">计算</button>
      <div>结果： {{ result }}</div>
    </a-form>
    <a-input v-model="num" type="text" allow-clear />
    <button @click="enter1">转换</button>
    <div>结果 {{ result1 }}</div>-->
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import BigNumber from 'bignumber.js';

@Component({
  name: 'Index',
  components: {}
})
export default class extends Vue {
  // todo
  private form = {
    input1: '',
    input2: ''
  };
  private result = '';
  private num = '';
  private result1 = '';
  // todo
  private enter(): void {
    this.result = new BigNumber(this.form.input1)
      .minus(this.form.input2)
      .toString(10);
  }
  private enter1(): void {
    this.result1 = new BigNumber(this.num).div(10 ** 18).toString(10);
  }
}
</script>

<style scoped lang="scss">
::v-deep input {
  width: 400px;
}
</style>
