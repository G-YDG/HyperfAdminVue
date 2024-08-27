import { App } from 'vue';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { BarChart, LineChart, PieChart, RadarChart } from 'echarts/charts';
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  DataZoomComponent,
  GraphicComponent,
} from 'echarts/components';
import HaChart from './ha-chart/index.vue';
import HaBreadcrumb from './ha-breadcrumb/index.vue';
import HaLogo from './ha-logo/index.vue';
import HaForm from './ha-form/index.vue';
import HaSearch from './ha-search/index.vue';
import HaTableData from './ha-table-data/index.vue';
import HaCodeEditor from './ha-code-editor/index.vue';

// Manually introduce ECharts modules to reduce packing size

use([
  CanvasRenderer,
  BarChart,
  LineChart,
  PieChart,
  RadarChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  DataZoomComponent,
  GraphicComponent,
]);

export default {
  install(Vue: App) {
    Vue.component('HaChart', HaChart);
    Vue.component('HaBreadcrumb', HaBreadcrumb);
    Vue.component('HaLogo', HaLogo);
    Vue.component('HaForm', HaForm);
    Vue.component('HaSearch', HaSearch);
    Vue.component('HaTableData', HaTableData);
    Vue.component('HaCodeEditor', HaCodeEditor);
  },
};
