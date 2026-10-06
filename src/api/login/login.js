import request from '../../utils/request'

const baseUrl="/api"

// ---- 演示模式账号：与后端 sql/kongguan.sql 种子数据保持一致 ----
// admin / user / guest 密码均为 123456；权限编码与 sys_auth、role_auth 完全对应
const ALL_CODES = [
  'menu:home', 'menu:monitor',
  'panel:sectorFlow', 'panel:airline', 'panel:sectorCount', 'panel:callSaturation',
  'panel:annualWarn', 'panel:company', 'panel:conflict', 'panel:airportLoad', 'panel:warnStat',
  'monitor:track', 'monitor:warn', 'monitor:atcCheck'
]
// 访客：仅首页 + 6 个只读统计板块（对应 role_auth 中 role_id=3 的授权）
const GUEST_CODES = ['menu:home', 'panel:sectorFlow', 'panel:airline', 'panel:sectorCount', 'panel:company', 'panel:airportLoad']
const DEMO_ACCOUNTS = {
  admin: { id: '1', name: '系统管理员', type: 1, roles: [{ id: 1, roleName: '管理员', roleCode: 'admin' }], codes: ALL_CODES },
  user:  { id: '2', name: '值班管制员', type: 0, roles: [{ id: 2, roleName: '普通用户', roleCode: 'user' }], codes: ALL_CODES },
  guest: { id: '3', name: '机场访客',   type: 0, roles: [{ id: 3, roleName: '访客', roleCode: 'guest' }], codes: GUEST_CODES }
}

/**
 * 用户登录
 * 后端不可用（如未启动、代理 ECONNREFUSED 返回 5xx）时，
 * 若未显式关闭 VITE_DEMO_FALLBACK，则回退到本地演示账号登录
 */
export async function login(data){
  try {
    return await request({
      url:baseUrl+"/login",
      method:"post",
      data:data,
      // 允许演示回退时静默处理网络/代理错误，避免弹出 500 提示
      skipErrorMessage: import.meta.env.VITE_DEMO_FALLBACK !== 'false'
    })
  } catch (error) {
    if (import.meta.env.VITE_DEMO_FALLBACK === 'false') throw error
    const status = error?.response?.status
    // 仅在网络异常/代理失败（无响应或 5xx）时使用演示登录，不掩盖后端的业务错误
    if (status != null && status < 500) throw error
    const account = data?.account?.trim()
    const acc = DEMO_ACCOUNTS[account]
    if (acc && data?.password === '123456') {
      const token = 'demo-token-' + acc.id + '-' + Date.now()
      return {
        successful: true,
        message: '演示登录成功',
        resultValue: {
          id: acc.id,
          name: acc.name,
          account,
          type: acc.type,
          Authorization: token,
          authorization: token,
          userAuth: JSON.stringify(acc.codes),
          authList: acc.codes,
          roles: acc.roles,
          expiresIn: 7 * 86400
        }
      }
    }
    return { successful: false, message: '用户名或密码错误（演示账号：admin / user / guest，密码均为 123456）' }
  }
}