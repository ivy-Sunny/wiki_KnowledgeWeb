<template>
  <div id="main">
    <a-layout>
      <a-layout-sider width="200" style="background: #fff">
        <a-menu
            mode="inline"
            :style="{ height: '100%', borderRight: 0 }"
        >
          <a-menu-item key="welcome" @click="queryEbook('')">
              <MainOutlined/>
              <span>
                全部
              </span>
          </a-menu-item>
          <a-sub-menu v-for="parent in categoryNodes" :key="parent.id">
            <template #title>
              <span >
                <user-outlined/>
                {{ parent.name }}
              </span>
            </template>
            <a-menu-item v-for="child in parent.children" :key="child.id" @click="queryEbook(child.id)">{{ child.name }}</a-menu-item>
          </a-sub-menu>
        </a-menu>
      </a-layout-sider>
      <a-layout-content
          :style="{ background: '#fff', padding: '24px', margin: 0, minHeight: '280px' }"
      >
        <a-list item-layout="vertical" size="large" :pagination="pagination" :data-source="ebooks"
                :grid="{gutter:20, column: 3}">
          <template #renderItem="{ item }">
            <a-list-item key="item.name">
              <template #actions>
          <span v-for="{ type, text } in actions" :key="type">
            <component v-bind:is="type" style="margin-right: 8px"/>
            {{ text }}
          </span>
              </template>
              <a-list-item-meta :description="item.description">
                <template #title>
                  <a :href="item.href">{{ item.name }}</a>
                </template>
                <template #avatar>
                  <a-avatar :src="item.cover"/>
                </template>
              </a-list-item-meta>
            </a-list-item>
          </template>
        </a-list>
      </a-layout-content>
    </a-layout>
  </div>
</template>

<script lang="ts">
import {StarOutlined, LikeOutlined, MessageOutlined} from '@ant-design/icons-vue';
import {defineComponent, onMounted, ref, reactive, toRef} from 'vue';
import axios from 'axios';
import {message} from "ant-design-vue";

export default defineComponent({
  name: 'Home',
  components: {
    StarOutlined,
    LikeOutlined,
    MessageOutlined,
  },
  setup() {

    onMounted(() => {
      queryEbook('');
      queryCategory();
    })
    const ebooks = ref();
    const queryEbook = (val): void => {
      axios.get("ebook/listByCategory", {
        params: {
          categoryId: val,
        }
      }).then(res => {
        ebooks.value = res.data
      });
    }

    const categoryNodes: any = ref();
    let category: any = ref({});
    const queryCategory = (): void => {
      axios.get("/category/nodes", {}).then((res: any): void => {
        if (res.code === 200) {
          categoryNodes.value = res.data.data;
        } else {
          message.error("查询失败");
        }
      })
    }
    return {
      categoryNodes,
      queryEbook,
      ebooks,
    }
  }
});
</script>
<style scoped>
.ant-avatar {
  width: 50px;
  height: 50px;
  line-height: 50px;
  border-radius: 10%;
  margin: 5px 0;
}

#main >>> .ant-layout {
  min-height: calc(100vh - 65px - 70px);
}
</style>
