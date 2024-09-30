<template>
  <div class="container">
    <HaBreadcrumb :items="['menu.system', 'menu.system.user']" />

    <a-card class="general-card" :title="$t('searchTable.title')">
      <HaTableData
        ref="tableRef"
        :search-model="searchModel"
        :search-config="searchConfig"
        :table-columns="tableColumns"
        :table-data-api="index"
      >
        <template #searchModelRoleId>
          <a-select
            v-model="searchModel.role_id"
            :options="userRoleOptions"
            :placeholder="$t('searchTable.form.selectDefault')"
          />
        </template>

        <template #tableSettingSettingLeft>
          <a-button type="primary" @click="openCreateModal">
            <template #icon>
              <icon-plus />
            </template>
            {{ $t('searchTable.operation.create') }}
          </a-button>
        </template>

        <template #tableSettingSettingRight>
          <a-tooltip :content="$t('searchTable.actions.export')">
            <div class="action-icon" @click="onExport">
              <icon-export size="18" :spin="iconExportSpin" />
            </div>
          </a-tooltip>
        </template>

        <template #status="{ record }">
          <span v-if="record.status === 1" class="circle success"></span>
          <span v-else class="circle fail"></span>
          {{ $t(`user.form.status.${record.status}`) }}
        </template>

        <template #roles="{ record }">
          <span v-for="role in record.roles" :key="role">
            <a-tag color="blue" class="tag">{{ role.name }}</a-tag>
          </span>
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

    <!--    表单弹窗-->
    <DataForm ref="dataFormRef" @refresh="() => refresh()" />
  </div>
</template>

<script lang="ts" setup>
  import { ref, computed } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { Message } from '@arco-design/web-vue';
  import { index, deleted } from '@/api/system/user';
  import { list, RoleModel } from '@/api/system/role';
  import type { SelectOptionData } from '@arco-design/web-vue/es/select/interface';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import DataForm from '@/views/system/user/components/data-form.vue';
  import { downloadByBlobResponse } from '@/utils/file';
  import axios from 'axios';

  const { t } = useI18n();

  const userRoleOptions = ref<SelectOptionData[]>([]);
  const fetchUserRoleOptions = async () => {
    try {
      const { data } = await list();
      userRoleOptions.value = data.map((item) => ({
        label: item.name,
        value: item.id,
      }));
    } catch (err) {
      Message.error('获取角色列表失败');
    }
  };
  fetchUserRoleOptions();

  const tableRef = ref();
  const dataFormRef = ref();

  const searchModel = ref({
    username: '',
    status: '',
    role_id: '',
  });
  const searchConfig = computed<Record<string, any>[]>(() => [
    {
      key: 'username',
      type: 'a-input',
      label: t('user.form.username'),
      placeholder: t('user.form.username.placeholder'),
    },
    {
      key: 'status',
      type: 'a-select',
      label: t('user.form.status'),
      placeholder: t('searchTable.form.selectDefault'),
      options: [
        {
          label: t('user.form.status.1'),
          value: 1,
        },
        {
          label: t('user.form.status.2'),
          value: 2,
        },
      ],
    },
    {
      key: 'role_id',
      label: t('user.form.role'),
      useSlot: true,
      slotName: 'searchModelRoleId',
    },
  ]);
  const tableColumns = computed<TableColumnData[]>(() => [
    {
      title: t('searchTable.columns.id'),
      dataIndex: 'id',
    },
    {
      title: t('user.form.username'),
      dataIndex: 'username',
    },
    {
      title: t('user.form.nickname'),
      dataIndex: 'nickname',
    },
    {
      title: t('user.form.role'),
      dataIndex: 'roles',
      slotName: 'roles',
    },
    {
      title: t('user.form.status'),
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

  const openEditeModal = (record: RoleModel) => {
    dataFormRef.value.edite(record);
  };

  // 导出
  const iconExportSpin = ref(false);
  const onExport = async () => {
    iconExportSpin.value = true;
    try {
      await axios
        .get(`/system/user/export`, { responseType: 'blob' })
        .then((response: any) => {
          downloadByBlobResponse(response);
          Message.success('导出成功');
        });
    } catch (err) {
      Message.error('导出失败');
    } finally {
      iconExportSpin.value = false;
    }
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
    name: 'SystemUser',
  };
</script>

<style scoped lang="less">
  .tag {
    margin-right: 5px;
  }
</style>
