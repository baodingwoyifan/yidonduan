<template>
  <div class="container">
    <!-- NavBar 导航栏组件 -->
    <!-- title  	自定义标题 -->
    <!-- fixed 是否固定在顶部 -->
    <!-- left-arrow  是否显示左侧箭头-->
    <!-- @click-left=""	点击左侧按钮时触发 -->
    <van-nav-bar title="搜索中心" left-arrow @click-left="$router.back()" />
    <!--绑定clear事件-->
    <!-- van-search 搜索组件 -->
    <!-- v-model=""可以获取搜索组件中的内容信息 -->
    <!-- placeholder="请输入搜索关键词"   页面提示信息 -->
    <!-- @clear="onClear" 点击清除按钮后触发 一般是清除搜索框内容的-->
    <!-- @search="onSearch(searchText)" 确定搜索时触发 根据关键字发送请求，获取数据，onSearch方法有编程式导航的封装，会进行页面跳转-->
    <!-- @search="onSearch(searchText)" 点击之后根据检索的结果，跳转到搜索结果页面 @search是vant官网提供的事件，把关键字作为参数传递进来-->
    <van-search
      v-model="searchText"
      placeholder="请输入搜索关键词"
      @clear="onClear"
      @search="onSearch(searchText)"
    />
    <!-- 联想建议 -->
    <!-- van-cell-group 单元格组件 -->
    <van-cell-group v-if="sugguestionList.length>0">
      <!--展示联想内容，并渲染-->
      <!-- title= 设置单元格标题 -->
      <!-- icon="search" 设置单元格前边的·图标 -->
      <!-- @click="onSearch(item)" 把当前小项目传递进来 -->
      <van-cell
        :title="item"
        icon="search"
        v-for="(item,k) in sugguestionList"
        :key="k"
        @click="onSearch(item)"
      >
        <!-- 关键字高亮 -->
        <!-- 命名插槽，使下面的元素在 van-cell 中显示 -->
        <!-- item 目标内容 -->
        <!-- searchText关键字 -->
        <!-- slot="title"通过命名插槽覆盖渲染掉 title属性 -->
        <!-- v-html 针对html标签、css样式、字符串内容 -->
        <!-- {{}}，如果使用插值表达式的话，只能表示字符串，就没有高亮显示了 -->
        <div slot="title" v-html="highlightCell(item,searchText)"></div>
      </van-cell>
    </van-cell-group>
    <!-- 联想历史记录管理 -->
    <van-cell-group v-else>
      <!-- slot="right-icon" 命名插槽，表示给cell单元格显示一个小图标 -->
      <van-cell title="历史记录">
        <van-icon
          @click="isDeleteData=true"
          v-show="!isDeleteData"
          slot="right-icon"
          name="delete"
          style="line-height:inherit"
        ></van-icon>
        <div v-show="isDeleteData">
          <span style="margin-right:10px" @click="delAllSugguest()">全部删除</span>
          <span @click="isDeleteData=false">完成</span>
        </div>
      </van-cell>
      <!--联想建议历史记录项目-->
      <van-cell :title="item" v-for="(item,k) in sugguestHistories" :key="k">
        <!-- 删除按钮 -->
        <van-icon
          v-show="isDeleteData"
          slot="right-icon"
          name="close"
          style="line-height:inherit"
          @click="delSugguest(k)"
        ></van-icon>
      </van-cell>
    </van-cell-group>
  </div>
</template>

<script>
// 导入api函数
import { apiSuggestionList } from "@/api/search";
// 引入api接口
import { apiSearchList } from "@/api/search";
// 设置联想历史数据信息
const SH = "sugguest-histories";
export default {
  name: "search-index",
  watch: {
    // 输入的关键字发生变化，才会执行下面的代码
    // 有变化就要调用methods方法获取联想数据
    searchText(newV) {
      // 设置防抖，避免频繁发送请求
      // 通过定时器（setTimeout）和清除定时器（clearTimeout）完成防抖
      // 每次执行时，就清除之前的定时器，以保证定时器不会重复累加 或 立即执行
      //清除定时器
      clearTimeout(this.timer);
      if (!newV) {
        this.sugguestionList = [];
        return false;
      }
      // 设置定时器
      // timer 是data成员，是临时的成员，不用在data中声明
      this.timer = setTimeout(async () => {
        let txt = newV.trim(); // 去除左右空格
        if (!txt) {
          // 关键字为空，清除联想关键字
          this.sugguestionList = [];
          // 代码停止执行
          return false;
        }
        // 调用api方法进行搜索
        let result = await apiSuggestionList({
          q: txt
        });
        this.sugguestionList = result.options;
      }, 1000);
    }
  },
  computed: {
    // 获得路由参数q，使得组件内部可以通过 this.q 的简便方式获得路由参数
    q() {
      return this.$route.params.q;
    }
  },
  data() {
    return {
      sugguestionList: [], // 联想建议数据
      searchText: "", // 搜索关键字
      searchList: [], // 搜索结果
      isDeleteData: false, // 历史记录开关
      // 联想历史记录，方便后面响应式的使用
      sugguestHistories: JSON.parse(localStorage.getItem(SH)) || [],
      // 联想建议 本地localStorage 的key的名称
      histroyKey: SH
    };
  },
  created() {
    // 调用获取结果方法
    this.getSearchList();
  },
  methods: {
    // 清除搜索内容
    onClear() {
      this.sugguestionList = [];
    },
    // 搜索关键字高亮
    // item代表检索结果
    // keywods搜索关键字
    highlightCell(item, keywords) {
      //  let reg = new RegExp(`${keywords}`, "i")这里也是一种创建正则的方法
      let reg = new RegExp(`${keywords}`, "i"); // ‘i’正则，忽略大小写
      // 获得到匹配内容
      //  能匹配到：
      //  rst[0]-----就是匹配到的关键字
      // 不能匹配的话：
      // rst=null
      // .match获取到匹配内容，而.text返回的是布尔值
      let rst = item.match(reg);
      // 对关键字进行高亮处理
      // 替换内容：reg就是原来的关键字，`<span style="color:red">${rst[0]}</span>`是es6语法，是一个家里css样式
      // 的span标签，里面的内容就是（res【0】）就是高亮显示的关键字
      // replace（替换内容，被替换内容）replace是一个js的标准方法
      try {
        return item.replace(reg, `<span style="color:red">${rst[0]}</span>`);
      } catch (err) {
        return item;
      }
    },
    // 根据关键字跳转到搜索结果页面
    // onSearch(keywords) {
    //   // 对联想的关键字做清除左右空格处理
    //   keywords = keywords.trim();

    //   // 没有联想内容，停止后续处理
    //   if (!keywords) {
    //     return false;
    //   }

    //   let data = new Set(this.sugguestHistories); // 根据已有的历史记录创建Set对象
    //   data.add(keywords); // 存储访问的关键字
    //   this.sugguestHistories = Array.from(data); // 把添加好的整体历史记录变为Array数组
    //   // 把联想关键字数组存储给localStorage里边(名称为sugguest-histories)
    //   window.localStorage.setItem(
    //     "sugguest-histories",
    //     JSON.stringify(this.sugguestHistories)
    //   );

    //   // 路由编程式导航，进入搜索文章展示页面，
    //   // 通过路由体现关键字，params属性传递参数
    //   this.$router.push({
    //     name: "result",
    //     params: {
    //       q: keywords
    //     }
    //   });
    // },
    // 根据关键字检索文章，获取数据，keywords就是传递进来的searchText（）搜索关键字
    onSearch(keywords) {
      // 对联想的关键字做清除左右空格处理，  .trim方法可以清除两边的空格
      keywords = keywords.trim();
      //如果没有关键字传递进来，那后面的代码也就没有了意义，要停止代码执行
      if (!keywords) {
        //停止代码执行
        return false;
      }
      // 根据已有的历史记录创建Set对象，  .Set()方法跟数组差不多，但是Array数组可以同时存在两个甚至多个相同的数据,而Set方法返回的也是一个新的数组，但是他没有重复成员
      let data = new Set(this.sugguestHistories);
      data.add(keywords); // 调用.add方法存储访问的关键字（关键字就是keywords）
      this.sugguestHistories = Array.from(data); // 调用.from方法把添加好的整体历史记录变为Array数组
      // 把联想关键字数组存储给localStorage里边(名称为sugguest-histories)
      localStorage.setItem(SH, JSON.stringify(this.sugguestHistories));

      // 路由编程式导航，进入搜索文章展示页面
      this.$router.push({ name: "result", params: { q: keywords } });
    },
    // 获得搜索结果
    async getSearchList() {
      let result = await apiSearchList({
        q: this.q
      });
      this.searchList = result.results;
    },
    // 删除“全部”联想建议历史记录
    delAllSugguest() {
      // 页面删除，直接把sugguestHistories为空就好了
      this.sugguestHistories = [];
      // 本地存储删除历史记录数据
      localStorage.removeItem(this.histroyKey);
    },
    // 删除“单个”的联想建议历史记录
    delSugguest(index) {
      // 根据传递进来的下标，删除当前点击的数据
      this.sugguestHistories.splice(index, 1);
      // 更新localStorage数据
      // 把修改后的数据直接覆盖就好了
      localStorage.setItem(
        this.histroyKey,
        JSON.stringify(this.sugguestHistories)
      );
    }
  }
};
</script>
