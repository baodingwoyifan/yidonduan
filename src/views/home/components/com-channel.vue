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
    @close="isEdit=false"
  >
    <div class="channel">
      <div class="channel-head">
        <div>
          <span class="title">我的频道</span>
          <span class="desc">点击进入频道</span>
        </div>
        <div>
          <van-button
            type="danger"
            plain
            size="mini"
            round
            @click="isEdit=!isEdit"
          >{{isEdit?'完成':'编辑'}}</van-button>
        </div>
      </div>
      <!-- 我的频道 部分-->
      <!-- 遍历展示我的频道的列表 -->
      <!-- :style="{color:k===activeChannelIndex?'red':''}"设置当前激活选项的下标高亮显示 -->
      <!-- k就是就是当前的下标 -->
      <!-- 给宫格组件设置点击事件 @click="clkChannel 把当前项目的下标传递进来（k） -->
      <van-grid class="channel-content" :gutter="10" clickable>
        <van-grid-item
          v-for="(item,k) in channelList"
          :key="item.id"
          @click="clkChannel(item.id,k)"
        >
          <!--要想显示插号图标的话， 需要把slot删掉 ，表示span和van-icon是同一个宫格元素-->
          <span class="text" :style="{color:k===activeChannelIndex?'red':''}">{{item.name}}</span>
          <!-- 删除我的频道图标 -->
          <!--显示删除按钮，k!==0 表示“推荐”项目不要设置参数按钮-->
          <!-- 删除我的频道图标 -->
          <!-- class="close-icon" 控制图标显示位置 -->
          <!-- v-show="isEdit && k!==0"控制图标的显示与隐藏 -->
          <!-- @click="userToRest(item.id,k)" 给插号小图标设置点击事件，把当前点击的频道的id和当前频道在channelList中的下标信息在当做参数传递进去 -->
          <van-icon
            class="close-icon"
            name="close"
            v-if="isEdit && k!==0"
            @click="userToRest(item.id,k)"
          />
          <!-- 以上的span和icon都是宫格内容的体现 -->
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
        <!-- 宫格组件添加事件，把被添加的频道当做参数传递进来，（item就是） -->
        <van-grid-item v-for="item in restChannel" :key="item.id" @click="restToUser(item)">
          <div class="info" slot="text">
            <span class="text">{{item.name}}</span>
          </div>
        </van-grid-item>
      </van-grid>
    </div>
  </van-popup>
</template>
<script>
// 导入获取全部列表的api
// import { apiChannelAll } from "@/api/channel.js";
// 导入 apiChannelAdd，导入获取全部列表的api和 添加频道的函数、和删除频道api
import { apiChannelAll, apiChannelAdd, apiChannelDel } from "@/api/channel";
export default {
  name: "ComChannel",
  data() {
    return {
      channelAll: [], // 全部频道
      isEdit: false // 是否进入编辑状态，控制小图标的显示与‘编辑’和’完成‘的切换
    };
  },
  created() {
    // 调用获取全部频道方法
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
    },
    // 添加频道
    restToUser(channel) {
      // 频道数据是通过channelList提供的，我们只需要添加到channelList里就行了
      // channelList是父组件传递进来的，本身是一个数组，这里改变，父组件里的channelList也会感知到，通过计算属性会更新
      //我的频道和全部频道的信息
      // channel被添加的频道参数
      this.channelList.push(channel);
      // 页面一刷新的话频道数据就会消失，我们需要做本地存储持久更新
      // 使用apiChannelAdd方法储存到本地持有化
      apiChannelAdd(channel);
    },
    // 删除频道
    // channelID:被删除频道的id，在小图标中传递进来的（item.id）
    // index:被删除频道的下标序号，在小图标中传递进来的（k）
    userToRest(channelID, index) {
      this.channelList.splice(index, 1); // 通过下标在页面中删除频道信息
      apiChannelDel(channelID); // 调用api方法，实现本地存储的删除
      // 频道前置
      // 判断当前被删除频道如果是最后一个，就把激活项目的下标序号向前移动一位
      // 是修改父组件的activeChannelIndex
      // activeChannelIndex是父组件传递件来的， this.$emit("update：''与父组件中的.sync配合使用
      //  if (this.channelList.length === index) 判断条件：删除以后的数组长度是等于当前频道的下标
      if (this.channelList.length === index) {
        this.$emit("update:activeChannelIndex", this.activeChannelIndex - 1);
      }
    },
    // 激活频道(兼顾删除)
    // channelID: 被单击频道的id，就是icon小图标中的（item.id）
    // index:被激活频道的下标 就是icon小图标中的（k）
    // 我的频道点击之后，在home要显示相关的频道
    clkChannel(channelID, index) {
      // 根据isEdit的值判断是否进入编辑状态，进行删除操作
      // index不能为0，使推荐项目不可以被删除
      if (this.isEdit && index !== 0) {
        // 调用删除方法（把删除频道的id和下标当做参数传递进来）
        this.userToRest(channelID, index);
        // 停止代码执行
        return false;
      }
      // 根据index激活home主页面的频道
      // 如下用法：表示对当前组件名称为 activeChannelIndex 的项目信息进行修改
      // activeChannelIndex 是home中设置sync调用那个项目
      // 即子组件要修改父组件数据，把当前在我的频道中点击的频道信息的下标传递给父组件的activeChannelIndex，控制home页面的频道列表激活
      this.$emit("update:activeChannelIndex", index);
      //  // 弹出层消失
      this.$emit("input", false);
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
