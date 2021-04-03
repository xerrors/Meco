<template>
  <div class="home-container">
    <div class="hero">
      <h1>{{ data.heroText }}</h1>
      <p>{{ data.description }}</p>
      <button class="action-btn">
        <a :href="data.actionLink">{{ data.actionText }}</a>
      </button>
      <img src="@assets/img/home.svg" alt="" />
    </div>
  </div>
</template>

<script>
import { defineComponent, ref } from "vue";
import {
  usePageFrontmatter,
  useSiteLocaleData,
  withBase,
} from '@vuepress/client'
// import axios from 'axios';
export default defineComponent({
  name: "HomePage",
  setup() {
    const data = usePageFrontmatter();

    document.getElementsByClassName("theme-default-content")[0].style.maxWidth = "var(--page-width-w)";

    return {
      data,
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
  height: calc(100vh - 8rem);
  max-height: 1300px;
  margin-top: 3rem;
  // padding-top: calc(var(--header-height) + 2rem);
  h1 {
    margin-top: 0;
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
</style>