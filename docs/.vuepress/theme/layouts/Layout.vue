<template>
  <Layout>
    <template #page-top>
      <div class='layout-component' v-if="isBlog">
        <PageTop></PageTop>
      </div>
    </template>

    <template #page-bottom>
      <div class='layout-component' v-if="isBlog">
        <Comment></Comment>
      </div>
    </template>
  </Layout>
</template>

<script>
import { defineComponent, computed } from 'vue'
import {
  usePageFrontmatter,
  useSiteLocaleData,
} from '@vuepress/client'

import PageTop from '../components/PageTop.vue'
import Layout from '@vuepress/theme-default/lib/layouts/Layout.vue'

export default defineComponent({
  components: {
    Layout,
    PageTop,
  },
  setup() {
    const fe = usePageFrontmatter().value

    const isBlog = computed(() => {
      return Boolean(fe.date);
   })

   console.log(isBlog)

   return {
     isBlog,
   }
  }
})
</script>

<style lang="scss">
.layout-component {
  width: var(--page-width);
  margin: 5rem auto 0 auto;
  padding: 2rem 2.5rem;
}

.layout-component + .theme-default-content:not(.custom) {
  margin-top: 0;
}
</style>