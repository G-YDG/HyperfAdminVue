<template>
  <div class="container">
    <!--    面包屑-->
    <Breadcrumb :items="['menu.system', 'menu.system.role']" />
    <!--    卡片内容-->
    <a-card class="general-card" :title="$t('searchTable.title')">
      <!--      搜索框-->
      <Search
        :search-form-model="searchFormModel"
        :search-form-config="searchFormConfig"
        @search="search"
        @reset="reset"
      >
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
        <template #status="{ record }">
          <span v-if="record.status === 1" class="circle success"></span>
          <span v-else class="circle fail"></span>
          {{ $t(`role.form.status.${record.status}`) }}
        </template>
        <!--        操作-->
        <template #operations="{ record }">
          <a-button
            type="text"
            size="small"
            @click="handleMenuModalClick(record)"
          >
            {{ $t(`searchTable.operation.menu`) }}
          </a-button>
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
      :title="formModalTitle"
      :on-before-ok="handleSave"
      @cancel="handleModalCancel"
    >
      <a-form :model="formModel">
        <a-form-item
          v-show="formAction !== 'create'"
          disabled
          field="ID"
          :label="$t('role.form.id')"
        >
          <a-input v-model="formModel.id" />
        </a-form-item>
        <a-form-item field="name" :label="$t('role.form.name')">
          <a-input
            v-model="formModel.name"
            :placeholder="$t('role.form.name.placeholder')"
          />
        </a-form-item>
        <a-form-item field="code" :label="$t('role.form.code')">
          <a-input
            v-model="formModel.code"
            :placeholder="$t('role.form.code.placeholder')"
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

    <!--    菜单-->
    <a-modal
      v-model:visible="menuVisible"
      :title="$t(`searchTable.operation.menu`)"
      @cancel="handleMenuModalCancel"
      @ok="handleMenu"
    >
      <a-card
        v-show="menuLoading"
        :bordered="false"
        :loading="menuLoading"
      ></a-card>
      <a-tree
        v-model:checked-keys="menuCheckedKeys"
        :checkable="true"
        :check-strictly="true"
        :data="menuTreeData"
      />
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
  import { computed, ref, reactive, provide } from 'vue';
  import { useI18n } from 'vue-i18n';
  import useLoading from '@/hooks/loading';
  import { Pagination } from '@/types/global';
  import { Message } from '@arco-design/web-vue';
  import type { SelectOptionData } from '@arco-design/web-vue/es/select/interface';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import { MenuTreeRecord, tree } from '@/api/system/menu';
  import {
    RoleModel,
    index,
    save,
    update,
    deleted,
    menuPermission,
    getMenuIdsByRole,
  } from '@/api/system/role';

  const { t } = useI18n();
  const { loading, setLoading } = useLoading(true);

  const statusOptions = computed<SelectOptionData[]>(() => [
    {
      label: t('role.form.status.1'),
      value: 1,
    },
    {
      label: t('role.form.status.2'),
      value: 2,
    },
  ]);

  // 搜索
  const searchFormModel = ref({
    name: '',
    status: '',
  });
  const searchFormConfig = computed<Record<string, any>[]>(() => [
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

  // 表格
  const tableData = ref<[]>([]);
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
  const formModel = ref<RoleModel>({} as RoleModel);

  // 表单弹窗状态
  const formVisible = ref(false);

  // 表单行为
  const formAction = ref('create');

  // 表单弹窗标题
  const formModalTitle = ref('');

  // 打开弹窗
  const handleModalClick = () => {
    formModalTitle.value = t(`searchTable.operation.${formAction.value}`);
    formVisible.value = true;
  };

  // 关闭弹窗
  const handleModalCancel = () => {
    formVisible.value = false;
    formModel.value = {} as RoleModel;
    formModalTitle.value = '';
    search();
  };

  // 打开创建弹窗
  const handleCreateModalClick = () => {
    formVisible.value = true;
    formAction.value = 'create';
    handleModalClick();
  };

  // 打开编辑弹窗
  const handleEditeModalClick = (record: RoleModel) => {
    formModel.value = record;
    formAction.value = 'edite';
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
      formModel.value = {} as RoleModel;
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
      search();
      Message.success('删除成功');
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };

  // 菜单弹窗状态
  const menuVisible = ref(false);
  const menuLoading = ref(false);

  // 菜单弹窗
  const menuTreeData = ref<MenuTreeRecord[]>([]);
  const menuCheckedKeys = ref([]);
  const menuRoleId = ref('');

  // 打开菜单弹窗
  const handleMenuModalClick = async (record: any) => {
    menuVisible.value = true;
    menuLoading.value = true;
    try {
      menuRoleId.value = record.id;
      const keyData = await getMenuIdsByRole(record.id);
      menuCheckedKeys.value = keyData.data;
      const { data } = await tree();
      menuTreeData.value = data;
      menuTreeData.value.forEach((item) => {
        item.title = t(item.title);
        item.children.forEach((childrenItem) => {
          childrenItem.title = t(childrenItem.title);
        });
      });
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      menuLoading.value = false;
    }
  };

  // 关闭菜单弹窗
  const handleMenuModalCancel = () => {
    menuVisible.value = false;
    menuTreeData.value = [];
    menuCheckedKeys.value = [];
  };

  // 更新角色菜单权限
  const handleMenu = async () => {
    setLoading(true);
    try {
      await menuPermission(menuRoleId.value, menuCheckedKeys.value);
      search();
      Message.success('修改成功');
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };
</script>

<script lang="ts">
  export default {
    name: 'SystemRole',
  };
</script>
