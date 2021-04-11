<template>
  <div class="articles-header">
    <img class="articles-header__cover" :src="fe.cover" alt="cover" />
    <h1 class="articles-header__title">{{ fe.title }}</h1>
    <p class="articles-header__info">{{ fe.date }}</p>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

import { formatTime } from '@src/utils/format'

import {
  usePageFrontmatter,
  useSiteLocaleData,
} from '@vuepress/client'

import { getRandomCover } from '@src/utils/common'

export default defineComponent({
  setup() {
    const fe = usePageFrontmatter()

    if (!fe.value.cover) {
      fe.value.cover = getRandomCover()
    }

    fe.value.date = formatTime(new Date(fe.value.date), '{y}年{m}月{d}日')

   return {
     fe,
   }
  }
})
// import { formatTime } from "";
</script>

<style lang="scss" scoped>
.articles-header {
  &__cover {
    border-radius: 4px;
    object-fit: cover;
    max-width: 100%;
  }

  &__title {
    font-size: 2rem;
  }

  &__info {
    font-size: 14px;
    line-height: 24px;
    color: #41414E;
  }
}
</style>

<style lang="scss">
.articles-header + .theme-default-content:not(.custom) {
  margin-top: 0;
}
</style>