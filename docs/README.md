---
sidebar: false
heroText: Hi, I'm Yuchuan.
tagline: Hero subtitle
actionText: 查看博客
actionLink: /blogs/
heroImage: /logo.png
heroAlt: Logo image
description: 
footer: Developed by Yuchuan
---

<HomePage class="my-home" :frontmatter="frontmatter"/>

<script>
import { defineComponent } from 'vue'
import HomePage from '@components/HomePage.vue'
import { usePageFrontmatter } from '@vuepress/client'
export default defineComponent({
  name: 'Home',
  components: {
    HomePage,
  },
  setup() {
    const frontmatter = usePageFrontmatter();

    return {
      frontmatter
    }
  }
})
</script>

<style lang='scss' scoped>
.my-home {

  footer {
    display: none;
  }
}
</style>
