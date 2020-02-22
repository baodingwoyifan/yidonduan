<template>
  <div class="container">
    <!-- NavBar 导航栏组件 -->
    <!-- title  	自定义标题 -->
    <!-- fixed 是否固定在顶部 -->
    <!-- left-arrow  是否显示左侧箭头-->
    <!-- @click-left=""	点击左侧按钮时触发 -->
    <van-nav-bar title="搜索结果" fixed left-arrow @click-left="$router.back()" />
    <!-- 上拉加载更多效果 -->
    <!-- List 列表 组件（瀑布流） -->
    <!-- v-model=“” 是否处于加载状态，加载过程中不触发load事件 ，默认值为false -->
    <!-- finished 是否已加载完成，加载完成后不再触发load事件  默认值为false（这里绑定的是data成员，需要设置属性绑定） -->
    <!-- finished-text="没有更多了"  加载完成后的提示文案 -->
    <!-- @load事件    onLoad事件是固定的，在官网找到后，可以根据业务需求修改onLoad方法-->
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad" >
      <!-- Cell 单元格组件 -->
      <!-- title  分组标题，标题内容是根据searchList来的，需要设置属性绑定 -->
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
      loading: false, // 瀑布相关 是否处于加载状态
      finished: false, // 瀑布相关 加载是否完成
      page: 1, //页码
      per_page: 10, //每页条数
      searchList: [] // 储存搜索结果
    };
  },
  methods: {
    // vant官网提供的list（瀑布流）组件事件
    async onLoad() {
      await this.$sleep(1000); // main.js中设置的延迟器
      //调用api方法，根据关键字和页码以及每页条数获取数据
      // apiSearchList里的参数是接口文档中规定的
      let result = await apiSearchList({
        q: this.q, //根据computed计算属性得来的联想数据的关键字
        page: this.page, //当前页码
        per_page: this.per_page //每页显示条数
      });
      // result.results的长度为假的话，执行下面的代码
      //为假，表示返回的result是没有数据的，要停止瀑布流加载效果
      //并停止代码执行
      if (!result.results.length) {
        this.finished = true; //停止瀑布流
        return false; //停止代码执行
      }
      // 把获取到的数据追加给searchList追加（push）
      // (...result.results)展开运算符(...)
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
