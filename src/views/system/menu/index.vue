<template>
  <div class="container">
    <!--    面包屑-->
    <Breadcrumb :items="['menu.system', 'menu.system.menu']" />

    <!--    卡片内容-->
    <a-card class="general-card" :title="$t('menu.system.menu')">
      <HaTableData
        ref="tableRef"
        :table-columns="tableColumns"
        :table-data-api="list"
        :show-table-pagination="false"
      >
        <template #tableSettingSettingLeft>
          <a-button type="primary" @click="openCreateModal">
            <template #icon>
              <icon-plus />
            </template>
            {{ $t('searchTable.operation.create') }}
          </a-button>
        </template>

        <template #name="{ record }">
          {{ $t(`${record.name}`) }}
        </template>

        <template #hideMenu="{ record }">
          <span v-if="record.hide_menu === 1" class="circle success"></span>
          <span v-else class="circle fail"></span>
          {{ $t(`menu.form.hide_menu.${record.hide_menu}`) }}
        </template>

        <template #status="{ record }">
          <span v-if="record.status === 1" class="circle success"></span>
          <span v-else class="circle fail"></span>
          {{ $t(`menu.form.status.${record.status}`) }}
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
            <a-button type="text" size="small">
              {{ $t(`searchTable.operation.delete`) }}
            </a-button>
          </a-popconfirm>
        </template>
      </HaTableData>
    </a-card>

    <DataForm ref="dataFormRef" @refresh="() => refresh()" />
  </div>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { Message } from '@arco-design/web-vue';
  import { list, deleted, MenuRecord } from '@/api/system/menu';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import DataForm from '@/views/system/menu/components/data-form.vue';

  const { t } = useI18n();

  const tableRef = ref();
  const dataFormRef = ref();
  const tableColumns = computed<TableColumnData[]>(() => [
    {
      title: t(`menu.form.id`),
      dataIndex: 'id',
    },
    {
      title: t(`menu.form.parent_id`),
      dataIndex: 'parent_id',
    },
    {
      title: t(`menu.form.name`),
      dataIndex: 'name',
      slotName: 'name',
    },
    {
      title: t(`menu.form.icon`),
      dataIndex: 'icon',
    },
    {
      title: t(`menu.form.code`),
      dataIndex: 'code',
    },
    {
      title: t(`menu.form.route`),
      dataIndex: 'route',
    },
    {
      title: t(`menu.form.sort`),
      dataIndex: 'sort',
    },
    {
      title: t(`menu.form.hide_menu`),
      dataIndex: 'hide_menu',
      slotName: 'hideMenu',
    },
    {
      title: t(`menu.form.status`),
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

  const openCreateModal = () => {
    dataFormRef.value.create();
  };

  const openEditeModal = (record: MenuRecord) => {
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
