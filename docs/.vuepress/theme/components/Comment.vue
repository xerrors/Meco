<template>
  <div :class="{ 'comment-box': true, 'hidden-comment': commenter.hidden }">
    <div class="input-area">
      <div class="info-inputs">
        <input
          class="info-name"
          placeholder="Name"
          spellcheck="false"
          v-model="commenter.params.reviewer"
        />
        <input
          class="info-email"
          placeholder="Mail"
          spellcheck="false"
          v-model="commenter.params.reviewer_mail"
        />
      </div>
      <textarea
        maxlength="1024"
        rows="8"
        placeholder="Comment text."
        spellcheck="false"
        v-model="commenter.content"
      ></textarea>
    </div>
    <div class="action-btns">
      <button class="btn-like" @click="commenter.addLike">鼓励一下</button>
      <button class="btn-close" @click="commenter.hiddenPanel">收起</button>
      <button
        class="btn-comment"
        @click="commenter.showCommentBox"
        :loading="commenter.loading && !commenter.hidden"
      >
        评论一下
      </button>
    </div>
  </div>
  <!-- 评论详情 -->
  <div class="comments">
    <div v-for="msg in commentList.comments" :key="msg.id" class="comment-card">
      <img class="comment-icon" :src="randomAvatar(msg.reviewer)">
      <div style="width: 100%;">
        <div class="msg-card">
          <div class="comment-header">
            <span class="comment-header-name">
              <a v-if="msg.reviewer_mail" :href="'mailto:'+msg.reviewer_mail">
                {{ msg.reviewer }}
              </a>
              <span v-else>
                {{ msg.reviewer }}
              </span>
            </span>
            <span class="comment-header-date">{{ msg.date }}</span>
            <button
              class="comment-header-reply"
              @click="commenter.reply(msg.id, msg.reviewer)"
            >
              回复
            </button>
          </div>
          <div
            class="content"
            style="text-align: justify; text-justify: inter-ideograph"
          >
            <pre><p>{{ msg.content }}</p></pre>
          </div>
        </div>
        <!-- 追评 -->
        <div
          v-for="follow_msg in msg.follows"
          :key="follow_msg.id"
          class="follow-comment msg-card"
        >
          <div class="comment-header">
            <span class="comment-header-name">
              <a v-if="follow_msg.reviewer_mail" :href="'mailto:'+follow_msg.reviewer_mail">
                {{ follow_msg.reviewer }}
              </a>
              <span v-else>
                {{ follow_msg.reviewer }}
              </span>
            </span>
            <span class="comment-header-text"> 回复 </span>
            <span class="comment-header-name">{{ follow_msg.follow_name }}</span>
            <span class="comment-header-date">{{ follow_msg.date }}</span>
            <button
              class="comment-header-reply"
              @click="commenter.reply(msg.id, follow_msg.reviewer)"
            >
              回复
            </button>
          </div>
          <div
            class="content"
            style="text-align: justify; text-justify: inter-ideograph"
          >
            <pre><p>{{ follow_msg.content }}</p></pre>
          </div>
        </div>
        <div class="comment-box reply-box" v-if="commenter.params.follow_id == msg.id">
          <div class="input-area">
            <div class="info-inputs">
              <input
                class="info-name"
                placeholder="Name"
                spellcheck="false"
                v-model="commenter.params.reviewer"
              />
              <input
                class="info-email"
                placeholder="Mail"
                spellcheck="false"
                v-model="commenter.params.reviewer_mail"
              />
            </div>
            <textarea
              maxlength="1024"
              rows="8"
              placeholder="Comment text."
              spellcheck="false"
              v-model="commenter.content"
            ></textarea>
          </div>
          <div class="action-btns">
            <button class="btn-close" @click="commenter.cancelReply">取消</button>
            <button
              class="btn-comment"
              @click="commenter.handelComment"
              :loading="commenter.loading"
            >
              发表
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import { message } from "ant-design-vue";
import { onMounted, reactive, ref } from "vue";
import { formatTime, parseTime } from "@src/utils/format";
import { usePageFrontmatter } from '@vuepress/client';

import axios from "axios";

export default {
  name: "server",
  setup() {
    const frontMatter = usePageFrontmatter();

    let path = ref(frontMatter.value.permalink);

    if (path.value[0] == '/') {
      path.value = path.value.slice(1)
    }
    if (path.value[path.value.length-1] == '/') {
      path.value = path.value.slice(0, -1)
    }

    let commenter = reactive({
      hidden: true,
      loading: false,
      params: {
        path: path.value,
        reviewer: "",
        reviewer_mail: "",
        follow_id: "",
        follow_name: "",
      },
      content: "",
      showPanel: () => (commenter.hidden = false),
      hiddenPanel: () => (commenter.hidden = true),
      showCommentBox: () => {
        if (commenter.hidden) {
          commenter.hidden = false;
          // 判断之前是否是追评
          if (commenter.params.follow_id) {
            commenter.params.follow_id = "";
            commenter.params.follow_name = "";
            commenter.content = "";
          }
        } else {
          commenter.handelComment();
        }
      },
      handelComment: () => {
        if (commenter.content.length == 0) {
          // message.error("请填写内容");
          alert("请填写内容");
        } else if (!commenter.params.reviewer) {
          // message.info("请问怎么称呼呢？");
          alert("请问怎么称呼呢？");
        } else {
          commitComment();
        }
      },
      addLike: () => {
        new Promise((resolve, reject) => {
          axios({
            url: "https://xerrors.fun:5000/api/articles/like",
            method: "post",
            params: {
              path: commenter.params.path,
            },
          })
            .then((res) => {
              // message.success(res.data.message);
              alert(res.data.message);
              resolve(res);
            })
            .catch((err) => {
              reject(err);
            });
        });
      },
      reply: (id, name) => {
        commenter.hidden = true;
        if (id != commenter.params.follow_id) {
          commenter.content = "";
          commenter.params.follow_id = id;
          commenter.params.follow_name = name;
        }
      },
      cancelReply: () => {
        commenter.params.follow_id = "";
      },
    });

    let commentList = reactive({
      comments: [],
      getComments: () => {
        new Promise((resolve, reject) => {
          axios({
            url: "https://xerrors.fun:5000/api/articles/comment",
            method: "get",
            params: {
              path: path.value,
            },
          })
            .then((res) => {
              commentList.comments = praseComments(res.data.data);
            })
            .catch((err) => {
              console.log(err);
            });
        });
      },
    });

    // 解析服务器传回来的评论数据并进行初步处理
    const praseComments = (comments) => {
      // console.log(comments[0].content)
      let comment_groups = [];
      comments.sort((a, b) => Number(a.id) - Number(b.id));
      for (var i in comments) {
          
        // console.log(comments[i].content)
        comments[i].date = formatTime(new Date(comments[i].date));
        if (!comments[i].follow_id) {
          comments[i].follows = [];
          comment_groups.push(comments[i]);
        } else {
          for (var cmgs in comment_groups) {
            if (comment_groups[cmgs].id == comments[i].follow_id) {
              comment_groups[cmgs].follows.push(comments[i]);
              break;
            }
          }
        }
      }
      comment_groups.sort((a, b) => Number(b.id) - Number(a.id));
      return comment_groups;
    };

    // 提交评论表单
    const commitComment = () => {
      // 将用户输入的用户名以及邮箱保存在 localstorage 里面
      window.localStorage.setItem("reviewer", commenter.params.reviewer);
      window.localStorage.setItem("reviewer_mail", commenter.params.reviewer_mail);
      commenter.loading = true;
      new Promise((resolve, reject) => {
        axios({
          url: "https://xerrors.fun:5000/api/articles/comment",
          method: "post",
          params: commenter.params,
          data: commenter.content,
          headers: {
            "Content-Type": "text/plain",
          },
        })
          .then((res) => {
            commentList.getComments();
            commenter.content = "";
            commenter.loading = false;
            commenter.params.follow_id = "";
            resolve(res);
          })
          .catch((err) => {
            console.log(err);
            commenter.loading = false;
            reject(err);
          });
      });
    };

    // 此哈希函数来源于提问的解答：
    // https://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript
    function customHash (str) {
      var hash = 0, i, chr;
      for (i = 0; i < str.length; i++) {
        chr   = str.charCodeAt(i);
        hash  = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
      }
      return hash;
    }
    
    // https://tools.prodless.com/avatar
    // 此处使用了网友的随机头像服务，由于相同的链接会导致浏览器只加载一次资源，
    // 所以使用评论的昵称的哈希值转化为颜色的16进制，这样就可以获取不同的 uri 了，
    // 同时也解决的相同的昵称不一样头像的问题。
    const randomAvatar = (name) => {
      const color = Math.abs(customHash(name)).toString(16).slice(2).toUpperCase();
      return "https://api.prodless.com/avatar.png?size=40&backgroundColor=f0f2f4&color=" + color;
    }

    onMounted(() => {
      commentList.getComments();

      // 从 localstorage 获取信息
      if (window.localStorage.getItem("reviewer")) {
        commenter.params.reviewer = window.localStorage.getItem("reviewer");
      }
      if (window.localStorage.getItem("reviewer_mail")) {
        commenter.params.reviewer_mail = window.localStorage.getItem("reviewer_mail");
      }
    });

    return {
      path,
      commenter,
      commentList,
      randomAvatar,
    };
  },
};
</script>

<style lang="scss" scoped>
.comment-box {
  margin-top: 50px;
  padding: 4px 12px 16px 12px;
  border: 1px solid #efefef;
  border-radius: 8px;

  .input-area {
    background: white;
    border-radius: 8px;

    textarea {
      width: 100%;
      border: none;
      padding: 12px 4px;
      height: auto;
      vertical-align: bottom;
      box-shadow: none;
      font-size: 14px;
      // line-height:10px;

      &:focus {
        outline: none;
      }
    }

    .info-inputs {
      width: 100%;
      display: flex;
      height: 50px;
      input {
        // padding-left: 20px;
        border: none;
        border-radius: 0;
        padding: 8px 4px;
        flex-grow: 1;
        border-bottom: 1px dashed #dedede;

        &:focus {
          border-color: #d7191a;
          outline: none;
        }
      }
    }
  }

  .action-btns {
    display: flex;
    justify-content: space-between;

    button {
      background: rgba(255, 255, 255, 0.7);
      padding: 8px 12px;
      color: white;
      margin-top: 20px;
      border: 1px solid white;
      margin-right: 16px;
      border-radius: 4px;
      cursor: pointer;
      outline: none;
    }

    button.btn-comment {
      margin-right: 0;
      background: #3fbb82;
    }

    // button:not()
    button.btn-like {
      background: #eb3941;
    }

    button.btn-close {
      background: none;
      justify-self: flex-end;
      margin-left: auto;
      border: none;
      color: #1a1a26;

      &:focus {
        outline: none;
      }
    }
  }
}

// 收起之后
.comment-box.hidden-comment {
  border: none;
  padding: 0;

  .btn-close {
    display: none;
  }
}

.hidden-comment {
  .input-area {
    display: none;
  }
  .action-btns {
    justify-content: flex-start;

    .btn-comment {
      background: rgba(255, 255, 255, 0.7);
    }
  }
}

.reply-box {
  margin-top: 10px;
}

.comments {
  // font-family: none;
  margin-top: 150px;
}

.comment-card {
  width: 100%;
  margin: 40px 0;
  border-radius: 8px;
  display: flex;

  .comment-icon {
    width: 40px;
    height: 40px;
    margin-right: 12px;
    border-radius: 4px;
  }

  .msg-card {
    .comment-header {
      height: 1.5rem;
      font-size: 14px;
      &-name {
        color: #1a1a26;
        font-weight: bold;
        letter-spacing: 2px;
        // border-bottom: 1px dashed red;

        a {
          color: inherit;
        }
      }
      &-date {
        color: #666;
        font-size: 12px;
        margin-left: 10px;
        display: none;
      }
      &-reply {
        display: none;
      }
      &-text {
        color: #999;
      }
    }

    .content {
      background: #f9fbfe;
      padding: 2px 16px;
      color: #666;
      border-radius: 0 12px 12px 12px;
      width: fit-content;
      line-height: 1.7;
      font-size: 1rem;
      letter-spacing: 1px;

      pre {
        white-space: pre-wrap;
        word-wrap: break-word;
        margin: 10px 0;

        p {
          margin: 10px 0;
        }
      }
    }
  }

  &:hover {
    .comment-header-date {
      display: inline-block;
    }
  }

  .msg-card:hover {
    .comment-header-reply {
      display: inline-block;
      animation: fade-in-bottom 0.1s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;

      float: right;
      padding-left: 10px;
      background: none;
      border: none;
      height: auto;
      transition: all 0.3s ease-in-out;
      cursor: pointer;

      &:focus {
        outline: none;
      }
    }
  }

  .follow-comment {
    margin-top: 20px;
  }
}

/* ----------------------------------------------
 * Generated by Animista on 2021-2-7 21:36:13
 * Licensed under FreeBSD License.
 * See http://animista.net/license for more info. 
 * w: http://animista.net, t: @cssanimista
 * ---------------------------------------------- */

/**
 * ----------------------------------------
 * animation fade-in-bottom
 * ----------------------------------------
 */
@keyframes fade-in-bottom {
  0% {
    transform: translateY(50px);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}



</style>