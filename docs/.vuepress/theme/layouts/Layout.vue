<template>
  <Layout>
    <template #page-top>
      <div class="ac pagetop" v-if="fe.date">
        <PageTop></PageTop>
      </div>
    </template>

    <template #page-bottom>
      <div class="ac page-comment" v-if="fe.date">
        <Comment></Comment>
      </div>
      <Footer></Footer>
    </template>
  </Layout>
</template>

<script>
import { defineComponent, computed, ref } from "vue";
import { usePageFrontmatter, useSiteLocaleData } from "@vuepress/client";

import PageTop from "../components/PageTop.vue";
import Comment from "../components/Comment.vue";
import Footer from "../components/Footer.vue";
import Layout from "@vuepress/theme-default/lib/layouts/Layout.vue";

export default defineComponent({
  components: {
    Layout,
    PageTop,
    Comment,
    Footer,
  },
  setup() {
    const fe = usePageFrontmatter();

    return {
      fe,
    };
  },
});
</script>

<style lang="scss">
.ac {
  width: var(--page-width);
  margin: 0 auto;
}

.pagetop {
  margin-top: 5rem;
  padding: 2rem 2.5rem;
}

.page-comment {
  margin-bottom: 5rem;
}

.pagetop + .theme-default-content:not(.custom) {
  margin-top: 0;
}
</style>