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
          :options="roleStatusOptions"
          :placeholder="$t('searchTable.form.selectDefault')"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { Message } from '@arco-design/web-vue';
  import type { SelectOptionData } from '@arco-design/web-vue/es/select/interface';
  import { RoleModel, save, update } from '@/api/system/role';

  const { t } = useI18n();

  const formModel = ref<RoleModel>({} as RoleModel);
  const formVisible = ref(false);
  const formAction = ref('create');
  const formModalTitle = ref('');
  const roleStatusOptions = computed<SelectOptionData[]>(() => [
    {
      label: t('role.form.status.1'),
      value: 1,
    },
    {
      label: t('role.form.status.2'),
      value: 2,
    },
  ]);

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

  const edite = (record: RoleModel) => {
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
      formModel.value = {} as RoleModel;
      emit('refresh');
      return true;
    } catch (err) {
      return false;
    }
  };

  const close = () => {
    formVisible.value = false;
    formModel.value = {} as RoleModel;
    formModalTitle.value = '';
    emit('refresh');
  };

  defineExpose({ create, edite });
</script>
