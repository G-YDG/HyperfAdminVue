<template>
  <div class="container">
    <!--    面包屑-->
    <Breadcrumb :items="['menu.dashboard.userInfo']" />

    <!--    用户基础信息-->
    <a-card class="general-card user-header rounded-sm text-center">
      <div class="avatar-box mx-auto pt-20">
        <a-upload
          :action="uploadFileUrl"
          :headers="uploadFileHeaders"
          :show-file-list="false"
          @change="handleUrlChange"
        >
          <template #upload-button>
            <div>
              <a-avatar :size="100" :image-url="userInfoForm.avatar"></a-avatar>
            </div>
          </template>
        </a-upload>
      </div>
      <div>
        <a-tag size="large" class="mt-10 rounded-full" color="#165dff">
          {{ userInfoForm.nickname }}
        </a-tag>
      </div>
    </a-card>

    <a-layout-content class="mt-10">
      <a-card class="general-card pt-15">
        <a-tabs type="rounded">
          <a-tab-pane
            key="personalInfo"
            :title="$t('userInfo.form.personalInfo')"
          >
            <HaForm
              :form-model="userInfoForm"
              :form-config="userInfoFormConfig"
              @submit="handModifyInfo"
            />
          </a-tab-pane>
          <a-tab-pane
            key="safeSetting"
            :title="$t('userInfo.form.safeSetting')"
          >
            <HaForm
              :form-model="userPasswordForm"
              :form-config="userPasswordFormConfig"
              @submit="handModifyPassword"
            />
          </a-tab-pane>
        </a-tabs>
      </a-card>
    </a-layout-content>
  </div>
</template>

<script setup>
  import { ref } from 'vue';
  import { Message } from '@arco-design/web-vue';
  import { modifyPassword, updateInfo } from '@/api/user';
  import { useUserStore } from '@/store';
  import useUser from '@/hooks/user';
  import { getUploadHeaders, getUploadUrl } from '@/utils/upload';
  import { useI18n } from 'vue-i18n';

  const { t } = useI18n();

  const { logout } = useUser();

  const loading = ref(false);

  const userStore = useUserStore();

  const userInfoForm = ref({
    username: userStore.$state.username,
    avatar: userStore.$state.avatar,
    nickname: userStore.$state.nickname,
    phone: userStore.$state.phone,
    email: userStore.$state.email,
  });
  const userInfoFormConfig = ref([
    {
      key: 'username',
      type: 'a-input',
      disabled: true,
      label: t('user.form.username'),
      placeholder: t('user.form.username.placeholder'),
    },
    {
      key: 'nickname',
      type: 'a-input',
      label: t('user.form.nickname'),
      placeholder: t('user.form.nickname.placeholder'),
      allowClear: true,
    },
    {
      key: 'phone',
      type: 'a-input',
      label: t('user.form.phone'),
      placeholder: t('user.form.phone.placeholder'),
      allowClear: true,
    },
    {
      key: 'email',
      type: 'a-input',
      label: t('user.form.email'),
      placeholder: t('user.form.email.placeholder'),
      allowClear: true,
    },
  ]);

  const userPasswordForm = ref({
    newPassword: '',
    newPassword_confirmation: '',
    oldPassword: '',
  });
  const userPasswordFormConfig = ref([
    {
      key: 'oldPassword',
      type: 'a-input',
      label: t('userInfo.form.oldPassword'),
      placeholder: t('userInfo.form.oldPassword.placeholder'),
      allowClear: true,
    },
    {
      key: 'newPassword',
      type: 'a-input',
      label: t('userInfo.form.newPassword'),
      placeholder: t('userInfo.form.newPassword.placeholder'),
      allowClear: true,
    },
    {
      key: 'newPassword_confirmation',
      type: 'a-input',
      label: t('userInfo.form.newPassword_confirmation'),
      placeholder: t('userInfo.form.newPassword_confirmation.placeholder'),
      allowClear: true,
    },
  ]);

  // 图片上传
  const uploadFileUrl = getUploadUrl();
  const uploadFileHeaders = getUploadHeaders();

  const handleUrlChange = (_, currentFile) => {
    if (currentFile.status === 'error') {
      Message.error('上传失败');
    }
    if (currentFile.status === 'done') {
      if (currentFile.response.code === 200) {
        userInfoForm.value.avatar = currentFile.response.data.url;
        userStore.$state.avatar = currentFile.response.data.url;
        handModifyInfo();
      } else {
        userInfoForm.value.avatar = userStore.$state.avatar;
        Message.error(currentFile.response.msg);
      }
    }
  };

  const handModifyInfo = async () => {
    try {
      loading.value = true;
      const res = await updateInfo({
        nickname: userInfoForm.value.nickname,
        avatar: userInfoForm.value.avatar,
        phone: userInfoForm.value.phone || '',
        email: userInfoForm.value.email || '',
      });
      Message.success(res.msg);
    } catch (err) {
      userInfoForm.value.avatar = userStore.$state.avatar;
    } finally {
      loading.value = false;
    }
  };

  const handModifyPassword = async () => {
    try {
      loading.value = true;
      const res = await modifyPassword(userPasswordForm.value);
      if (res.code === 200) {
        await logout();
      }
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      loading.value = false;
    }
  };
</script>

<script>
  export default { name: 'UserInfo' };
</script>

<style scoped>
  .user-header {
    width: 100%;
    height: 200px;
    background-size: cover;
  }
</style>
