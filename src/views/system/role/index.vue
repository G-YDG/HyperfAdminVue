<template>
  <div class="container">
    <Breadcrumb :items="['menu.system', 'menu.system.role']" />

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

        <template #status="{ record }">
          <span v-if="record.status === 1" class="circle success"></span>
          <span v-else class="circle fail"></span>
          {{ $t(`role.form.status.${record.status}`) }}
        </template>

        <!--        操作-->
        <template #operations="{ record }">
          <a-button type="text" size="small" @click="openMenuModal(record)">
            {{ $t(`searchTable.operation.menu`) }}
          </a-button>
          <a-button type="text" size="small" @click="openEditeModal(record)">
            {{ $t(`searchTable.operation.edite`) }}
          </a-button>
          <a-popconfirm
            :content="$t(`searchTable.operation.confirmDelete`)"
            type="error"
            @ok="onDelete(record.id)"
          >
            <a-button type="text" size="small">
              {{ $t(`searchTable.operation.delete`) }}
            </a-button>
          </a-popconfirm>
        </template>
      </HaTableData>
    </a-card>

    <DataForm ref="dataFormRef" @refresh="() => refresh()" />

    <MenuPermission ref="menuRef" @success="() => refresh()" />
  </div>
</template>

<script lang="ts" setup>
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import { computed, ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { Message } from '@arco-design/web-vue';
  import { RoleModel, index, deleted } from '@/api/system/role';
  import MenuPermission from '@/views/system/role/components/menu-permission.vue';
  import DataForm from '@/views/system/role/components/data-form.vue';

  const { t } = useI18n();

  const tableRef = ref();
  const dataFormRef = ref();
  const menuRef = ref();

  const searchModel = ref({
    name: '',
    status: '',
  });
  const searchConfig = computed<Record<string, any>[]>(() => [
    {
      key: 'name',
      type: 'a-input',
      label: t('role.form.name'),
      placeholder: t('role.form.name.placeholder'),
    },
    {
      key: 'status',
      type: 'a-select',
      label: t('role.form.status'),
      placeholder: t('searchTable.form.selectDefault'),
      options: [
        {
          label: t('role.form.status.1'),
          value: 1,
        },
        {
          label: t('role.form.status.2'),
          value: 2,
        },
      ],
    },
  ]);
  const tableColumns = computed<TableColumnData[]>(() => [
    {
      title: t('searchTable.columns.id'),
      dataIndex: 'id',
    },
    {
      title: t('role.form.name'),
      dataIndex: 'name',
    },
    {
      title: t('role.form.code'),
      dataIndex: 'code',
    },
    {
      title: t('role.form.status'),
      dataIndex: 'status',
      slotName: 'status',
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

  const openMenuModal = async (record: any) => {
    menuRef.value.open(record);
  };

  const openCreateModal = () => {
    dataFormRef.value.create();
  };

  const openEditeModal = (record: RoleModel) => {
    dataFormRef.value.edite(record);
  };

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
    name: 'SystemRole',
  };
</script>
