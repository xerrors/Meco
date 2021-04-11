---
title: 关于
permalink: /about/
sidebar: false
---

<AboutPage />

<script>
import { defineComponent } from 'vue'
import AboutPage from '@components/AboutPage.vue'
export default defineComponent({
  name: 'About',
  components: {
    AboutPage
  },
})
</script>

