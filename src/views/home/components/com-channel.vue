<template>
  <!-- :value="value" -->
  <!-- @input="$emit('input')" -->
  <!-- 上面两个来控制弹出层的显示与隐藏，具体开关是要在父组件中操作的 -->
  <!-- closeable 有关闭图标的属性-->
  <!-- close-icon-position="top-left" 关闭按钮要在左上角显示-->
  <!-- round 圆角 -->
  <!-- position="bottom" 表示弹出层是从底部弹出的 -->
  <van-popup
    :value="value"
    @input="$emit('input', $event)"
    closeable
    close-icon-position="top-left"
    round
    position="bottom"
    :style="{ height: '95%' }"
  >
    <div class="channel">
      <div class="channel-head">
        <div>
          <span class="title">我的频道</span>
          <span class="desc">点击进入频道</span>
        </div>
        <div>
          <van-button type="danger" plain size="mini" round>编辑</van-button>
        </div>
      </div>
      <!-- 我的频道 部分-->
      <!-- 遍历展示我的频道的列表 -->
      <!-- :style="{color:k===activeChannelIndex?'red':''}"设置当前激活选项的下标高亮显示 -->
      <!-- k就是就是当前的下标 -->
      <van-grid class="channel-content" :gutter="10" clickable>
        <van-grid-item v-for="(item,k) in channelList" :key="item.id">
          <span
            class="text"
            slot="text"
            :style="{color:k===activeChannelIndex?'red':''}"
          >{{item.name}}</span>
        </van-grid-item>
      </van-grid>
    </div>

    <div class="channel">
      <div class="channel-head">
        <div>
          <span class="title">频道推荐</span>
          <span class="desc">点击添加频道</span>
        </div>
      </div>
      <!-- 遍历展示所有的频道数据 -->
      <van-grid class="channel-content" :gutter="10" clickable>
        <van-grid-item v-for="item in restChannel" :key="item.id">
          <div class="info" slot="text">
            <span class="text">{{item.name}}</span>
          </div>
        </van-grid-item>
      </van-grid>
    </div>
  </van-popup>
</template>
<script>
import { apiChannelAll } from "@/api/channel.js";
export default {
  name: "ComChannel",
  data() {
    return {
      channelAll: [] // 全部频道
    };
  },
  created() {
    this.getChannelAll();
  },
  //接收父组件的v-model的数据信息，用来控制弹出层的显示与隐藏
  props: {
    value: {
      type: Boolean,
      default: false
    },
    // 接收频道数据
    channelList: {
      type: Array,
      // 通过箭头函数实现设置空数组默认值效果
      // 数组的默认值要通过如下方式设置，vue固定用法
      default: () => []
    },
    // 当前激活选中频道
    activeChannelIndex: {
      type: Number,
      default: 0
    }
  },
  methods: {
    // 获取全部频道
    async getChannelAll() {
      let result = await apiChannelAll();
      this.channelAll = result.channels;
    }
  },
  //计算属性获取我的频道，并过滤掉
  computed: {
    // 从 全部频道 数据里边过滤掉 我的频道
    restChannel: function() {
      // 把“我的频道”的全部id获得到，通过Array
      // map对channelList做遍历，返回一个新数组
      // 元素就是channelList数组各个元素的id,新数组的长度与channelList一样
      const userChannelIds = this.channelList.map(item => {
        return item.id;
      });
      // 遍历全部频道，返回不在“我的频道”出现的频道
    //   对channelAll做过滤，把id值不在数组userChannelIds数组中出现的新数组返回
      const rest = this.channelAll.filter(item => {
        // Array.includes判断是否包含该元素
        return !userChannelIds.includes(item.id);
      });
      // 返回过滤好的剩余的频道
      return rest;
    }
  }
};
</script>

<style lang="less" scoped>
.channel {
  margin-top: 70px;
  .channel-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    .title {
      font-size: 30px;
      margin-right: 5px;
    }
    .desc {
      font-size: 16px;
      color: gray;
    }
  }
  .channel-content {
    .text {
      font-size: 16px;
    }
    .active {
      color: red;
    }
    .close-icon {
      font-size: 20px;
      position: absolute;
      top: -5px;
      right: -5px;
      z-index: 999;
      background-color: #fff;
    }
    .info {
      display: flex;
      align-items: center;
    }
  }
}
</style>
