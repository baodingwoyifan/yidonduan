<template>
  <div class="user-login">
    <van-nav-bar title="登录"></van-nav-bar>
    <van-cell-group>
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
        <van-button slot="button" size="small" type="primary">发送验证码</van-button>
      </van-field>
    </van-cell-group>
    <div class="login-btn">
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
.login-btn{margin:40px;}
</style>
