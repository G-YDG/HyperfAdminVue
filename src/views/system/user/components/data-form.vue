<template>
  <a-modal
    v-model:visible="formVisible"
    :title="formModalTitle"
    :on-before-ok="submit"
    @cancel="close"
  >
    <a-form :model="formModel">
      <a-form-item
        :disabled="formAction === 'edite'"
        field="username"
        :label="$t('user.form.username')"
      >
        <a-input
          v-model="formModel.username"
          :placeholder="$t('user.form.username.placeholder')"
        />
      </a-form-item>
      <a-form-item field="nickname" :label="$t('user.form.nickname')">
        <a-input
          v-model="formModel.nickname"
          :placeholder="$t('user.form.nickname.placeholder')"
        />
      </a-form-item>
      <a-form-item
        v-show="formAction !== 'edite'"
        field="password"
        :label="$t('user.form.password')"
      >
        <a-input-password
          v-model="formModel.password"
          :placeholder="$t('user.form.password.placeholder')"
          allow-clear
        />
      </a-form-item>
      <a-form-item field="role_ids" :label="$t('user.form.role')">
        <a-select
          v-model="formModel.role_ids"
          multiple
          :options="userRoleOptions"
          :placeholder="$t('searchTable.form.select')"
        />
      </a-form-item>
      <a-form-item field="status" :label="$t('role.form.status')">
        <a-select
          v-model="formModel.status"
          :default-value="1"
          :options="userStatusOptions"
          :placeholder="$t('searchTable.form.selectDefault')"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { Message } from '@arco-design/web-vue';
  import { UserModel, UserRecord, save, update } from '@/api/system/user';
  import { list } from '@/api/system/role';
  import type { SelectOptionData } from '@arco-design/web-vue/es/select/interface';

  const { t } = useI18n();

  const formModel = ref<UserModel>({} as UserModel);
  const formVisible = ref(false);
  const formAction = ref('create');
  const formModalTitle = ref('');
  const userStatusOptions = computed<SelectOptionData[]>(() => [
    {
      label: t('user.form.status.1'),
      value: 1,
    },
    {
      label: t('user.form.status.2'),
      value: 2,
    },
  ]);
  const userRoleOptions = ref<SelectOptionData[]>([]);
  const fetchUserRoleOptions = async () => {
    try {
      const { data } = await list();
      userRoleOptions.value = data.map((item) => ({
        label: item.name,
        value: item.id,
      }));
    } catch (err) {
      // you can report use errorHandler or other
    }
  };
  fetchUserRoleOptions();

  const emit = defineEmits(['refresh']);

  const openModal = () => {
    formModalTitle.value = t(`searchTable.operation.${formAction.value}`);
    formVisible.value = true;
  };

  const create = () => {
    formVisible.value = true;
    formAction.value = 'create';
    openModal();
  };

  const edite = (record: UserRecord) => {
    formModel.value = {
      id: record.id,
      username: record.username,
      avatar: record.avatar,
      nickname: record.nickname,
      password: record.password,
      role_ids: record.roles.map((item) => item.id),
      status: record.status,
    };
    formAction.value = 'edite';
    openModal();
  };

  const submit = async () => {
    try {
      if (formAction.value === 'create') {
        await save(formModel.value);
      } else {
        await update(formModel.value.id, formModel.value);
      }
      Message.success('操作成功');
      formModel.value = {} as UserModel;
      emit('refresh');
      return true;
    } catch (err) {
      return false;
    }
  };

  const close = () => {
    formVisible.value = false;
    formModel.value = {} as UserModel;
    formModalTitle.value = '';
    emit('refresh');
  };

  defineExpose({ create, edite });
</script>
