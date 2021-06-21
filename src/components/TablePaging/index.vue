<template>
  <div>
    <p v-show="noData">没有查到相关数据！</p>
    <!-- :row-class-name="tableRowClassName" -->
    <el-table
      v-show="!noData"
      :data="tableData"
      :stripe="isStripe"
      class="table-box"
    >
      <el-table-column v-for="item in columns"
        :key="item.key"
        :prop="item.key"
        :label="item.title"
        :width="item.width">
        <template v-if="item.btnGroup" #default="scope">
          <el-button 
            v-for="(ibtn, idx) in item.btnGroup"
            :key="idx"
            :size="ibtn.size"
            @click="ibtn.fn(scope.$index, scope.row)">{{ibtn.text}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-if="total != null" class="page-bar">     
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        v-model:currentPage="currentPage"
        :page-sizes="sizeOpts"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        >
      </el-pagination>
    </div>
  </div>
</template>
<script lang="ts">
import {
    defineComponent,
    onMounted,
    onUnmounted,
    reactive,
    computed,
    toRefs,
    toRaw,
    ref,
    getCurrentInstance
} from 'vue';

export default defineComponent({
  name: "TablePaging",
  props: {
    loading: {
      type: Boolean,
      default: () => false,
    },
    isStripe: {
      type: Boolean,
      default: () => false,
    },
    tableData: {
      type: Array,
    },
    columns: {
      type: Array,
      required: true,
    },
    total: {
      type: Number,
      default: () => null,
    },
    sizeOpts: {
      type: Array,
      default: [10, 15, 20, 30, 50]
    },
    pageSize: {
      type: Number,
      default: () => 10
    },
    // currentPage: {
    //   type: Number,
    //   default: () => 1,
    // },
  },
  setup(props: any, context: any) {
    const { proxy } = getCurrentInstance() as any;
    const state = reactive({
      currentPage: 1,
    });

    const methods = {
      handleSizeChange(val: number) {
        console.log(`每页 ${val} 条`);
        this.handleCurrentChange(1);
      },
      handleCurrentChange(page: number) {
        console.log(`当前页: ${page}`);
        state.currentPage = page;
        context.emit('pageChange', page, props.pageSize)
      },
      // tableRowClassName({row, rowIndex}) {
      //   if(props.isStripe) {
      //     if (rowIndex%2 === 0) {
      //       return 'warning-row';
      //     } else {
      //       return 'success-row';
      //     }
      //   }
      //   return '';
      // }
    };

    const noData = computed(() => props.tableData.length > 0 || props.loading === true ? false : true);

    return {
      ...toRefs(state),
      ...methods,
      noData
    };
  },
});
</script>
<style lang="scss">
.el-table {
  td {
    font-weight: bold;
    .btn-td {
      color: #427FDA !important;
      span {
        font-weight: bold;
        text-decoration: underline;
      }
    }
  }
} 
</style>
