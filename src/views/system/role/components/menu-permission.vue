<template>
  <a-modal
    v-model:visible="menuVisible"
    :title="$t(`searchTable.operation.menu`)"
    @cancel="close"
    @before-ok="submit"
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
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { Message } from '@arco-design/web-vue';
  import { MenuTreeRecord, tree } from '@/api/system/menu';
  import { getMenuIdsByRole, menuPermission } from '@/api/system/role';
  import { useI18n } from 'vue-i18n';

  const { t } = useI18n();

  const menuVisible = ref(false);
  const menuLoading = ref(false);
  const menuRoleId = ref('');
  const menuTreeData = ref<MenuTreeRecord[]>([]);
  const menuCheckedKeys = ref([]);

  const emit = defineEmits(['success']);

  const open = async (record: any) => {
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

  const close = () => {
    menuVisible.value = false;
    menuTreeData.value = [];
    menuCheckedKeys.value = [];
  };

  const submit = async () => {
    try {
      await menuPermission(menuRoleId.value, menuCheckedKeys.value);
      emit('success');
      Message.success('修改成功');
    } catch (err) {
      // you can report use errorHandler or other
    }
  };

  defineExpose({ open });
</script>
