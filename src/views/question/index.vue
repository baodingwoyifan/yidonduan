<template>
  <!-- title属性 第一个属性的样子，row显示几小行-->
  <div>
    <van-skeleton title :row="3" />
    <van-skeleton title :row="3" />
    <van-skeleton title :row="3" />
  </div>
</template>

<script>
export default {
  name: 'question-index'
}
</script>

<style scoped lang='less'>
.van-skeleton {
  margin-top: 10px;
}
</style>
