<template>
  <div class="zone-container">
    <div class="page-header">
      <div class="page-header-content">
        <h2>鹅鹅鹅，曲颈向天歌。</h2>
        <p>
          信息时代，交流变得更加的方便，但是有些话，却总是不想跟别人表达，每个人都是一个独立的个体，都有自己的想法，是真实的自己，也有想要表达出去的欲望，不如在这里，说个痛快！
        </p>
        <div :class="{ 'button-show': true, 'button-close': showCommit }" @click="showCommit = !showCommit">
          <PlusOutlined />
        </div>
      </div>
    </div>
    <div class="commit-box" v-if="showCommit">
      <div class="emoji-selector">
        <div
          v-for="(emoji, ind) in msgCtrl.status"
          :key="ind"
          :class="{ selected: emoji == newMsg.status }"
          @click="newMsg.status = emoji"
          >{{ emoji }}</div
        >
      </div>
      <input type="password" name="token" id="" v-model="newMsg.token" placeholder="token"/>
      <textarea
        name="content"
        id="content"
        cols="30"
        rows="10"
        v-model="newMsg.msg"
      ></textarea>
      <span>只有网站的所有者才可以发布动态哦~不要尝试哦~</span>
      <button class="commit-button" :disabled="!msgCtrl.completeInput" @click="msgCtrl.handleCommit">
        提交
      </button>
    </div>
    <Loading v-if="msgCtrl.loading" />
    <div v-else class="posts">
      <div class="post-card" v-for="post in posts" :key="post.id">
        <div class="post-card__head">
          <span class="post-card__status">{{ post.status }}</span>
          <span class="post-card__date" @click="msgCtrl.delMsg(post.id)">{{ post.date }}</span>
          <div class="btn-love" :class="{'love-active': post.active}" @click="msgCtrl.love(post.id)"></div>
        </div>
        <div class="post-card__body">
          <pre>{{ post.msg }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, reactive, computed, onMounted } from 'vue';
import { PlusOutlined } from '@ant-design/icons-vue';
import axios from 'axios';
import { formatTime } from "@src/utils/format";
export default defineComponent({
  name: "ZonePage",
  components: {
    PlusOutlined,
  },
  setup() {
    // 定义部分：
    const posts = ref([]);
    const showCommit = ref(false);

    const newMsg = reactive({
      msg: "",
      status: "😘",
      token: "",
    })
    
    // 从本地获取点赞了的列表
    function getLocalActiveList() {
      let lovedMsgs = [];
      const temp = window.localStorage.getItem("lovedMsgs")
      if (temp) {
        lovedMsgs = temp.split(",");
      }
      else {
        lovedMsgs = ["test", "test2"];
      }
      return lovedMsgs;
    }

    // 解析从服务器传来的数据
    function parseData(data) {
      // console.log(data);
      const lovedMsgs = getLocalActiveList();

      data = data.map(item => {
        item.date = formatTime(new Date(item.date), "{y}年{m}月{d}日");
        if (lovedMsgs.includes(String(item.id))) {
          item.active = true;
        }
        return item;
      })
      data.reverse();
      return data;
    }

    // 提交新的动态
    function commitMessage() {
      if (!msgCtrl.completeInput) {
        alert("请填写所有字段");
        return
      }
      new Promise((resolve, reject) => {
        axios({
          url: "https://xerrors.fun:5000/zones",
          method: "post",
          params: newMsg,
        })
        .then((res) => {
          posts.value = parseData(res.data.data);
          newMsg.msg = "";
          newMsg.status = "😘";
          newMsg.token = "";
          showCommit.value = false;
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        })
      })
    }    

    // 删除一个动态，现在还没有添加验证 TODO
    let count = 0;
    function delMessage(id) {

      if (count < 10) {
        count += 1;
      }
      else {
        count = 0;

        var token = prompt("请输入 token:");
        new Promise((resolve, reject) => {
          axios({
            url: "https://xerrors.fun:5000/zones",
            method: "delete",
            params: {
              id: id,
              token: token,
            }
          })
          .then((res) => {
            posts.value = parseData(res.data.data);
            alert(res.data.message);
            // console.log(res.data.message)
            resolve(res);
          })
          .catch((err) => {
            reject(err);
          })
        })
      }
    }

    // 点赞功能，纯本地化，存储在 localstorage 里面
    function loveMessage(id) {
      // just frontend
      let lovedMsgs = getLocalActiveList();
      if (!(lovedMsgs.includes(String(id)))) {
        lovedMsgs.unshift(String(id));
      }
      // console.log(lovedMsgs)
      window.localStorage.setItem("lovedMsgs", String(lovedMsgs));

      posts.value = posts.value.map(item => {
        if (lovedMsgs.includes(String(item.id)) ) {
          item.active = true;
        }
        return item;
      })
    }

    // 从服务器获取消息列表
    function getMessages() {
      new Promise((resolve, reject) => {
        axios({
          url: "https://xerrors.fun:5000/zones",
          method: "GET",
        })
        .then((res) => {
          posts.value = parseData(res.data.data);
          msgCtrl.loading = false;
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        })
      })
    }

    const msgCtrl = reactive({
      loading: true,
      status: ["😘", "😊", "😂", "👍", "😒", "✨", "🎉", "👀", "👨‍💻", "👎", "📢", "🏡"],
      handleCommit: commitMessage,
      delMsg: delMessage,
      love: loveMessage,
      completeInput: computed(() => newMsg.msg && newMsg.status && newMsg.token)
    })

    // 执行部分：
    onMounted(() => {
      getMessages();
    })

    return {
      posts,
      newMsg,
      msgCtrl,
      showCommit,
    }
  }
})
</script>

<style lang="scss">
.page-header {
  // background: #fafafa;

  .page-header-content {
    position: relative;
    max-width: var(--page-width);
    margin: 0 auto;
    padding: 10px 0 40px 0;

    h2 {
      font-size: 36px;
      line-height: 56px;
      color: #1a1a26;
    }

    p {
      font-size: 16px;
      line-height: 24px;
      color: var(--c-text-light-2);
    }

    .button-show {
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 30px;
      color: white;

      position: absolute;
      bottom: -25px;
      cursor: pointer;
      right: -25px;
      background: var(--accent-color);
      border-radius: 50%;
      width: 50px;
      height: 50px;
      transition: all 0.3s ease-in-out;
    }

    .button-close {
      transform: rotate(-45deg);
    }
  }
}
</style>

<style lang="scss" scoped>
.zone-container {
  // padding-top: var(--header-height);
  width: 100%;
}

.commit-box {
  max-width: var(--page-width);
  margin: 80px auto 40px auto;
  user-select: none;

  display: grid;
  grid-template-columns: auto 120px;
  grid-template-rows: 60px auto 60px;

  border: 1px solid #aaa;
  border-radius: 8px;
  padding: 16px 20px;

  animation: scale-in-tr 0.3s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;

  .emoji-selector {
    height: 40px;
    display: flex;
    padding-top: 10px;
    div {
      margin-right: 10px;
      font-size: larger;
      cursor: pointer;
      transition: all 0.1s ease-in-out;
    }
    
    div.selected {
      position: relative;
      transform: translateY(-8px);

      &::before {
        content: "";
        position: absolute;
        bottom: -4px;
        // width: 100%;
        left: 8px;
        right: 8px;
        height: 4px;
        border-radius: 2px;
        background: var(--accent-color);
      }
    }
  }

  input {    
    width: 100%;
    border: none;
    height: 30px;
    margin-top: 10px;
    padding: 0 8px;
    border: 1px dashed #aaa;
    border-radius: 4px;

    &:focus {
      border: 1px solid #666;
      outline: none;
    }

  }

  textarea {
    grid-column: span 2;
    padding: 12px 8px;
    font-size: 16px;
    border: 1px dashed #aaa;
    border-radius: 4px;
    resize: vertical;
    height: 210px;

    &:focus {
      outline: none;
      border: 1px solid #666;
    }
  }

  & > span {
    margin: 28px 0;
    font-size: 12px;
    color: #999;
  }

  button {
    height: 40px;
    margin-top: 15px;
    background: #3fbb82;
    color: white;
    cursor: pointer;
    border: none;
    border-radius: 4px;
    letter-spacing: 8px;
    transition: box-shadow 0.3s ease-in-out;

    &:hover {
      box-shadow: 0 0 0 4px #dbffef
    }

    &:focus {
      box-shadow: 0 0 0 4px #a4f5d0;
      border: none;
      outline: none;
    }

    &:disabled {
      background: #919191;
      cursor: not-allowed;
      box-shadow: 0 0 0 0 #dbffef
    }
  }
}


.posts {
  max-width: var(--page-width);
  margin: 80px auto;
  width: 100%;
  position: relative;
  user-select: none;
  // &::before {
  //   content: '';
  //   width: 2px;
  //   height: 100%;
  //   background: var(--border-color-light);
  //   position: absolute;
  // }

  .post-card {
    margin-bottom:2.5rem;
    border-radius: 3px;
    // padding-left: 2rem;
    animation: swing-in-top-fwd 0.3s cubic-bezier(0.175, 0.885, 0.320, 1.275) both;
    // &::before {
    //   z-index: 3;
    //   content: '';
    //   position: absolute;
    //   left: -6px;
    //   background: #999;
    //   height: 14px;
    //   margin-top: 11px;
    //   border-radius: 100%;
    //   width: 14px;
    //   border: 2px solid var(--border-color-light);
    // }

    &__head {
      position: relative;
      padding: 0.5rem;
      // background-color: var(--border-color-light);
      border: 1px solid var(--border-color-light);
      border-bottom-width: 0;
      border-radius: 4px 4px 0 0;
      // &::before {
      //   position: absolute;
      //   right: 100%;
      //   content: "";
      //   width: 0;
      //   height: 0;
      //   border-style: solid;
      //   border-width: 10px 18px 10px 0;
      //   border-width: 10px 15px 10px 0;
      //   border-color: transparent var(--border-color-light) transparent transparent;
      // }
    }

    &__body {
      border: 1px solid var(--border-color-light);
      border-radius: 0 0 4px 4px;
      letter-spacing: 1px;
      padding: 0 1rem;

      pre {
        white-space: pre-wrap;
        word-wrap: break-word;
        line-height: 1.7;
        background: none;
        color: var(--c-text-light-3);
        padding: 0;
      }
    }

    &__status {
      margin: 0 0.5rem;
    }

    &__date {
      margin: 0 0.5rem;
      font-weight: 500;
    }
  }

  .btn-love {
    position: absolute;
    right: 0;
    top: -10px;
    display: inline-block;
    background: url(https://xerrors.oss-cn-shanghai.aliyuncs.com/blog/20200222/xHqDqd9ROBhI.png) 0 0 no-repeat;
    background-size: 2900%;
    height: 60px;
    cursor: pointer;
    width: 60px;
  }

  .btn-love.love-active{
    -webkit-animation: heart-burst steps(28) 0.8s 1 both;
            animation: heart-burst steps(28) 0.8s 1 both;
  }
}

/* ----------------------------------------------
 * Generated by Animista on 2021-2-8 16:9:41
 * Licensed under FreeBSD License.
 * See http://animista.net/license for more info. 
 * w: http://animista.net, t: @cssanimista
 * ---------------------------------------------- */

/**
 * ----------------------------------------
 * animation swing-in-top-fwd
 * ----------------------------------------
 */
@keyframes swing-in-top-fwd {
  0% {
    transform: rotateX(-100deg);
    transform-origin: top;
    opacity: 0;
  }
  100% {
    transform: rotateX(0deg);
    transform-origin: top;
    opacity: 1;
  }
}

@-webkit-keyframes heart-burst {
  0% {
    background-position: left;
  }
  100% {
    background-position: right;
  }
}

@keyframes heart-burst {
  0% {
    background-position: left;
  }
  100% {
    background-position: right;
  }
}

@keyframes scale-in-tr {
  0% {
    transform: scale(0);
    transform-origin: 100% 0%;
    opacity: 1;
  }
  100% {
    transform: scale(1);
    transform-origin: 100% 0%;
    opacity: 1;
  }
}


</style>