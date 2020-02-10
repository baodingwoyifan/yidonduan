<template>
  <div class='container'>
    <!-- title是第一行的内容，row是设置其他骨架屏的行数，avatar设置骨架屏前边的小圆圈的 -->
    <van-skeleton title avatar :row="3" />
    <van-skeleton title avatar :row="3" />
    <van-skeleton title avatar :row="3" />
  </div>
</template>

<script>
export default {
  name: 'video-index'
}
</script>

<style scoped lang='less'>
.van-skeleton{
  margin-top: 10px;
}
</style>
