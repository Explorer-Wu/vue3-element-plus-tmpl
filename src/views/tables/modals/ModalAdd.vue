<template>
  <CustomModal v-model:visible="isModal" :modal-config="modalConfig">
    <template #contents>
      <CustomForm ref="refFormAdd" :formConfig="formConfig" :formRules="ruleAddState" :formItems="addFormItems"/>
    </template>
  </CustomModal>
</template>

<script lang="ts">
  import { defineComponent, onMounted, onUnmounted, reactive, computed, toRefs, toRaw, ref, getCurrentInstance, UnwrapRef } from 'vue';
  import CustomModal from "@/components/Modals/CustomModal.vue";
  import CustomForm from "@/components/Forms/index";
  import { Item } from "@/components/Forms/item";

  interface RuleAdd {
    name: Array<any>;
  }

  export default defineComponent({
    name: "ModalAdd",
    components: {
      CustomModal,
      CustomForm
    },
    // props: {
    //   dataDetails: Object
    // },
    setup(props: any, context: any) {
      const { proxy } = getCurrentInstance() as any;
      const isModal = ref<boolean>(false);
      const refFormAdd = ref<any>(null);
      const modalConfig = reactive({
          title: "添加",
          isMid: true,
          isMask: true,
          isFull: false,
          width: 800,
          btnGroups: [{
            text: "添加",
            type: "primary",
            fn: () => { methods.addForm(); }
          }, {
            text: "取消",
            fn: () => { methods.resetForm(); }
          }]
      });

      const formConfig = reactive({
        isInline: false,
        refForm: "refFormAdd",
        labelWd: '100px',
        formSize: 'medium',
        sapn: 12,
      });

      const ruleAddState: UnwrapRef<RuleAdd> = reactive({
        name: [
          {
            required: true,
            message: '用户名不能为空！',
            trigger: 'blur'
          },
          { min: 3, max: 15, message: '用户名3-15个字符！', trigger: 'blur'}
        ]
      });

      const addFormItems: Item[] = [
        { field: 'name', label: '用户名', type: 'input', hideLabel: false, default: ''},
        { field: 'address', label: '地址', type: 'textarea', hideLabel: false, default: ''},
      ];

      const addItemsState = reactive({
        addFormItems,
      });

      const methods = {
        showModal: (bol) => {
          isModal.value = bol;
        },
        addForm() {
          (refFormAdd.value.refForm as any).validate(async (valid: boolean) => {
            if(valid) {
              const formData = toRaw(refFormAdd.value.formState);
            } else {
              proxy.$message({
                showClose: true,
                message: '表单验证失败！',
                type: 'error',
                duration: 3000
              })
            }
          })
        },
        resetForm() {
          (refFormAdd.value.refForm as any).resetFields();
          methods.showModal(false);
        },  
      }

      onMounted(() => {
        proxy.$EventBus.$on('showAdd', (bol) => {
          methods.showModal(bol);
        })
      });

      onUnmounted(() => {
        proxy.$EventBus.$off("showAdd")
      });

      return {
        ...toRefs(addItemsState),
        ...methods,
        modalConfig,
        isModal,
        refFormAdd,
        formConfig,
        ruleAddState
      };
    },
  });
</script>

<style lang="less">
  .trackNumName {
    .ivu-form-item-error-tip {
      width: 120px !important;
    }
  }
</style>
