<template>
  <div id="category">
    <div style="margin: 0px 0 15px 100px;">
      <a-input-search style="width: 50%;max-width: 350px" placeholder="请输入关键字" enter-button="查询"
                      @search="handleQuery({name: $event})"/>
      <a-button type="danger" :size="size" style="margin-left: 25px" @click="showModel('add')">
        新增分类
      </a-button>
    <!--表格-->
    <a-table
        :columns="columns"
        :row-key="record => record.id"
        :data-source="categoryList"
        :loading="loading"
        :pagination = "false"
    >
      <template #action="{text:item}">
        <a-button type="primary" @click="showModel('edit',item)">编辑</a-button>
        &nbsp;&nbsp;
        <a-button type="primary" style="background: #ff7875" @click="showModel('del',item)" danger>删除</a-button>
      </template>
    </a-table>
  </div>
</template>

<script>
import {message} from 'ant-design-vue';
import axios from "axios";
import {defineComponent, ref, onMounted, watch, toRaw} from 'vue';

const columns = [
  {
    title: '名称',
    dataIndex: 'name',
    width:'25%'
  },
  {
    title: '父分类',
    dataIndex: 'parentName',
    width:'25%'
  },
  {
    title: '顺序',
    dataIndex: 'sort',
    width:'25%'
  },
  {
    title: 'Action',
    key: 'action',
    slots: {customRender: 'action'},
    width:'25%'
  }
];
export default defineComponent({
  name: "admin-category",
  setup() {
    const loading = ref(false);
    const pagination = ref({
      current: 1,
      pageSize: 5,
      total: 0
    });

    onMounted(() => {
      handleQuery();
    })

    const categoryList = ref();
    const handleQuery = (params) => {
      axios.get("/category/query").then(res => {
        console.log(res.data)
        categoryList.value = res.data.data
      })
    }

    const showModel = (operation,item)=>{
      console.log(operation,item)
    }
    return {
      columns,
      loading,
      pagination,
      categoryList,
      handleQuery,
      showModel
    }
  }
})
</script>

<style scoped>
  #category{
    padding: 25px;
    background: white;
  }
  #category >>> .ant-table-row-cell-break-word{
    text-align: center;
  }
</style>