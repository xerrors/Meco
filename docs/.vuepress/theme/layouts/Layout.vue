<template>
  <Layout>
    <template #page-top>
      <div class="layout-component" v-if="fe.date">
        <PageTop></PageTop>
      </div>
    </template>

    <template #page-bottom>
      <div class="layout-component" v-if="fe.date">
        <Comment></Comment>
      </div>
    </template>
  </Layout>
</template>

<script>
import { defineComponent, computed, ref } from "vue";
import { usePageFrontmatter, useSiteLocaleData } from "@vuepress/client";

import PageTop from "../components/PageTop.vue";
import Comment from "../components/Comment.vue";
import Layout from "@vuepress/theme-default/lib/layouts/Layout.vue";

export default defineComponent({
  components: {
    Layout,
    PageTop,
    Comment,
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
.layout-component {
  width: var(--page-width);
  margin: 5rem auto 0 auto;
  padding: 2rem 2.5rem;
}

.layout-component + .theme-default-content:not(.custom) {
  margin-top: 0;
}
</style>