<template>
  <div class="comment">
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
      <!--注意：com_id是数组格式信息，需要调用toString()变为字符串，否则vue会报错-->
      <van-cell v-for="item in commentList" :key="item.com_id.toString()">
        <!-- 作者头像 -->
        <div slot="icon">
          <img class="avatar" :src="item.aut_photo" alt />
        </div>
        <!-- 作者名称 -->
        <div slot="title">
          <span>{{item.aut_name}}</span>
        </div>
        <!-- 点赞 -->
        <div slot="default">
          <van-button
            icon="like-o"
            size="mini"
            plain
            type="item.is_liking?'danger':'info'"
          >&nbsp;{{item.like_count}}</van-button>
        </div>
        <!-- 评论内容和时间 -->
        <div slot="label">
          <p>{{item.content}}</p>
          <p>
            <span>{{item.pubdate | formatTime}}</span>
            ·
            <span @click="showReply=true">{{item.reply_count}}&nbsp;回复</span>
          </p>
        </div>
      </van-cell>
    </van-list>
    <!-- 回复区域 -->
    <van-popup v-model="showReply" position="bottom" :style="{ height: '80%' }" round>
      <!-- 瀑布加载效果 -->
      <van-list
        v-model="reply.loading"
        :finished="reply.finished"
        finished-text="没有更多了"
        @load="onLoadReply"
      >
        <van-cell v-for="item in reply.list" :key="item" :title="item">
          <!-- 作者头像 -->
          <div slot="icon">
            <img class="avatar" src="http://toutiao.meiduo.site/Fn6-mrb5zLTZIRG3yH3jG8HrURdU" alt />
          </div>
          <!-- 作者名称 -->
          <div slot="title">
            <span>度娘</span>
          </div>
          <!-- 评论内容和时间 -->
          <div slot="label">
            <p>好厉害呀</p>
            <p>
              <span>2019-12-30 15:15:15</span>
            </p>
          </div>
        </van-cell>
      </van-list>
    </van-popup>
    <!-- 添加评论或回复的小构件 -->
    <span class="reply-container van-hairline--top">
      <van-field v-model.trim="contentCorR" placeholder="写评论或回复...">
        <van-loading v-if="submitting" slot="button" type="spinner" size="16px"></van-loading>
        <span class="submit" v-else slot="button" @click="add">提交</span>
      </van-field>
    </span>
  </div>
</template>
  
<script>
// 获取文章评论api
import { apiCommentList } from "@/api/comment.js";

// 获取评论回复api、添加评论/回复
import { apiReplyList, apiAddCorR } from "@/api/reply.js";
export default {
  name: "ComComment",
  data() {
    return {
      showReply: false, // 回复弹出层
      // 回复瀑布相关
      reply: {
        list: [],
        loading: false,
        finished: false
      },
      commentList: [], // 评论列表
      commentID: null, // 评论ID(评论分页使用)
      // 添加评论或回复
      contentCorR: "", // 评论或回复的内容
      submitting: false, // 添加状态
      list: [],
      loading: false,
      finished: false
    };
  },
  computed: {
    // 简化路由参数获取,获取当前文章id
    aid() {
      return this.$route.params.aid;
    }
  },
  methods: {
    async onLoad() {
      // 暂停0.8秒，设置延迟器
      await this.$sleep(800);
      // 调用api方法
      let result = await apiCommentList({
        articleID: this.aid, //文章id
        commentID: this.commentID //评论id
      });
      // 加载动画消失
      this.loading = false;

      // 数据加载完成
      if (result.results.length === 0) {
        this.finished = true;
        return false;
      }

      this.commentList.push(...result.results);
      // 接收commentID
      this.commentID = result.last_id;
    },
    // 回复瀑布加载
    onLoadReply() {
      // 异步更新数据
      // setTimeout 仅做示例，真实场景中一般为 ajax 请求
      setTimeout(() => {
        for (let i = 0; i < 10; i++) {
          this.reply.list.push(this.reply.list.length + 1);
        }

        // 加载状态结束
        this.reply.loading = false;

        // 数据全部加载完成
        if (this.reply.list.length >= 40) {
          this.reply.finished = true;
        }
      }, 1000);
    },
    // 添加 评论 或 回复
    async add() {
      // 没有输入内容
      if (!this.contentCorR) return false;
      // 开启提交中
      this.submitting = true;

      // 暂停0.8秒
      await this.$sleep(800);

      if (this.nowComID) {
        // A. 回复
        let result = await apiAddCorR({
          target: this.nowComID,
          content: this.contentCorR,
          art_id: this.aid
        });
        // 在回复列表顶部追加  回复信息(新回复信息置顶显示)
        this.replyList.unshift(result.new_obj);
        // 找到当前回复的评论，把数据加一即可
        const comment = this.commentList.find(
          item => item.com_id.toString() === this.nowComID
        );
        comment.reply_count++;
      } else {
        // B. 评论
        let result = await apiAddCorR({
          target: this.aid,
          content: this.contentCorR
        });
        // 在评论顶部追加  评论信息(新评论信息置顶显示)
        this.commentList.unshift(result.new_obj);
      }

      // 清除输入框
      this.contentCorR = "";
      // 结束提交中
      this.submitting = false;
    }
  }
};
</script>

<style lang="less" scoped>
.comment {
  margin-top: 15px;

  .avatar {
    width: 50px;
    height: 50px;
    border-radius: 100%;
    margin-right: 10px;
  }

  /deep/ .van-cell__title {
    .van-cell__label {
      width: 400px;
    }
  }
}

// 添加评论或回复构件
.reply-container {
  position: fixed;
  left: 0;
  bottom: 0;
  height: 88px;
  width: 100%;
  background: #f5f5f5;
  z-index: 9999;

  .submit {
    font-size: 24px;
    color: #3296fa;
  }
}
</style>
