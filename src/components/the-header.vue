<template>
  <a-layout-header class="header">
    <div class="logo"/>
    <a-menu
        theme="dark"
        mode="horizontal"
        v-model:selectedKeys="selectedKeys"
        :style="{ lineHeight: '64px' }"
    >
      <a-menu-item key="/">
        <router-link to="/home">首页</router-link>
      </a-menu-item>
      <a-menu-item key="/admin/ebook">
        <router-link to="/admin/ebook">电子书管理</router-link>
      </a-menu-item>
      <a-menu-item key="/admin/category">
        <router-link to="/admin/category">分类管理</router-link>
      </a-menu-item>
      <a-menu-item key="/about">
        <router-link to="/about">
          关于我们
        </router-link>
      </a-menu-item>
    </a-menu>
  </a-layout-header>
</template>

<script lang="ts">
import {defineComponent, onMounted, ref} from "vue";
import {useRouter} from "vue-router";
import router from "@/router";

export default defineComponent({
  name: "the-header",
  setup() {
     const selectedKeys:any = ref([]);

    onMounted(()=>{
      router.push('/home')
      selectedKeys.value.push('/')
    })

    return {
      selectedKeys
    }
  }
})
</script>

<style scoped>

</style>