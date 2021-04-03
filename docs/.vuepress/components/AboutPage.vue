<template>
  <div class="about-container">
    <div class="about-header">
      <h1>{{ author }}</h1>
      <a :href="'mailto:' + mailAddress"><MailOutlined style="margin-right: 16px;" />联系我</a>
      <p>{{ info }}</p>
    </div>

    <div class="about-body">
      <div v-for="(item, ind) in content" :key="ind">
        <h3 class="border-left-h">{{ item.title }}</h3>
        <p v-for="(p, i) in item.details" :key="i">{{ p }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import { usePageFrontmatter } from '@vuepress/client';
import { MailOutlined } from '@ant-design/icons-vue';
export default defineComponent({
  name: "AboutPage",
  components: {
    MailOutlined,
  },
  setup() {
    const frontmatter = usePageFrontmatter();
    const mailAddress = frontmatter.value.mail;
    const author = frontmatter.value.author;
    const info = frontmatter.value.info;
    const content = frontmatter.value.content;
    return {
      mailAddress,
      author,
      info,
      content,
    }
  }
})
</script>

<style lang="scss" scoped>
.about-container {
  // padding-top: var(--header-height);
  width: 100%;
}

.about-header {
  max-width: var(--page-width);
  margin: 0 auto;
  padding: 40px 0 40px 0;
  display: grid;
  grid-template-rows: 80px 30px;
  grid-template-columns: auto 120px;

  h1 {
    font-size: 48px;
    line-height: 56px;
    color: #1a1a26;
  }

  p {
    font-size: 16px;
    line-height: 24px;
    color: var(--c-text-light-2);
    grid-column: span 2;
  }

  a {
    text-decoration: none;
    padding: 10px 16px;
    padding-right: 0;
    cursor: pointer;
    border: none;
    outline: none;
    height: fit-content;
    margin-top: auto;
    margin-bottom: 0;
    background: var(--accent-color);
    border-radius: 4px;
    color: white;
    font-size: 16px;
    letter-spacing: 4px;

    &:hover {
      text-decoration: none;
    }
  }
}

.about-body {
  max-width: var(--page-width);
  margin: 0 auto;

  h3 {
    font-size: 24px;
    line-height: 32px;
    margin-bottom: 36px;
    margin-top: 56px;
  }

  p {
    font-size: 16px;
    line-height: 28px;
    letter-spacing: 1px;
    text-align: justify;
  }
}
</style>