<template>
  <div class="container">
    <HaBreadcrumb
      :items="['menu.system', 'menu.system.config', 'menu.system.config.group']"
    />

    <a-card class="general-card" :title="$t('searchTable.title')">
      <HaTableData
        ref="tableRef"
        :search-model="searchModel"
        :search-config="searchConfig"
        :table-columns="tableColumns"
        :table-data-api="index"
      >
        <template #tableSettingSettingLeft>
          <a-button type="primary" @click="openCreateModal">
            <template #icon>
              <icon-plus />
            </template>
            {{ $t('searchTable.operation.create') }}
          </a-button>
        </template>
        <template #operations="{ record }">
          <a-button type="text" size="small" @click="openEditeModal(record)">
            {{ $t(`searchTable.operation.edite`) }}
          </a-button>
          <a-popconfirm
            :content="$t(`searchTable.operation.confirmDelete`)"
            type="error"
            @ok="onDelete(record.id)"
          >
            <a-button v-if="record.is_system != 1" type="text" size="small">
              {{ $t(`searchTable.operation.delete`) }}
            </a-button>
          </a-popconfirm>
        </template>
      </HaTableData>
    </a-card>

    <!--    表单弹窗-->
    <DataForm ref="dataFormRef" @refresh="() => refresh()" />
  </div>
</template>

<script lang="ts" setup>
  import { ref, computed } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { Message } from '@arco-design/web-vue';
  import { index, deleted, ConfigGroupModel } from '@/api/system/config-group';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import DataForm from '@/views/system/config-group/components/data-form.vue';

  const { t } = useI18n();

  const tableRef = ref();
  const dataFormRef = ref();

  const searchModel = ref({
    name: '',
  });
  const searchConfig = computed<Record<string, any>[]>(() => [
    {
      key: 'name',
      type: 'a-input',
      label: t('config.group.form.name'),
      placeholder: t('config.group.form.name.placeholder'),
    },
  ]);
  const tableColumns = computed<TableColumnData[]>(() => [
    {
      title: t('searchTable.columns.id'),
      dataIndex: 'id',
    },
    {
      title: t('config.group.form.key'),
      dataIndex: 'key',
    },
    {
      title: t('config.group.form.name'),
      dataIndex: 'name',
    },
    {
      title: t('searchTable.columns.createdAt'),
      dataIndex: 'created_at',
    },
    {
      title: t('searchTable.columns.operations'),
      dataIndex: 'operations',
      slotName: 'operations',
    },
  ]);

  const refresh = () => {
    tableRef.value.refresh();
  };

  const openCreateModal = () => {
    dataFormRef.value.create();
  };

  const openEditeModal = (record: ConfigGroupModel) => {
    dataFormRef.value.edite(record);
  };

  // 删除
  const onDelete = async (id: string) => {
    try {
      await deleted(id);
      tableRef.value.refresh();
      Message.success('删除成功');
    } catch (err) {
      Message.error('删除失败');
    }
  };
</script>

<script lang="ts">
  export default {
    name: 'SystemConfigGroup',
  };
</script>

<style scoped lang="less">
  .tag {
    margin-right: 5px;
  }
</style>
