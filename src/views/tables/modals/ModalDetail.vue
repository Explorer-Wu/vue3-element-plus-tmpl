<template>
  <CustomModal v-modal:visible="isModal" :modal-config="modalConfig">
    <template #contents>
      <el-form label-position="right" label-width="100px" :model="detailState">
        <el-form-item label="名称">
          {{ detailState.name }}
        </el-form-item>
        <el-form-item label="区域">
          {{ detailState.region }}
        </el-form-item>
        <el-form-item label="形式">
          {{ detailState.type }}
        </el-form-item>
      </el-form>
    </template>
  </CustomModal>
</template>

<script lang="ts">
  import { defineComponent, onMounted, onUnmounted, reactive, computed, toRefs, toRaw, ref, getCurrentInstance } from 'vue';
  import CustomModal from "@/components/Modals/CustomModal.vue"

  export default defineComponent({
    name: "ModalDetail",
    components: {
      CustomModal
    },
    setup(props: any, context: any) {
      const { proxy } = getCurrentInstance() as any;
      const isModal = ref<boolean>(false);

      const detailState = reactive({
        name: 'wwh',
        region: '杭州',
        type: '不拘一格'
      });
      const modalConfig = reactive({
          title: "详情",
          isMid: true,
          isMask: true,
          isFull: false,
          width: 800,
      });

      const showModal = (bol) => {
        isModal.value = bol;
      };

      onMounted(() => {
        proxy.$EventBus.$on('showDetail', (bol) => {
          showModal(bol)
        })
      });

      onUnmounted(() => {
        proxy.$EventBus.$off("showDetail")
      });

      return {
        detailState,
        modalConfig,
        isModal,
        showModal
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
