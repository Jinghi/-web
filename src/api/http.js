import request from '@/utils/request'

export async function apiGet(url, params = {}, fallback = null) {
  const canFallback = fallback !== null && import.meta.env.VITE_DEMO_FALLBACK !== 'false'
  try {
    // 有演示回退时静默失败，由回退数据兜底，避免弹出 500/网络错误提示
    const data = await request({ url, method: 'get', params, skipErrorMessage: canFallback })
    if (data?.successful === false) throw new Error(data?.message || '接口返回失败')
    return data?.resultValue ?? fallback
  } catch (error) {
    if (canFallback) {
      return fallback
    }
    throw error
  }
}

function bizError(message) {
  // 业务错误（HTTP 正常但 successful=false），不应触发演示回退
  const err = new Error(message)
  err.bizError = true
  return err
}

export async function apiPost(url, data = {}, extra = {}) {
  const res = await request({ url, method: 'post', data, ...extra })
  if (res?.successful === false) throw bizError(res?.message || '接口返回失败')
  return res?.resultValue
}

export async function apiPut(url, data = {}, extra = {}) {
  const res = await request({ url, method: 'put', data, ...extra })
  if (res?.successful === false) throw bizError(res?.message || '接口返回失败')
  return res?.resultValue
}
