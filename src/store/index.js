import { createPinia, defineStore } from 'pinia'

export const pinia = createPinia()

export const useUserStore = defineStore('user', {
  state: () => ({
    // 存储 token
    Authorization: localStorage.getItem('Authorization') || '',
  }),
  actions: {
    // 将 token 存入 localStorage
    changeLogin(user) {
      const token = typeof user === 'string' ? user : (user?.Authorization || '')
      this.Authorization = token
      localStorage.setItem('Authorization', token)
    }
  }
})

// 后端链路状态：
// checking 尚未完成任何请求；online 真实接口可用；demo 后端不可用、正在使用演示数据；offline 非演示模式下后端不可用
export const useLinkStore = defineStore('link', {
  state: () => ({ status: 'checking' }),
  actions: {
    setOnline() { this.status = 'online' },
    setDemo() { this.status = 'demo' },
    setOffline() { this.status = 'offline' }
  }
})

// 当前登录者权限（对应后端 sys_auth 权限编码：menu:* / panel:* / monitor:*）
// 数据来源：登录接口返回的 authList（与 userAuth 一致），持久化到 localStorage 供刷新后路由守卫使用
function readStoredCodes() {
  try {
    const v = JSON.parse(localStorage.getItem('userAuth') || '[]')
    return Array.isArray(v) ? v : []
  } catch { return [] }
}
function readStoredUser() {
  try { return JSON.parse(localStorage.getItem('userInfo') || 'null') } catch { return null }
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    codes: readStoredCodes(),
    user: readStoredUser() // {account,name,type,roles}
  }),
  getters: {
    isAdmin: s => s.user?.type === 1,
    roles: s => s.user?.roles || []
  },
  actions: {
    // 登录成功后写入，入参与后端 /api/login 的 resultValue 结构一致
    setLogin(data) {
      let codes = Array.isArray(data?.authList) ? data.authList : []
      if (!codes.length && data?.userAuth) {
        try { const v = JSON.parse(data.userAuth); if (Array.isArray(v)) codes = v } catch { /* 忽略损坏的 userAuth */ }
      }
      const user = {
        account: data?.account || '',
        name: data?.name || data?.account || '',
        type: data?.type ?? 0,
        roles: Array.isArray(data?.roles) ? data.roles : []
      }
      this.codes = codes
      this.user = user
      localStorage.setItem('userAuth', JSON.stringify(codes))
      localStorage.setItem('userInfo', JSON.stringify(user))
    },
    clear() {
      this.codes = []
      this.user = null
      localStorage.removeItem('userAuth')
      localStorage.removeItem('userInfo')
    },
    // 管理员（后端 user.type=1，拥有全部权限）直接放行；其余按权限编码精确判断
    has(code) { return this.user?.type === 1 || this.codes.includes(code) },
    hasAny(list) { return this.user?.type === 1 || (list || []).some(c => this.codes.includes(c)) },
    // 登录后默认落地页：按菜单顺序取第一个有权限的页面
    firstMenuPath() {
      if (this.has('menu:home')) return '/home'
      if (this.has('menu:monitor')) return '/monitor'
      return ''
    }
  }
})

export default pinia