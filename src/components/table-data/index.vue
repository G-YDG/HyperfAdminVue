<template>
  <!--      表格设置-->
  <a-row style="margin-bottom: 12px">
    <a-col :span="12">
      <a-space>
        <a-button
          v-show="showCreateBtn"
          type="primary"
          @click="handleCreateModalClick"
        >
          <template #icon>
            <icon-plus />
          </template>
          {{ $t('searchTable.operation.create') }}
        </a-button>
      </a-space>
    </a-col>
    <a-col
      :span="12"
      style="display: flex; align-items: center; justify-content: end"
    >
      <a-tooltip
        v-if="showDownloadBtn"
        :content="$t('searchTable.actions.download')"
      >
        <div class="action-icon" @click="download">
          <icon-download size="18" />
        </div>
      </a-tooltip>
      <a-tooltip :content="$t('searchTable.actions.refresh')">
        <div class="action-icon" @click="search">
          <icon-refresh size="18" />
        </div>
      </a-tooltip>
      <a-dropdown @select="handleSelectDensity">
        <a-tooltip :content="$t('searchTable.actions.density')">
          <div class="action-icon">
            <icon-line-height size="18" />
          </div>
        </a-tooltip>
        <template #content>
          <a-doption
            v-for="item in densityList"
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
  <!--      表格内容-->
  <a-table
    row-key="id"
    :loading="tableLoading"
    :pagination="tablePagination"
    :data="tableData"
    :bordered="false"
    :size="size"
    @page-change="onPageChange"
    @sorter-change="onSortChange"
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
        :fixed="column.fixed"
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
  import { computed, inject, ref } from 'vue';
  import { Pagination, SizeProps } from '@/types/global';
  import { useI18n } from 'vue-i18n';

  const { t } = useI18n();

  const emit = defineEmits([
    'fetchTableData',
    'search',
    'download',
    'handleCreateModalClick',
    'onSortChange',
  ]);

  const props = defineProps({
    showCreateBtn: {
      type: Boolean,
      default: () => {
        return true;
      },
    },
    showDownloadBtn: {
      type: Boolean,
      default: false,
    },
    tableLoading: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
    tableColumns: {
      type: Array,
      default: () => {
        return {};
      },
    },
  });

  // 表格设置
  const size = ref<SizeProps>('medium');
  const densityList = computed(() => [
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
  const handleSelectDensity = (
    val: string | number | Record<string, any> | undefined
  ) => {
    size.value = val as SizeProps;
  };

  // 表格
  const tableColumns = ref(props.tableColumns);
  const tableData = inject('tableData');
  const tablePagination = inject<Pagination>('tablePagination');

  const fetchTableData = async (params: object) => {
    emit('fetchTableData', params);
  };
  fetchTableData({ ...tablePagination });

  const onPageChange = (page: number) => {
    fetchTableData({ ...tablePagination, page });
  };

  const search = () => {
    emit('search');
  };

  const download = () => {
    emit('download');
  };

  const handleCreateModalClick = () => {
    emit('handleCreateModalClick');
  };

  const onSortChange = (dataIndex: string, direction: string) => {
    emit('onSortChange', { dataIndex, direction });
  };
</script>
