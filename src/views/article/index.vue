<template>
  <div class="container">
    <!--设置fixed属性，使得头部固定-->
    <van-nav-bar fixed left-arrow @click-left="$router.back()" title="文章详情"></van-nav-bar>

    <div class="detail">
      <h3 class="title">{{article.title}}</h3>
      <div class="author">
        <van-image
          round
          width="1rem"
          height="1rem"
          fit="fill"
          src="https://img.yzcdn.cn/vant/cat.jpeg"
        />
        <div class="text">
          <p class="name">{{article.aut_name}}</p>
          <p class="time">{{article.pubdate | formatTime}}</p>
        </div>
        <!-- is_followed 为true表示已关注该用户 false表示未关注 -->
        <!-- :loading="followLoading" 提示按钮有加载效果 -->
        <van-button
          round
          size="small"
          @click="followMe()"
          :loading="followLoading"
          :type="article.is_followed?'default':'info'"
        >{{article.is_followed?'取消关注':'+ 关注'}}</van-button>
      </div>
      <div class="content">
        <p v-html="article.content"></p>
      </div>
      <div class="zan">
        <van-button
          round
          size="small"
          :class="{active:article.attitude===1}"
          plain
          icon="like-o"
          style="margin-right:8px;"
        >点赞</van-button>
        <van-button
          round
          size="small"
          :class="{active:article.attitude===0}"
          plain
          icon="delete"
        >不喜欢</van-button>
      </div>
      <!-- 评论组件-->
      <com-comment></com-comment>
    </div>
  </div>
</template>
<script>
// 关注相关api方法导入
import { apiFollow, apiUnFollow } from "@/api/user.js";
import { apiArticleDetail } from "@/api/article"; // 导入api方法
// 引入评论组件
import ComComment from "./components/com-comment.vue";
export default {
  name: "Article",
  data() {
    return {
      followLoading: false, // 关注动作加载标志
      article: {} // 文章详情
    };
  },
  components: {
    ComComment, //简易成员赋值
  },
  computed: {
    // 简化aid路由参数获取
    aid: function() {
      return this.$route.params.aid;
    }
  },
  created() {
    // 调用
    this.getArticleById()
  },
  methods: {
    // 获得文章
    async getArticleById() {
      let rst = await apiArticleDetail(this.aid);
      this.article = rst;
    },
    // 关注 或 取消关注
    async followMe() {
      this.followLoading = true;

      await this.$sleep(800); // 暂停一会

      if (this.article.is_followed) {
        // 取消关注
        try {
          await apiUnFollow(this.article.aut_id);
        } catch (err) {
          console.dir(err);
        }
        this.article.is_followed = false; // 同步更新状态
      } else {
        // 关注
        await apiFollow(this.article.aut_id);
        this.article.is_followed = true; // 同步更新状态
      }
      this.followLoading = false;
    },
    // 获得文章
    async getArticleById() {
      let rst = await apiArticleDetail(this.aid);
      this.article = rst;
    }
  }
};
</script>
<style scoped lang='less'>
/*设置外边距，使得文章的标题显示出来*/
.detail {
  margin-top:92px;
  }
.container {
  height: 100%;
  overflow-y: auto;
  box-sizing: border-box;
}
.detail {
  padding: 0 20px 88px;
  .title {
    font-size: 36px;
    line-height: 2;
  }
  .zan {
    text-align: center;
    padding: 20px 0;
    .active {
      border-color: red;
      color: red;
    }
  }
  .author {
    padding: 20px 0;
    display: flex;
    position: sticky;
    background-color: #fff;
    top: 92px;
    z-index: 2;
    .text {
      flex: 1;
      padding-left: 20px;
      line-height: 1.5;
      .name {
        font-size: 14px;
        margin: 0;
      }
      .time {
        margin: 0;
        font-size: 12px;
        color: #999;
      }
    }
  }
  .content {
    padding: 40px 0;
    overflow: hidden;
    white-space: pre-wrap;
    word-break: break-all;
    p {
      font-size: 28px;
    }
    /deep/ img {
      max-width: 100%;
      background: #f9f9f9;
    }
    /deep/ code {
      white-space: pre-wrap;
    }
  }
}
</style>
