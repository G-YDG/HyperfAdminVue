<template>
  <div class="container">
    <!--    面包屑-->
    <Breadcrumb :items="['menu.system', 'menu.system.user']" />
    <!--    卡片内容-->
    <a-card class="general-card" :title="$t('searchTable.title')">
      <!--      搜索框-->
      <Search
        :search-form-model="searchFormModel"
        :search-form-config="searchFormConfig"
        @search="search"
        @reset="reset"
      >
        <template #roleId>
          <a-select
            v-model="searchFormModel.role_id"
            :options="roleOptions"
            :placeholder="$t('searchTable.form.selectDefault')"
          />
        </template>
      </Search>
      <!--      分割线-->
      <a-divider style="margin-top: 0" />
      <!--      表格-->
      <TableData
        :table-loading="loading"
        :table-columns="tableColumns"
        @fetch-table-data="fetchTableData"
        @search="search"
        @handle-create-modal-click="handleCreateModalClick"
      >
        <!--        状态-->
        <template #status="{ record }">
          <span v-if="record.status === 1" class="circle success"></span>
          <span v-else class="circle fail"></span>
          {{ $t(`user.form.status.${record.status}`) }}
        </template>
        <!--        角色-->
        <template #roles="{ record }">
          <span v-for="role in record.roles" :key="role">
            <a-tag color="blue" style="margin-right: 5px">{{
              role.name
            }}</a-tag>
          </span>
        </template>
        <!--        操作-->
        <template #operations="{ record }">
          <a-button
            type="text"
            size="small"
            @click="handleEditeModalClick(record)"
          >
            {{ $t(`searchTable.operation.edite`) }}
          </a-button>
          <a-popconfirm
            :content="$t(`searchTable.operation.confirmDelete`)"
            type="error"
            @ok="handleDelete(record.id)"
          >
            <a-button type="text" size="small">
              {{ $t(`searchTable.operation.delete`) }}
            </a-button>
          </a-popconfirm>
        </template>
      </TableData>
    </a-card>

    <!--    表单弹窗-->
    <a-modal
      v-model:visible="formVisible"
      :title="modalTitle"
      :on-before-ok="handleSave"
      @cancel="handleModalCancel"
    >
      <a-form :model="formModel">
        <a-form-item
          :disabled="formAction === 'edite'"
          field="username"
          :label="$t('user.form.username')"
        >
          <a-input
            v-model="formModel.username"
            :placeholder="$t('user.form.username.placeholder')"
          />
        </a-form-item>
        <a-form-item field="nickname" :label="$t('user.form.nickname')">
          <a-input
            v-model="formModel.nickname"
            :placeholder="$t('user.form.nickname.placeholder')"
          />
        </a-form-item>
        <a-form-item
          v-show="formAction !== 'edite'"
          field="password"
          :label="$t('user.form.password')"
        >
          <a-input-password
            v-model="formModel.password"
            :placeholder="$t('user.form.password.placeholder')"
            allow-clear
          />
        </a-form-item>
        <a-form-item field="role_ids" :label="$t('user.form.role')">
          <a-select
            v-model="formModel.role_ids"
            multiple
            :options="roleOptions"
            :placeholder="$t('searchTable.form.select')"
          />
        </a-form-item>
        <a-form-item field="status" :label="$t('role.form.status')">
          <a-select
            v-model="formModel.status"
            :default-value="1"
            :options="statusOptions"
            :placeholder="$t('searchTable.form.selectDefault')"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
  import { ref, computed, reactive, provide } from 'vue';
  import { useI18n } from 'vue-i18n';
  import useLoading from '@/hooks/loading';
  import { Pagination } from '@/types/global';
  import { Message } from '@arco-design/web-vue';
  import type { SelectOptionData } from '@arco-design/web-vue/es/select/interface';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import {
    index,
    save,
    update,
    deleted,
    UserModel,
    UserRecord,
  } from '@/api/system/user';
  import { list } from '@/api/system/role';

  const { t } = useI18n();
  const { loading, setLoading } = useLoading(true);

  // 获取角色
  const roleOptions = ref<SelectOptionData[]>([]);
  const fetchRoleOption = async () => {
    setLoading(true);
    try {
      const { data } = await list();
      roleOptions.value = data.map((item) => ({
        label: item.name,
        value: item.id,
      }));
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };
  fetchRoleOption();

  const statusOptions = computed<SelectOptionData[]>(() => [
    {
      label: t('user.form.status.1'),
      value: 1,
    },
    {
      label: t('user.form.status.2'),
      value: 2,
    },
  ]);

  // 搜索表单
  const searchFormModel = ref({
    username: '',
    status: '',
    role_id: '',
  });

  // 搜索配置
  const searchFormConfig = computed<Record<string, any>[]>(() => [
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
      slotName: 'roleId',
    },
  ]);

  // 表格
  const tableData = ref<[]>([]);
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

  const basePagination: Pagination = {
    page: 1,
    pageSize: 20,
  };

  const pagination = reactive({ ...basePagination });

  // provide： 传递数据给子组件
  provide('tableData', tableData);
  provide('tablePagination', pagination);

  const fetchTableData = async (params: object = { page: 1, pageSize: 20 }) => {
    setLoading(true);
    try {
      const { data } = await index(params);
      tableData.value = data.items;
      pagination.current = data.pageInfo.currentPage;
      pagination.total = data.pageInfo.total;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };

  const search = () => {
    fetchTableData({
      ...basePagination,
      ...searchFormModel.value,
    } as unknown as object);
  };

  const reset = () => {
    Object.keys(searchFormModel.value).forEach((key) => {
      searchFormModel.value[key] = '';
    });
  };

  // 表单数据
  const formModel = ref<UserModel>({} as UserModel);

  // 表单弹窗状态
  const formVisible = ref(false);

  // 表单行为
  const formAction = ref('create');

  // 表单弹窗标题
  const modalTitle = ref('');

  // 打开表单弹窗
  const handleModalClick = () => {
    modalTitle.value = t(`searchTable.operation.${formAction.value}`);
    formVisible.value = true;
  };

  // 关闭弹窗
  const handleModalCancel = () => {
    formVisible.value = false;
    formModel.value = {} as UserModel;
    search();
  };

  // 打开创建弹窗
  const handleCreateModalClick = () => {
    formAction.value = 'create';
    handleModalClick();
  };

  // 打开编辑弹窗
  const handleEditeModalClick = (record: UserRecord) => {
    formAction.value = 'edite';
    formModel.value = {
      id: record.id,
      username: record.username,
      avatar: record.avatar,
      nickname: record.nickname,
      password: record.password,
      role_ids: record.roles.map((item) => item.id),
      status: record.status,
    };
    handleModalClick();
  };

  // 表单数据保存
  const handleSave = async () => {
    try {
      if (formAction.value === 'create') {
        await save(formModel.value);
      } else {
        await update(formModel.value.id, formModel.value);
      }
      Message.success('操作成功');
      formModel.value = {} as UserModel;
      search();
      return true;
    } catch (err) {
      return false;
    }
  };

  // 删除
  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      await deleted(id);
      Message.success('删除成功');
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      search();
      setLoading(false);
    }
  };
</script>

<script lang="ts">
  export default {
    name: 'SystemUser',
  };
</script>
