<template>
  <div class="avatar-box mx-auto pt-20">
    <a-upload
      :action="uploadFileUrl"
      :headers="uploadFileHeaders"
      :show-file-list="false"
      accept="image/*"
      @before-upload="beforeUpload"
      @change="onChange"
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
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue';
  import { getUploadHeaders, getUploadUrl } from '@/utils/upload';
  import { Message } from '@arco-design/web-vue';

  const props = defineProps({
    userInfo: {
      type: Object,
      default: () => {
        return {};
      },
    },
  });

  const userInfo = ref(props.userInfo);

  const uploadFileUrl = getUploadUrl();
  const uploadFileHeaders = getUploadHeaders();

  const emit = defineEmits(['onChangeSuccess']);

  const onChangeSuccess = () => {
    emit('onChangeSuccess');
  };

  const beforeUpload = (file: any) => {
    // 检查文件类型，只允许上传图片
    if (!/\.(jpe?g|png|gif)$/i.test(file.name)) {
      Message.error('只支持jpg、jpeg、png、gif格式！');
      return false;
    }
    return true;
  };

  const onChange = (_: any, currentFile: any) => {
    if (currentFile.status === 'error') {
      Message.error('上传失败');
    }
    if (currentFile.status === 'done') {
      if (currentFile.response.code === 200) {
        userInfo.value.avatar = currentFile.response.data.url;
        onChangeSuccess();
      } else {
        Message.error(currentFile.response.msg);
      }
    }
  };

  watch(
    () => props.userInfo,
    () => {
      userInfo.value = props.userInfo;
    }
  );
</script>
