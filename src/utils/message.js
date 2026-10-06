import { ElMessage } from 'element-plus'

let messageInstance = null

export const message = function (options) {
  // 如果弹窗已存在先关闭
  if (messageInstance) {
    messageInstance.close()
  }
  if (typeof options === 'string') {
    options = { message: options }
  }
  messageInstance = ElMessage(options)
  return messageInstance
}

const arr = ['success', 'warning', 'info', 'error']
arr.forEach(function (type) {
  message[type] = function (options) {
    if (typeof options === 'string') {
      options = {
        message: options
      }
    }
    return message({
      ...options,
      type
    })
  }
})

export default message