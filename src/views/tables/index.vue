<template>
  <div class="page-box">
    <el-button type="primary" class="v-fr" @click="$EventBus.$emit('showAdd', true)">新增</el-button>
    <TablePaging
      :loading="loading"
      :total="pageTotal"
      :table-data="tableData"
      :columns="tableColumns"
      :size-opts="[10, 20, 30]"
      :page-size="10"
      :is-stripe="true"
      @pageChange="getTableDataFn"
    />
    <ModalDetail/>
    <ModalAdd @update="getTableDataFn"/>
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
    markRaw,
    ref,
    getCurrentInstance
  } from 'vue';
  import TablePaging from '@/components/TablePaging/index.vue';
  import ModalAdd from './modals/ModalAdd.vue';
  import ModalDetail from './modals/ModalDetail.vue';
  import TableBtns from './modals/tableBtns';

  export default defineComponent({
    name: 'DealAlarm',
    components: {
      TablePaging,
      ModalAdd,
      ModalDetail,
    },
    setup(props: any, context: any) {
      const { proxy } = getCurrentInstance() as any;
      const methods = {
        handleEdit(scope) {
          console.log(scope.row);
        },
        handleDelete(scope) {
          proxy
            .confirm('确认删除该新闻?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              closeOnClickModal: false,
              type: 'warning'
            })
            .then(() => {
              // delRowFn(scope.row.id)
            })
            .catch(err => {
              throw new Error(err);
            });
        },
        async getTableDataFn(current, pageSize) {
          detailState.loading = true;
          try {
            const resData = await proxy.$Api.getArticleList(current, pageSize);
            detailState.loading = false;
            console.log('table-res:', resData);
            detailState.tableData = resData.data.data;
            detailState.pageTotal = resData.data.total;
          } catch (error) {
            proxy.$message({
              showClose: true,
              message: error.message + ', 获取新闻列表相关数据请求失败！',
              type: 'error',
              duration: 5000,
            });
          }
        }
      };

      const detailState = reactive({
        isModal: false,
        curPage: 1,
        pageSize: 10,
        loading: false,
        pageTotal: 0,
        tableData: [],
        tableColumns: [
          {
            title: '标题',
            key: 'title',
            width: 160
          },
          {
            title: '作者',
            key: 'author',
            minWidth: 80
          },
          {
            title: '导语',
            dataIndex: 'desc',
            key: 'desc'
          },
          {
            title: '发布时间',
            key: 'publish_date',
            minWidth: 160
          },
          {
            title: '操作',
            key: 'action',
            width: 88,
            render: (scope) => {
              const btnGroup = [
                {
                  size: 'mini',
                  text: '编辑',
                  fn: (scope) => methods.handleEdit(scope)
                },
                {
                  size: 'mini',
                  type: 'danger',
                  text: '删除',
                  fn: (scope) => methods.handleDelete(scope)
                },
                {
                  size: 'mini',
                  text: '详情',
                  fn: () => proxy.$EventBus.$emit('showDetail', true)
                }
              ]
              return {
                childTemp: markRaw({
                  temp: TableBtns,
                  // scope: scope,
                  extra: btnGroup
                })
              }
            }
          }
        ]
      });

      onMounted(() => {
        methods.getTableDataFn(detailState.curPage, detailState.pageSize);
        // proxy.$EventBus.$on('updateList', () => {
        //   getData(this.curPage, this.pageSize)
        // })
      });

      // onUnmounted(() => {
      //   proxy.$EventBus.$off("updateList")
      // });

      return {
        ...toRefs(detailState),
        ...methods
      };
    }
  });
</script>
