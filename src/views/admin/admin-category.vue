<template>
  <div id="category">
    <div style="margin: 0px 0 15px 100px;">
      <a-input-search style="width: 50%;max-width: 350px" placeholder="请输入关键字" enter-button="查询"
                      @search="handleQuery($event)"/>
      <a-button type="danger" :size="size" style="margin-left: 25px" @click="showModel('add')">
        新增分类
      </a-button>
    </div>
    <!--表格-->
    <a-table
        :columns="columns"
        :row-key="record => record.id"
        :data-source="categoryList"
        :loading="loading"
        :pagination="false"
    >
      <template #action="{text:item}">
        <a-button type="primary" @click="showModel('edit',item)">编辑</a-button>
        &nbsp;&nbsp;
        <a-button v-show="item.parent != 0" type="primary" style="background: #ff7875" @click="showModel('del',item)"
                  danger>删除
        </a-button>
      </template>
    </a-table>
    <div v-if="visible.add || visible.update" class="popStyle">
      <a-form :model="category" :rules="rules"
              ref="ebookform"
              style="background: white;width: 500px" :label-col="labelCol" :wrapper-col="wrapperCol">
        <div class="form-title">
          新增分类
        </div>
        <a-form-item label="名称" name="name">
          <a-input v-model:value="category.name"/>
        </a-form-item>
        <a-form-item label="父分类" name="parent">
          <a-select v-model:value="category.parent" placeholder="请选择">
<!--            <a-select-option v-for="node in (categoryList)" :key="node.name" v-show="(node.parent%100 === 0)"
                             :value="node.id">{{ node.name }}
            </a-select-option>-->
          </a-select>
        </a-form-item>
        <a-form-item label="顺序" name="sort">
          <a-input v-model:value="category.sort"/>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="handle('submit')">确认</a-button>
          <a-button style="margin-left: 10px" @click="handle('cancel')">取消</a-button>
        </a-form-item>
      </a-form>
    </div>
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
    width: '25%'
  },
  {
    title: '父分类',
    dataIndex: 'parentName',
    width: '25%'
  },
  {
    title: '顺序',
    dataIndex: 'sort',
    width: '25%'
  },
  {
    title: 'Action',
    key: 'action',
    slots: {customRender: 'action'},
    width: '25%'
  }
];

const rules = {
  name: [
    {required: true, message: '名称不得为空', trigger: 'blur'},
    {min: 2, message: 'Length should be over 2', trigger: 'blur'},
  ],
  parent: [
    {required: true, message: '父分类不得为空', trigger: 'change'},
  ],
  sort: [
    {required: true, message: '顺序不得为空', trigger: 'blur'},
  ]
}
export default defineComponent({
  name: "admin-category",
  setup() {
    const loading = ref(false);
    const pagination = ref({
      current: 1,
      pageSize: 5,
      total: 0
    });
    const visible = ref({
      add: false,
      update: false,
      delete: false
    })

    const category = ref();
    onMounted(() => {
      handleQuery();
    })

    const categoryList = ref();
    const handleQuery = (param) => {
      axios.get("/category/query", {
        params: {
          name: param
        }
      }).then(res => {
        console.log(res.data)
        categoryList.value = res.data.data
      })
    }

    const showModel = (operation, item) => {
      document.documentElement.style.overflow = 'hidden';
      if (operation == 'del'){
        visible.value.delete = true;
      }else if (operation == 'add'){
        visible.value.add = true;
      }else if (operation == 'edit'){
        visible.value.update = true;
        category.value = item;
      }
    }
    return {
      columns,
      loading,
      pagination,
      categoryList,
      handleQuery,
      showModel,
      visible,
      category,
      rules,
      labelCol: {span: 5},
      wrapperCol: {span: 15},
    }
  }
})
</script>

<style scoped>
#category {
  padding: 25px;
  background: white;
}

#category >>> .ant-table-row-cell-break-word {
  text-align: center;
}
.popStyle {
  width: 100%;
  height: 100%;
  position: fixed;
  margin: auto;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.32);
  display: flex;
  justify-content: center;
  align-items: center;
}
#category .ant-form-item {
  margin-left: 25px;
  margin-right: 25px;
}

.form-title {
  text-align: center;
  font-size: 17px;
  color: white;
  line-height: 2.5;
  background: #1890ff;
  margin-bottom: 25px;
}

</style>