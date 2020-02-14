<template>
  <!-- 文章列表展示区域 -->
  <div class="scroll-wrapper">
    <!-- v-model="isLoading" 设置下拉动画效果是否结束的 -->
    <!-- @refresh="onRefresh 鼠标左键下拉动作触发的事件-->
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh" success-text="ε＝ε＝ε＝(#>д<)ﾉ累死我了">
      <!-- 文章上拉列表 -->
      <!-- v-model="loading" 设置加载动画效果的 -->
      <!-- :finished="finished" 是否停止加载  false继续加载，true时停止加载-->
      <!-- finished-text="没有更多了" -->
      <!-- @load="onLoad" 加载数据的回调事件，页面初次载入的时候会自动触发 -->
      <!-- van-cell单元格组件，内容独占一格显示 -->
      <!-- title设置当前单元格的标题的 -->
      <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
        <!-- <van-cell v-for="item in articleList" :key="item.art_id.toString()" :title="item.title" /> -->
        <van-cell v-for="item in articleList" :key="item.art_id.toString()" :title="item.title">
          <template slot="label">
            <van-grid :border="false" v-if="item.cover.type>0" :column-num="item.cover.type">
              <van-grid-item v-for="(item2,k2) in item.cover.images" :key="k2">
                <van-image width="90" height="90" :src="item2" />
              </van-grid-item>
            </van-grid>
            <p>
              <span>作者:{{item.aut_name}}</span>
              &nbsp;
              <span>评论 :{{item.comm_count}}</span>
              &nbsp;
              <span>时间:{{item.pubdate}}</span>
              &nbsp;
            </p>
          </template>
        </van-cell>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
//导入获得文章的api函数
import { apiArticleList } from "@/api/article";
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
      // 下拉刷新
      isLoading: false, //下拉动画是否显示的开关
      list: [], //接受加载好的数据的
      loading: false, //设置加载中。。。动画是否显示，默认不显示（加载的时候设置为true，加载完毕为false）
      finished: false, //是否停止的标志，如果后端没有数据显示了，就设置为真，
      // 声明一个时间戳成员，用于获取文章使用
      ts: Date.now(),
      // 当前频道文章列表信息
      articleList: []
    };
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
    // 下拉刷新
    onRefresh() {
      setTimeout(() => {
        this.$toast.success("虽然很累。但是还是帮你刷新下了哦 (*╹▽╹*)");
        this.isLoading = false; // 下拉动画消失
        this.onLoad(); // 触发请求上拉动作
      }, 1000);
    },
    async getArticleList() {
      const result = await apiArticleList({
        channel_id: this.channelID, //频道id
        timestamp: this.ts //时间戳
      });
      // this.articleList = result.results;
      // 把获得好的文章列表返回,给onLoad使用
      return result;
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
