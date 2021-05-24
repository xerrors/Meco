<template>
  <div class="about-container">
    <div class="about-header">
      <h1>{{ base.author }}</h1>
      <a :href="'mailto:' + base.mailAddress"
        ><MailOutlined style="margin-right: 12px" />联系我</a
      >
      <p>{{ base.info }}</p>
    </div>

    <div class="about-body">
      <div v-for="(item, ind) in base.content" :key="ind">
        <h3 class="border-left-h">{{ item.title }}</h3>
        <p v-for="(p, i) in item.details" :key="i">{{ p }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, reactive, ref } from "vue";
import { MailOutlined } from "@ant-design/icons-vue";
export default defineComponent({
  name: "AboutPage",
  components: {
    MailOutlined,
  },
  setup() {
    const base = reactive({
      author: "Chen",
      mail: "xerrors@163.com",
      info:
        "江南大学 · 2017级 · 计算机科学与技术专业 · 学习方向：计算机视觉、图像处理",
      content: [
        {
          title: "关于我",
          details: [
            "我目前是一名计算机科学与技术专业的准研究生，意向的领域是计算机视觉。我本人并不是一个前端开发工作者，只是对前端开发感兴趣，从而给自己开发了这么一个博客网站供自己使用！很多地方为了省事并没有按照开发的规范来开发，典型的小作坊产品，拿不上台面。",
          ],
        },
        {
          title: "关于本站",
          details: [
            "哪个男孩不想拥有属于自己的网站呢？从 2017 年使用 wordpress 傻瓜式建站，2018 年使用 Hexo 建站，2019 年使用了 Vuepress 建站，每一次的建站都在之前的基础上加上了更高的自由度。",
            "这个网站是在 2020 年夏天设计完成，预计在 2021 年春节期间开发完成；使用 Vuepress2 进行文档渲染，后端使用 Falsk 完成简单的后台工作！同时为了更好的对网站进行管理，我同时也开发了后台管理系统，可以对自己的文章消息进行管理。所有的项目内容都在 GitHub 上面开源了",
          ],
        },
        {
          title: "版权声明",
          details: [
            "网页内的所有文章均是我的原创文章，如有摘录其他网站的内容，均会在醒目位置注明出处，使用 CC 4.0 BY-SA 知识共享协议，支持转载，转载请注明此网站内文章链接；我除了在「CSDN」以及「掘金」之外，我没有在任何网站授权发表过文章；所有文章所使用的图片资源在使用的时候已经检查过版权信息，如有遗漏或者侵害了你的利益请及时联系我。",
          ],
        },
      ],
    });

    return {
      base,
    };
  },
});
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
  grid-template-columns: auto 100px;

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
    padding: 8px 14px;
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
    font-size: 14px;
    letter-spacing: 2px;

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