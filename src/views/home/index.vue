<template>
  <div class="container">
    <!-- 频道展示区域 -->
    <van-tabs v-model="activeChannelIndex">
      <!--对频道做遍历展示-->
      <van-tab :title="item.name" v-for="item in channelList" :key="item.id">
      <!-- 把频道id传递给子组件 -->
        <com-article :channelID='item.id'></com-article>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
//导入api方法
import { apiChannelList } from "@/api/channel";
import ComArticle from "./components/com-article";
export default {
  name: "home-index",
  data() {
    return {
      channelList: [], //接收频道列表
      activeChannelIndex: 0 //激活频道的下标
    };
  },
  components: {
    ComArticle
  },
  created() {
    this.getChannelList()
  },
  methods: {
    async getChannelList() {
      const result = await apiChannelList()
      this.channelList=result.channels
    }
  }
};
</script>
<style scoped lang='less'>
.van-tabs {
  // 弹性布局
  display: flex;
  // 灵活的项目将垂直显示，正如一个列一样
  flex-direction: column;
  height: 100%;
  /deep/ .van-tabs__content {
    // flex:1;的值是1 1 0%，【父控件有剩余空间占1份放大，父控件空间不足按1缩小，自身的空间大小是0%】
    flex: 1;
    overflow: hidden;
  }
  /deep/ .van-tab__pane {
    height: 100%;
    // 给上拉列表设置样式
    .scroll-wrapper {
      height: 100%;
      overflow-y: auto; //内容过多的话，会出现滚动条
    }
  }
  // 给频道下边沿横向设置样式 颜色
  /deep/ .van-tabs__line {
    background-color: #1989fa;
  }
}
</style>
