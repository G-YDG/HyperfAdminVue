<template>
  <!--      搜索框-->
  <a-form :model="searchModel" label-align="center">
    <a-row>
      <a-col
        v-for="(config, configIndex) in searchConfig"
        :key="configIndex"
        :xs="24"
        :sm="16"
        :md="12"
        :lg="8"
        :xl="6"
        :xxl="6"
      >
        <a-form-item
          :prop="config.key"
          :field="config.key"
          :label="config.label"
          label-col-flex="90px"
        >
          <slot
            v-if="config.useSlot"
            :name="config.slotName || 'default'"
          ></slot>
          <component
            :is="config.type"
            v-else
            v-model="searchModel[config.key]"
            :placeholder="config.placeholder"
          >
            <a-option
              v-for="(option, index) in config.options"
              :key="index"
              :label="option.label"
              :value="option.value"
            />
          </component>
        </a-form-item>
      </a-col>
    </a-row>
  </a-form>

  <!--  搜索按钮&刷新按钮 -->
  <a-col v-if="searchConfig.length > 0" style="margin: 5px 105px">
    <a-space :size="16">
      <a-button type="primary" @click="search">
        <template #icon>
          <icon-search />
        </template>
        {{ $t('searchTable.form.search') }}
      </a-button>
      <a-button @click="reset">
        <template #icon>
          <icon-refresh />
        </template>
        {{ $t('searchTable.form.reset') }}
      </a-button>
    </a-space>
  </a-col>

  <!--      分割线-->
  <a-divider style="margin-top: 0" />

  <!--      数据汇总-->
  <a-card
    v-if="tableSummaryColumns.length > 0"
    class="data-statistics-container"
    :loading="summaryLoading"
    :bordered="false"
  >
    <a-row class="data-statistics-row">
      <a-col
        v-for="(item, index) in tableSummaryColumns"
        :key="index"
        class="data-statistics-col"
        :xs="20"
        :sm="14"
        :md="8"
        :lg="6"
        :xl="6"
        :xxl="4"
      >
        <a-card class="data-statistics-card" :bordered="false" hoverable>
          <div class="label">{{ item.label }}</div>
          <div class="value">{{ tableSummaryData[item.key] }}</div>
        </a-card>
      </a-col>
    </a-row>
  </a-card>

  <!--      表格设置-->
  <a-row class="table-setting">
    <a-col class="table-setting-col left" :span="12">
      <a-space>
        <!--        左边插槽-->
        <slot name="tableSettingSettingLeft"></slot>
      </a-space>
    </a-col>
    <a-col class="table-setting-col right" :span="12">
      <!--      右边插槽-->
      <slot name="tableSettingSettingRight"></slot>
      <a-tooltip :content="$t('searchTable.actions.refresh')">
        <div class="action-icon" @click="refresh">
          <icon-refresh size="18" />
        </div>
      </a-tooltip>
      <a-dropdown @select="onSelectDensity">
        <a-tooltip :content="$t('searchTable.actions.density')">
          <div class="action-icon">
            <icon-line-height size="18" />
          </div>
        </a-tooltip>
        <template #content>
          <a-doption
            v-for="item in tableDensityList"
            :key="item.value"
            :value="item.value"
            :class="{ active: item.value === size }"
          >
            <span>{{ item.name }}</span>
          </a-doption>
        </template>
      </a-dropdown>
    </a-col>
  </a-row>

  <!--  表格数据-->
  <a-table
    row-key="id"
    :bordered="false"
    :loading="loading"
    :pagination="showTablePagination ? tablePagination : false"
    :data="tableData"
    :size="tableSize"
    @page-change="onTablePageChange"
    @sorter-change="onTableSortChange"
  >
    <template #columns>
      <a-table-column
        v-for="(column, columnIndex) in tableColumns"
        :key="columnIndex"
        :data-index="column.dataIndex"
        :title="column.title"
        :sortable="column.sortable"
        :width="column.width"
        :ellipsis="column.ellipsis ?? false"
        :filterable="column.filterable"
        :cell-class="column.cellClass"
        :header-cell-class="column.headerCellClass"
        :body-cell-class="column.bodyCellClass"
        :summary-cell-class="column.summaryCellClass"
        :cell-style="column.cellStyle"
        :header-cell-style="column.headerCellStyle"
        :body-cell-style="column.bodyCellStyle"
        :summary-cell-style="column.summaryCellStyle"
        :tooltip="
          column.dataIndex === 'operations' ? false : column.tooltip ?? true
        "
        :align="column.align || 'left'"
        :fixed="column.dataIndex === 'operations' ? 'right' : column.fixed"
      >
        <template #cell="{ record }">
          <slot
            v-if="column.slotName"
            :name="column.slotName || 'default'"
            :record="record"
          ></slot>
          <span v-else> {{ record[column.dataIndex] }} </span>
        </template>
      </a-table-column>
    </template>
  </a-table>
</template>

<script lang="ts" setup>
  import { ref, reactive, computed, watch } from 'vue';
  import { Pagination, SizeProps } from '@/types/global';
  import { useI18n } from 'vue-i18n';

  const emit = defineEmits([
    'fetchTableData',
    'fetchTableSummaryData',
    'reset',
  ]);

  const props = defineProps({
    loading: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
    searchModel: {
      type: Object,
      default: () => {
        return {};
      },
    },
    searchConfig: {
      type: Array,
      default: () => {
        return [];
      },
    },
    summaryLoading: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
    tableSummaryColumns: {
      type: Array,
      default: () => {
        return [];
      },
    },
    tableSummaryData: {
      type: Object,
      default: () => {
        return {};
      },
    },
    tableSummaryDataApi: {
      type: Function,
      default: undefined,
    },
    tableColumns: {
      type: Array,
      default: () => {
        return [];
      },
    },
    tableData: {
      type: Array,
      default: () => {
        return [];
      },
    },
    tableDataApi: {
      type: Function,
      default: undefined,
    },
    tablePageSize: {
      type: Number,
      default: () => {
        return 10;
      },
    },
    showTablePagination: {
      type: Boolean,
      default: () => {
        return true;
      },
    },
  });

  const { t } = useI18n();

  // 搜索框
  const searchModel = ref(props.searchModel);
  const searchConfig = ref(props.searchConfig);
  // 表格设置
  const tableSize = ref<SizeProps>('medium');
  const tableDensityList = computed(() => [
    {
      name: t('searchTable.size.mini'),
      value: 'mini',
    },
    {
      name: t('searchTable.size.small'),
      value: 'small',
    },
    {
      name: t('searchTable.size.medium'),
      value: 'medium',
    },
    {
      name: t('searchTable.size.large'),
      value: 'large',
    },
  ]);
  // 表格
  const loading = ref(props.loading);
  const tableData = ref(props.tableData);
  const tableDataApi = ref(props.tableDataApi);
  const tableColumns = ref(props.tableColumns);
  const tablePageSize = ref(props.tablePageSize);
  const showTablePagination = ref(props.showTablePagination);

  // 表格汇总
  const summaryLoading = ref(props.summaryLoading);
  const tableSummaryData = ref(props.tableSummaryData);
  const tableSummaryColumns = ref(props.tableSummaryColumns);
  const tableSummaryDataApi = ref(props.tableSummaryDataApi);

  // 分页
  const basePagination: Pagination = {
    page: 1,
    pageSize: tablePageSize.value,
  };
  const tablePagination = reactive({ ...basePagination });

  const fetchTableSummaryData = async (params: object) => {
    summaryLoading.value = true;
    try {
      if (tableSummaryDataApi.value !== undefined) {
        const { data } = await tableSummaryDataApi.value(params);
        tableSummaryData.value = data;
      }
      emit('fetchTableSummaryData', params);
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      summaryLoading.value = false;
    }
  };

  const fetchTableData = async (params: object) => {
    loading.value = true;
    try {
      if (tableDataApi.value !== undefined) {
        const { data } = await tableDataApi.value(params);
        tableData.value = data.items;
        if (data.pageInfo !== undefined) {
          tablePagination.current = data.pageInfo.currentPage;
          tablePagination.total = data.pageInfo.total;
        }
      }
      emit('fetchTableData', params);
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      loading.value = false;
    }
  };

  const search = () => {
    fetchTableData({
      ...{ page: basePagination.page, pageSize: basePagination.pageSize },
      ...searchModel.value,
    } as unknown as object);
    fetchTableSummaryData({
      ...searchModel.value,
    } as unknown as object);
  };
  search();

  const reset = () => {
    Object.keys(searchModel.value).forEach((key) => {
      searchModel.value[key] = '';
    });
    emit('reset');
    search();
  };

  const onTablePageChange = (page: number) => {
    fetchTableData({
      ...{ page, pageSize: tablePagination.pageSize },
      ...searchModel.value,
    });
  };

  const onTableSortChange = async (dataIndex: string, direction: string) => {
    if (direction) {
      searchModel.value.orderBy = dataIndex;
      searchModel.value.orderType = direction;
    } else {
      searchModel.value.orderBy = '';
      searchModel.value.orderType = '';
    }
    tablePagination.page = 1;
    search();
  };

  const onSelectDensity = (
    val: string | number | Record<string, any> | undefined
  ) => {
    tableSize.value = val as SizeProps;
  };

  const refresh = () => {
    search();
  };

  watch(
    () => props.loading,
    () => {
      loading.value = props.loading;
    }
  );

  watch(
    () => props.searchModel,
    () => {
      searchModel.value = props.searchModel;
    }
  );

  watch(
    () => props.tableData,
    () => {
      tableData.value = props.tableData;
    }
  );

  defineExpose({ refresh });
</script>

<style scoped lang="less">
  .table-setting {
    margin-bottom: 10px;
    .table-setting-col {
      display: flex;
      align-items: center;
    }
    .left {
      justify-content: start;
    }
    .right {
      justify-content: end;
    }
  }

  .data-statistics-container {
    .data-statistics-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .data-statistics-card {
      background-color: var(--color-neutral-2);
    }
    .data-statistics-col {
      flex: 1;
      margin: 4px;
      line-height: 1.6;
      .label {
        color: var(--color-text-2);
        font-size: 16px;
      }
      .value {
        color: var(--color-text-2);
        font-size: 30px;
        font-weight: bold;
      }
    }
  }
</style>
