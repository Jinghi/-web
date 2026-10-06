import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/store'
import message from '@/utils/message'
import Layout from '@/views/Layout/Layout.vue'

const routes=[
  {path:'/login',component:()=>import('@/views/Login/Login.vue'),meta:{auth:true}},
  {path:'/',component:Layout,redirect:'/home',children:[
    {path:'home',component:()=>import('@/views/Home/Index.vue'),name:'home',meta:{title:'首页数据统计',authCode:'menu:home'}},
    {path:'monitor',component:()=>import('@/views/Monitor/Index.vue'),name:'monitor',meta:{title:'航空实时监控',authCode:'menu:monitor'}}
  ]},
  {path:'/:pathMatch(.*)*',redirect:'/'}
]
const router=createRouter({history:createWebHistory(import.meta.env.BASE_URL),routes})

// 路由守卫：未登录跳登录页；已登录但缺少该菜单权限码（menu:home / menu:monitor）时落到首个可访问菜单
router.beforeEach((to)=>{
  if(to.path==='/login') return true
  const token=localStorage.getItem('Authorization')
  if(!token) return {path:'/login',query:{redirect:to.fullPath}}
  const authStore=useAuthStore()
  // 本地没有任何权限信息（旧版本会话残留等）：要求重新登录，避免权限判断失真
  if(!authStore.codes.length){
    localStorage.removeItem('Authorization')
    authStore.clear()
    return {path:'/login',query:{redirect:to.fullPath}}
  }
  const code=to.meta?.authCode
  if(code && !authStore.has(code)){
    message.warning('当前账号无权限访问该模块')
    const fallback=authStore.firstMenuPath()
    if(fallback && fallback!==to.path) return {path:fallback}
    return {path:'/login'}
  }
  return true
})

export default router
