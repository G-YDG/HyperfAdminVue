<template>
  <div class="container">
    <!--    面包屑-->
    <Breadcrumb :items="['menu.system', 'menu.system.menu']" />

    <!--    卡片内容-->
    <a-card class="general-card" :title="$t('menu.system.menu')">
      <TableData
        :table-loading="loading"
        :table-columns="tableColumns"
        @fetch-table-data="fetchTableData"
        @search="search"
        @handle-create-modal-click="handleCreateModalClick"
      >
        <template #name="{ record }">
          {{ $t(`${record.name}`) }}
        </template>

        <template #hideMenu="{ record }">
          {{ $t(`menu.form.hide_menu.${record.hide_menu}`) }}
        </template>

        <template #status="{ record }">
          {{ $t(`menu.form.status.${record.status}`) }}
        </template>

        <!--                操作-->
        <template #operations="{ record }">
          <a-button
            type="text"
            size="small"
            @click="handleEditeModalClick(record)"
          >
            {{ $t(`searchTable.operation.edite`) }}
          </a-button>
          <a-popconfirm
            :content="$t(`searchTable.operation.delete.confirm`)"
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
          v-show="formAction !== 'create'"
          disabled
          field="id"
          :label="$t('menu.form.id')"
        >
          <a-input
            v-model="formModel.id"
            :placeholder="$t('menu.form.id.placeholder')"
          />
        </a-form-item>
        <a-form-item field="parent_id" :label="$t('menu.form.parent_id')">
          <a-tree-select
            v-model="formModel.parent_id"
            :data="menuTreeData"
            :placeholder="$t('menu.form.parent_id.placeholder')"
            :field-names="{
              key: 'id',
              title: 'title',
              children: 'children',
            }"
          >
          </a-tree-select>
        </a-form-item>
        <a-form-item field="name" :label="$t('menu.form.name')">
          <a-input
            v-model="formModel.name"
            :placeholder="$t('menu.form.name.placeholder')"
          />
        </a-form-item>
        <a-form-item field="icon" :label="$t('menu.form.icon')">
          <a-input-group :style="{ width: '100%' }">
            <a-input-search
              v-model="formModel.icon"
              :placeholder="$t('menu.form.icon.placeholder')"
              :button-text="$t('menu.form.searchIcon')"
              search-button
              @search="redirectToFindIcon"
            />
          </a-input-group>
        </a-form-item>
        <a-form-item field="name" :label="$t('menu.form.code')">
          <a-input
            v-model="formModel.code"
            :placeholder="$t('menu.form.code.placeholder')"
          />
        </a-form-item>
        <a-form-item field="route" :label="$t('menu.form.route')">
          <a-input
            v-model="formModel.route"
            :placeholder="$t('menu.form.route.placeholder')"
          />
        </a-form-item>
        <a-form-item field="sort" :label="$t('menu.form.sort')">
          <a-input-number
            v-model="formModel.sort"
            :default-value="0"
            mode="button"
          />
        </a-form-item>
        <a-form-item field="hide_menu" :label="$t('menu.form.hide_menu')">
          <a-switch
            v-model="formModel.hide_menu"
            :checked-value="1"
            :unchecked-value="2"
          />
        </a-form-item>
        <a-form-item field="status" :label="$t('menu.form.status')">
          <a-switch
            v-model="formModel.status"
            :checked-value="1"
            :unchecked-value="2"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref, provide } from 'vue';
  import useLoading from '@/hooks/loading';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import { useI18n } from 'vue-i18n';
  import { Message } from '@arco-design/web-vue';
  import {
    index,
    save,
    update,
    deleted,
    MenuRecord,
    tree,
    MenuTreeRecord,
  } from '@/api/system/menu';

  const { t } = useI18n();

  const { loading, setLoading } = useLoading(true);

  // 表格数据
  const tableData = ref<MenuRecord[]>([]);
  // 表格列配置
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

  // provide： 传递数据给子组件
  provide('tableData', tableData);

  // 获取表格数据
  const fetchTableData = async () => {
    setLoading(true);
    try {
      const { data } = await index();
      tableData.value = data;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };

  // 搜索
  const search = () => {
    fetchTableData();
  };

  // 菜单数据
  const menuTreeData = ref<MenuTreeRecord[]>([]);
  const getMenuTree = async () => {
    const { data } = await tree();
    menuTreeData.value = data;
    menuTreeData.value.forEach((item) => {
      item.title = t(item.title);
      item.children.forEach((childrenItem) => {
        childrenItem.title = t(childrenItem.title);
      });
    });
    menuTreeData.value.unshift({
      id: '0',
      parent_id: '0',
      key: '0',
      title: '无',
      disabled: false,
      children: [],
    });
  };
  getMenuTree();

  // 表单数据
  const formModel = ref<MenuRecord>({} as MenuRecord);

  // 弹窗状态
  const formVisible = ref(false);

  // 表单行为
  const formAction = ref('create');

  // 弹窗标题
  const modalTitle = ref('');

  // 重置表单数据
  const resetFormModel = () => {
    formModel.value = {
      parent_id: '0',
      sort: 0,
      hide_menu: 1,
      status: 1,
    } as MenuRecord;
  };
  resetFormModel();

  //  打开弹窗
  const handleModalClick = () => {
    modalTitle.value = t(`searchTable.operation.${formAction.value}`);
    formVisible.value = true;
  };

  // 关闭弹窗
  const handleModalCancel = () => {
    formVisible.value = false;
    modalTitle.value = '';
    resetFormModel();
    search();
  };

  // 打开创建弹窗
  const handleCreateModalClick = () => {
    formVisible.value = true;
    formAction.value = 'create';
    handleModalClick();
  };

  // 打开编辑弹窗
  const handleEditeModalClick = (record: MenuRecord) => {
    modalTitle.value = t(`searchTable.operation.edite`);
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
      resetFormModel();
      search();
      getMenuTree();
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

  // 跳转至ArcoDesign图标库
  const redirectToFindIcon = () => {
    window.open('https://arco.design/vue/component/icon');
  };
</script>
