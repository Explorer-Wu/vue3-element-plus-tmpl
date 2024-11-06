import { defineComponent, reactive, getCurrentInstance } from 'vue';
interface BtnItem {
  size: String;
  text: String;
  type?: String;
  fn?: Function;
}
interface PropScope {
  $index: any;
  row: any;
}
interface AllProps {
  vscope: PropScope;
  extra: Array<BtnItem>;
}

export default {
  name: 'TableBtns',
  props: {
    vscope: {
      type: Object,
      default: () => null,
    },
    extra: {
      type: Array,
    },
  },
  setup(props: AllProps, context: any) {
    return () => {
      const {vscope, extra} = props;
      return (<el-row>
        {
          extra.map((ibtn, idx) => {
            return <el-button key={idx} size={ibtn.size} type={ibtn.type} onClick={ibtn.fn} data-index={vscope.$index}>{ibtn.text}</el-button>
          })
        }
      </el-row>)
    }
  }
};