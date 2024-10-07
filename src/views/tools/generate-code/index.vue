<template>
  <div class="container">
    <!--    面包屑-->
    <HaBreadcrumb :items="['menu.tools', 'menu.tools.generateCode']" />

    <!--    卡片内容-->
    <a-card class="general-card" :title="$t('menu.tools.generateCode')">
      <HaTableData
        ref="tableRef"
        :search-model="searchModel"
        :search-config="searchConfig"
        :table-columns="tableColumns"
        :table-data-api="index"
      >
        <template #searchDatasource>
          <a-select
            v-model="searchModel.datasource"
            :options="datasourceOptions"
            :placeholder="$t('searchTable.form.select')"
          />
        </template>

        <template #operations="{ record }">
          <a-button type="text" size="small" @click="openPreviewModal(record)">
            {{ $t(`searchTable.operation.preview`) }}
          </a-button>
        </template>
      </HaTableData>
    </a-card>

    <DataForm ref="dataFormRef" @submit="onPreviewCode" />

    <PreviewCode ref="previewRef" />
  </div>
</template>

<script setup lang="ts">
  import { computed, ref, onMounted } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { index, datasource } from '@/api/tools/generate-code';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import PreviewCode from '@/views/tools/generate-code/components/preview-code.vue';
  import DataForm from '@/views/tools/generate-code/components/data-form.vue';
  import type { SelectOptionData } from '@arco-design/web-vue/es/select/interface';

  const { t } = useI18n();

  const previewRef = ref();
  const dataFormRef = ref();
  const tableRef = ref();

  const searchModel = ref({
    name: '',
    datasource: '',
  });
  const searchConfig = computed<Record<string, any>[]>(() => [
    {
      label: t('generateCode.from.datasource'),
      useSlot: true,
      slotName: 'searchDatasource',
    },
    {
      key: 'name',
      type: 'a-input',
      label: t('generateCode.from.name'),
      placeholder: t('generateCode.from.name.placeholder'),
    },
  ]);

  const tableColumns = computed<TableColumnData[]>(() => [
    {
      title: t(`generateCode.from.name`),
      dataIndex: 'Name',
    },
    {
      title: t(`generateCode.from.comment`),
      dataIndex: 'Comment',
    },
    {
      title: t('searchTable.columns.createdAt'),
      dataIndex: 'Create_time',
      sortable: {
        sortDirections: ['ascend', 'descend'],
        defaultSortOrder: 'descend',
      },
    },
    {
      title: t('searchTable.columns.operations'),
      dataIndex: 'operations',
      slotName: 'operations',
    },
  ]);

  const openPreviewModal = (record: any) => {
    dataFormRef.value.open({
      module: 'System',
      name: record.Name,
      datasource: searchModel.value.datasource,
    });
  };

  const onPreviewCode = (record: any) => {
    previewRef.value.open(record);
  };

  const datasourceOptions = ref<SelectOptionData[]>([]);
  const fetchDatasourceOptions = async () => {
    const { data } = await datasource();
    datasourceOptions.value = data;
  };

  onMounted(() => {
    fetchDatasourceOptions();
  });
</script>
