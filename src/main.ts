import Vue, { DirectiveOptions } from 'vue';
import App from './App.vue';
import router from './router';
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import * as filters from '@/filters';
import VueClipboard from 'vue-clipboard2';
import 'highlight.js/styles/monokai.css';
import '@/styles/style.css';
import '@/styles/common.scss';
import vuePlugin from '@/components/highlightjs/vue-plugin/src/vue';
import * as directives from '@/directives';
import * as echarts from 'echarts/core';
import { TreeChart } from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent
} from 'echarts/components';
import { GraphChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([
  TooltipComponent,
  TreeChart,
  CanvasRenderer,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GraphChart,
  CanvasRenderer
]);
Vue.use(Antd);
Vue.use(VueClipboard);
Vue.use(vuePlugin);
Vue.config.productionTip = false;

// Register global filter functions
Object.keys(filters).forEach((key) => {
  console.log(key, filters);
  Vue.filter(key, filters[key]);
});
Object.keys(directives).forEach((key) => {
  Vue.directive(key, (directives as { [key: string]: DirectiveOptions })[key]);
});

router.afterEach(() => {
  window.scrollTo(0, 0);
});

new Vue({
  router,
  render: (h) => h(App)
}).$mount('#app');
