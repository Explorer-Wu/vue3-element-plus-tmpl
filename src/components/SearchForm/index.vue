<template>
  <el-form 
    :inline="isInline"
    :model="formState"
    :rules="formRules"
    :ref="refForm"
    :label-width="labelWd"
    :size="formSize"
    :class="formClass">
    <el-form-item v-for="item in formItems" :size="item.size" :key="item.field" :prop="item.field" :label="item.hideLabel ? undefined : item.label" :required="item.required">
      <el-input v-if="item.type === 'input'" v-model="formState[item.field]" :placeholder="item.label || item.field"></el-input>
      <el-input v-else-if="item.type === 'textarea'" type="textarea" v-model="formState[item.field]" :placeholder="item.label || item.field"></el-input>
      <el-select v-else-if="item.type === 'select'" v-model="formState[item.field]" :placeholder="item.label || item.field">
        <el-option v-for="(opt, idx) in item.options" :key="idx" :value="opt.value || opt" :label="opt.label || opt"></el-option>
      </el-select>
      <el-date-picker v-else-if="item.type === 'rangedate' || item.type === 'date'" :type="item.type" v-model="formState[item.field]" :placeholder="item.label || item.field" :class="item.class"></el-date-picker>
      <el-time-picker v-else-if="item.type === 'time'"  v-model="formState[item.field]" :placeholder="item.label || item.field" :class="item.class"></el-time-picker>
      <el-switch v-else-if="item.type === 'switch'" v-model="formState[item.field]"></el-switch>
      <el-checkbox-group v-else-if="item.type === 'checkgroup'" v-model="formState[item.field]">
        <el-checkbox v-for="(opt, idx) in item.options" :key="idx" :name="opt.value || opt" :label="opt.label || opt"></el-checkbox>
      </el-checkbox-group>
      <el-radio-group v-else-if="item.type === 'radiogroup'" v-model="formState[item.field]">
        <el-radio v-for="(opt, idx) in item.options" :key="idx" :label="opt.label || opt"></el-radio>
      </el-radio-group>
      <el-button v-else-if="item.type === 'button'" :type="item.btnType" @click="submitForm">{{ item.label }}</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts">
import { defineComponent, reactive, toRaw, ref, UnwrapRef } from 'vue';
import { Item } from './item';

interface FormState {
  [key: string]: any;
}

export default defineComponent({
  // components: {
  //   SearchOutlined,
  // },
  props: {
    isInline: {
      type: Boolean,
      default: () => true,
    },
    formRules: {
      type: Array,
      default: () => [],
    },
    refForm: {
      type: String,
      default: () => null,
    },
    labelWd: {
      type: String,
      default: () => null,
    },
    formSize: {
      type: String,
      default: () => null,
    },
    formClass: {
      type: String,
      default: () => null,
    },
    formItems: {
      type: Array,
      required: true,
    },
  },
  setup(props: any, context: any) {
    // const formRef = ref();
    // const { formItems } = props;
    const initFormData = () => {
      const initData: {[key: string]: any} = {};
      props.formItems.forEach((item: Item) => {
        if (item.default !== undefined && item.field !== undefined) {
          initData[item.field] = item.default;
        }
      });
      return initData;
    };
    const formState: UnwrapRef<FormState> = reactive(initFormData());

    const submitForm = () => {
      // console.log('search:', toRaw(formSearchState));
      context.emit('submit', toRaw(formState));
    };

    return {
      // formItems,
      formState,
      submitForm,
    };
  },
});
</script>
<style lang="scss" scoped>
    .form-item {
        display: inline-block;
        margin-right: 10px;
    }
    // .search-form {
    //     display: flex;
    // }
</style>
