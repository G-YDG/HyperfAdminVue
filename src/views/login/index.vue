<template>
  <div class="login-container">
    <div class="logo">
      <HaLogo />
    </div>
    <div class="content">
      <div class="content-inner">
        <LoginForm />
      </div>
    </div>
    <div class="footer">
      <HaFooter />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import HaFooter from '@/components/ha-footer/index.vue';
  import LoginForm from './components/login-form.vue';
</script>

<style lang="less" scoped>
  .login-container {
    display: flex;
    height: 100vh;
    align-items: center;
    justify-content: center;
    background: linear-gradient(163.85deg, var(--color-bg-5) 0%, #0039ab 100%);

    .content {
      background: var(--color-bg-5);
      border-radius: 20px;
      position: relative;
      display: flex;
      padding: 40px;
    }

    .footer {
      position: absolute;
      right: 0;
      bottom: 0;
      width: 100%;
      color: var(--color-text-4);
    }
  }

  .logo {
    position: fixed;
    top: 24px;
    left: 22px;
    z-index: 1;
    display: inline-flex;
    align-items: center;
  }
</style>

<style lang="less" scoped>
  // responsive
  @media (max-width: @screen-lg) {
    .container {
      .banner {
        width: 25%;
      }
    }
  }
</style>
