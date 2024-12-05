<template>
  <div class="container">
    <HaBreadcrumb
      :items="['menu.system', 'menu.system.config', 'menu.system.config.list']"
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
        <template #searchSystemGroupId>
          <a-select
            v-model="searchModel.system_group_id"
            :options="configGroupOptions"
            :placeholder="$t('searchTable.form.selectDefault')"
          />
        </template>

        <template #group="{ record }">
          {{ record.group ? record.group.name : '' }}
        </template>

        <template #value="{ record }">
          <a-image
            v-if="record.value_type === 2"
            width="100"
            :src="record.value"
          />
          <span v-else>{{ record.value }}</span>
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
  import { list } from '@/api/system/config-group';
  import { index, deleted, ConfigModel } from '@/api/system/config';
  import type { SelectOptionData } from '@arco-design/web-vue/es/select/interface';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import DataForm from '@/views/system/config/components/data-form.vue';

  const { t } = useI18n();

  const configGroupOptions = ref<SelectOptionData[]>([]);
  const fetchConfigGroupOptions = async () => {
    try {
      const { data } = await list();
      configGroupOptions.value = data.map((item: any) => ({
        label: item.name,
        value: item.id,
      }));
    } catch (err) {
      Message.error('获取分组列表失败');
    }
  };
  fetchConfigGroupOptions();

  const tableRef = ref();
  const dataFormRef = ref();

  const searchModel = ref({
    remark: '',
    system_group_id: '',
  });
  const searchConfig = computed<Record<string, any>[]>(() => [
    {
      key: 'system_group_id',
      label: t('config.form.system_group_id'),
      useSlot: true,
      slotName: 'searchSystemGroupId',
    },
    {
      key: 'remark',
      type: 'a-input',
      label: t('config.form.remark'),
      placeholder: t('config.form.remark.placeholder'),
    },
  ]);
  const tableColumns = computed<TableColumnData[]>(() => [
    {
      title: t('searchTable.columns.id'),
      dataIndex: 'id',
      width: 100,
    },
    {
      title: t('config.form.key'),
      dataIndex: 'key',
      width: 320,
    },
    {
      title: t('config.form.value'),
      slotName: 'value',
      width: 320,
    },
    {
      title: t('config.form.remark'),
      dataIndex: 'remark',
      width: 280,
    },
    {
      title: t('config.form.system_group_id'),
      slotName: 'group',
      width: 200,
    },
    {
      title: t('searchTable.columns.createdAt'),
      dataIndex: 'created_at',
      width: 180,
    },
    {
      title: t('searchTable.columns.operations'),
      dataIndex: 'operations',
      slotName: 'operations',
    },
  ]);

  const openCreateModal = () => {
    dataFormRef.value.create();
  };

  const refresh = () => {
    tableRef.value.refresh();
  };

  const openEditeModal = (record: ConfigModel) => {
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
    name: 'SystemConfig',
  };
</script>

<style scoped lang="less">
  .tag {
    margin-right: 5px;
  }
</style>
