<template>
  <div class="container">
    <HaBreadcrumb
      :items="['menu.system', 'menu.system.logs', 'menu.system.logs.login']"
    />

    <a-card class="general-card" :title="$t('searchTable.title')">
      <HaTableData
        ref="tableRef"
        :search-model="searchModel"
        :search-config="searchConfig"
        :table-columns="tableColumns"
        :table-data-api="getLoginLogPageList"
      >
        <template #searchLoginTime>
          <a-range-picker v-model="searchModel.login_time" />
        </template>

        <template #status="{ record }">
          <span v-if="record.status === 1" class="circle success"></span>
          <span v-else class="circle fail"></span>
          {{ $t(`logs.login.form.status.${record.status}`) }}
        </template>

        <template #operations="{ record }">
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
  </div>
</template>

<script lang="ts" setup>
  import { ref, computed } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { Message } from '@arco-design/web-vue';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import { deleteLoginLog, getLoginLogPageList } from '@/api/system/logs';

  const { t } = useI18n();

  const tableRef = ref();

  const searchModel = ref({
    username: '',
    status: '',
    ip: '',
    login_time: [],
  });
  const searchConfig = computed<Record<string, any>[]>(() => [
    {
      key: 'username',
      type: 'a-input',
      label: t('logs.login.form.username'),
      placeholder: t('logs.login.form.username.placeholder'),
    },
    {
      key: 'status',
      type: 'a-select',
      label: t('logs.login.form.status'),
      placeholder: t('logs.login.form.status.placeholder'),
      options: [
        {
          label: t('logs.login.form.status.1'),
          value: 1,
        },
        {
          label: t('logs.login.form.status.2'),
          value: 2,
        },
      ],
    },
    {
      key: 'ip',
      type: 'a-input',
      label: t('logs.login.form.ip'),
      placeholder: t('logs.login.form.ip.placeholder'),
    },
    {
      useSlot: true,
      slotName: 'searchLoginTime',
      label: t('logs.login.form.login_time'),
    },
  ]);
  const tableColumns = computed<TableColumnData[]>(() => [
    {
      title: t('logs.login.form.username'),
      dataIndex: 'username',
    },
    {
      title: t('logs.login.form.status'),
      dataIndex: 'status',
      slotName: 'status',
    },
    {
      title: t('logs.login.form.ip'),
      dataIndex: 'ip',
    },
    {
      title: t('logs.login.form.ip_location'),
      dataIndex: 'ip_location',
    },
    {
      title: t('logs.login.form.os'),
      dataIndex: 'os',
    },
    {
      title: t('logs.login.form.browser'),
      dataIndex: 'browser',
    },
    {
      title: t('logs.login.form.message'),
      dataIndex: 'message',
    },
    {
      title: t('logs.login.form.login_time'),
      dataIndex: 'login_time',
    },
    {
      title: t('searchTable.columns.operations'),
      dataIndex: 'operations',
      slotName: 'operations',
    },
  ]);

  // 删除
  const onDelete = async (id: string) => {
    try {
      await deleteLoginLog(id);
      tableRef.value.refresh();
      Message.success('删除成功');
    } catch (err) {
      Message.error('删除失败');
    }
  };
</script>

<script lang="ts">
  export default {
    name: 'SystemLogsLogin',
  };
</script>
