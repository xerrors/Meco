---
home: false
---

<template>
  <HomePage />
</template>

<script>
import { defineComponent } from 'vue'
import HomePage from '@components/HomePage.vue'
export default defineComponent({
  name: 'Home',
  components: {
    HomePage,
  },
})
</script>


<!-- vitepress 地址: https://github.com/Xerrors/Gourd

目前还存在的问题

1. 主题的配置需要修改
2. css 变量的修改和适配 -->
