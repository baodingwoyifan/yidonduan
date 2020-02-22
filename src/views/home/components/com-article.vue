<template>
  <!-- 文章列表展示区域 -->
  <!-- 设置scrool事件 记录滚动条位置 -->
  <div class="scroll-wrapper" @scroll="remember()" ref="myarticle">
    <!-- v-model="isLoading" 设置下拉动画效果是否结束的 -->
    <!-- @refresh="onRefresh 鼠标左键下拉动作触发的事件-->
    <!-- success-duration="1000" 下拉完成后，提示信息在页面的停留时间 -->
    <van-pull-refresh
      v-model="isLoading"
      @refresh="onRefresh"
      :success-text="downSuccessText"
      success-duration="1000"
    >
      <!-- 文章上拉列表 -->
      <!-- v-model="loading" 设置加载动画效果的 -->
      <!-- :finished="finished" 是否停止加载  false继续加载，true时停止加载-->
      <!-- finished-text="没有更多了" -->
      <!-- @load="onLoad" 加载数据的回调事件，页面初次载入的时候会自动触发 -->
      <!-- van-cell单元格组件，内容独占一格显示 -->
      <!-- title设置当前单元格的标题的 -->
      <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
        <!-- <van-cell v-for="item in articleList" :key="item.art_id.toString()" :title="item.title" /> -->
        <!-- cell单元格组件 -->
        <!-- @click="$router.push({name:'article',params:{aid:item.art_id}})"  页面跳转，使得单击文章，跳转到文章详情页面 -->
        <van-cell
          v-for="item in articleList"
          :key="item.art_id.toString()"
          :title="item.title"
          @click="$router.push({name:'article',params:{aid:item.art_id.toString()}})"
        >
          <!-- 通过作用域插槽，体现label的描述信息 -->
          <template slot="label">
            <!-- van-grid宫格组件一行中,通过列的方式设置单元格 -->
            <!-- border设置边框 -->
            <!-- :column-num=设置宫格列的个数 -->
            <!-- v-if="item.cover.type>0" 表示如果有数据的话，下面的组件才会显示 -->
            <van-grid :border="false" v-if="item.cover.type>0" :column-num="item.cover.type">
              <!-- van-grid-item宫格单元 
             内容区域:设置具体内容的
              -->
              <!-- cover.images进行图片信息展示 -->
              <!-- 这里的item2是为了区别上面的item -->
              <!-- 文章列表添加点击事件，跳转到文章详情页 -->
              <!-- @click="$router.push({name:'article',params:{aid:item.art_id}})" 页面跳转，使得单击文章，跳转到文章详情页面  -->
              <van-grid-item
                v-for="(item2,k2) in item.cover.images"
                :key="k2"
                @click="$router.push({name:'article',params:{aid:item.art_id.toString()}})"
              >
                <!-- van-image 
                可以设置宽 高，src图片路径名地址
                -->
                <van-image width="90" height="90" :src="item2" lazy-load />
              </van-grid-item>
            </van-grid>
            <p>
              <!-- </van-icon>图标组件  name来设置显示图标的样式 -->
              <!-- @click="displayDialog(item.art_id.toString())"传递不感兴趣的文章id -->
              <!-- .stop 阻止事件冒泡 -->
              <van-icon
                name="close"
                style="float:right;"
                @click.stop="displayDialog(item.art_id.toString())"
              />
              <span>作者:{{item.aut_name}}</span>
              &nbsp;
              <span>评论 :{{item.comm_count}}</span>
              &nbsp;
              <span>时间:{{item.pubdate | formatTime}}</span>
              &nbsp;
            </p>
          </template>
        </van-cell>
      </van-list>
    </van-pull-refresh>
    <!--关闭-更多动作弹出框-->
    <!-- 组件传值的方法，用v-model控制组件的显示与隐藏 -->
    <!-- @dislikeSuccess="handleDislikeSuccess"父组件设置事件方法，注意事件名称后边没有（），子组件可以调用父组件的方法 -->
    <more-action
      v-model="showDialog"
      :articleID="nowArticleID"
      @dislikeSuccess="handleDislikeSuccess"
    ></more-action>
  </div>
</template>

<script>
//导入获得文章的api函数
import { apiArticleList } from "@/api/article";
//导入弹出框组件模块
import MoreAction from "./com-moreaction";
export default {
  name: "com-article",
  // 接收传递过来的id值
  props: {
    channelID: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      qiantop: 0, //记录滚动条位置
      // 下拉刷新
      isLoading: false, //下拉动画是否显示的开关
      list: [], //接受加载好的数据的
      loading: false, //设置加载中。。。动画是否显示，默认不显示（加载的时候设置为true，加载完毕为false）
      finished: false, //是否停止的标志，如果后端没有数据显示了，就设置为真，
      // 声明一个时间戳成员，用于获取文章使用
      ts: Date.now(),
      // 当前频道文章列表信息
      articleList: [],
      showDialog: false, // 弹出框的显示与隐藏
      nowArticleID: "", // 不感兴趣文章id
      downSuccessText: "" //更新信息提示信息
    };
  },
  components: {
    // 注册弹出框组件
    MoreAction
  },
  activated() {
    if(this.qiantop){
      this.$refs.myarticle.scrollTop=this.qiantop
    }
  },
  // created() {
  //   this.getArticleList();
  // },
  methods: {
    async onLoad() {
      // 异步更新数据
      // 应用延迟器,设置await，使异步变为同步
      await this.$sleep(800);
      // 获取文章数据
      const articles = await this.getArticleList();
      // 判断数据是否获取到
      if (articles.results.length > 0) {
        // 把获得到的文章数据push追加给articleList成员
        this.articleList.push(...articles.results);
        // 更新时间戳
        this.ts = articles.pre_timestamp;
      } else {
        //停止动画效果
        this.finished = false;
      }
      //停止瀑布效果
      this.loading = true;
      setTimeout(() => {
        for (let i = 0; i < 10; i++) {
          this.list.push(this.list.length + 1);
        }
        // 加载状态结束
        this.loading = false;
        // 数据全部加载完成
        if (this.list.length >= 40) {
          this.finished = true;
        }
      }, 500);
    },
    // 下拉刷新载入
    async onRefresh() {
      await this.$sleep(1000); // 暂停1s
      // 获取文章信息
      let articles = await this.getArticleList();
      // 判断数据是否存在
      if (articles.results.length) {
        // 把文章前置追加给articleList
        this.articleList.unshift(...articles.results);
        this.downSuccessText = "加载最新文章成功";
        // 更新时间戳
        this.ts = articles.pre_timestamp;
      } else {
        this.downSuccessText = "已经是最新文章";
      }
      this.isLoading = false; // 暂停拉取
    },
    async getArticleList() {
      const result = await apiArticleList({
        channel_id: this.channelID, //频道id
        timestamp: this.ts //时间戳
      });
      // this.articleList = result.results;
      // 把获得好的文章列表返回,给onLoad使用
      return result;
    },
    /**
     * 显示更多操作对话框
     * artID: 不喜欢文章id
     */
    displayDialog(artID) {
      // 点击之后使弹出框显示
      this.showDialog = true;
      // 目标文章id
      this.nowArticleID = artID;
    },
    //不感兴趣文章的后续处理，从文章列表中把指定的文章删除，目标id就是nowArticleID，
    //根据nowArticleID的数据从articleList中找出所处的下标，findIndex获得指定数组元素的下标
    //item => item.art_id.toString() === this.nowArticleID）找到与nowArticleID相同的数据的下标
    //this.articleList.splice(index, 1);根据下标删除文章
    handleDislikeSuccess() {
      // 获取当前被处理文章在数组中下标
      let index = this.articleList.findIndex(
        item => item.art_id.toString() === this.nowArticleID
      );
      // 在总的文章中把当前文章清除掉
      this.articleList.splice(index, 1);
    },
    remember() {
      this.qiantop = this.$refs.myarticle.scrollTop;
    }
  }
};
</script>

<style lang="less" scoped>
// 给上拉列表设置样式
.scroll-wrapper {
  height: 100%;
  overflow-y: auto;
}
</style>
