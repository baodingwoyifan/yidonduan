<template>
  <div class="page-user-profile">
    <van-nav-bar
      left-arrow
      @click-left="$router.back()"
      title="编辑资料"
      right-text="保存"
      @click-right="saveProfile()"
    ></van-nav-bar>
    <van-cell-group>
      <van-cell is-link title="头像" center @click="showPhoto=true">
        <van-image
          slot="default"
          width="56"
          height="56"
          fit="cover"
          round
          :src="userProfile.photo"
        />
      </van-cell>
      <van-cell is-link title="名称" :value="userProfile.name" @click="showName=true" />
      <van-cell is-link title="性别" :value="userProfile.gender?'男':'女'" @click="showSex=true" />
      <van-cell is-link title="生日" :value="userProfile.birthday" @click="showBirthday=true" />
    </van-cell-group>

    <!-- 弹出层  用户图片 -->
    <van-popup v-model="showPhoto" position="bottom">
      <!-- 点击之后执行文件上传 -->
      <van-cell title="选择本地图片" is-link @click="$refs.mypic.click();" />
      <van-cell title="拍照" is-link />
    </van-popup>
    <!-- 弹出层 用户名 -->
    <!-- 弹昵称 -->
    <van-popup v-model="showName" position="bottom">
      <!-- 编辑用户昵称  双向绑定用户的昵称-->
      <!-- type="textarea"代表的是一个文本域 -->
      <van-field v-model.trim="userProfile.name" type="textarea" rows="3"></van-field>
    </van-popup>
    <!-- 弹性别，菜单弹层组件
v-model：是否显示
@select：选取项目的回调处理
:actions：可选取项目设定
cancel-text="取消" 展示取消按钮
    -->
    <!-- van-action-sheet 菜单弹出层组件 -->
    <!-- 与普通弹出层的区别 只能展示菜单项目 -->
    <!-- @select="onSelect"某一个小菜单被选取后的回调处理 -->
    <!-- :actions="actions" 可选取菜单信息设置  格式以对象形式{ name；'男'} -->
    <!-- cancel-text="取消" 展示取消按钮 -->
    <van-action-sheet v-model="showSex" @select="onSelect" :actions="actions" cancel-text="取消"></van-action-sheet>
    <!-- </van-popup> -->
    <!-- 弹出层 生日 -->
    <van-popup v-model="showBirthday" position="bottom">
      <!-- 时间选择器
    v-model：默认显示时间
    type 时间类型 (年月日)
    :min-date="minDate" 允许选取的最小时间
    @cancel 点击取消按钮的回调事件
    @confirm 确认选取时间回调事件
      -->
      <van-datetime-picker
        v-model="nowDate"
        type="date"
        :min-date="minDate"
        @cancel="showBirthday=false"
        @confirm="confirmDate"
      ></van-datetime-picker>
    </van-popup>
    <input ref="mypic" @change="startUpload()" style="display:none" type="file" />
  </div>
</template>
<script>
import dayjs from "dayjs";
// 获取用户资料的api、上传用户头像、导入更新用户资料的api
import { apiUserProfile, apiUserPhoto, apiSaveProfile } from "@/api/user.js";
export default {
  name: "user-profile",
  data() {
    return {
      showPhoto: false, // 是否显示选择头像弹层
      showName: false, // 是否显示编辑昵称的弹层
      actions: [{ name: "女" }, { name: "男" }], //菜单栏组件的自定义面板
      showSex: false, // 菜单层组件显示与隐藏
      nowDate: new Date(), // 当前时间
      minDate: new Date("1900-01-01"), // 允许选取的最小时间
      showBirthday: false, // 是否显示生日弹层

      // 用户资料表单对象
      userProfile: {
        photo: "",
        name: "我是华仔",
        gender: 0, // 0 男 1 女
        birthday: "1993-09-01"
      }
    };
  },
  created() {
    this.getUserProfile(); // 调用获取用户资料的方法
  },
  methods: {
    // 获取用户资料的方法
    async getUserProfile() {
      this.userProfile = await apiUserProfile();
      // 日期组件要求时间格式为字符串，所以对目标生日时间转化处理
      // 字符串转化为对象格式
      this.nowDate = new Date(this.userProfile.birthday);
    },
    // 菜单被选中回调处理
    // val被选中的项目信息
    onSelect(val) {
      // console.log(val) // {name:'男'}
      // 组建成员接收数据
      this.userProfile.gender = val.name === "男" ? 0 : 1;
      this.showSex = false; //关闭弹层
    },
    // 点击确认的回调处理
    // val固定参数 代表选择好的时间信息
    confirmDate(val) {
      // 转化时间，获取到的时间是对象格式的，要把获取到的数据装换为‘年--月--日 格式’
      this.userProfile.birthday = dayjs(val).format("YYYY-MM-DD");
      // 关闭
      this.showBirthday = false;
    },
    // 实现图片上传
    async startUpload() {
      // 获得上传好的图片信息  this.$refs.mypic.files[0]
      // 当我们选择图片之后就会触发
      // 创建fromdata对象
      let fd = new FormData();
      fd.append("photo", this.$refs.mypic.files[0]); // 往FormData对象中添加参数
      let result = await apiUserPhoto(fd);
      // 应该 把地址 同步设置给 当前页面的数据
      this.userProfile.photo = result.photo; // 将上传成功的头像设置给当前头像，更新页面信息
      this.showPhoto = false; // 关闭弹窗
    },
    //更新用户资料
    async saveProfile() {
      // 性别更新有问题，服务器端的问题
      await apiSaveProfile(this.userProfile);
      // 提示信息
      this.$toast.success("更新成功");
    }
  }
};
</script>


<style scoped lang='less'></style>
