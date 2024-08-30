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
          label-col-flex="60px"
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
  <a-col v-if="searchConfig.length > 0" style="margin: 5px 76px">
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
  import { Message } from '@arco-design/web-vue';
  import { useI18n } from 'vue-i18n';
  import useLoading from '@/hooks/loading';

  const emit = defineEmits(['fetchTableData']);

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
  const { loading, setLoading } = useLoading(props.loading);
  const tableData = ref(props.tableData);
  const tableDataApi = ref(props.tableDataApi);
  const tableColumns = ref(props.tableColumns);
  const tablePageSize = ref(props.tablePageSize);
  const showTablePagination = ref(props.showTablePagination);

  // 分页
  const basePagination: Pagination = {
    page: 1,
    pageSize: tablePageSize.value,
  };
  const tablePagination = reactive({ ...basePagination });

  const fetchTableData = async (params: object) => {
    setLoading(true);
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
      Message.error('获取数据失败');
    } finally {
      setLoading(false);
    }
  };

  const search = () => {
    fetchTableData({
      ...{ page: basePagination.page, pageSize: basePagination.pageSize },
      ...searchModel.value,
    } as unknown as object);
  };
  search();

  const reset = () => {
    Object.keys(searchModel.value).forEach((key) => {
      searchModel.value[key] = '';
    });
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
    margin-bottom: 12px;
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
</style>
