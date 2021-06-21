<template>
  <el-dialog
    v-model="dialogVisible"
    :title="modalConfig.title"
    :width="!modalConfig.isFull? modalConfig.width: undefined"
    :fullscreen="modalConfig.isFull"
    :center="modalConfig.isMid"
    :modal="modalConfig.isMask">
    <slot name="contents"></slot>
    <template v-if="modalConfig.btnGroups" #footer>
      <span class="dialog-footer">
        <el-button v-for="(item, idx) in modalConfig.btnGroups" :key="idx" :type="item.type" @click="item.fn">{{item.text}}</el-button>
        <!-- <el-button type="primary" @click="dialogVisible = false">确 定</el-button> -->
      </span>
    </template>
  </el-dialog>
</template>
<script>
import { defineComponent, reactive, computed, watch, ref, toRefs } from 'vue';

export default defineComponent({
  name: 'CustomModal',
  props: {
    vModal: Boolean,
    modalConfig: {
      type: Object,
      required: true,
      default: () => {
        return {
          isMid: true,
          isMask: true,
          isFull: false,
          width: 500,
        }
      }
    },
    
  },
  setup(props, context) {
    const modalState = reactive({
      setShow: null,
    });

    const loading = ref(false);

    const dialogVisible = computed({
      get: () => (modalState.setShow === null ? props.vModal : modalState.setShow),
      set: (val) => {
        modalState.setShow = val;
      },
    });

    watch(
      () => dialogVisible.value,
      (value, prevValue) => {
        if (!value) {
          context.emit('showModal', value);
        }
        modalState.setShow = null;
      },
    );
    // const showModal = () => {
    //   dialogVisible.value = true;
    // };

    return {
      loading,
      ...toRefs(modalState),
      dialogVisible,
    };
  },
});
</script>

<style lang="scss" scoped>
  .modal-close {
    width: 22px;
    height: 22px;
    border: 1px solid #fff;
    border-radius: 50%;
    position: relative;
    // margin-top: 10px;
    margin-right: 12px;
    z-index: 0;
    &::before, &::after {
      content: '';
      width: 16px;
      height: 1px;
      background: transparent;
      position: absolute;
      top: 10px;
      left: 2px;
      z-index: 100;
      background-color: #fff;
    }
    &::before{
      -webkit-transform: rotate(45deg); /* Safari & Chrome */
          -moz-transform: rotate(45deg); /* Firefox */
          -o-transform: rotate(45deg); /* Opera */
    }
    &::after{
      -webkit-transform: rotate(-45deg); /* Safari & Chrome */
          -moz-transform: rotate(-45deg); /* Firefox */
          -o-transform: rotate(-45deg); /* Opera */
    }
  }

  .dialog-footer.center {
    text-align: center !important;
  }
  .btn-default {
    display: inline-block;
    height: 30px;
    line-height: 30px;
    padding: 0 20px;
    margin: auto 10px;
    font-size: 15px;
    color:#FEFEFE;
    background: #457CD0;
    border-radius: 4px;
  }
</style>
