<template>
  <div class="home-container">
    <div class="hero">
      <h1>{{ frontmatter.heroText }}</h1>
      <p><span>{{ des.prefix }}</span><span ref="desDom"></span><span>{{ des.endfix }}</span></p>
      <button class="action-btn">
        <a :href="frontmatter.actionLink">{{ frontmatter.actionText }}</a>
      </button>
      <img src="@assets/img/home.svg" alt="" class="no-zoom"/>
    </div>
  </div>
</template>

<script>
import { defineComponent, onMounted, ref } from "vue";
import {init} from 'ityped';

import {
  usePageFrontmatter,
  useSiteLocaleData,
  withBase,
} from '@vuepress/client'
export default defineComponent({
  name: "HomePage",
  props: {
    frontmatter: {
      require: true,
      type: Object,
    },
  },
  setup() {
    const data = usePageFrontmatter();
    const desDom=ref(null);
    const des = {
      prefix: '我是',
      strings: [
        '准研一苦行僧……',
        '月初生活费终结者……',
        '可乐克星……',
        '数码产品破坏大师……',
        '计算机视觉初级炼丹师……',
        '前端业余菜鸡……',
      ],
      endfix: '',
    }

    onMounted(() => {
      document.getElementsByClassName("theme-default-content")[0].style.maxWidth = "var(--page-width-w)";

      // 打字机效果
      init(desDom.value, {showCursor: true, strings: des.strings});
    })

    return {
      data,
      desDom,
      des,
    };
  },
});
</script>

<style lang="scss" scoped>
.home-container {
  max-width: var(--page-width-w);
  height: 100%;
  margin: 0 auto;
}
.hero {
  position: relative;
  height: calc(100vh - 9rem);
  max-height: 1300px;
  h1 {
    margin-top: 3rem;
    font-style: normal;
    font-weight: bold;
    font-size: 3.25rem;
    line-height: 4rem;
    color: #1A1A26;
  }
  p {
    font-style: normal;
    font-weight: 300;
    font-size: 18px;
    line-height: 40px;
    letter-spacing: 4px;
  }
  button {
    display: block;
    border: none;
    outline: none;
    cursor: pointer;
    font-weight: bold;
    font-size: 1rem;
    line-height: 1.75rem;
    letter-spacing: 4px;
    color: white;
    padding: 8px 32px;
    background: #000000;
    border-radius: 8px;
    margin-top: 3rem;
    &:hover {
      background-color: #1A1A26;
    }

    a {
      color: inherit;

      &:hover {
        text-decoration: none;
      }
    }
  }
  img {
    width: 900px;
    position: absolute;
    right: 0;
    bottom: 0;
  }
}

@media (max-width: 1537px) {
  .hero img {
    width: 50vw;
  }
}
</style>