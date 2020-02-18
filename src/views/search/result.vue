<template>
  <div class="container">
    <van-nav-bar title="搜索结果" fixed left-arrow @click-left="$router.back()" />
    <!-- 上拉加载更多效果 -->
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
      <van-cell v-for="item in searchList" :key="item.art_id.toString()" :title="item.title" />
    </van-list>
  </div>
</template>
<script>
// 引入搜索结果api接口
import { apiSearchList } from "@/api/search";
export default {
  name: "search-result",
  computed: {
    // 获得路由参数q，使得组件内部可以通过 this.q 的简便方式获得路由参数
    q: function() {
      // q是路由参数的名称，通过下面的方法可以获取到
      return this.$route.params.q;
    }
  },
  data() {
    return {
      // 瀑布相关
      // list: [],
      loading: false,
      finished: false,
      page: 1, //页码
      per_page: 10, //每页条数
      searchList: [] // 储存搜索结果
    };
  },
  methods: {
    // 瀑布加载
    async onLoad() {
      await this.$sleep(1000); // 暂停1s，不要太着急加载，延迟器
      // 根据关键字和页码以及每页条数获取数据
      // apiSearchList里的参数是接口文档中规定的
      let result = await apiSearchList({
        q: this.q,
        page: this.page,
        per_page: this.per_page
      });
      // 如果result里面有数据的话
      if (!result.results.length) {
        // 数据全部加载完成
        this.finished = true; //停止瀑布
        return false; //停止代码执行
      }
      // 把获取到的数据追加给searchList
      this.searchList.push(...result.results);
      // 加载状态结束
      this.loading = false;
      // 页码累加
      this.page++;
    }
  }
};
</script>

<style lang="less" scoped>
.container {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  box-sizing: border-box;
  .van-list {
    flex: 1;
    margin-top: 92px;
  }
}
</style>
