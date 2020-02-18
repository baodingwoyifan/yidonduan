
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
    @close='isOneLevel=true'
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
      <!-- @click="articleReport(item.value)" 把要举报的类型传递进去类型就是itme.value -->
      <van-cell icon="arrow-left" @click="isOneLevel=true" />
      <van-cell
            v-for="item in reportsList"
            :key="item.value"
            :title="item.title"
            icon="location-o"
            @click="articleReport(item.value)"
            />
</van-cell-group>
    </van-cell-group>
  </van-dialog>
</template>

<script>
// 导入api模块文章不敢兴趣的函数
import { apiArticleDislike } from "@/api/article";
//导入举报api
import { apiArticleReport } from "@/api/article";
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
      isOneLevel: true ,// 判断展示一级 或 二级 反垃圾内容 true:一级  false:二级
      // 举报类型：
      reportsList: [
        { title: '其他问题', value: 0 },
        { title: '标题夸张', value: 1 },
        { title: '低俗色情', value: 2 },
        { title: '错别字多', value: 3 },
        { title: '旧闻重复', value: 4 },
        { title: '广告软文', value: 5 },
        { title: '内容不实', value: 6 },
        { title: '涉嫌违法犯罪', value: 7 },
        { title: '侵权', value: 8 }
      ],
    };
  },
  methods: {
    // 对不感兴趣文章做处理，处理成功后，弹出框消失，文章消失
    // dislikeSuccess是来自父组件的方法
    async articleDislike () {
      // 下面方法调用api，正常情况下成功率是100%的，不用设置try和catch
      let result = await apiArticleDislike(this.articleID)
      // 调用父组件给声明的方法dislikeSuccess删除目标文章
      this.$emit('dislikeSuccess')
      // 关闭弹框，控制父组件的showDialog的布尔值
      this.$emit('input', false)
      // 处理成功提示
      this.$toast.success('处理成功')
    },
   /**
  * 对文章做举报处理
  * type 举报类型
  */
async articleReport (type) {
  try {
    // 调用api方法（apiArticleReport）发送举报请求
   await apiArticleReport({ articleID: this.articleID, type: type })
  } catch (err) {
    this.$emit('input', false) // 关闭弹框
    // err错误提示信息
    // 重复举报的409提示处理
    if (err.response.status === 409) {
     return this.$toast.fail('文章已经被举报过')
    } else {
     return this.$toast.fail('举报失败')
    }
    return false
  }
  // 举报成功处理
  this.$emit('input', false) // 关闭弹框
  this.$toast.success('举报成功！')
},
  }
};
</script>

<style lang="less" scoped>
</style>

