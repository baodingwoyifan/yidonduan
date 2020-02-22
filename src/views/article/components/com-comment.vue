<template>
  <div class="comment">
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
      <!--注意：com_id是数组格式信息，需要调用toString()变为字符串，否则vue会报错-->
      <!-- commentList遍历获取到的评论信息 -->
      <!-- :key="item.com_id.toString()" 就是评论id -->
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
          <!-- plain设置为朴素按钮，每有背景颜色 -->
          <!-- type="item.is_liking?'danger':'info'"(三元表达式) 根据is_liking切换按钮颜色 -->
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
            <!-- 时间需要使用过滤器转换一下 -->
            <span>{{item.pubdate | formatTime}}</span>
            ·
            <!--给回复按钮声明单击事件，传递评论id-->
            <span @click="openReply(item.com_id.toString())">{{item.reply_count}}&nbsp;回复</span>
          </p>
        </div>
      </van-cell>
    </van-list>
    <!-- 回复区域 -->
    <!-- 弹出层组件 -->
    <van-popup v-model="showReply" position="bottom" :style="{ height: '80%' }" round>
      <!-- 瀑布加载效果 -->
      <van-list
        v-model="reply.loading"
        :finished="reply.finished"
        finished-text="没有更多了"
        @load="onLoadReply"
      >
        <!-- 对获得到的回复信息做遍历展示 -->
        <van-cell v-for="item in replyList" :key="item.com_id.toString()">
          <!-- 作者头像 -->
          <div slot="icon">
            <img class="avatar" :src="item.aut_photo" alt />
          </div>
          <!-- 作者名称 -->
          <div slot="title">
            <span>{{item.aut_name}}</span>
          </div>
          <!-- 评论内容和时间 -->
          <div slot="label">
            <p>{{item.content}}</p>
            <p>
              <span>{{item.pubdate|formatTime}}</span>
            </p>
          </div>
        </van-cell>
      </van-list>
    </van-popup>
    <!-- 添加评论或回复的小构件 -->
    <span class="reply-container van-hairline--top">
      <!-- .trim去除两侧空格 -->
      <van-field v-model.trim="contentCorR" placeholder="写评论或回复...">
        <van-loading v-if="submitting" slot="button" type="spinner" size="16px"></van-loading>
        <span class="submit" v-else slot="button" @click="add">{{this.showReply?'写评论':'回复'}}</span>
      </van-field>
    </span>
  </div>
</template>
  
<script>
// 获取文章评论api
import { apiCommentList } from "@/api/comment.js";

// 获取评论回复api、添加评论/回复（apiAddCorR）
import { apiReplyList, apiAddCorR } from "@/api/reply.js";
export default {
  name: "ComComment",
  data() {
    return {
      replyList: [], // 回复列表
      replyID: null, // 回复id
      showReply: false, // 回复弹出层
      // 控制回复瀑布相关
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
    async onLoadReply() {
      // 暂停0.8秒
      await this.$sleep(800);

      let result = await apiReplyList({
        commentID: this.nowComID,
        replyID: this.replyID
      });
      // console.log(result);

      // 加载动画消失
      this.reply.loading = false;

      // 数据加载完成
      if (result.results.length === 0) {
        this.reply.finished = true;
        return false;
      }
      this.replyList.push(...result.results);
      // 接收replyID
      this.replyID = result.last_id;
    },
    // 声明需要的【methods】方法
    // 开启回复弹出框
    // comID: 被激活评论id
    openReply(comID) {
      this.showReply = true; // 显示弹出层
      this.nowComID = comID; // 设置激活评论
      // 恢复
      this.replyList = []; // 清空回复列表
      this.reply.finished = false; // 重置瀑布状态
      this.replyID = null; // 重置分页偏移量
    },
    // 添加 评论 或 回复内容
    //判断是评论信息还是回复信息（根据弹出层是否打开判断是评论还是回复）
    async add() {
      // 没有输入内容，代码停止执行
      if (!this.contentCorR) return false;
      // 开启提交中动画效果（转圈效果）
      this.submitting = true;

      // 暂停0.8秒，延迟器
      await this.$sleep(800);

      if (this.showReply) {
        // A. 回复
        let result = await apiAddCorR({
          target: this.nowComID,//当前被激活的
          content: this.contentCorR,
          art_id: this.aid
        });
        // 在回复列表顶部追加  回复信息(新回复信息置顶显示)
        this.replyList.unshift(result.new_obj);
        // 找到当前回复的评论，把数据加一即可
        //对回复的数量增加
        // .find可以冲一个大的对象中，找到某个小对象
        const comment = this.commentList.find(
          item => item.com_id.toString() === this.nowComID
        );
        comment.reply_count++;//回复数量增加
      } else {
        // B. 评论
        // 评论是不需要设置id的，这里就不需要传递id信息了
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
