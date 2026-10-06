import { apiGet, apiPost, apiPut } from '@/api/http'

const demo = {
  overview: { statDate: '2026-10-05', flightCount: 1920, delayCount: 246, delayRate: 12.81, routeCount: 244, airportCount: 44, companyCount: 20, warnCount: 13, avgSaturation: 34.08, inAirCount: 46, sectorCount: 3 },
  airlineStat: {
    startDate: '2026-09-29', endDate: '2026-10-05', total: 1920, routeCount: 244,
    domesticIn: 360, domesticOut: 462, internationalIn: 164, internationalOut: 133, internal: 801,
    byDate: ['09-29','09-30','10-01','10-02','10-03','10-04','10-05'].map((d,i)=>({date:`2026-${d}`, domesticIn:51+i*2, domesticOut:68+i, internationalIn:24, internationalOut:20-i%2, internal:117+i*2, total:280+i*4})),
    byCompany: [{companyCode:'CSN',companyName:'南航',count:315,ratio:16.41},{companyCode:'CCA',companyName:'国航',count:283,ratio:14.74},{companyCode:'CES',companyName:'东航',count:242,ratio:12.6},{companyCode:'CHH',companyName:'海航',count:188,ratio:9.79},{companyCode:'CSC',companyName:'川航',count:161,ratio:8.39}],
    byDeparture: [{city:'北京',count:289},{city:'青岛',count:145},{city:'沈阳',count:129},{city:'大连',count:120},{city:'济南',count:104}],
    byArrival: [{city:'北京',count:315},{city:'青岛',count:130},{city:'大连',count:126},{city:'沈阳',count:122},{city:'济南',count:109}],
    topCities: [{city:'北京',count:604},{city:'青岛',count:275},{city:'大连',count:246},{city:'沈阳',count:251},{city:'济南',count:213}]
  },
  airlines: {startDate:'2026-09-29',endDate:'2026-10-05',totalFlights:1920,list:[{companyCode:'CSN',companyName:'南航',fullName:'中国南方航空股份有限公司',flightCount:315,delayCount:44,delayRate:13.97,avgDelayMinutes:60.34,ratio:16.41},{companyCode:'CCA',companyName:'国航',fullName:'中国国际航空股份有限公司',flightCount:283,delayCount:32,delayRate:11.31,avgDelayMinutes:55.75,ratio:14.74},{companyCode:'CES',companyName:'东航',fullName:'中国东方航空股份有限公司',flightCount:242,delayCount:27,delayRate:11.16,avgDelayMinutes:48.2,ratio:12.6},{companyCode:'CHH',companyName:'海航',fullName:'海南航空控股股份有限公司',flightCount:188,delayCount:19,delayRate:10.11,avgDelayMinutes:45.8,ratio:9.79},{companyCode:'CSC',companyName:'川航',fullName:'四川航空股份有限公司',flightCount:161,delayCount:15,delayRate:9.32,avgDelayMinutes:41.6,ratio:8.39}]},
  companyTrend: {companyCode:'ALL',companyName:'全部航司',dates:['09-22','09-23','09-24','09-25','09-26','09-27','09-28','09-29','09-30','10-01','10-02','10-03','10-04','10-05'].map(d=>`2026-${d}`),flightCount:[274,265,272,271,284,276,268,280,276,271,271,276,276,270],delayRate:[10.8,11.3,10.4,12.1,11.7,12.8,13.2,10.6,11.4,12.0,13.5,12.6,12.2,12.8]},
  airportLoad: {startDate:'2026-09-29',endDate:'2026-10-05',list:[{airportCode:'ZBAA',airportName:'北京首都国际机场',city:'北京',sectorCode:'G',takeoffCount:188,landingCount:235,total:423},{airportCode:'ZSQD',airportName:'青岛胶东国际机场',city:'青岛',sectorCode:'K',takeoffCount:145,landingCount:130,total:275},{airportCode:'ZYTX',airportName:'沈阳桃仙国际机场',city:'沈阳',sectorCode:'G',takeoffCount:132,landingCount:121,total:253},{airportCode:'ZYTL',airportName:'大连周水子国际机场',city:'大连',sectorCode:'G',takeoffCount:118,landingCount:126,total:244},{airportCode:'ZSJN',airportName:'济南遥墙国际机场',city:'济南',sectorCode:'K',takeoffCount:111,landingCount:104,total:215},{airportCode:'ZLIC',airportName:'西安咸阳国际机场',city:'西安',sectorCode:'K',takeoffCount:97,landingCount:102,total:199},{airportCode:'ZSPD',airportName:'上海浦东国际机场',city:'上海',sectorCode:'E',takeoffCount:94,landingCount:101,total:195},{airportCode:'ZSHC',airportName:'杭州萧山国际机场',city:'杭州',sectorCode:'E',takeoffCount:86,landingCount:91,total:177}]},
  airportTrend:{airportCode:null,airportName:'全部机场',dates:['09-29','09-30','10-01','10-02','10-03','10-04','10-05'].map(d=>`2026-${d}`),takeoffCount:[280,276,271,271,276,276,270],landingCount:[280,276,271,271,276,276,270]},
  sectorCount:{startDate:'2026-10-05',endDate:'2026-10-05',list:[{sectorCode:'G',sectorName:'G扇区（北部）',takeoffCount:102,landingCount:94,passCount:8,totalCount:204},{sectorCode:'K',sectorName:'K扇区（中部）',takeoffCount:69,landingCount:62,passCount:93,totalCount:224},{sectorCode:'E',sectorName:'E扇区（南部）',takeoffCount:65,landingCount:57,passCount:43,totalCount:165}]},
  sectorTrend:{startDate:'2026-09-29',endDate:'2026-10-05',dates:['09-29','09-30','10-01','10-02','10-03','10-04','10-05'].map(d=>`2026-${d}`),series:[{sectorCode:'G',sectorName:'G扇区（北部）',data:[208,202,199,203,201,211,204]},{sectorCode:'K',sectorName:'K扇区（中部）',data:[241,232,228,225,232,231,224]},{sectorCode:'E',sectorName:'E扇区（南部）',data:[167,159,154,160,158,165,165]}]},
  sectorFlow:{date:'2026-10-05',hours:Array.from({length:24},(_,i)=>String(i).padStart(2,'0')+':00'),series:[{sectorCode:'G',sectorName:'G扇区（北部）',capacity:30,data:[7,0,0,0,0,0,2,5,12,18,26,24,19,21,22,20,16,10,8,5,3,2,1,0]},{sectorCode:'K',sectorName:'K扇区（中部）',capacity:36,data:[12,1,0,0,0,0,3,8,15,19,22,21,18,20,23,18,14,11,8,6,4,2,1,0]},{sectorCode:'E',sectorName:'E扇区（南部）',capacity:28,data:[5,0,0,0,0,0,2,4,9,13,17,16,15,18,20,17,13,9,7,4,3,2,1,0]}],peak:{sectorCode:'G',hour:'10:00',flightCount:26}},
  saturationLatest:[{sectorCode:'G',sectorName:'G扇区（北部）',value:45.34,level:'正常',thbhTime:'2026-10-05 14:00:00'},{sectorCode:'K',sectorName:'K扇区（中部）',value:35.03,level:'正常',thbhTime:'2026-10-05 14:00:00'},{sectorCode:'E',sectorName:'E扇区（南部）',value:32.49,level:'正常',thbhTime:'2026-10-05 14:00:00'}],
  saturationList:{date:'2026-10-05',times:Array.from({length:29},(_,i)=>String(Math.floor(i/2)).padStart(2,'0')+':'+(i%2?'30':'00')),series:[{sectorCode:'G',sectorName:'G扇区（北部）',data:Array.from({length:29},(_,i)=>Math.round((20+Math.sin(i/4)*23+i*.55)*100)/100),avg:34.86,max:77.79},{sectorCode:'K',sectorName:'K扇区（中部）',data:Array.from({length:29},(_,i)=>Math.round((18+Math.cos(i/5)*18+i*.45)*100)/100),avg:34.47,max:66.69},{sectorCode:'E',sectorName:'E扇区（南部）',data:Array.from({length:29},(_,i)=>Math.round((16+Math.sin(i/3)*16+i*.42)*100)/100),avg:31.85,max:58.12}]},
  warnStat:{startDate:'2026-09-06',endDate:'2026-10-05',list:[{sectorCode:'G',sectorName:'G扇区（北部）',flightWarn:61,similarWarn:62,tpWarn:118,total:241},{sectorCode:'K',sectorName:'K扇区（中部）',flightWarn:21,similarWarn:35,tpWarn:48,total:104},{sectorCode:'E',sectorName:'E扇区（南部）',flightWarn:12,similarWarn:19,tpWarn:38,total:69}],total:414},
  warnSummary:{date:'2026-10-05',flightWarn:4,similarWarn:6,tpWarn:3,total:13,unhandled:11},
  annualWarn:{startDate:'2026-01-01',endDate:'2026-10-05',months:['01','02','03','04','05','06','07','08','09','10'],flightWarn:[18,24,21,31,29,35,42,38,47,13],similarWarn:[22,28,26,34,31,38,45,49,54,18],tpWarn:[182,257,196,179,188,194,205,214,226,196],total:[222,309,243,244,248,267,292,301,327,227],yearTotal:2678,lastYearTotal:3320,lastYearSamePeriod:2784,periodEnd:'2026-10-05',yoy:-3.81},
  tpAnalysis:{startDate:'2026-09-29',endDate:'2026-10-05',total:46,handledCount:37,handledRate:80.43,byType:[{conflictType:'高度冲突',count:22},{conflictType:'航向冲突',count:7},{conflictType:'速度冲突',count:6},{conflictType:'超出扇区限制',count:6},{conflictType:'非标准高度层',count:5}],byLevel:[{level:1,levelName:'提示',count:5},{level:2,levelName:'警告',count:18},{level:3,levelName:'严重',count:23}],bySector:[{sectorCode:'G',sectorName:'G扇区（北部）',count:27},{sectorCode:'K',sectorName:'K扇区（中部）',count:11},{sectorCode:'E',sectorName:'E扇区（南部）',count:8}],byHour:[0,0,0,0,0,0,0,1,2,3,4,2,5,4,3,3,4,3,2,2,1,1,0,0],topControllers:[{controller:'高远',count:5},{controller:'冯博',count:4},{controller:'李强',count:4},{controller:'赵敏',count:3}],topFlights:[{acid:'CCA5636',count:3},{acid:'CSN5767',count:2},{acid:'CES4198',count:2}]},
  radar:{updateTime:'2026-10-05 14:30:45',replay:true,total:18,warnCount:3,list:[{id:1,flightNo:'CCA1315',trackNum:'5792',longitude:120.7,latitude:40.5,altitude:10700,speed:848,direction:243,sectorCode:'G',sectorName:'G扇区（北部）',status:'CRZ',statusName:'巡航',companyName:'国航',aircraftType:'B738',warn:true,predictWarn:false,warnTypes:['SIMILAR'],warnMessages:['CCA1315 与 CCA1351 航班号相似']},{id:2,flightNo:'AAR218',trackNum:'4140',longitude:124.93,latitude:37.86,altitude:8900,speed:805,direction:105,sectorCode:'K',sectorName:'K扇区（中部）',status:'CRZ',statusName:'巡航',companyName:'韩亚航空',aircraftType:'B789',warn:false,predictWarn:false,warnTypes:[],warnMessages:[]},{id:3,flightNo:'CHH7342',trackNum:'3327',longitude:121.08,latitude:37.91,altitude:9100,speed:790,direction:27,sectorCode:'K',sectorName:'K扇区（中部）',status:'CRZ',statusName:'巡航',companyName:'海航',aircraftType:'B737',warn:true,predictWarn:false,warnTypes:['DANGER'],warnMessages:['与 CSC8617 存在危险接近']},{id:4,flightNo:'CSC8617',trackNum:'1974',longitude:121.18,latitude:37.92,altitude:9100,speed:782,direction:207,sectorCode:'K',sectorName:'K扇区（中部）',status:'CRZ',statusName:'巡航',companyName:'川航',aircraftType:'A320',warn:true,predictWarn:true,warnTypes:['DANGER'],warnMessages:['预计 32 秒后进入危险接近']},{id:5,flightNo:'CSN3792',trackNum:'6501',longitude:118.2,latitude:39.6,altitude:9800,speed:800,direction:160,sectorCode:'G',sectorName:'G扇区（北部）',status:'CLB',statusName:'爬升',companyName:'南航',aircraftType:'A321',warn:false,predictWarn:false,warnTypes:[],warnMessages:[]},{id:6,flightNo:'CES2386',trackNum:'8120',longitude:118.28,latitude:39.64,altitude:9800,speed:805,direction:340,sectorCode:'G',sectorName:'G扇区（北部）',status:'CLB',statusName:'爬升',companyName:'东航',aircraftType:'A320',warn:false,predictWarn:false,warnTypes:[],warnMessages:[]},{id:7,flightNo:'OKA2338',trackNum:'2811',longitude:126.2,latitude:38.9,altitude:11250,speed:760,direction:65,sectorCode:'K',sectorName:'K扇区（中部）',status:'CRZ',statusName:'巡航',companyName:'大韩航空',aircraftType:'B777',warn:false,predictWarn:false,warnTypes:[],warnMessages:[]},{id:8,flightNo:'CSZ7321',trackNum:'9031',longitude:117.9,latitude:40.1,altitude:10200,speed:720,direction:230,sectorCode:'G',sectorName:'G扇区（北部）',status:'DSC',statusName:'下降',companyName:'春秋',aircraftType:'A320',warn:false,predictWarn:false,warnTypes:[],warnMessages:[]},{id:9,flightNo:'CCA5636',trackNum:'3881',longitude:125.2,latitude:36.9,altitude:8600,speed:750,direction:120,sectorCode:'E',sectorName:'E扇区（南部）',status:'CRZ',statusName:'巡航',companyName:'国航',aircraftType:'B738',warn:false,predictWarn:false,warnTypes:[],warnMessages:[]}]},
  sectorSummary:{list:[{sectorCode:'G',sectorName:'G扇区（北部）',frequency:'125.85',capacity:30,trackCount:7,warnCount:1,dangerCount:0,predictCount:0,similarCount:1,conflictCount:2,saturation:45.34,saturationLevel:'正常',loadRate:23.3,onDuty:[{controllerName:'李强',controllerCode:'GK002',position:'主班管制员',startTime:'2026-10-05 08:00:00',endTime:'2026-10-05 16:00:00'},{controllerName:'王磊',controllerCode:'GK003',position:'副班管制员',startTime:'2026-10-05 08:00:00',endTime:'2026-10-05 16:00:00'}]},{sectorCode:'K',sectorName:'K扇区（中部）',frequency:'127.35',capacity:36,trackCount:5,warnCount:2,dangerCount:1,predictCount:1,similarCount:0,conflictCount:0,saturation:35.03,saturationLevel:'正常',loadRate:13.9,onDuty:[{controllerName:'刘洋',controllerCode:'GK004',position:'主班管制员',startTime:'2026-10-05 08:00:00',endTime:'2026-10-05 16:00:00'}]},{sectorCode:'E',sectorName:'E扇区（南部）',frequency:'128.15',capacity:28,trackCount:7,warnCount:0,dangerCount:0,predictCount:0,similarCount:0,conflictCount:1,saturation:32.49,saturationLevel:'正常',loadRate:25,onDuty:[{controllerName:'董瑞',controllerCode:'GK029',position:'主班管制员',startTime:'2026-10-05 08:00:00',endTime:'2026-10-05 16:00:00'}]}],totalTracks:19,totalWarns:3},
  liveWarnings:{updateTime:'2026-10-05 14:30:45',total:3,list:[{type:'DANGER',typeName:'危险接近',level:'告警',flights:['CHH7342','CSC8617'],trackNums:['3327','1974'],sectorCode:'K',sectorName:'K扇区（中部）',horizontalKm:12.0,verticalM:0,bearingDeg:26.89,predicted:false,predictSeconds:0,cpaKm:12.0,message:'CHH7342 与 CSC8617 水平距离 12.0 公里、垂直间隔 0 米，存在相撞危险',warnId:2152,warnTable:'flight',handled:false},{type:'SIMILAR',typeName:'相似航班号',level:'提示',flights:['CCA1315','CCA1351'],sectorCode:'G',sectorName:'G扇区（北部）',horizontalKm:0,verticalM:0,predicted:false,message:'CCA1315 与 CCA1351 航班号相似（数字颠倒）',warnId:2857,warnTable:'similar',handled:false},{type:'DANGER',typeName:'危险接近预警',level:'预警',flights:['CSC8617','CHH7342'],sectorCode:'K',sectorName:'K扇区（中部）',horizontalKm:16.4,verticalM:0,predicted:true,predictSeconds:32,cpaKm:8.5,message:'预计 32 秒后最近水平距离 8.5 公里',warnId:null,warnTable:'flight',handled:false}]},
  duty:[{id:133,dutyDate:'2026-10-05',sectorCode:null,controllerName:'张伟',controllerCode:'GK001',position:'带班主任',startTime:'2026-10-05 00:00:00',endTime:'2026-10-05 08:00:00'},{id:131,dutyDate:'2026-10-05',sectorCode:'E',controllerName:'董瑞',controllerCode:'GK029',position:'主班管制员',startTime:'2026-10-05 08:00:00',endTime:'2026-10-05 16:00:00'},{id:132,dutyDate:'2026-10-05',sectorCode:'K',controllerName:'刘洋',controllerCode:'GK004',position:'主班管制员',startTime:'2026-10-05 08:00:00',endTime:'2026-10-05 16:00:00'}],
  flightTrack:{flightNo:'AAR218',points:[{longitude:121.48,latitude:38.78,altitude:8900,time:'2026-10-05 14:26:02'},{longitude:123.21,latitude:38.32,altitude:8900,time:'2026-10-05 14:28:24'},{longitude:124.93,latitude:37.86,altitude:8900,time:'2026-10-05 14:30:45'}],current:{flightNo:'AAR218',companyName:'韩亚航空',aircraftType:'B789',longitude:124.93,latitude:37.86,altitude:8900,speed:805,direction:105,sectorCode:'K',sectorName:'K扇区（中部）',statusName:'巡航'}}
}

/* ============ 演示模式辅助：让回退数据随查询参数变化 ============ */
const demoEnabled = () => import.meta.env.VITE_DEMO_FALLBACK !== 'false'
// 仅在网络异常/代理失败（无响应或 5xx）时回退，不掩盖后端业务错误
const isDownstreamError = e => !e?.bizError && (!e?.response || (e.response.status >= 500))

function hashSeed(str) {
  let h = 0
  for (const c of String(str || 'demo')) h = (h * 131 + c.charCodeAt(0)) >>> 0
  return h
}
// 同一日期得到稳定系数（0.86~1.13），不同日期数据有可见差异
function dateFactor(key) { return Math.round((0.86 + (hashSeed(key) % 28) / 100) * 100) / 100 }

const SCALE_SKIP_KEY = /coord|longitude|latitude|capacity|frequency|^id$|sectorcode/i
// 按系数缩放演示数据中的数值（坐标/容量等保持不变）
function scaleNumbers(obj, factor) {
  if (Array.isArray(obj)) return obj.map(v => scaleNumbers(v, factor))
  if (obj && typeof obj === 'object') {
    const out = {}
    for (const [k, v] of Object.entries(obj)) {
      out[k] = SCALE_SKIP_KEY.test(k) ? v : scaleNumbers(v, factor)
    }
    return out
  }
  if (typeof obj === 'number') {
    const n = obj * factor
    return Number.isInteger(obj) ? Math.round(n) : Math.round(n * 100) / 100
  }
  return obj
}

const fmtDate = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
function addDays(date, delta) { const d = new Date(date); d.setDate(d.getDate() + delta); return d }

// 按查询参数生成演示数据：数值随日期变化，日期标签同步为请求的日期
function withDate(base, p = {}) {
  const out = scaleNumbers(base, dateFactor(p.date || p.endDate || p.startDate))
  if (out && typeof out === 'object') {
    if (p.date) {
      if ('statDate' in out) out.statDate = p.date
      if ('date' in out) out.date = p.date
    }
    if (p.startDate && 'startDate' in out) out.startDate = p.startDate
    if (p.endDate && 'endDate' in out) out.endDate = p.endDate
  }
  return out
}

function buildAirlineStat(p) {
  const out = withDate(demo.airlineStat, p)
  if (p.endDate) {
    const end = new Date(`${p.endDate}T00:00:00`)
    out.byDate = out.byDate.map((row, i) => ({ ...row, date: fmtDate(addDays(end, i - out.byDate.length + 1)) }))
  }
  return out
}

function buildAnnualWarn(p) {
  // 与后端 /api/warn/annual 契约一致：只接收 year 参数，返回 12 个月数据
  const year = p.year || (p.endDate ? new Date(`${p.endDate}T00:00:00`).getFullYear() : 2026)
  const base = demo.annualWarn
  // 不同年份按稳定系数缩放（同一年份结果稳定，切换年份图表数据有可见变化）
  const factor = dateFactor('annual-' + year)
  // 演示基础数据只有 10 个月，11/12 月按月度走势补全
  const extend12 = arr => {
    const rest = [Math.round(arr[8] * 0.88), Math.round(arr[9] * 0.8)]
    return [...arr, ...rest].map(v => Math.round(v * factor))
  }
  const flightWarn = extend12(base.flightWarn)
  const similarWarn = extend12(base.similarWarn)
  const tpWarn = extend12(base.tpWarn)
  const total = flightWarn.map((v, i) => v + similarWarn[i] + tpWarn[i])
  const yearTotal = total.reduce((a, b) => a + b, 0)
  return {
    year,
    periodEnd: `${year}-12-31`,
    months: Array.from({ length: 12 }, (_, i) => `${i + 1}月`),
    flightWarn, similarWarn, tpWarn, total,
    yearTotal,
    lastYearTotal: Math.round(yearTotal / (1 - base.yoy / 100)),
    lastYearSamePeriod: Math.round(yearTotal * 1.04),
    yoy: base.yoy
  }
}

function buildAirlineList(p) {
  return withDate({
    startDate: '2026-09-29', endDate: '2026-10-05',
    list: demo.radar.list.slice(0, 5).map((f, i) => ({ adep: ['ZYTX', 'ZSJN', 'ZBAA', 'ZYTL', 'ZSPD'][i], ades: ['ZBTJ', 'ZBAD', 'ZSQD', 'ZSQD', 'ZSHC'][i], depName: '起飞机场', arrName: '落地机场', depCity: '城市', arrCity: '城市', depCoord: [f.longitude, f.latitude], arrCoord: [f.longitude + 1.2, f.latitude - 0.6], flightType: 0, direction: 'INTERNAL', flightCount: 26 - i * 3 }))
  }, p)
}

/* ============ 实时监控：扇区过滤 / 已处理告警的本地状态 ============ */
const handledWarns = new Set()
const handledKey = (type, id) => `${type}:${id}`

function buildRadar(p) {
  if (!p?.sectorCode) return demo.radar
  const list = demo.radar.list.filter(f => f.sectorCode === p.sectorCode)
  return { ...demo.radar, list, total: list.length, warnCount: list.filter(f => f.warn).length }
}
function buildSectorSummary(p) {
  const list = p?.sectorCode ? demo.sectorSummary.list.filter(s => s.sectorCode === p.sectorCode) : demo.sectorSummary.list
  return {
    list,
    totalTracks: list.reduce((a, s) => a + s.trackCount, 0),
    totalWarns: list.reduce((a, s) => a + s.warnCount, 0)
  }
}
function buildLiveWarnings(p) {
  let list = demo.liveWarnings.list.filter(w => w.warnId == null || !handledWarns.has(handledKey(w.warnTable, w.warnId)))
  if (p?.sectorCode) list = list.filter(w => w.sectorCode === p.sectorCode)
  return { ...demo.liveWarnings, list, total: list.length }
}

/* ============ 管制指令本地纠错 ============
   规则逐行复刻后端 services/monitor_service.py + services/geo.py + config.py，
   保证后端宕机进入演示模式时，检查结论与真实接口完全一致。 */
const LC = {
  ALT_MIN: 600, ALT_MAX: 12500,          // 允许的高度范围（米）
  SPD_MIN: 300, SPD_MAX: 1000,           // 允许的速度范围（公里/小时）
  ALT_RADIUS: 50, SEP: 300, ALT_REPEAT: 50,
  SPD_AHEAD: 30, SPD_REPEAT: 10,
  HDG_RADIUS: 50, HDG_CONE: 15, HDG_MARGIN: 5, HDG_REPEAT: 3,
  MAX_ISSUES: 5, WARN_MIN_ALT: 1000
}
const LEVEL_RANK = { OK: 0, INFO: 1, WARN: 2, ERROR: 3 }
// 扇区高度范围与后端 sql/kongguan.sql 初始化数据一致
const LOCAL_SECTORS = {
  G: { sectorCode: 'G', sectorName: 'G扇区（北部）', minAltitude: 1200, maxAltitude: 12500 },
  K: { sectorCode: 'K', sectorName: 'K扇区（中部）', minAltitude: 900, maxAltitude: 12500 },
  E: { sectorCode: 'E', sectorName: 'E扇区（南部）', minAltitude: 900, maxAltitude: 11900 }
}
const EARTH_R = 6371
const haversine = (lat1, lng1, lat2, lng2) => {
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2
  return 2 * EARTH_R * Math.asin(Math.min(1, Math.sqrt(a)))
}
const bearing = (lat1, lng1, lat2, lng2) => {
  const rl1 = lat1 * Math.PI / 180, rl2 = lat2 * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const x = Math.sin(dLng) * Math.cos(rl2)
  const y = Math.cos(rl1) * Math.sin(rl2) - Math.sin(rl1) * Math.cos(rl2) * Math.cos(dLng)
  return (Math.atan2(x, y) * 180 / Math.PI + 360) % 360
}
const angleDiff = (a, b) => { const d = Math.abs(((a - b) % 360 + 360) % 360); return d > 180 ? 360 - d : d }
const STANDARD_LEVELS = [...Array.from({ length: (8400 - 600) / 300 + 1 }, (_, i) => 600 + i * 300),
  ...Array.from({ length: (12500 - 8900) / 300 + 1 }, (_, i) => 8900 + i * 300)]
function isStandardLevel(v) {
  v = Math.round(Number(v))
  if (600 <= v && v <= 8400) return v % 300 === 0
  if (8900 <= v && v <= 12500) return (v - 8900) % 300 === 0
  return false
}
function nearestStandardLevel(v, exclude) {
  const blocked = new Set(exclude || [])
  const candidates = STANDARD_LEVELS.filter(lv => !blocked.has(lv))
  if (!candidates.length) return null
  return candidates.reduce((best, lv) => Math.abs(lv - v) < Math.abs(best - v) ? lv : best, candidates[0])
}
const pad3 = v => String(v).padStart(3, '0')
const issue = (level, type, message, conflictFlightNo) => ({ level, type, message, conflictFlightNo: conflictFlightNo || null })

function nearby(track, tracks) {
  if (track.latitude == null || track.longitude == null) return []
  const out = []
  for (const o of tracks) {
    if (o.flightNo === track.flightNo || o.latitude == null || o.longitude == null) continue
    out.push([o, haversine(track.latitude, track.longitude, o.latitude, o.longitude)])
  }
  return out.sort((a, b) => a[1] - b[1])
}
const occupiedAlts = o => [o.altitude, o.cruiseAltitude].filter(a => a != null)

function suggestLevel(value, near, sector) {
  let low = LC.ALT_MIN, high = LC.ALT_MAX
  if (sector) {
    if (sector.minAltitude != null) low = Math.max(low, sector.minAltitude)
    if (sector.maxAltitude != null) high = Math.min(high, sector.maxAltitude)
  }
  const blocked = new Set()
  for (const lv of STANDARD_LEVELS) {
    if (lv < low || lv > high) { blocked.add(lv); continue }
    for (const [o, dist] of near) {
      if (dist >= LC.ALT_RADIUS || (o.altitude || 0) < LC.WARN_MIN_ALT) continue
      if (occupiedAlts(o).some(a => Math.abs(lv - a) < LC.SEP)) { blocked.add(lv); break }
    }
  }
  return nearestStandardLevel(value, blocked)
}

function checkAltitude(track, near, value, sector) {
  const issues = []
  const current = track.altitude || 0
  let outOfRange = false
  if (value < LC.ALT_MIN || value > LC.ALT_MAX) {
    outOfRange = true
    issues.push(issue('ERROR', '超出扇区限制', `目标高度 ${value} 米超出管制允许的高度范围（${LC.ALT_MIN}~${LC.ALT_MAX} 米）`))
  } else if (sector && sector.minAltitude != null && sector.maxAltitude != null && !(sector.minAltitude <= value && value <= sector.maxAltitude)) {
    outOfRange = true
    issues.push(issue('ERROR', '超出扇区限制', `目标高度 ${value} 米超出${sector.sectorName}的高度范围（${sector.minAltitude}~${sector.maxAltitude} 米）`))
  }
  if (!outOfRange && !isStandardLevel(value)) {
    issues.push(issue('WARN', '非标准高度层', `${value} 米不是标准高度层，建议使用 ${nearestStandardLevel(value)} 米`))
  }
  if (Math.abs(value - current) < LC.ALT_REPEAT) {
    issues.push(issue('INFO', '重复指令', `目标高度 ${value} 米与当前高度 ${current} 米相差不足 ${LC.ALT_REPEAT} 米，属于重复指令`))
  }
  let conflicts = 0
  for (const [o, dist] of near) {
    if (dist >= LC.ALT_RADIUS) break
    if ((o.altitude || 0) < LC.WARN_MIN_ALT) continue
    const byCurrent = o.altitude != null && Math.abs(o.altitude - value) < LC.SEP
    const byCruise = o.cruiseAltitude != null && Math.abs(o.cruiseAltitude - value) < LC.SEP
    if (!(byCurrent || byCruise)) continue
    const detail = byCurrent ? `当前高度 ${o.altitude} 米` : `巡航高度 ${o.cruiseAltitude} 米`
    issues.push(issue('ERROR', '高度冲突', `目标高度 ${value} 米与 ${o.flightNo} 冲突：其水平距离 ${dist.toFixed(1)} 公里，${detail}，垂直间隔不足 ${LC.SEP} 米`, o.flightNo))
    if (++conflicts >= LC.MAX_ISSUES) break
  }
  let suggestion = null
  if (issues.some(i => i.level === 'ERROR' || i.level === 'WARN')) {
    const lv = suggestLevel(value, near, sector)
    suggestion = lv == null
      ? '附近暂无可用的标准高度层，建议保持当前高度并与相关航班协调'
      : `建议改为 ${lv} 米（附近未被占用的标准高度层）`
  }
  return [issues, suggestion]
}

function checkSpeed(track, near, value) {
  const issues = []
  let suggestion = null
  const current = track.speed || 0
  if (value < LC.SPD_MIN || value > LC.SPD_MAX) {
    issues.push(issue('ERROR', '速度冲突', `目标速度 ${value} 公里/小时超出允许范围（${LC.SPD_MIN}~${LC.SPD_MAX} 公里/小时）`))
    suggestion = `建议速度调整为 ${Math.min(Math.max(value, LC.SPD_MIN), LC.SPD_MAX)} 公里/小时（允许范围 ${LC.SPD_MIN}~${LC.SPD_MAX} 公里/小时）`
  }
  if (Math.abs(value - current) < LC.SPD_REPEAT) {
    issues.push(issue('INFO', '重复指令', `目标速度 ${value} 公里/小时与当前速度 ${current} 公里/小时相差不足 ${LC.SPD_REPEAT}，属于重复指令`))
  }
  const frontSpeeds = []
  let count = 0
  for (const [o, dist] of near) {
    if (dist > LC.SPD_AHEAD) break
    // 演示航迹快照无起降机场字段，无法判定“同一航线”时跳过追尾检查（真实数据由后端判定）
    if (!track.adep || !o.adep) continue
    if (o.adep !== track.adep || o.ades !== track.ades) continue
    if (angleDiff(bearing(track.latitude, track.longitude, o.latitude, o.longitude), track.direction || 0) >= 90) continue
    if (Math.abs((o.altitude || 0) - (track.altitude || 0)) >= LC.SEP) continue
    const otherSpeed = o.speed || 0
    if (value <= otherSpeed) continue
    issues.push(issue('WARN', '速度冲突', `前方 ${dist.toFixed(1)} 公里处 ${o.flightNo} 与本机同航线、同高度层（${o.altitude || 0} 米），其速度 ${otherSpeed} 公里/小时，新速度 ${value} 公里/小时更快，可能追尾接近`, o.flightNo))
    frontSpeeds.push(otherSpeed)
    if (++count >= LC.MAX_ISSUES) break
  }
  if (frontSpeeds.length) suggestion = `建议速度不超过前机速度 ${Math.min(...frontSpeeds)} 公里/小时，或先调整高度层、拉开间隔`
  return [issues, suggestion]
}

function headingConflicts(track, near, head, margin = 0) {
  const out = []
  for (const [o, dist] of near) {
    if (dist >= LC.HDG_RADIUS) break
    if (Math.abs((o.altitude || 0) - (track.altitude || 0)) >= LC.SEP) continue
    if (angleDiff(bearing(track.latitude, track.longitude, o.latitude, o.longitude), head) <= LC.HDG_CONE + margin) out.push([o, dist])
  }
  return out
}

function checkHeading(track, near, value) {
  const issues = []
  let suggestion = null
  const current = track.direction || 0
  if (angleDiff(value, current) < LC.HDG_REPEAT) {
    issues.push(issue('INFO', '重复指令', `目标航向 ${pad3(value)} 与当前航向 ${pad3(current)} 相差不足 ${LC.HDG_REPEAT} 度，属于重复指令`))
  }
  const conflicts = headingConflicts(track, near, value)
  for (const [o, dist] of conflicts.slice(0, LC.MAX_ISSUES)) {
    issues.push(issue('ERROR', '航向冲突', `按航向 ${pad3(value)} 飞行，前方 ${dist.toFixed(1)} 公里处 ${o.flightNo} 高度 ${o.altitude || 0} 米（与本机高度差 ${Math.abs((o.altitude || 0) - (track.altitude || 0))} 米），存在航向冲突`, o.flightNo))
  }
  if (conflicts.length) {
    for (let step = 1; step < 25; step++) {
      let found = null
      for (const sign of [1, -1]) {
        const candidate = (value + sign * step * 5 + 360) % 360
        if (!headingConflicts(track, near, candidate, LC.HDG_MARGIN).length) { found = candidate; break }
      }
      if (found != null) { suggestion = `建议改为航向 ${pad3(found)}（避开前方 ${conflicts[0][0].flightNo}）`; break }
    }
    if (!suggestion) suggestion = `各方向均有航班，建议保持当前航向 ${pad3(current)} 并与相关航班协调`
  }
  return [issues, suggestion]
}

function buildInstructionText(track, type, value) {
  const no = track.flightNo
  if (type === 'ALT') {
    const current = track.altitude || 0
    if (Math.abs(value - current) < LC.ALT_REPEAT) return `${no} 保持高度 ${value} 米`
    return `${no} ${value > current ? '上升到' : '下降到'} ${value} 米保持`
  }
  if (type === 'SPD') return `${no} 保持速度 ${value} 公里/小时`
  const current = track.direction || 0
  if (angleDiff(value, current) < LC.HDG_REPEAT) return `${no} 保持航向 ${pad3(value)}`
  const turn = ((value - current) % 360 + 360) % 360 <= 180 ? '右转' : '左转'
  return `${no} ${turn}航向 ${pad3(value)}`
}

function localInstructionCheck(p) {
  // 参数校验（与后端 api/monitor.py 的 ParamError 顺序、文案一致；演示模式下以抛出异常模拟 400）
  const flightNo = String(p.flightNo || '').trim()
  if (!flightNo) throw new Error('参数 flightNo 不能为空')
  const type = String(p.instructionType || '').toUpperCase()
  if (!['ALT', 'SPD', 'HDG'].includes(type)) throw new Error('参数 instructionType 取值必须为 ALT/SPD/HDG')
  const raw = p.value === null || p.value === undefined || p.value === '' ? null : Number(p.value)
  if (raw === null || Number.isNaN(raw)) throw new Error('参数 value 不能为空')
  if (!Number.isFinite(raw) || Math.abs(raw) > 1000000) throw new Error('参数 value 数值不合法')
  if (type === 'HDG' && !(0 <= raw && raw <= 359)) throw new Error('航向指令的 value 必须在 0~359 之间')
  let value = Math.round(raw)
  if (type === 'HDG') value %= 360
  const tracks = demo.radar.list
  const track = tracks.find(f => f.flightNo?.toUpperCase() === flightNo.toUpperCase())
  if (!track) throw new Error('航班不在当前监控空域')

  const sector = LOCAL_SECTORS[track.sectorCode] || null
  const near = nearby(track, tracks)
  let issues, suggestion
  if (type === 'ALT') [issues, suggestion] = checkAltitude(track, near, value, sector)
  else if (type === 'SPD') [issues, suggestion] = checkSpeed(track, near, value)
  else [issues, suggestion] = checkHeading(track, near, value)

  issues.sort((a, b) => LEVEL_RANK[b.level] - LEVEL_RANK[a.level])
  const level = issues.length ? issues[0].level : 'OK'
  if (!issues.length) suggestion = '指令合理，可以发布'
  else if (level === 'INFO') suggestion = '该指令与当前状态基本一致，无需重复发布'
  else if (!suggestion) suggestion = '请核对后再发布指令'
  return {
    flightNo: track.flightNo,
    sectorCode: track.sectorCode,
    sectorName: track.sectorName,
    instructionType: type,
    value,
    instructionText: buildInstructionText(track, type, value),
    pass: level !== 'ERROR',
    level,
    issues,
    suggestion,
    current: { altitude: track.altitude, speed: track.speed, direction: track.direction },
    saved: false, instructionId: null, warnId: null
  }
}

export const getOverview = p => apiGet('/api/dashboard/overview', p, withDate(demo.overview, p))
export const getAirlineList = p => apiGet('/api/airline/list', p, buildAirlineList(p))
export const getAirlineStat = p => apiGet('/api/airline/stat', p, buildAirlineStat(p))
export const getAirportLoad = p => apiGet('/api/airport/load', p, withDate(demo.airportLoad, p))
export const getAirportLoadTrend = p => apiGet('/api/airport/load/trend', p, demo.airportTrend)
export const getCompanyList = p => apiGet('/api/company/list', p, withDate(demo.airlines, p))
export const getCompanyTrend = p => apiGet('/api/company/trend', p, demo.companyTrend)
export const getSectorCount = p => apiGet('/api/sector/count', p, withDate(demo.sectorCount, p))
export const getSectorCountTrend = p => apiGet('/api/sector/count/trend', p, demo.sectorTrend)
export const getSectorFlow = p => apiGet('/api/sector/flow', p, withDate(demo.sectorFlow, p))
export const getSectorList = p => apiGet('/api/sector/list', {}, demo.sectorSummary.list.map((s, i) => ({ id: i + 1, sectorCode: s.sectorCode, sectorName: s.sectorName, minLat: 35.5 + i, maxLat: 42.3 - i, minLng: 114.6, maxLng: 128.76, minAltitude: 900, maxAltitude: 12500, capacity: s.capacity, frequency: s.frequency, sort: i + 1 })))
export const getSaturationLatest = p => apiGet('/api/callsaturation/latest', p, demo.saturationLatest)
export const getSaturationList = p => apiGet('/api/callsaturation/list', p, withDate(demo.saturationList, p))
export const getWarnAnnual = p => apiGet('/api/warn/annual', p, buildAnnualWarn(p))
export const getWarnStat = p => apiGet('/api/warn/stat', p, withDate(demo.warnStat, p))
export const getWarnSummary = p => apiGet('/api/warn/summary', p, demo.warnSummary)
export const getTpAnalysis = p => apiGet('/api/warn/tp/analysis', p, withDate(demo.tpAnalysis, p))
export const getWarnFlightList = p => apiGet('/api/warn/flight/list', p, { list: demo.liveWarnings.list.filter(x => x.warnTable === 'flight').map((x, i) => ({ id: x.warnId || i + 1, gjType: x.typeName, gjMsgType: x.level, gjTrackNum1: x.flights[0], gjTrackNum2: x.flights[1], gjDistinct: x.horizontalKm, gjHeightDiff: x.verticalM, gjName: x.message, gjStatus: x.handled ? 1 : 0, gjStatusName: x.handled ? '已处理' : '未处理', gjSector: x.sectorCode, sectorName: x.sectorName, gjDate: demo.liveWarnings.updateTime })), total: 3, page: 1, pageSize: 10 })
export const getRadarFlights = p => apiGet('/api/radar/flight/list', p, buildRadar(p))
export const getRadarTrack = p => apiGet('/api/radar/flight/track', p, demo.flightTrack)
export const getSectorSummary = p => apiGet('/api/monitor/sector/summary', p, buildSectorSummary(p))
export const getLiveWarnings = p => apiGet('/api/monitor/warnings', p, buildLiveWarnings(p))
export const getDutyList = p => apiGet('/api/atc/duty/list', p, demo.duty)
export const getInstructionStat = p => apiGet('/api/atc/instruction/stat', p, { dates: demo.sectorFlow.hours.slice(0, 7), instructionCount: [355, 348, 346, 322, 367, 337, 349], conflictCount: [4, 7, 8, 6, 10, 8, 7], byType: [{ instructionType: 'ALT', name: '高度指令', count: 1118 }, { instructionType: 'HDG', name: '航向指令', count: 540 }, { instructionType: 'SPD', name: '速度指令', count: 274 }, { instructionType: 'HANDOVER', name: '移交', count: 94 }] })

export async function checkInstruction(p) {
  const silent = demoEnabled()
  try {
    return await apiPost('/api/monitor/instruction/check', p, { skipErrorMessage: silent })
  } catch (e) {
    if (!silent || !isDownstreamError(e)) throw e
    return localInstructionCheck(p)
  }
}

export async function handleWarn(type, id) {
  const silent = demoEnabled()
  try {
    return await apiPut(`/api/warn/${type}/${id}/handle`, {}, { skipErrorMessage: silent })
  } catch (e) {
    if (!silent || !isDownstreamError(e)) throw e
    handledWarns.add(handledKey(type, id))
    return true
  }
}

export const demoData = demo
