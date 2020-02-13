<template>
  <!-- 文章列表展示区域 -->
  <div class="scroll-wrapper">
     <!-- v-model="isLoading" 设置下拉动画效果是否结束的 -->
     <!-- @refresh="onRefresh 鼠标左键下拉动作触发的事件-->
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh" success-text='ε＝ε＝ε＝(#>д<)ﾉ累死我了'>
      <!-- 文章上拉列表 -->
      <!-- v-model="loading" 设置加载动画效果的 -->
      <!-- :finished="finished" 是否停止加载  false继续加载，true时停止加载-->
      <!-- finished-text="没有更多了" -->
      <!-- @load="onLoad" 加载数据的回调事件，页面初次载入的时候会自动触发 -->
      <!-- van-cell单元格组件，内容独占一格显示 -->
      <!-- title设置当前单元格的标题的 -->
      <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
        <van-cell v-for="item in list" :key="item" :title="item" />
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
export default {
  name: "com-article",
  data() {
    return {
      // 下拉刷新
      isLoading: false,//下拉动画是否显示的开关
      list: [], //接受加载好的数据的
      loading: false, //设置加载中。。。动画是否显示，默认不显示（加载的时候设置为true，加载完毕为false）
      finished: false //是否停止的标志，如果后端没有数据显示了，就设置为真，
    };
  },
  methods: {
    onLoad() {
      // 异步更新数据
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
        this.$toast.success ("虽然很累。但是还是帮你刷新下了哦 (*╹▽╹*)");
        this.isLoading = false; // 下拉动画消失
        this.onLoad(); // 获取数据一次
      }, 1000);
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
