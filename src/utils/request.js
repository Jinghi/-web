import axios from 'axios'
import { message } from './message'
import router from '../router'
import { useLinkStore, useAuthStore } from '../store'

const service = axios.create({
  baseURL: import.meta.env.DEV ? '' : (import.meta.env.VITE_APP_BASE_API || ''),
  timeout: 10000
})

const demoModeOn = import.meta.env.VITE_DEMO_FALLBACK !== 'false'
// 网络不通或服务器 5xx 视为后端不可用（4xx 是业务/鉴权问题，服务本身可达）
function markLinkByError(error) {
  const status = error?.response?.status
  if (!status || status >= 500) {
    useLinkStore()[demoModeOn ? 'setDemo' : 'setOffline']()
  }
}

// 请求拦截器
service.interceptors.request.use(
  config => {
    const token = localStorage.getItem('Authorization')
    if (token) {
      config.headers = config.headers || {}
      config.headers['Authorization'] = token
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    useLinkStore().setOnline()
    return response.data
  },
  error => {
    markLinkByError(error)
    const status = error?.response?.status
    if (status === 401) {
      // 401：未登录/Token 失效，清理登录态并跳登录页
      localStorage.removeItem('Authorization')
      useAuthStore().clear()
      message.error('登录已过期，请重新登录')
      router.push('/login')
    } else if (status === 403) {
      // 403：已登录但无该接口权限（前端已按权限隐藏入口，走到这里属越权访问），不踢登录
      if (!error.config?.skipErrorMessage) message.error('暂无权限执行该操作')
    } else if (!error.config?.skipErrorMessage) {
      message.error(error.message || '网络请求错误')
    }
    return Promise.reject(error)
  }
)

export default service