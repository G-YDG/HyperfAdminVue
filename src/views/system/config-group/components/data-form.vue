<template>
  <a-modal
    v-model:visible="formVisible"
    :title="formModalTitle"
    :on-before-ok="submit"
    @cancel="close"
  >
    <a-form :model="formModel">
      <a-form-item field="key" :label="$t('config.group.form.key')">
        <a-input
          v-model="formModel.key"
          :disabled="formAction === 'edite'"
          :placeholder="$t('config.group.form.key.placeholder')"
        />
      </a-form-item>
      <a-form-item field="name" :label="$t('config.group.form.name')">
        <a-input
          v-model="formModel.name"
          :placeholder="$t('config.group.form.name.placeholder')"
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
    ConfigGroupModel,
    ConfigGroupRecord,
    save,
    update,
  } from '@/api/system/config-group';

  const { t } = useI18n();

  const formModel = ref<ConfigGroupModel>({} as ConfigGroupModel);
  const formVisible = ref(false);
  const formAction = ref('create');
  const formModalTitle = ref('');

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

  const edite = (record: ConfigGroupRecord) => {
    formModel.value = {
      id: record.id,
      name: record.name,
      key: record.key,
    };
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
      formModel.value = {} as ConfigGroupModel;
      emit('refresh');
      return true;
    } catch (err) {
      return false;
    }
  };

  const close = () => {
    formVisible.value = false;
    formModel.value = {} as ConfigGroupModel;
    formModalTitle.value = '';
    emit('refresh');
  };

  defineExpose({ create, edite });
</script>
