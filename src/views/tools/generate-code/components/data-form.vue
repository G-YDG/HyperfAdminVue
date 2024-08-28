<template>
  <a-modal
    v-model:visible="formVisible"
    :title="$t('generateCode.previewCode')"
    :on-before-ok="submit"
  >
    <a-form :model="formModel">
      <a-form-item field="module" :label="$t('generateCode.from.module')">
        <a-input
          v-model="formModel.module"
          :placeholder="$t('generateCode.from.module.placeholder')"
        />
      </a-form-item>
      <a-form-item field="name" :label="$t('generateCode.from.name')">
        <a-input
          v-model="formModel.name"
          :placeholder="$t('generateCode.from.name.placeholder')"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { GenerateCodeModel } from '@/api/tools/generate-code';

  const formModel = ref<GenerateCodeModel>({} as GenerateCodeModel);
  const formVisible = ref(false);

  const open = async (params: any) => {
    formVisible.value = true;
    formModel.value.module = params.module || 'System';
    formModel.value.name = params.name || '';
  };

  const emit = defineEmits(['submit']);

  const submit = async () => {
    emit('submit', { ...formModel.value });
  };

  defineExpose({ open });
</script>

<style scoped lang="less"></style>
