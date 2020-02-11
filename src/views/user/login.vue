<template>
  <div class="user-login">
    <!-- 顶部显示一个登陆提示标题就好了 title="登录-->
    <van-nav-bar title="登录"></van-nav-bar>
    <!-- 表单部分  vant里面没有from相关组件，只有普通的表单组件 -->
    <!-- <van-cell-group>是对普通表单域做封装的类似于from -->
    <van-cell-group>
      <!-- van-field输入框表单组件 -->
       <!-- label="手机号"设置输入框前边的提示信息 -->
      <!-- required 不进行校验，设置表单域前边有一个‘红星’  -->
      <!-- clearable  设置输入框的内容可以通过后面的“插号”进行清除-->
      <van-field
        v-model="loginForm.mobile"
        type="text"
        placeholder="请输入手机号码"
        label="手机号"
        required
        clearable
      />
      <van-field
        v-model="loginForm.code"
        type="password"
        placeholder="请输入验证码"
        label="验证码"
        required
        clearable
      >
      <!-- 发送验证提示相关按钮 命名插槽,要给field组件内部进行填充的 -->
        <!-- size="small"设置按钮样式 -->
        <!-- type="primary"设置背景颜色 -->
        <van-button slot="button" size="small" type="primary">发送验证码</van-button>
      </van-field>
    </van-cell-group>
    <div class="login-btn">
      <!-- van-button  -->
      <!-- type="info"设置颜色 -->
      <!-- size="small"设置大小 -->
      <!-- round圆圈效果 -->
       <!-- block块级样式设置,占据一整行 -->
      <van-button type="info" size="small" round block @click="login()">登录</van-button>
    </div>
  </div>
</template>

<script>
import { apiUserLogin } from '@/api/user'
// 导入vuex的方法模块
import { mapMutations } from 'vuex'
export default {
  name: 'user-login',
  data () {
    return {
      loginForm: {
        // mobile和code的设置来自接口文档
        mobile: '13911111111',
        code: '246810'
      }
    }
  },
  methods: {
    // 对vuex的mutations方法进行展开操作
    ...mapMutations(['updateUser']),
    async login () {
      try {
        const result = await apiUserLogin(this.loginForm)
        // Vuex实现token等信息的存储管理
        this.updateUser(result)

        this.$toast.success('登录成功')

        const { redirectUrl } = this.$route.query // 接收回跳地址
        this.$router.push(redirectUrl || '/') // 判断是否有会跳地址要执行，没有就走/斜杠
      } catch (err) {
        return this.$toast.fail('账号不正确')
      }
    }
  }
}
</script>

<style scoped lang='less'>
//设置按钮的样式
.login-btn {
  margin: 40px;
}
</style>
