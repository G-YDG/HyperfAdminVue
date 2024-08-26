<template>
  <!--      搜索框-->
  <a-form ref="formRef" :model="formModel" @submit="submit">
    <a-col v-for="(config, configIndex) in formConfig" :key="configIndex">
      <a-form-item
        :prop="config.key"
        :field="config.key"
        :label="config.label"
        :disabled="config.disabled || false"
        :label-col-flex="config.labelColFlex || labelColFlex"
      >
        <slot v-if="config.useSlot" :name="config.slotName || 'default'"></slot>
        <component
          :is="config.type"
          v-else
          v-model="formModel[config.key]"
          :placeholder="config.placeholder"
          :allow-clear="config.allowClear || false"
        >
          <a-option
            v-for="(option, index) in config.options"
            :key="index"
            :label="option.label"
            :value="option.value"
          />
        </component>
      </a-form-item>
    </a-col>
    <a-col>
      <a-form-item :label-col-flex="labelColFlex">
        <a-button html-type="submit" type="primary">
          {{ $t(`searchTable.operation.save`) }}
        </a-button>
      </a-form-item>
    </a-col>
  </a-form>
</template>

<script setup lang="ts">
  import { ref } from 'vue';

  const props = defineProps({
    formModel: {
      type: Object,
      default: () => {
        return {};
      },
    },
    formConfig: {
      type: Array,
      default: () => {
        return [];
      },
    },
    labelColFlex: {
      type: String,
      default: () => {
        return '60px';
      },
    },
  });

  const formModel = ref(props.formModel);
  const formConfig = ref(props.formConfig);
  const labelColFlex = ref(props.labelColFlex);

  const emit = defineEmits(['submit']);

  const submit = () => {
    emit('submit');
  };
</script>
