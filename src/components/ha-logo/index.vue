<template>
  <div class="ha-logo">
    <img
      class="logo"
      width="33"
      height="33"
      alt="logo"
      :src="appStore.websiteSetting.WEBSITE_SETTING_LOGO"
    />
    <span v-if="appStore.device !== 'mobile'" class="title">
      {{ appStore.websiteSetting.WEBSITE_SETTING_TITLE }}
    </span>
  </div>
</template>

<script lang="ts" setup>
  import { useAppStore } from '@/store';

  const appStore = useAppStore();
</script>

<style lang="less" scoped>
  .ha-logo {
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--color-text-2);

    .title {
      margin-left: 2px;
      font-size: 18px;
    }
  }
</style>
