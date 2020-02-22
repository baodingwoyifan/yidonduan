<template>
  <div class="container">
    <!-- 当路由地址（path === $route.path）不是`我的`才显示 -->
    <!-- fixed 属性，使导航栏固定在头部 -->
    <!-- @click-right 右侧文字单击事件 -->
    <!-- @click-right="$router.push('/search')" 点击搜索后页面跳转到搜索页面 -->
    <van-nav-bar fixed title="黑马头条" right-text="搜索" @click-right="$router.push('/search')" />
    <div class="my-wrapper">
      <!-- 设置缓存 二级路由（在这里配置缓存非常合适） -->
      <keep-alive>
      <router-view></router-view>
      </keep-alive>
    </div>
    <!-- router开启路由模式 -->
    <!-- <van-tabbar 标签栏组件，默认在底部显示 -->
    <!-- <van-tabbar >可以设置v-model，用来控制选中状态，如果添加了router，就不用设置了 -->
    <van-tabbar route>
      <!-- to属性设置路由跳转地址 -->
      <van-tabbar-item to="/" icon="home-o">首页</van-tabbar-item>
      <van-tabbar-item to="/question" icon="chat-o">问答</van-tabbar-item>
      <van-tabbar-item to="/video" icon="video-o">视频</van-tabbar-item>
      <van-tabbar-item :to='userGo' icon="user-o"> {{$store.state.user.token?'我的':'未登录'}}</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
computed: {
  userGo:function(){
   return this.$store.state.user.token?'/user':'/login'
  }
},

}
</script>

<style scoped lang='less'>
.container {
  width: 100%;
  height: 100%;
  position: relative;
  .my-wrapper {
    width: 100%;
    height: 100%;
    overflow: hidden;
    padding-top: 92px;
    padding-bottom: 100px;
    box-sizing: border-box;
    &.noTop {
      padding-top: 0;
    }
  }
}
</style>
