import Vue from 'vue'
import VueRouter from 'vue-router'
const Layout = () => import('@/views/layout') // 布局组件
const Home = () => import('@/views/home') // 主页组件
const Question = () => import('@/views/question') // 问答组件
const Video = () => import('@/views/video') // 视频组件
const User = () => import('@/views/user') // 个人中心
const Profile = () => import('@/views/user/profile') // 编辑资料
const Chat = () => import('@/views/user/chat') // 小智同学
const Login = () => import('@/views/user/login') // 登录组件
const Article = () => import('@/views/article') // 文章详情
const Search = () => import('@/views/search') // 搜索中心
const SearchResult = () => import('@/views/search/result.vue') // 搜索结果

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: Layout, // 一级路由
    children: [
      {
        path: '/',
        name:'home',
        component: Home // 二级路由 首页
      },
      {
        path: '/question',
        name: 'question',
        component: Question // 二级路由 问答组件
      },
      {
        path: '/video',
        name: 'video',
        component: Video // 二级路由 视频组件
      }, {
        path: '/user',
        name: 'user',
        component: User // 二级路由 个人中心
      }
    ]
  },
  {
    path: '/user/profile',
    name: 'profile',
    component: Profile // 编辑资料
  },
  {
    path: '/user/chat',
    name: 'chat',
    component: Chat // 小智同学
  },
  {
    path: '/login',
    name: 'login',
    component: Login // 登录组件
  },
  {
    path: '/article/:aid',
    name: 'article',
    component: Article // 文章详情
  },
  {
    path: '/search',
    name: 'search',
    component: Search // 搜索中心
  },
  // ：q路由参数，是搜索的关键字
  {
    path: '/search/result/:q',//通过路由体现搜索关键字
    name: 'result',
    component: SearchResult // 搜索结果
  }

]

const router = new VueRouter({
  routes
})

export default router
