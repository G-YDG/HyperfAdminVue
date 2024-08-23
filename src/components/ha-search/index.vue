<template>
  <!--      搜索框-->
  <a-form ref="searchRef" :model="searchModel" label-align="center">
    <a-row>
      <a-col
        v-for="(config, configIndex) in searchConfig"
        :key="configIndex"
        :xs="24"
        :sm="16"
        :md="12"
        :lg="8"
        :xl="6"
        :xxl="6"
      >
        <a-form-item
          :prop="config.key"
          :field="config.key"
          :label="config.label"
          label-col-flex="60px"
        >
          <slot
            v-if="config.useSlot"
            :name="config.slotName || 'default'"
          ></slot>
          <component
            :is="config.type"
            v-else
            v-model="searchModel[config.key]"
            :placeholder="config.placeholder"
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
    </a-row>
  </a-form>

  <!--  搜索按钮&刷新按钮 -->
  <a-col style="margin: 5px 76px">
    <a-space :size="16">
      <a-button type="primary" @click="search">
        <template #icon>
          <icon-search />
        </template>
        {{ $t('searchTable.form.search') }}
      </a-button>
      <a-button @click="reset">
        <template #icon>
          <icon-refresh />
        </template>
        {{ $t('searchTable.form.reset') }}
      </a-button>
    </a-space>
  </a-col>
</template>

<script setup lang="ts">
  import { ref } from 'vue';

  const props = defineProps({
    searchModel: {
      type: Object,
      default: () => {
        return {};
      },
    },
    searchConfig: {
      type: Array,
      default: () => {
        return [];
      },
    },
  });

  const searchModel = ref(props.searchModel);
  const searchConfig = ref(props.searchConfig);

  const emit = defineEmits(['search', 'reset']);

  const search = () => {
    emit('search');
  };

  const reset = () => {
    emit('reset');
    search();
  };
</script>
