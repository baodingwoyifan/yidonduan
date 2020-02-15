
<!--弹出框组件 -->
 <!-- :show-confirm-button="false" 隐藏弹出框的确认按钮 -->
  <!-- close-on-click-overlay单机别的地方会关闭弹出框 -->
  // 注意 @input="$emit('input',$event)"这里就这样配置，e.target.value
  <template>
  <van-dialog
    :value="value"
    :show-confirm-button="false"
    @input="$emit('input',$event)"
    close-on-click-overlay
  >
    <van-cell-group v-if="isOneLevel">
      <!-- icon设置图标 -->
      <!-- title设置标题 -->
      <!-- is-link一个向右的小箭头 -->
      <!-- @click="isOneLevel=true"控制显示与隐藏 -->
      <van-cell icon="location-o" title="不感兴趣" @click="articleDislike()" />
      <van-cell icon="location-o" title="反馈垃圾内容" is-link @click="isOneLevel=false" />
      <van-cell icon="location-o" title="拉黑作者" />
    </van-cell-group>

    <van-cell-group v-else>
      <!-- icon="arrow-left"左箭头图标 -->
      <!-- @click="isOneLevel=true"控制显示与隐藏 -->
      <van-cell icon="arrow-left" @click="isOneLevel=true" />
      <van-cell title="其他问题" icon="location-o" />
      <van-cell title="标题夸张" icon="location-o" />
      <van-cell title="低俗色情" icon="location-o" />
      <van-cell title="错别字多" icon="location-o" />
      <van-cell title="旧闻重复" icon="location-o" />
      <van-cell title="广告软文" icon="location-o" />
      <van-cell title="内容不实" icon="location-o" />
      <van-cell title="涉嫌违法犯罪" icon="location-o" />
      <van-cell title="侵权" icon="location-o" />
    </van-cell-group>
  </van-dialog>
</template>

<script>
// 导入api模块函数
import { apiArticleDislike } from "@/api/article";
export default {
  name: "com-moreaction",
  props: {
    // 接收父传递的v-model的值
    value: {
      type: Boolean,
      default: false
    },
    // 接收不感兴趣文章的id
    articleID: {
      type: String,
      requird:true
    }
  },
  data() {
    return {
      isOneLevel: true // 判断展示一级 或 二级 反垃圾内容 true:一级  false:二级
    };
  },
  methods: {
    // 对不感兴趣文章做处理
    async articleDislike () {
      let result = await apiArticleDislike(this.articleID)
      // 刷新文章列表
      this.$emit('dislikeSuccess')
      // 关闭弹框
      this.$emit('input', false)
      // 成功提示
      this.$toast.success('操作成功')
    }
    
  }
};
</script>

<style lang="less" scoped>
</style>

