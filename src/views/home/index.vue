<template>
  <div class="container">
    <!-- 频道展示区域 -->
    <van-tabs v-model="activeChannelIndex">
      <!--给频道按钮设置单击click事件-->
      <!-- 命名插槽 -->
      <!-- @click="showChannel=true"设置频道弹出层显示 -->
      <div slot="nav-right" class="channel-more" @click="showChannel=true">
        <van-icon name="wap-nav" />
      </div>
      <!--对频道做遍历展示-->
      <van-tab :title="item.name" v-for="item in channelList" :key="item.id">
        <!-- 把频道id传递给子组件 -->
        <com-article :channelID="item.id"></com-article>
      </van-tab>
    </van-tabs>
    <!-- 弹出层的组件 -->
    <!-- 传递控制弹出层的显示与隐藏，以及我的频道展示，当前激活选中的频道 -->
    <com-channel v-model="showChannel" :channelList="channelList" :activeChannelIndex="activeChannelIndex"></com-channel>
  </div>
</template>
<script>
//导入api方法
import { apiChannelList } from "@/api/channel";
//导入文章列表组件模块
import ComArticle from "./components/com-article";
// 导入弹出层组件模块
import ComChannel from "./components/com-channel";
export default {
  name: "home-index",
  data() {
    return {
      channelList: [], //接收频道列表
      activeChannelIndex: 0, //激活频道的下标
      downSuccessText: "", // 下拉加载完毕提示信息
      isLoading: false, //下拉动画是否显示的开关
      showChannel: false, // 频道操作组件显示标志
      channelShow: false
    };
  },
  components: {
    ComArticle,
    ComChannel
  },
  created() {
    this.getChannelList();
  },
  methods: {
    async getChannelList() {
      const result = await apiChannelList();
      this.channelList = result.channels;
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
/*给 更多 频道设置样式*/
.channel-more {
  position: fixed;
  right: 0;
  background-color: white;
  line-height: 88px;
  height: 88px;
  width: 90px;
  text-align: center;
  font-size: 40px;
}
/*频道列表*/
.van-tabs {
  /deep/ .van-tabs__wrap {
    width: 90%; /*设置频道列表最大宽度，可以避免最后一个频道被按钮覆盖住*/
  }
}
</style>
