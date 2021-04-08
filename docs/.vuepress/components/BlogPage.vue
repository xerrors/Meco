<template>
  <div class="blog-container">
    <div class="slideshow">
      <Shuffler :sliderArray="banner" />
    </div>

    <div class="categories">
      <span
        v-for="(cat, ind) in categories.labels"
        :key="ind"
        :class="{ active: categories.active == cat }"
        @click="categories.selectCategory(cat)"
      >
        {{ cat }}
      </span>
    </div>

    <div class="search-box">
      <!-- <a-input-search
        v-model:value="searcher.value"
        placeholder="input search text"
        style="width: 200px"
        @search="searcher.onSearch"
      /> -->
    </div>
    <Loading v-if="loading" />
    <div v-else class="blogs">
      <div v-for="(page, ind) in filtedPages" :key="ind">
        <div class="week-card" v-if="page.categories == '周报'">
          <div class="week-card__header">{{ page.formatDate }}周报</div>
          <div class="week-card__title">
            <a :href="page.permalink" target="_blank">{{ page.title }}</a>
          </div>
          <div class="week-card__cover">
            <a :href="page.permalink" target="_blank"><img :src="page.cover" alt="" /></a>
          </div>
          <div class="week-card__content">
            <a :href="page.permalink" target="_blank">{{ page.abstract }}</a>
          </div>
        </div>

        <div v-else class="blog-card">
          <a :href="page.permalink" target="_blank">
            <div class="blog-card__image">
              <img
                :src="
                  page.cover + '?x-oss-process=image/resize,m_fill,h_180,w_340'
                "
                alt=""
              /></div
          ></a>

          <div class="blog-card__info">
            <a :href="page.permalink" target="_blank"
              ><h3>{{ page.title }}</h3></a
            >
            <span>{{ page.formatDate }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="blog-right">
      <div class="adversizement">
        广告位招租
      </div>

      <!-- <h4 class="border-left-h">我的专栏</h4>

      <div class="zhuanlan-slideshow">
        <Shuffler :sliderArray="zhuanlan" />
      </div> -->
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, reactive, computed, onMounted } from "vue";
import { SearchOutlined } from "@ant-design/icons-vue";

import axios from "axios";

import Shuffler from "@components/Shuffler.vue";

import { parseTime } from "@src/utils/format";
import { getRandomCover } from "@src/utils/common";

export default defineComponent({
  name: "BlogPage",
  components: {
    SearchOutlined,
    Shuffler,
  },
  setup() {
    const banner = ref([{
        cover: "https://xerrors.oss-cn-shanghai.aliyuncs.com/imgs/20210220180756.png",
        link: "/anime-gan-note/",
      }, {
        cover: "https://xerrors.oss-cn-shanghai.aliyuncs.com/imgs/20210207165125.png",
        link: "https://baidu.com",
      }, {
        cover: "https://xerrors.oss-cn-shanghai.aliyuncs.com/imgs/20210220100428.png",
        link: "/cycle-gan-reading-note/",
      },
    ]);

    const loading = ref(true);
    const pages = ref([]);

    function getPages() {
      new Promise((resolve, reject) => {
        axios({
          url: "https://www.xerrors.fun:5000/articles",
          method: "get",
        })
          .then((res) => {
            pages.value = res.data.data.map((item) => {
              item.formatDate = parseTime(
                new Date(item.date),
                "{y}年{m}月{d}日"
              );
              if (!item.cover) {
                item.cover = getRandomCover();
              }
              if (item.permalink[0] != "/") {
                item.permalink = "/" + item.permalink;
              }
              if (item.permalink[-1] != '/') {
                item.permalink =  item.permalink + "/";
              }
              return item;
            });

            pages.value.sort((a, b) => {
              return Number(new Date(b.date)) - Number(new Date(a.date));
            });
            loading.value = false;
            resolve(res);
          })
          .catch((err) => {
            reject(err);
          });
      });
    }

    const searcher = reactive({
      value: "",
      onSearch: () => {
        console.log("onSearch");
      },
    });

    const categories = reactive({
      labels: ["全部", "前端", "人工智能", "算法", "周报"],
      active: "全部",
      selectCategory: (link) => {
        categories.active = link;
      },
    });

    let filtedPages = computed(() => {
      if (categories.active != "全部") {
        return pages.value.filter((item) => {
          return (
            item.categories === categories.active ||
            item.categories[0] === categories.active
          );
        });
      } else {
        return pages.value;
      }
    });

    const zhuanlan = ref([]);
    function getZhuanlan() {
      new Promise((resolve, reject) => {
        axios({
          url: "https://www.xerrors.fun:5000/zhuanlan",
        }).then((res) => {
          // console.log(res.data.data);
          zhuanlan.value = res.data.data.map((item) => {
            const temp = {
              cover: item.cover,
              link: "/pages/zhuanlan?name=" + item.name,
            };
            return temp;
          });
          resolve(res);
        }).catch(err => {
          reject(err);
        });
      });
    }

    getPages();
    getZhuanlan();

    onMounted(() => {
      document.getElementsByClassName("theme-default-content")[0].style.maxWidth =
      "var(--page-width-w)";
    })

    return {
      filtedPages,
      categories,
      searcher,
      zhuanlan,
      banner,
      loading,
    };
  },
});
</script>

<style lang="scss" scoped>
.blog-container {
  margin: 0 auto;
  margin-top: var(--header-height);
  width: var(--page-width-w);

  display: grid;
  grid-template-columns: 9fr 3fr;
  grid-template-rows: 380px 60px auto;
  grid-column-gap: 30px;
  grid-row-gap: 20px;
}

.slideshow {
  width: 100%;
  height: 100%;
  border-radius: 4px;
  overflow: hidden;

  grid-column-start: span 2;

  // img {
  //   object-fit: cover;
  //   width: 100%;
  // }
}

.categories {
  // height: 100%;
  position: sticky;
  top: -1px;
  padding-top: 18px;
  background: white;
  z-index: 1;

  span {
    font-size: 20px;
    line-height: 24px;
    padding: 8px 20px;
    margin-right: 16px;
    cursor: pointer;
    transition: all 0.2s ease-in-out;

    &:not(.active):hover {
      background: #fafafa;
      border-radius: 4px;
    }
  }

  .active {
    font-weight: Bold;
    color: var(--accent-color);
    padding: 12px 20px;

    border-bottom: 4px solid var(--accent-color);
  }
}

.blogs {
  .blog-card,
  .week-card {
    a {
      color: inherit;
    }

    a:hover {
      text-decoration: none;
    }
  }

  .blog-card {
    display: flex;
    height: 180px;
    margin-bottom: 24px;
    border: 1px solid #f2f2f2;
    transition: all 0.3s ease-in-out;
    // animation: slide-in-blurred-bottom 0.5s cubic-bezier(0.230, 1.000, 0.320, 1.000) both;

    &__image {
      overflow: hidden;
      min-width: 340px;
      cursor: pointer;
      transition: all 0.3s ease-in-out;
      & > img {
        transition: all 0.3s ease-in-out;
        object-fit: cover;
        width: 340px;
        height: 180px;
      }
    }

    &__info {
      width: 100%;
      padding: 0 24px;
      position: relative;
      transition: all 0.3s ease-in-out;

      h3 {
        color: #1a1a26;
        margin-top: 38px;
        font-weight: bold;
        font-size: 20px;
        line-height: 24px;
        cursor: pointer;
        max-height: 56px;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      span {
        position: absolute;
        bottom: 27px;
        color: #41414e;
      }
    }
  }

  .blog-card:hover {
    .blog-card__image {
      width: 320px;
      min-width: 320px;

      & > img {
        transform: scale(1.05);
      }
    }

    .blog-card__info {
      padding-left: 16px;
      padding-right: 32px;
    }
  }
}

.blogs .week-card {
  display: grid;
  grid-template-rows: 50px 30px 100px;
  grid-template-columns: auto 256px;
  grid-gap: 14px;
  // animation: slide-in-blurred-bottom 0.5s cubic-bezier(0.230, 1.000, 0.320, 1.000) both;

  padding: 24px 28px;
  border: 1px solid #f2f2f2;
  margin-bottom: 24px;

  &__header {
    grid-column: span 2;

    font-weight: bold;
    font-size: 24px;
    line-height: 24px;
    color: var(--accent-color);

    border-bottom: 2px solid #f2f2f2;
    margin-bottom: 10px;
  }

  &__title a {
    font-weight: bold;
    font-size: 24px;
    line-height: 24px;
    cursor: pointer;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  &__content {
    font-size: 16px;
    line-height: 24px;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__cover {
    grid-row: span 2;
    width: 100%;
    overflow: hidden;
    cursor: pointer;

    img {
      object-fit: cover;
      height: 100%;
      border-radius: 4px;
    }
  }
}

.blog-right {
  position: sticky;
  top: var(--header-height);
  top: 60px;
  height: fit-content;

  .adversizement {
    background: white;
    min-height: 100px;
    border: 1px solid #f2f2f2;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
  }

  h4 {
    margin-top: 16px;
    font-weight: normal;
    margin-bottom: 12px;
  }

  h4:first-child {
    margin-top: 0;
  }

  .zhuanlan-slideshow {
    height: 380px;
    overflow: hidden;
    border-radius: 8px;
  }
}

/* ----------------------------------------------
 * Generated by Animista on 2021-2-10 19:0:30
 * Licensed under FreeBSD License.
 * See http://animista.net/license for more info. 
 * w: http://animista.net, t: @cssanimista
 * ---------------------------------------------- */

/**
 * ----------------------------------------
 * animation slide-in-blurred-bottom
 * ----------------------------------------
 */
@keyframes slide-in-blurred-bottom {
  0% {
    transform: translateY(400px) scaleX(0.8);
    transform-origin: 50% 100%;
    opacity: 0;
  }
  100% {
    transform: translateY(0) scaleX(1);
    transform-origin: 50% 50%;
    opacity: 1;
  }
}
</style>
