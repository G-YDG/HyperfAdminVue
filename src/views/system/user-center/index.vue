<template>
  <div class="container">
    <!--    面包屑-->
    <Breadcrumb :items="['menu.system.userCenter']" />

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
              <a-avatar :size="100" :image-url="userInfo.avatar"></a-avatar>
            </div>
          </template>
        </a-upload>
      </div>

      <div>
        <a-tag size="large" class="mt-10 rounded-full" color="#165dff">
          {{ userInfo.nickname }}
        </a-tag>
      </div>
    </a-card>

    <a-layout-content class="mt-10">
      <a-card class="general-card pt-15">
        <a-tabs type="rounded">
          <a-tab-pane
            key="info"
            :title="$t('user.form.personal')"
            @submit="handModifyUserInfo"
          >
            <a-form :model="userInfo">
              <a-form-item
                :label="$t('user.form.username')"
                label-col-flex="140px"
              >
                <a-input
                  disabled
                  :default-value="userInfo.username"
                  allow-clear
                />
              </a-form-item>
              <a-form-item
                :label="$t('user.form.nickname')"
                label-col-flex="140px"
              >
                <a-input
                  v-model="userInfo.nickname"
                  :placeholder="$t('user.form.nickname.placeholder')"
                  allow-clear
                />
              </a-form-item>
              <a-form-item
                :label="$t('user.form.phone')"
                label-col-flex="140px"
              >
                <a-input
                  v-model="userInfo.phone"
                  :placeholder="$t('user.form.phone.placeholder')"
                  allow-clear
                />
              </a-form-item>
              <a-form-item
                :label="$t('user.form.email')"
                label-col-flex="140px"
              >
                <a-input
                  v-model="userInfo.email"
                  :placeholder="$t('user.form.email.placeholder')"
                  allow-clear
                />
              </a-form-item>
              <a-form-item label-col-flex="140px">
                <a-button html-type="submit" type="primary">
                  {{ $t(`searchTable.operation.save`) }}
                </a-button>
              </a-form-item>
            </a-form>
          </a-tab-pane>

          <a-tab-pane key="safe" :title="$t('user.form.safe')">
            <a-form :model="passwordForm" @submit="handModifyPassword">
              <a-form-item
                :label="$t('user.form.oldPassword')"
                label-col-flex="140px"
              >
                <a-input-password
                  v-model="passwordForm.oldPassword"
                  :placeholder="$t('user.form.oldPassword.placeholder')"
                  allow-clear
                />
              </a-form-item>
              <a-form-item
                :label="$t('user.form.newPassword')"
                label-col-flex="140px"
              >
                <a-input-password
                  v-model="passwordForm.newPassword"
                  :placeholder="$t('user.form.newPassword.placeholder')"
                  allow-clear
                />
              </a-form-item>
              <a-form-item
                :label="$t('user.form.newPassword_confirmation')"
                label-col-flex="140px"
              >
                <a-input-password
                  v-model="passwordForm.newPassword_confirmation"
                  :placeholder="
                    $t('user.form.newPassword_confirmation.placeholder')
                  "
                  allow-clear
                />
              </a-form-item>
              <a-form-item label-col-flex="140px">
                <a-button html-type="submit" type="primary">{{
                  $t(`searchTable.operation.save`)
                }}</a-button>
              </a-form-item>
            </a-form>
          </a-tab-pane>
        </a-tabs>
      </a-card>
    </a-layout-content>
  </div>
</template>

<script setup>
  import { reactive, ref } from 'vue';
  import { Message } from '@arco-design/web-vue';
  import { modifyPassword, updateInfo } from '@/api/user';
  import { useUserStore } from '@/store';
  import useUser from '@/hooks/user';
  import { getUploadHeaders, getUploadUrl } from '@/utils/upload';

  const { logout } = useUser();

  const loading = ref(false);

  const userStore = useUserStore();

  const userInfo = reactive({
    ...userStore.$state,
  });

  const passwordForm = ref({
    newPassword: '',
    newPassword_confirmation: '',
    oldPassword: '',
  });

  // 图片上传
  const uploadFileUrl = getUploadUrl();
  const uploadFileHeaders = getUploadHeaders();

  const handleUrlChange = (_, currentFile) => {
    if (currentFile.status === 'error') {
      Message.error('上传失败');
    }
    if (currentFile.status === 'done') {
      if (currentFile.response.code === 200) {
        userInfo.avatar = currentFile.response.data.url;
        userStore.$state.avatar = currentFile.response.data.url;
        handModifyUserInfo();
      } else {
        userInfo.avatar = userStore.$state.avatar;
        Message.error(currentFile.response.msg);
      }
    }
  };

  const handModifyUserInfo = async () => {
    try {
      loading.value = true;
      const res = await updateInfo({
        nickname: userInfo.nickname,
        avatar: userInfo.avatar,
        phone: userInfo.phone,
        email: userInfo.email,
      });
      Message.success(res.msg);
    } catch (err) {
      userInfo.avatar = userStore.$state.avatar;
    } finally {
      loading.value = false;
    }
  };

  const handModifyPassword = async () => {
    try {
      loading.value = true;
      const res = await modifyPassword(passwordForm.value);
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
  export default { name: 'SystemUserCenter' };
</script>

<style scoped>
  .user-header {
    width: 100%;
    height: 200px;
    background-size: cover;
  }
</style>
