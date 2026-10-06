<template>
  <header class="app-header">
    <div class="brand">
      <div class="brand-mark">✈</div>
      <div>
        <div class="brand-title">航空数据管控平台</div>
        <div class="brand-subtitle">AIR TRAFFIC DATA INTELLIGENCE CENTER</div>
      </div>
    </div>

    <nav class="nav-tabs">
      <router-link v-if="auth.has('menu:home')" to="/home" class="nav-item" active-class="active">数据驾驶舱</router-link>
      <router-link v-if="auth.has('menu:monitor')" to="/monitor" class="nav-item" active-class="active">实时监控</router-link>
    </nav>

    <div class="header-tools">
      <span class="system-status" :class="link.status" :title="linkTip"><i></i>{{ linkText }}</span>
      <span class="header-time">{{ nowText }}</span>
      <el-dropdown trigger="click">
        <button class="user-btn" :title="roleText"><el-icon><User /></el-icon>{{ userName }}<em v-if="roleText" class="role-tag">{{ roleText }}</em><el-icon><ArrowDown /></el-icon></button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </header>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowDown, User } from '@element-plus/icons-vue'
import request from '@/utils/request'
import message from '@/utils/message'
import { useLinkStore, useAuthStore } from '@/store'

const router = useRouter()
const nowText = ref('')
const link = useLinkStore()
const auth = useAuthStore()
const userName = computed(() => auth.user?.name || '值班用户')
const roleText = computed(() => auth.roles.map(r => r.roleName).join('/') || (auth.isAdmin ? '管理员' : ''))
// 状态灯随真实请求结果变化：online 真实接口；demo 后端不可用、正在展示演示数据；offline 非演示模式下后端异常
const LINK_META = {
  checking: { text: '链路检测中', tip: '正在检测后端服务状态' },
  online: { text: '数据链路正常', tip: '已连接后端实时数据接口' },
  demo: { text: '演示数据 · 后端未连接', tip: '后端服务不可达（8848端口），当前展示前端演示数据；联调/答辩请启动后端并设置 VITE_DEMO_FALLBACK=false' },
  offline: { text: '链路异常', tip: '后端服务不可达，请检查后端（8848端口）是否启动' }
}
const linkText = computed(() => LINK_META[link.status]?.text || '链路检测中')
const linkTip = computed(() => LINK_META[link.status]?.tip || '')
let timer

function updateClock() {
  nowText.value = new Intl.DateTimeFormat('zh-CN', { hour12: false, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(new Date())
}
async function logout() {
  try { await request({ url:'/api/logout', method:'post', skipErrorMessage: true }) } catch (_) {}
  localStorage.removeItem('Authorization')
  auth.clear()
  message.success('已退出登录')
  router.push('/login')
}

onMounted(async () => {
  updateClock(); timer = setInterval(updateClock, 1000)
  try {
    const res = await request({ url:'/api/user/info', method:'get', skipErrorMessage: true })
    // 真实后端在线时用服务端返回的角色/权限刷新本地状态（演示模式下该请求失败则沿用登录时的本地状态）
    if (res?.successful && res.resultValue) auth.setLogin(res.resultValue)
  } catch (_) {}
})
onBeforeUnmount(() => clearInterval(timer))
</script>

<style scoped>
.app-header{height:72px;display:flex;align-items:center;padding:0 28px;border-bottom:1px solid rgba(119,193,255,.16);background:rgba(7,18,37,.92);box-shadow:0 6px 20px rgba(0,0,0,.16);position:sticky;top:0;z-index:50;color:#dceeff}.brand{display:flex;align-items:center;gap:12px;min-width:370px}.brand-mark{width:38px;height:38px;border:1px solid rgba(94,193,255,.55);border-radius:10px;display:grid;place-items:center;color:#69c7ff;font-size:22px;background:linear-gradient(145deg,#102848,#081729)}.brand-title{font-size:18px;font-weight:700;letter-spacing:1.5px}.brand-subtitle{font-size:9px;color:#6582a5;letter-spacing:1.8px;margin-top:3px}.nav-tabs{display:flex;gap:8px;height:100%;align-items:center}.nav-item{color:#7e9ab8;text-decoration:none;padding:0 22px;height:44px;display:flex;align-items:center;border-radius:10px;font-size:14px}.nav-item:hover{color:#dceeff;background:rgba(83,157,220,.08)}.nav-item.active{color:#f3fbff;background:linear-gradient(90deg,rgba(37,137,216,.24),rgba(50,197,255,.08));box-shadow:inset 0 0 0 1px rgba(88,195,255,.14)}.header-tools{margin-left:auto;display:flex;align-items:center;gap:18px;font-size:12px;color:#6985a4}.system-status{display:flex;align-items:center;gap:6px;white-space:nowrap}.system-status i{width:7px;height:7px;border-radius:50%;background:#27d49a;box-shadow:0 0 10px #27d49a}.system-status.demo{color:#ffc34f}.system-status.demo i{background:#ffc34f;box-shadow:0 0 10px #ffc34f}.system-status.offline{color:#ff7b88}.system-status.offline i{background:#ff6475;box-shadow:0 0 10px #ff6475}.system-status.checking i{background:#7d93ab;box-shadow:0 0 8px #7d93ab}.user-btn{border:1px solid rgba(115,169,220,.18);background:rgba(23,42,69,.65);color:#d8eaff;padding:7px 10px;border-radius:8px;display:flex;align-items:center;gap:6px;cursor:pointer}.role-tag{font-style:normal;font-size:10px;line-height:1;color:#8fd0ff;background:rgba(70,150,230,.15);border:1px solid rgba(110,190,255,.28);border-radius:4px;padding:3px 6px}.header-time{font-variant-numeric:tabular-nums;color:#8eabc9}
</style>
