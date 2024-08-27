<template>
  <div class="container">
    <a-card class="card-info" :bordered="false">
      <div class="justify-between">
        <div>
          <a-avatar
            class="avatar"
            :size="100"
            :image-url="userStore.$state.avatar"
          ></a-avatar>
          <span class="text">
            {{ userStore.$state.nickname }}{{ $t('workplace.welcome') }}
          </span>
        </div>
        <div class="datetime">
          <h2>{{ time }}</h2>
          <p>{{ day }}</p>
        </div>
      </div>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted } from 'vue';
  import dayjs from 'dayjs';
  import { useUserStore } from '@/store';

  const userStore = useUserStore();

  const time = ref('');
  const day = ref('');
  const showTime = () => {
    time.value = dayjs().format('HH:mm:ss');
    day.value = dayjs().format('YYYY年MM月DD日');
  };

  onMounted(() => {
    showTime();
    setInterval(() => showTime(), 1000);
  });
</script>

<script lang="ts">
  export default {
    name: 'Workplace',
  };
</script>

<style>
  .card-info {
    padding: 15px;
    margin: 10px;
    border-radius: 10px;
    background-color: var(--color-bg-2);

    .text {
      font-size: 18px;
      color: var(--color-text-2);
      margin-left: 10px;

      .arco-tag {
        margin: 5px;
      }
    }

    .datetime {
      background: rgb(var(--primary-6));
      color: var(--color-bg-2);
      width: 160px;
      text-align: center;
      border-radius: 3px;
      padding: 5px 10px;
    }
  }
</style>
