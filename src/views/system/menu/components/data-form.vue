<template>
  <a-modal
    v-model:visible="formVisible"
    :title="formModalTitle"
    :on-before-ok="submit"
    @cancel="close"
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
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { Message } from '@arco-design/web-vue';
  import {
    MenuTreeRecord,
    MenuRecord,
    save,
    update,
    tree,
  } from '@/api/system/menu';

  const { t } = useI18n();

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

  const formModel = ref<MenuRecord>({} as MenuRecord);
  const formVisible = ref(false);
  const formAction = ref('create');
  const formModalTitle = ref('');

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

  const emit = defineEmits(['refresh']);

  const openModal = () => {
    formModalTitle.value = t(`searchTable.operation.${formAction.value}`);
    formVisible.value = true;
  };

  const create = () => {
    formVisible.value = true;
    formAction.value = 'create';
    openModal();
  };

  const edite = (record: MenuRecord) => {
    formModel.value = record;
    formAction.value = 'edite';
    openModal();
  };

  const submit = async () => {
    try {
      if (formAction.value === 'create') {
        await save(formModel.value);
      } else {
        await update(formModel.value.id, formModel.value);
      }
      Message.success('操作成功');
      resetFormModel();
      emit('refresh');
      return true;
    } catch (err) {
      return false;
    }
  };

  const close = () => {
    formVisible.value = false;
    formModalTitle.value = '';
    resetFormModel();
    emit('refresh');
  };

  // 跳转至ArcoDesign图标库
  const redirectToFindIcon = () => {
    window.open('https://arco.design/vue/component/icon');
  };

  defineExpose({ create, edite });
</script>
