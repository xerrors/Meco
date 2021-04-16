<template>
  <div class="friends-container">
    <div class="page-header">
      <div class="page-header-content">
        <h2>有朋自远方来，不亦悦乎。</h2>
        <p>
          交个朋友，可以把你的 GitHub 地址、博客地址、个人网站或者其他能够代表自己作品的地方发送到我的邮箱 <a href="mailto:xerrors@163.com">Xerrors@163.com</a>；务必附带上头像、名称、一句话介绍/格言信息，如果能够顺便带上自己的职业或者研究方向就更好不过了，这样能够让其他访客更好的了解到你。
        </p>
      </div>
    </div>
    <Loading v-if="data.loading" />
    <div v-else class="friends-content">
      <h3 class="border-left-h">专业领域</h3>
      <div class="friends-list">
        <div class="f-pro-card friend-card" v-for="(item, ind) in data.pro" :key="ind">
          <img :src="item.avatar" alt="头像" class="f-pro-card__avatar">
          <h3 class="f-pro-card__name"><a :href="item.site">{{ item.name }}</a></h3>
          <div class="links">
            <span v-if="item.mail">
              <a :href="'mailto:' + item.mail">
                <MailOutlined />
              </a>
            </span>
          </div>
          <div class="f-pro-card__title">{{ item.title }}</div>
          <p class="f-pro-card__quote">{{ item.quote }}</p>
        </div>
      </div>
      <h3 class="border-left-h">小伙伴们</h3>
      <div class="friends-list">
        <div class="f-card friend-card" v-for="(item, ind) in data.friends" :key="ind">
          <img :src="item.avatar" alt="头像" class="f-card__avatar">
          <h3 class="f-card__name"><a :href="item.site">{{ item.name }}</a></h3>
          <div class="links">
            <span v-if="item.mail">
              <a :href="'mailto:' + item.mail">
                <MailOutlined />
              </a>
            </span>
          </div>
          <p class="f-card__quote">{{ item.quote }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, reactive } from 'vue';
import { CompassOutlined, MailOutlined } from '@ant-design/icons-vue';
import axios from 'axios';

export default defineComponent({
  name: "FriendPage",
  components: {
    MailOutlined,
    CompassOutlined,
  },
  setup() {
    function getFriends() {
      new Promise((resolve, reject) => {
        axios({
          url: "https://xerrors.fun:5000/api/friends",
          method: "get"
        })
        .then(res => {
          parseFriends(res.data.data);
          resolve(res);
        })
        .catch(err => {
          reject(err);
        })
      })
    }

    function parseFriends(friends) {
      for (var ind=0; ind < friends.length; ind++) {
        if(friends[ind].title) {
          data.pro.push(friends[ind]);
        }
        else {
          data.friends.push(friends[ind])
        }
      }
      data.loading = false;
    }

    const data = reactive({
      loading: true,
      pro: [],
      friends: [],
    })

    getFriends();

    return {
      data,
    }
  }
})
</script>

<style lang="scss" scoped>
.page-header .page-header-content {
  max-width: var(--page-width-w);
}

.friends-container {
  margin-top: var(--header-height);
}

.friends-content {
  width: var(--page-width-w);
  margin: 0 auto;
}

.friends-list {
  display: grid;
  grid-template-columns: repeat(auto-fit,minmax(260px,1fr));
  grid-gap: 20px;
  margin-top: 40px;
  margin-bottom: 50px;
}

.friend-card {
  border: 1px solid var(--border-color-light);
  max-width: 380px;
  border-radius: 4px;
  padding: 16px;
  transition: 0.2s;

  a {
    text-decoration: none;
    color: inherit;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border: 1px dashed var(--border-color-light);
    border-radius: 4px;
  }

  h3 {
    margin-top: 8px;
    padding-left: 12px;
  }

  .links {
    display: flex;
    justify-content: flex-end;
    align-items: center;

    span {
      margin-left: 8px;
      font-size: large;

      > a {
        color: #aaa;
        opacity: 0;
        transition: opacity 0.2s;
      }

      &:hover {
        color: var(--accent-color);
      }
    }
  }

  &:hover {
    box-shadow: var(--shadow-1);

    span > a {
      opacity: 1;
    }
  }
}

.f-pro-card {
  display: grid;
  grid-template-columns: 68px auto 48px;
  grid-template-rows: 44px 24px auto;

  &__avatar {
    grid-row: span 2;
  }

  &__title {
    grid-column: span 2;
    padding-left: 12px;
    font-size: 14px;
    line-height: 24px;
    color: #20202F;
  }

  &__quote {
    grid-column: span 3;
    font-size: 16px;
    line-height: 24px;
    color: #20202F;
  }
}

.f-card {
  display: grid;
  grid-template-columns: 68px auto 48px;
  grid-template-rows: 44px 24px;

  &__avatar {
    grid-row: span 2;
  }

  &__quote {
    grid-column: span 2;
    padding-left: 12px;
    font-size: 14px;
    line-height: 24px;
    color: #20202F;
    margin: 0;
    overflow: hidden;
  }
}
</style>