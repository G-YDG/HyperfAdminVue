<template>
  <div class="container">
    <!--    面包屑-->
    <Breadcrumb :items="['menu.tools', 'menu.tools.generateCode']" />

    <!--    卡片内容-->
    <a-card class="general-card" :title="$t('menu.tools.generateCode')">
      <HaTableData
        ref="tableRef"
        :table-columns="tableColumns"
        :table-data-api="index"
      >
        <template #operations="{ record }">
          <a-button type="text" size="small" @click="previewModal(record)">
            {{ $t(`searchTable.operation.preview`) }}
          </a-button>
        </template>
      </HaTableData>
    </a-card>

    <a-modal v-model:visible="formVisible" :on-before-ok="onPreview">
      <HaForm
        :form-model="formModel"
        :form-config="formConfig"
        :is-show-submit-btn="false"
      />
    </a-modal>
  </div>

  <preview ref="previewRef" />
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { index } from '@/api/tools/generate-code';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import preview from '@/views/tools/generate-code/components/preview.vue';

  const { t } = useI18n();

  const previewRef = ref();

  const tableRef = ref();
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

  const formVisible = ref(false);
  const formModel = ref({
    module: '',
    name: '',
  });
  const formConfig = ref([
    {
      key: 'module',
      type: 'a-input',
      label: t('generateCode.from.module'),
      placeholder: t('generateCode.from.module.placeholder'),
      allowClear: true,
    },
    {
      key: 'name',
      type: 'a-input',
      disabled: true,
      label: t('generateCode.from.name'),
      placeholder: t('generateCode.from.name.placeholder'),
    },
  ]);

  const previewModal = (record: any) => {
    formVisible.value = true;
    formModel.value.module = 'System';
    formModel.value.name = record.Name;
  };

  const onPreview = () => {
    return previewRef.value.open(formModel.value);
  };
</script>

<style scoped lang="less"></style>
