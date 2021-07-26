<template>
  <div id="ebook" style="min-height: calc(100vh - 65px - 70px);background: white">
    <!--表头-->
    <div style="margin: 25px 0 15px 100px;">
      <a-input-search style="width: 50%;max-width: 350px" placeholder="请输入关键字" enter-button="搜索"
                      @search="handleQuery({page: 1, size: pagination.pageSize,name: $event})"/>
      <a-button type="danger" :size="size" style="margin-left: 25px" @click="showModel('add')">
        添加电子书
      </a-button>
    </div>

    <!--表格-->
    <a-table
        :columns="columns"
        :row-key="record => record.id"
        :data-source="ebooks"
        :pagination="pagination"
        :loading="loading"
        @change="handleTableChange"
    >
      <template #cover="{text:cover}">
        <img v-if="cover" :src="cover" alt="avatar" width="50" height="50"/>
      </template>
      <template #action="{ text: item }">
        <a-button type="primary" @click="showModel('edit',item)">编辑</a-button>
        &nbsp;&nbsp;
        <a-button type="primary" style="background: #ff7875" @click="showModel('del',item)" danger>删除</a-button>
      </template>
    </a-table>

    <!--删除-->
    <a-modal v-model:visible="visible.delete" title="删除确认"
             @ok="handle('submit')"
             ok-text="确认"
             cancel-text="取消">
      确定要删除？
      <p>{{ ebook.name }}</p>
    </a-modal>

    <!--新增-->
    <div v-if="visible.add || visible.update" class="popStyle">
      <a-form :model="ebook" :rules="rules"
              ref="ebookform"
              style="background: white;width: 500px" :label-col="labelCol" :wrapper-col="wrapperCol">
        <div class="form-title">
          添加电子书
        </div>
        <a-form-item label="封面" name="cover">
          <a-input v-model:value="ebook.cover"/>
        </a-form-item>
        <a-form-item label="名称" name="name">
          <a-input v-model:value="ebook.name"/>
        </a-form-item>
        <a-form-item label="分类一" name="category1Id">
          <a-select v-model:value="ebook.category1Id" placeholder="请选择">
            <a-select-option @click="changeNodes(node)" v-for="node in (categoryNodes.allNodes)" :key="node.name"
                             :value="node.id">{{ node.name }}
            </a-select-option>
          </a-select>

        </a-form-item>
        <a-form-item label="分类二" name="category2Id">
          <a-select v-model:value="ebook.category2Id" placeholder="请选择">
            <a-select-option v-for="node in (categoryNodes.choseNodes)" :key="node.name" :value="node.id">{{
                node.name
              }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="描述" name="description">
          <a-textarea v-model:value="ebook.description"/>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="handle('submit')">确认</a-button>
          <a-button style="margin-left: 10px" @click="handle('cancel')">取消</a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>

</template>
<script lang="ts">
import {message} from 'ant-design-vue';
import axios from "axios";
import {defineComponent, ref, onMounted, watch, toRaw} from 'vue';

let c: Array<{ text: string, value: string }> = [];
const columns = [
  {
    title: '封面',
    dataIndex: 'cover',
    slots: {customRender: 'cover'}
  },
  {
    title: '名称',
    dataIndex: 'name'
  },
  {
    title: '分类一',
    dataIndex: 'category1Id',
    filters: c
  },
  {
    title: '分类二',
    dataIndex: 'category2Id',
  },
  {
    title: '文档数',
    dataIndex: 'docCount'
  },
  {
    title: '阅读数',
    dataIndex: 'viewCount'
  },
  {
    title: '点赞数',
    dataIndex: 'voteCount'
  },
  {
    title: 'Action',
    key: 'action',
    slots: {customRender: 'action'}
  }
];

export default defineComponent({
  setup: function () {
    const ebookform = ref();
    const visible = ref({
      delete: false,
      add: false,
      update: false
    });
    const rules = {
      name: [
        {required: true, message: '电子书名不得为空', trigger: 'blur'},
        {min: 2, message: 'Length should be over 2', trigger: 'blur'},
      ],
      cover: [
        {required: true, message: '封面不得为空', trigger: 'blur'},
      ],
      category1Id: [
        {required: true, message: '分类一不得为空', trigger: 'change'},
      ],
      category2Id: [
        {required: true, message: '分类二不得为空', trigger: 'change'},
      ],
      description: [
        {required: true, message: '描述不得为空', trigger: 'blur'},
      ]
    }
    const ebooks = ref();
    const ebook = ref({
      id: '',
      cover: '',
      name: '',
      description: '',
      category1Id: null,
      category2Id: null,
    });
    const pagination = ref({
      current: 1,
      pageSize: 2,
      total: 0
    });
    const loading = ref(false);

    onMounted((): void => {
      queryCategory();
      handleQuery({
        page: 1,
        size: 2,
        name: ''
      })
    })
    /**
     * 查询category
     */
    const categoryNodes: any = ref({
      allNodes: null,
      choseNodes: null
    });
    setTimeout(function (){
      console.log(c)
    },10000)
    const queryCategory = (): void => {
      axios.get("/category/query", {}).then((res: any): void => {
        if (res.code === 200) {
          categoryNodes.value.allNodes = res.data.data;
          categoryNodes.value.allNodes.forEach(item1 => {
            let obj1 = {text: '', value: ''};
            obj1.text = item1.name;
            obj1.value = item1.id;
            c.push(obj1);
            if (item1.children != '') {
              item1.children.forEach(item2 => {
                let obj2 = {text: '', value: ''};
                obj2.text = item2.name;
                obj2.value = item2.id;
                c.push(obj2);
              })
            }
          })
        } else {
          message.error("查询失败");
        }
      })
    }
    const changeNodes = (node) => {
      ebook.value.category2Id = null;
      categoryNodes.value.choseNodes = node.children;
    }

    /**
     * 数据查询
     **/
    const handleQuery = (params: any) => {
      loading.value = true;
      // 如果不清空现有数据，则编辑保存重新加载数据后，再点编辑，则列表显示的还是编辑前的数据
      ebooks.value = [];
      axios.get("/ebook/list", {
        params: {
          page: params.page,
          size: params.size,
          name: params.name
        }
      }).then((res: any) => {
        loading.value = false;
        console.log(res.data)
        if (res.code === 200) {
          const data = res.data;
          ebooks.value = data.list;
          console.log(data.list)
          // 重置分页按钮
          pagination.value.current = params.page;
          pagination.value.total = data.total;
        } else {
          message.error("操作失败");
        }
      });
    };

    /**
     * 表格点击页码时触发
     */
    const handleTableChange = (pagination: any) => {
      console.log("看看自带的分页参数都有啥：" + pagination);
      handleQuery({
        page: pagination.current,
        size: pagination.pageSize
      });
    };

    /**
     * 编辑框
     */
    let dowhat = '';
    const showModel = (operation: string, item) => {
      if (operation === 'del') {
        visible.value.delete = true;
        ebook.value = item
      } else if (operation === 'add') {
        visible.value.add = true;
      } else if (operation === 'edit') {
        ebook.value = item

        categoryNodes.value.allNodes.forEach(item => {
          if (item.id === ebook.value.category1Id) {
            categoryNodes.value.choseNodes = item.children;
          }
        })
        visible.value.update = true;
      }
      dowhat = operation;
    }

    const handle = (operation) => {
      if (operation === 'submit') {
        if (dowhat === "add" || dowhat === "edit") {
          ebookform.value
              .validate()
              .then(() => {
                axios.post(`/ebook/${dowhat}`, ebook.value).then(res => {
                  reflush();
                })
              })
              .catch(() => {
                console.log(ebook.value)
              })
        } else {
          axios.post(`/ebook/${dowhat}`, ebook.value).then(res => {
            reflush();
          })
        }
      } else {
        reflush();
      }

      function reflush() {
        dowhat = '';
        visible.value = {
          delete: false,
          add: false,
          update: false
        };
        ebook.value = {
          id: '',
          cover: '',
          name: '',
          description: '',
          category2Id: null,
          category1Id: null,
        }
      }
    }

    return {
      ebookform,
      changeNodes,
      labelCol: {span: 5},
      wrapperCol: {span: 15},
      categoryNodes,
      visible,
      ebooks,
      ebook,
      pagination,
      rules,
      columns,
      loading,
      handle,
      handleTableChange,
      handleQuery,
      showModel
    };
  },
});
</script>

<style scope>
.ant-modal-footer > div {
  display: flex;
  justify-content: center;
}

.popStyle {
  width: 100%;
  height: 100%;
  position: absolute;
  margin: auto;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.32);
  display: flex;
  justify-content: center;
  align-items: center
}

#ebook .ant-form-item {
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

.ant-form-item:last-child, .ant-form-item-control-input-content {
  display: flex;
  justify-content: center;
}
</style>