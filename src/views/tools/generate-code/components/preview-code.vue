<template>
  <a-modal v-model:visible="visible" width="80%" :footer="false">
    <template #title>预览代码</template>
    <a-tabs v-model:active-key="activeTab">
      <a-tab-pane
        v-for="item in previewCode"
        :key="item.name"
        :title="item.label"
      >
        <div class="relative">
          <HaCodeEditor
            v-model="item.code"
            readonly
            mini-map
            :language="item.lang"
            :height="600"
          />
          <a-button
            class="copy-button"
            type="primary"
            @click="copyCode(item.code)"
          >
            <icon-copy /> {{ $t('searchTable.operation.copy') }}
          </a-button>
        </div>
      </a-tab-pane>
    </a-tabs>
  </a-modal>
</template>

<script setup>
  import { ref } from 'vue';
  import { preview } from '@/api/tools/generate-code';
  import { copy } from '@/utils/tools';

  const activeTab = ref('controller');
  const visible = ref(false);
  const previewCode = ref([]);

  const open = async (params) => {
    try {
      const response = await preview(params);
      previewCode.value = response.data;
      visible.value = true;
      return true;
    } catch (error) {
      return false;
    }
  };

  const copyCode = async (code) => {
    copy(code);
  };

  defineExpose({ open });
</script>

<style scoped>
  .copy-button {
    position: absolute;
    right: 15px;
    top: 0;
    z-index: 999;
  }
</style>
