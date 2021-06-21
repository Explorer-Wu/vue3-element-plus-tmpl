<template>
  <CustomModal :v-modal="isModal" @showModal="showModal" :modal-config="modalConfig">
    <template #contents>
      <el-form label-position="right" label-width="100px" :model="dataDetails">
        <el-form-item label="名称">
          {{ dataDetails.name }}
        </el-form-item>
        <el-form-item label="区域">
          {{ dataDetails.region }}
        </el-form-item>
        <el-form-item label="形式">
          {{ dataDetails.type }}
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
    // props: {
    //   dataDetails: Object
    // },
    setup(props: any, context: any) {
      const { proxy } = getCurrentInstance() as any;

      const detailState = reactive({
        isModal: false,
        modalConfig: {
          title: "详情",
          isMid: true,
          isMask: true,
          isFull: false,
          width: 800,
        },
        dataDetails: {
          name: 'wwh',
          region: '杭州',
          type: '不拘一格'
        }
      });

      const showModal = (bol) => {
        detailState.isModal = bol
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
        ...toRefs(detailState),
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
