<template>
  <a-modal
    v-model:visible="formVisible"
    :title="formModalTitle"
    :on-before-ok="submit"
    @cancel="close"
  >
    <a-form :model="formModel" @submit.prevent="submit">
      <a-form-item
        field="system_group_id"
        :label="$t('config.form.system_group_id')"
      >
        <a-select
          v-model="formModel.system_group_id"
          :disabled="formModel.is_system == 1"
          :options="configGroupOptions"
          :placeholder="$t('config.form.system_group_id.placeholder')"
        />
      </a-form-item>

      <a-form-item
        :disabled="formAction === 'edite'"
        field="key"
        :label="$t('config.form.key')"
      >
        <a-input
          v-model="formModel.key"
          :placeholder="$t('config.form.key.placeholder')"
        />
      </a-form-item>

      <a-form-item field="value_type" :label="$t('config.form.value_type')">
        <a-select
          v-model="formModel.value_type"
          :default-value="1"
          :options="valueTypeOptions"
          :placeholder="$t('searchTable.form.selectDefault')"
        />
      </a-form-item>

      <a-form-item field="value" :label="$t('config.form.value')">
        <a-space
          v-if="formModel.value_type === 2"
          direction="vertical"
          :style="{ width: '100%' }"
        >
          <a-upload
            list-type="picture-card"
            :action="uploadFileUrl"
            :headers="uploadFileHeaders"
            :show-file-list="false"
            :limit="1"
            accept="image/*"
            image-preview
            @before-upload="beforeUpload"
            @change="handleUrlChange"
          >
            <template #upload-button>
              <div
                v-if="formModel.value"
                class="arco-upload-list-picture custom-upload-avatar"
              >
                <img :src="formModel.value" width="100" />
                <div class="arco-upload-list-picture-mask">
                  <IconEdit />
                </div>
              </div>
              <div v-else class="arco-upload-picture-card">
                <div class="arco-upload-picture-card-text">
                  <IconPlus />
                </div>
              </div>
            </template>
          </a-upload>
        </a-space>
        <a-input
          v-else
          v-model="formModel.value"
          :placeholder="$t('config.form.value.placeholder')"
        />
      </a-form-item>

      <a-form-item field="remark" :label="$t('config.form.remark')">
        <a-input
          v-model="formModel.remark"
          :placeholder="$t('config.form.remark.placeholder')"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { Message } from '@arco-design/web-vue';
  import { list } from '@/api/system/config-group';
  import { ConfigModel, ConfigRecord, save, update } from '@/api/system/config';
  import type { SelectOptionData } from '@arco-design/web-vue/es/select/interface';
  import { getUploadHeaders, getUploadUrl } from '@/utils/upload';
  import { useAppStore } from '@/store';
  import defaultSettings from '@/config/settings.json';

  const appStore = useAppStore();

  const { t } = useI18n();

  const formModel = ref<ConfigModel>({} as ConfigModel);
  const formVisible = ref(false);
  const formAction = ref('create');
  const formModalTitle = ref('');

  const valueTypeOptions = computed<SelectOptionData[]>(() => [
    {
      label: t('config.form.value_type.1'),
      value: 1,
    },
    {
      label: t('config.form.value_type.2'),
      value: 2,
    },
  ]);

  const uploadFileUrl = getUploadUrl();
  const uploadFileHeaders = getUploadHeaders();

  const beforeUpload = (file: any) => {
    // 检查文件类型，只允许上传图片
    if (!/\.(jpe?g|png|gif)$/i.test(file.name)) {
      Message.error('只支持jpg、jpeg、png、gif格式！');
      return false;
    }
    return true;
  };

  const handleUrlChange = (_: any, currentFile: any) => {
    if (currentFile.status === 'error') {
      Message.error('上传失败');
    }
    if (currentFile.status === 'done') {
      if (currentFile.response.code === 200) {
        formModel.value.value = currentFile.response.data.url;
        Message.success('上传成功');
      } else {
        Message.error(currentFile.response.msg || '上传失败');
      }
    }
  };

  const configGroupOptions = ref<SelectOptionData[]>([]);
  const fetchConfigGroupOptions = async () => {
    try {
      const { data } = await list();
      configGroupOptions.value = data.items.map((item: any) => ({
        label: item.name,
        value: item.id,
      }));
    } catch (err) {
      // you can report use errorHandler or other
    }
  };
  fetchConfigGroupOptions();

  const openModal = () => {
    formModalTitle.value = t(`searchTable.operation.${formAction.value}`);
    formVisible.value = true;
  };

  const create = () => {
    formVisible.value = true;
    formAction.value = 'create';
    openModal();
  };

  const edite = (record: ConfigRecord) => {
    formModel.value = {
      id: record.id,
      key: record.key,
      value: record.value,
      value_type: record.value_type,
      remark: record.remark,
      is_system: record.is_system,
      system_group_id: record.system_group_id,
    };
    formAction.value = 'edite';
    openModal();
  };
  const emit = defineEmits(['refresh']);

  const submit = async () => {
    try {
      if (formAction.value === 'create') {
        await save(formModel.value);
      } else {
        await update(formModel.value.id, formModel.value);
        if (
          formModel.value.key &&
          Object.keys(defaultSettings.websiteSetting).includes(
            formModel.value.key
          )
        ) {
          appStore.updateWebsiteSetting(
            formModel.value.key as keyof typeof defaultSettings.websiteSetting,
            formModel.value.value
          );
        }
      }
      Message.success('操作成功');
      formModel.value = {} as ConfigModel;
      emit('refresh');
      return true;
    } catch (err) {
      return false;
    }
  };

  const close = () => {
    formVisible.value = false;
    formModel.value = {} as ConfigModel;
    formModalTitle.value = '';
    emit('refresh');
  };

  defineExpose({ create, edite });
</script>

<style scoped lang="less">
  .arco-upload-hide {
    display: block !important; /* 强制覆盖 */
  }
</style>
