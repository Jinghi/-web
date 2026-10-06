import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import pinia from './store'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import './assets/css/basic.css'
import './assets/icon/iconfont.css'
import * as echarts from 'echarts'
import axios from 'axios'
import moment from 'moment'
import { message } from './utils/message'

const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(ElementPlus)

app.config.globalProperties.$echarts = echarts
app.config.globalProperties.$axios = axios
app.config.globalProperties.$moment = moment
app.config.globalProperties.$message = message

// 拦截重复请求
const pending = {}
const CancelToken = axios.CancelToken
const removePending = (key, isRequest = false) => {
  if (pending[key] && isRequest) {
    pending[key]('取消重复请求')
  }
  delete pending[key]
}

const getRequestIdentify = (config) => {
  const url = config.url || ''
  if (config.method === 'post') {
    return encodeURIComponent(url + JSON.stringify(config.data || {}))
  }
  return encodeURIComponent(url + JSON.stringify(config.params || {}))
}

// request 拦截器
axios.interceptors.request.use(config => {
  if (!config.data || !config.data.allowedRepeat) {
    const requestData = getRequestIdentify(config)
    removePending(requestData, true)
    config.cancelToken = new CancelToken((c) => {
      pending[requestData] = c
    })
  } else {
    delete config.data.allowedRepeat
  }
  return config
}, error => {
  console.error(error)
  return Promise.reject(error)
})

// response 拦截器
axios.interceptors.response.use(config => {
  const status = config.data?.code || config.code
  if (status === 401 || status === 403) {
    router.push('/login')
  }
  return config
})

app.mount('#app')
