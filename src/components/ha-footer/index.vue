<template>
  <a-layout-footer class="footer">
    {{ appStore.websiteSetting.WEBSITE_SETTING_TIME }}
    <a-link
      :href="appStore.websiteSetting.WEBSITE_SETTING_URL"
      target="_blank"
      class="a-link-website"
    >
      {{ appStore.websiteSetting.WEBSITE_SETTING_COMPANY }}
    </a-link>
    <a-link
      href="https://beian.miit.gov.cn/"
      target="_blank"
      class="a-link-website"
    >
      {{ appStore.websiteSetting.WEBSITE_SETTING_RECORD_NUMBER }}
    </a-link>
  </a-layout-footer>
</template>

<script lang="ts" setup>
  import { useAppStore } from '@/store';

  const appStore = useAppStore();
</script>

<style lang="less" scoped>
  .footer {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 40px;
    color: var(--color-text-2);
    text-align: center;
    .a-link-website {
      text-decoration: none;
      color: inherit;
    }
  }
</style>
