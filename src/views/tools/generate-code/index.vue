<template>
  <div class="container">
    <!--    面包屑-->
    <HaBreadcrumb :items="['menu.tools', 'menu.tools.generateCode']" />

    <!--    卡片内容-->
    <a-card class="general-card" :title="$t('menu.tools.generateCode')">
      <HaTableData
        ref="tableRef"
        :loading="loading"
        :search-model="searchModel"
        :search-config="searchConfig"
        :table-columns="tableColumns"
        :table-data="tableData"
        @fetch-table-data="fetchTableData"
      >
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
  import { computed, ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { index } from '@/api/tools/generate-code';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import PreviewCode from '@/views/tools/generate-code/components/preview-code.vue';
  import DataForm from '@/views/tools/generate-code/components/data-form.vue';
  import useLoading from '@/hooks/loading';

  const { t } = useI18n();

  const { loading, setLoading } = useLoading(true);

  const previewRef = ref();
  const dataFormRef = ref();
  const tableRef = ref();
  const tableData = ref([]);

  const searchModel = ref({
    name: '',
  });
  const searchConfig = computed<Record<string, any>[]>(() => [
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
    },
    {
      title: t('searchTable.columns.operations'),
      dataIndex: 'operations',
      slotName: 'operations',
    },
  ]);

  const fetchTableData = async () => {
    setLoading(true);
    const { data } = await index();
    if (searchModel.value.name !== '') {
      tableData.value = data.items.filter((item: any) =>
        item.Name.includes(searchModel.value.name)
      );
    } else {
      tableData.value = data.items;
    }
    setLoading(false);
  };

  const openPreviewModal = (record: any) => {
    dataFormRef.value.open({ module: 'System', name: record.Name });
  };

  const onPreviewCode = (record: any) => {
    previewRef.value.open(record);
  };
</script>
