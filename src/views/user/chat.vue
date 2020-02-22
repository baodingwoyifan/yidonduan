<template>
  <!-- 小智同学的页面结构 -->
  <div class="container">
    <van-nav-bar fixed left-arrow @click-left="$router.back()" title="小智同学"></van-nav-bar>
    <div class="chat-list" ref="talkArea">
      <!-- 展示消息 -->
      <div
        class="chat-item"
        :class="[item.name==='xz'?'left':'right']"
        v-for="(item,k) in talks"
        :key="k"
      >
        <van-image fit="cover" round v-if="item.name==='xz'" :src="Maomao" />
        <div class="chat-pao">{{item.msg}}</div>
        <van-image fit="cover" round v-if="item.name==='vip'" :src="userInfo.photo" />
      </div>
    </div>
    <div class="reply-container van-hairline--top">
      <van-field v-model="content" placeholder="说点什么...">
        <van-loading v-if="loading" slot="button" type="spinner" size="16px"></van-loading>
        <span v-else @click="send()" slot="button" style="font-size:12px;color:#999">提交</span>
      </van-field>
    </div>
  </div>
</template>
<script>
// 导入图片
import Maomao from "@/assets/images/maomao.jpg";
//导入获取用户自己信息的api方法
import { apiUserInfo } from "@/api/user.js";
// 导入socket.io
import io from "socket.io-client";
export default {
  name: "user-chat",
  data() {
    return {
      content: "", // 即将发表的聊天内容
      loading: false, // 是否正在提交留言
      Maomao, //猫猫图片信息
      userInfo: {}, //创建临时成员接收信息
      talks: [], //接收小智同学的返回信息，（msg，timestamp）
      socket: null //储存socket对象
    };
  },
  //生命周期函数
  created() {
    // 调用获取自己信息方法
    this.getUserInfo();
    //页面加载好,第一时间连接,方便随时使用
    this.setSocket();
  },
  //生命周期函数
  // 页面销毁之前的钩子函数
  beforeDestory () {
    // 销毁连接
    this.socket.close() // 销毁连接
  },
  methods: {
    async send() {
      // 如果留言框没有数据的话，代码停止执行
      if (!this.content) {
        return false;
      }
      //变为发送留言状态
      this.loading = true;
      // msg 和  timestamp 是服务器端要求的名字
      let obj = {
        name: "vip", // 用户标志
        msg: this.content, // 消息内容
        timestamp: Date.now() // 时间戳给什么 应该给当前的时间戳
      };
      // 把聊天记录追加到talik，响应式的原因，页面及时更新
      this.talks.push(obj);
      // 消息追加完毕以后，滚动条在底部显示
      this.scrollButtom();
      // 清除留言框
      this.content = "";
      // 设置延迟器
      await this.$sleep(800);
      // 发送这条消息到服务端   emit 发送消息 on接收消息
      // 服务器端接收后会向客户端返回对话信息
      this.socket.emit("message", obj); // 发送消息
      //关闭留言状态
      this.loading = false;
    },
    // 获取用户信息
    async getUserInfo() {
      const result = await apiUserInfo();
      // console.log(result);
      this.userInfo = result;
    },
    // socket.io连接方法
    setSocket() {
      // query代表以请求字符串形式传递token参数
      // 请求地址为：http://ttapi.research.itcast.cn/socket.io/?token=xxx
      // 其中的socket.io是内部自动添加的，不用理会
      // this.socket接收返回信息
      // token 传递token信息
      // query的作用会使得参数以‘请求字符串的形式挂接到请求地址的后边’
      // 请求字符串：把参数通过‘？’的形式与请求地址连接，发送到服务器
      this.socket = io("http://ttapi.research.itcast.cn", {
        query: {
          token: this.$store.state.user.token
        }
      });
      //  this.socket.on连接成功后的回调处理
      // io调用时会与服务器端连接，成功后会自动调用如下的connect事件
      this.socket.on("connect", () => {
        // 客户端与服务器连接成功后会自动调用该事件
        // 提示信息
        // console.log("连接成功");
        // 小智先发言，暖下场
        // 给talks追加信息
        // 提示信息
        alert('连接成功')
        this.talks.push({
          msg: "干啥呢老哥，咋这长时间不联系了？",
          timestamp: Date.now(),
          name: "xz"
        }); // name:xz 表示这句话是小智同学说的
      });
      // 服务器端向客户端发送消息时候会自动调用该事件
      // 接收到传递回来的信息
      this.socket.on("message", data => {
        // data:{mas:xxx,timestamp:xxx}
        // this.talks.push({ ...data, name: "xz" });展开运算符
        // 展开后的效果: this.talks.push({ mas:xxx, timestamp:xxx, name: "xz" })
        this.talks.push({ ...data, name: "xz" });
        // 使得滚动条在拖动到聊天内容最底部
        this.scrollButtom();
      });
    },
    //滚动条效果(使得滚动条在最底部显示)
    scrollButtom() {
      // 可以保证，在滚动的时候，数据发生变化，数据更新完以后，视图通过响应式发生改变的时候，调用该方法
      // 滚动条滚动不彻底，还有一个对话内容不显示，
      // 解决方法  this.$nextTick(()=>{}),vue的方法，修改数据后，立即调用该方法。获取更新后的DOM
      this.$nextTick(() => {
        this.$refs.talkArea.scrollTop = this.$refs.talkArea.scrollHeight;
      });
    }
  }
};
</script>

<style lang='less' scoped>
.container {
  height: 100%;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  box-sizing: border-box;
  background: #fafafa;
  padding: 92px 0 100px 0;
  .chat-list {
    height: 100%;
    overflow-y: scroll;
    .chat-item {
      padding: 20px;
      .van-image {
        vertical-align: top;
        width: 80px;
        height: 80px;
      }
      .chat-pao {
        vertical-align: top;
        display: inline-block;
        min-width: 80px;
        max-width: 140%;
        min-height: 80px;
        line-height: 76px;
        border: 1px solid #c2d9ea;
        border-radius: 8px;
        position: relative;
        padding: 0 20px;
        background-color: #e0effb;
        word-break: break-all;
        font-size: 28px;
        color: #333;
        &::before {
          content: "";
          width: 20px;
          height: 20px;
          position: absolute;
          top: 24px;
          border-top: 1px solid #c2d9ea;
          border-right: 1px solid #c2d9ea;
          background: #e0effb;
        }
      }
    }
  }
}
.chat-item.right {
  text-align: right;
  .chat-pao {
    margin-left: 0;
    margin-right: 30px;
    &::before {
      right: -12px;
      transform: rotate(45deg);
    }
  }
}
.chat-item.left {
  text-align: left;
  .chat-pao {
    margin-left: 30px;
    margin-right: 0;
    &::before {
      left: -10px;
      transform: rotate(-135deg);
    }
  }
}
.reply-container {
  position: fixed;
  left: 0;
  bottom: 0;
  height: 88px;
  width: 100%;
  background: #f5f5f5;
  z-index: 9999;
}
</style>
