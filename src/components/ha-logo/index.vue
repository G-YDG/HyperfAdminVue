<template>
  <div class="ha-logo">
    <img
      class="logo"
      alt="logo"
      src="//p3-armor.byteimg.com/tos-cn-i-49unhts6dw/dfdba5317c0c20ce20e64fac803d52bc.svg~tplv-49unhts6dw-image.image"
    />
    <span v-if="appStore.device !== 'mobile'" class="title">
      {{ $t('website.title') }}
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
