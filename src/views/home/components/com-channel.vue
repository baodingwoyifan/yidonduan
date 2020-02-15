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
        <van-grid-item v-for="item in channelAll" :key="item.id">
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
