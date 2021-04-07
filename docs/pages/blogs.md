---
title: 博客
permalink: /blogs/
sidebar: false
---

<BlogPage />

<script>
import { defineComponent } from 'vue'
import BlogPage from '@components/BlogPage.vue'
export default defineComponent({
  name: 'Blog',
  components: {
    BlogPage,
  },
})
</script>