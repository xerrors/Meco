---
sidebar: false
heroText: Hi, I'm Xerrors.
tagline: Hero subtitle
actionText: 查看博客
actionLink: /blogs
heroImage: /logo.png
heroAlt: Logo image
description: 我是一名大四学生/生活费终结者/可乐克星/数码产品破坏大师。
footer: Developed by Xerrors
---

<HomePage class="my-home"/>

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

<style lang='scss' scoped>
.my-home {

  footer {
    display: none;
  }
}
</style>

<!-- <style lang='scss'>
.theme-default-content {
  max-width: var(--page-width-w)!important;
}
</style> -->
