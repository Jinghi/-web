<template>
  <div class="dashboard-page">
    <section class="hero-row">
      <div><div class="eyebrow">AIR TRAFFIC ANALYTICS</div><h1>航空运行数据驾驶舱</h1><p>基于航线、机场、航司、扇区、通信与告警数据的统一分析视图</p></div>
      <div class="filter-box">
        <span class="filter-label">统计日期</span>
        <el-date-picker v-model="selectedDate" type="date" value-format="YYYY-MM-DD" size="small" :clearable="false" />
        <el-button type="primary" size="small" :loading="loading" @click="refreshAll">刷新数据</el-button>
      </div>
    </section>

    <section class="kpi-grid">
      <div v-for="item in kpis" :key="item.key" class="kpi-card">
        <div class="kpi-icon">{{ item.icon }}</div><div class="kpi-copy"><div class="kpi-label">{{ item.label }}</div><div class="kpi-value">{{ formatKpi(overview[item.key], item.unit) }}</div><div class="kpi-meta">{{ item.meta }}</div></div>
      </div>
    </section>

    <section class="grid-two">
      <ChartPanel v-if="auth.has('panel:sectorFlow')" title="扇区小时架次动态" sub-title="24H FLOW / 监测航班数量" :option="sectorFlowOption" :loading="loading" />
      <ChartPanel v-if="auth.has('panel:airline')" title="动态航线图" sub-title="TOP ROUTES / 近7日架次" :option="routeOption" :loading="loading" />
    </section>

    <section v-if="auth.hasAny(['panel:airportLoad','panel:company','panel:sectorCount'])" class="grid-three">
      <ChartPanel v-if="auth.has('panel:airportLoad')" title="机场起降负荷 TOP8" sub-title="AIRPORT LOAD" :option="airportOption" :loading="loading" />
      <ChartPanel v-if="auth.has('panel:company')" title="航司架次与延误率" sub-title="AIRLINE PERFORMANCE" :option="companyOption" :loading="loading" />
      <ChartPanel v-if="auth.has('panel:sectorCount')" title="扇区架次构成" sub-title="SECTOR COUNT" :option="sectorCountOption" :loading="loading" />
    </section>

    <section v-if="auth.hasAny(['panel:callSaturation','panel:warnStat'])" class="grid-two">
      <ChartPanel v-if="auth.has('panel:callSaturation')" title="通话饱和度趋势" sub-title="VOICE SATURATION" :option="saturationOption" :loading="loading" />
      <ChartPanel v-if="auth.has('panel:warnStat')" title="告警类型与扇区分布" sub-title="WARNING STATISTICS" :option="warnOption" :loading="loading" />
    </section>

    <section v-if="auth.hasAny(['panel:annualWarn','panel:conflict'])" class="grid-two bottom-row">
      <ChartPanel v-if="auth.has('panel:annualWarn')" title="年度告警趋势" sub-title="ANNUAL WARNING / 月度" :option="annualWarnOption" :loading="loading" />
      <div v-if="auth.has('panel:conflict')" class="panel conflict-summary">
        <div class="panel-header"><div><h3>冲突指令分析</h3><span>CONFLICT COMMAND / C.10</span></div><div class="handled-rate">{{ tpAnalysis.handledRate || 0 }}% <small>处理率</small></div></div>
        <div class="conflict-body">
          <div class="donut-wrap"><div class="donut" :style="donutStyle"></div><div class="donut-center"><b>{{ tpAnalysis.total || 0 }}</b><span>告警</span></div></div>
          <div class="conflict-list"><div v-for="item in (tpAnalysis.byType || [])" :key="item.conflictType" class="conflict-item"><span>{{ item.conflictType }}</span><b>{{ item.count }}</b><i :style="{width:`${Math.min(100,item.count / Math.max(1,tpAnalysis.total)*100)}%`}"></i></div></div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import ChartPanel from '@/components/ChartPanel.vue'
import { useAuthStore } from '@/store'
import { getAirlineList, getAirlineStat, getAirportLoad, getCompanyList, getOverview, getSectorCount, getSectorFlow, getSaturationList, getWarnAnnual, getWarnStat, getTpAnalysis } from '@/api/analysis'

const auth = useAuthStore()

const selectedDate = ref('2026-10-05')
const loading = ref(false)
const overview = ref({})
const airlineStat = ref({ byDate:[], byCompany:[] })
const routeList = ref([])
const airportLoad = ref({ list:[] })
const companyList = ref({ list:[] })
const sectorCount = ref({ list:[] })
const sectorFlow = ref({ hours:[], series:[] })
const saturation = ref({ times:[], series:[] })
const warnStat = ref({ list:[] })
const annualWarn = ref({ months:[], total:[], flightWarn:[], similarWarn:[], tpWarn:[] })
const tpAnalysis = ref({ total:0,handledRate:0,byType:[] })

const kpis = [
  { key:'flightCount', label:'航班架次', icon:'✈', unit:'', meta:'统计周期内运行航班' },
  { key:'delayRate', label:'延误率', icon:'◷', unit:'%', meta:'观测航班口径' },
  { key:'routeCount', label:'航线数量', icon:'↗', unit:'', meta:'起降机场去重' },
  { key:'airportCount', label:'活跃机场', icon:'⌂', unit:'', meta:'有统计数据机场' },
  { key:'companyCount', label:'航空公司', icon:'◎', unit:'', meta:'当日有航班航司' },
  { key:'inAirCount', label:'当前空中', icon:'◌', unit:'架', meta:'实时航迹快照' },
  { key:'warnCount', label:'当日告警', icon:'!', unit:'', meta:'三类告警合计' },
  { key:'avgSaturation', label:'平均通话饱和度', icon:'≈', unit:'%', meta:'控制区平均水平' },
]

const period = computed(() => { const end = new Date(`${selectedDate.value}T00:00:00`); const start = new Date(end); start.setDate(start.getDate() - 6); const fmt = d => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; return { startDate:fmt(start), endDate:fmt(end) } })
const tooltipBase = { trigger:'axis', backgroundColor:'rgba(5,17,34,.94)', borderColor:'rgba(96,190,255,.2)', textStyle:{color:'#dcefff'} }
const axis = { axisLine:{lineStyle:{color:'#294561'}}, axisLabel:{color:'#7392b0'}, splitLine:{lineStyle:{color:'rgba(75,108,139,.14)'}} }

const sectorFlowOption = computed(() => ({ tooltip:tooltipBase, legend:{top:0,textStyle:{color:'#84a6c6'}}, grid:{left:42,right:16,top:42,bottom:28}, xAxis:{type:'category',data:sectorFlow.value.hours || [], ...axis}, yAxis:{type:'value',...axis}, series:(sectorFlow.value.series || []).map((s,i)=>({name:s.sectorName,type:'line',smooth:true,showSymbol:false,data:s.data,lineStyle:{width:2}})) }))
const routeOption = computed(() => ({ tooltip:{trigger:'item',formatter:p => p.data?.name || ''}, grid:{left:54,right:20,top:20,bottom:34}, xAxis:{type:'value',min:114,max:129,name:'经度',nameTextStyle:{color:'#5e7894'},...axis},yAxis:{type:'value',min:34.8,max:42.8,name:'纬度',nameTextStyle:{color:'#5e7894'},...axis}, series:[{type:'lines',coordinateSystem:'cartesian2d',polyline:false,effect:{show:true,symbol:'circle',symbolSize:3,trailLength:.35},lineStyle:{color:'#52b6ff',width:1.1,opacity:.45},data:routeList.value.filter(r=>r.depCoord&&r.arrCoord).map(r=>({coords:[r.depCoord,r.arrCoord],name:`${r.depCity}-${r.arrCity} / ${r.flightCount} 架次`}))},{type:'scatter',symbolSize:v=>Math.max(6,Math.min(15,(v?.[2]||10)/2)),itemStyle:{color:'#6ad0ff',shadowBlur:14,shadowColor:'rgba(65,189,255,.55)'},data:routeList.value.flatMap(r=>[{value:[...(r.depCoord||[0,0]),r.flightCount],name:r.depName},{value:[...(r.arrCoord||[0,0]),r.flightCount],name:r.arrName}])}] }))
const airportOption = computed(() => ({ tooltip:tooltipBase, grid:{left:106,right:18,top:12,bottom:28}, xAxis:{type:'value',...axis}, yAxis:{type:'category',inverse:true,data:(airportLoad.value.list||[]).map(a=>a.airportName?.replace('国际机场','')||a.airportCode),axisLabel:{color:'#86a4bf',fontSize:11}}, series:[{type:'bar',name:'总架次',barWidth:12,data:(airportLoad.value.list||[]).map(a=>a.total),itemStyle:{borderRadius:[0,6,6,0]}}] }))
const companyOption = computed(() => ({ tooltip:tooltipBase, legend:{top:0,textStyle:{color:'#84a6c6'}}, grid:{left:44,right:44,top:42,bottom:30}, xAxis:{type:'category',data:(companyList.value.list||[]).map(c=>c.companyName),axisLabel:{color:'#7392b0',rotate:28,fontSize:10}}, yAxis:[{type:'value',name:'架次',...axis},{type:'value',name:'延误率%',...axis}], series:[{name:'航班架次',type:'bar',barWidth:18,data:(companyList.value.list||[]).map(c=>c.flightCount)},{name:'延误率',type:'line',yAxisIndex:1,smooth:true,data:(companyList.value.list||[]).map(c=>c.delayRate)}] }))
const sectorCountOption = computed(() => ({ tooltip:tooltipBase, legend:{top:0,textStyle:{color:'#84a6c6'}}, grid:{left:44,right:16,top:40,bottom:30}, xAxis:{type:'category',data:(sectorCount.value.list||[]).map(s=>s.sectorCode),...axis},yAxis:{type:'value',...axis},series:[{name:'起飞',type:'bar',stack:'total',data:(sectorCount.value.list||[]).map(s=>s.takeoffCount)},{name:'降落',type:'bar',stack:'total',data:(sectorCount.value.list||[]).map(s=>s.landingCount)},{name:'飞越',type:'bar',stack:'total',data:(sectorCount.value.list||[]).map(s=>s.passCount)}]}))
const saturationOption = computed(() => ({ tooltip:{...tooltipBase,formatter:p=>`${p[0].axisValue}<br/>${p.map(x=>`${x.seriesName}: ${x.value}%`).join('<br/>')}`}, legend:{top:0,textStyle:{color:'#84a6c6'}},grid:{left:44,right:18,top:42,bottom:28},xAxis:{type:'category',data:saturation.value.times || [],...axis},yAxis:{type:'value',max:100,name:'%',...axis},series:(saturation.value.series||[]).map(s=>({name:s.sectorName,type:'line',smooth:true,showSymbol:false,data:s.data}))}))
const warnOption = computed(() => ({ tooltip:tooltipBase, legend:{top:0,textStyle:{color:'#84a6c6'}},grid:{left:44,right:16,top:42,bottom:28},xAxis:{type:'category',data:(warnStat.value.list||[]).map(s=>s.sectorCode),...axis},yAxis:{type:'value',...axis},series:[{name:'危险接近',type:'bar',stack:'warn',data:(warnStat.value.list||[]).map(s=>s.flightWarn)},{name:'相似航班号',type:'bar',stack:'warn',data:(warnStat.value.list||[]).map(s=>s.similarWarn)},{name:'冲突指令',type:'bar',stack:'warn',data:(warnStat.value.list||[]).map(s=>s.tpWarn)}]}))
const annualWarnOption = computed(() => ({ tooltip:tooltipBase, legend:{top:0,textStyle:{color:'#84a6c6'}},grid:{left:44,right:18,top:42,bottom:28},xAxis:{type:'category',// 兼容后端返回的 "1月" 文案与演示数据的 "01" 数字两种格式
data:(annualWarn.value.months||[]).map(m=>`${String(m).replace(/^0/,'').replace(/月$/,'')}月`),...axis},yAxis:{type:'value',...axis},series:[{name:'危险接近',type:'line',smooth:true,data:annualWarn.value.flightWarn},{name:'相似航班号',type:'line',smooth:true,data:annualWarn.value.similarWarn},{name:'冲突指令',type:'line',smooth:true,data:annualWarn.value.tpWarn}]}))
const donutStyle = computed(() => { const total=Math.max(1,tpAnalysis.value.total||0); const handled=tpAnalysis.value.handledCount||0; const pct=handled/total*100; return {background:`conic-gradient(#39d0a1 0 ${pct}%, #ff6e7a ${pct}% 100%)`}})

function formatKpi(v,unit){ if(v===null||v===undefined) return '--'; return `${Number(v).toLocaleString('zh-CN')}${unit}` }
async function refreshAll(){
  loading.value=true
  try {
    const p=period.value
    // 只请求当前账号有权限的板块数据（与后端 @permission_required 一一对应，无权限不发请求，避免 403）
    const skip=Promise.resolve(null)
    const [o,a,r,ap,c,sc,sf,sa,ws,aw,tp]=await Promise.all([
      getOverview({date:selectedDate.value}),
      auth.has('panel:airline') ? getAirlineStat(p) : skip,
      auth.has('panel:airline') ? getAirlineList({...p,limit:36}) : skip,
      auth.has('panel:airportLoad') ? getAirportLoad({...p,limit:8}) : skip,
      auth.has('panel:company') ? getCompanyList({...p,limit:8}) : skip,
      auth.has('panel:sectorCount') ? getSectorCount(p) : skip,
      auth.has('panel:sectorFlow') ? getSectorFlow({date:selectedDate.value}) : skip,
      auth.has('panel:callSaturation') ? getSaturationList({date:selectedDate.value}) : skip,
      auth.has('panel:warnStat') ? getWarnStat({startDate:p.startDate,endDate:p.endDate}) : skip,
      auth.has('panel:annualWarn') ? getWarnAnnual({ year: new Date(`${selectedDate.value}T00:00:00`).getFullYear() }) : skip,
      auth.has('panel:conflict') ? getTpAnalysis(p) : skip
    ])
    overview.value=o||{}
    if(a) airlineStat.value=a
    if(r) routeList.value=r?.list||[]
    if(ap) airportLoad.value=ap
    if(c) companyList.value=c
    if(sc) sectorCount.value=sc
    if(sf) sectorFlow.value=sf
    if(sa) saturation.value=sa
    if(ws) warnStat.value=ws
    if(aw) annualWarn.value=aw
    if(tp) tpAnalysis.value=tp
  } finally { loading.value=false }
}
onMounted(refreshAll)
onBeforeUnmount(()=>{})
</script>

<style scoped>
.dashboard-page{min-height:100vh;padding:22px 26px 32px;background:radial-gradient(circle at 12% 0%,rgba(34,102,163,.15),transparent 28%),radial-gradient(circle at 92% 14%,rgba(25,177,196,.08),transparent 22%),#071225}.hero-row{display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:18px}.eyebrow{font-size:11px;letter-spacing:3px;color:#4bb8f6;margin-bottom:5px}.hero-row h1{font-size:28px;letter-spacing:1px;margin:0;color:#e7f4ff}.hero-row p{color:#718ca9;margin:6px 0 0;font-size:13px}.filter-box{display:flex;align-items:center;gap:8px;background:rgba(14,31,54,.78);padding:10px 12px;border:1px solid rgba(117,174,221,.14);border-radius:10px}.filter-label{font-size:12px;color:#7592af}.kpi-grid{display:grid;grid-template-columns:repeat(8,minmax(0,1fr));gap:10px;margin-bottom:12px}.kpi-card{min-height:92px;border:1px solid rgba(100,172,227,.12);border-radius:11px;background:linear-gradient(150deg,rgba(18,42,69,.9),rgba(8,24,43,.92));display:flex;align-items:center;padding:12px;gap:10px}.kpi-icon{width:36px;height:36px;border-radius:10px;display:grid;place-items:center;background:rgba(70,175,238,.09);color:#56c5ff;font-weight:700;font-size:20px}.kpi-label{font-size:11px;color:#708aa6}.kpi-value{font-size:24px;color:#f2f8ff;font-weight:700;line-height:1.15;margin:4px 0;font-variant-numeric:tabular-nums}.kpi-meta{font-size:10px;color:#536e8b}.grid-two{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px}.grid-three{display:grid;grid-template-columns:1.1fr 1.1fr .8fr;gap:12px;margin-bottom:12px}.panel{min-height:310px;background:linear-gradient(160deg,rgba(13,31,53,.96),rgba(7,20,37,.96));border:1px solid rgba(106,174,224,.11);border-radius:12px;box-shadow:inset 0 1px 0 rgba(255,255,255,.018)}.conflict-summary{padding:16px 18px}.panel-header{display:flex;justify-content:space-between;align-items:flex-start}.panel-header h3{margin:0;color:#e3f3ff;font-size:15px}.panel-header span{font-size:9px;color:#587694;letter-spacing:1.7px}.handled-rate{font-size:22px;color:#48dbb2;font-weight:700}.handled-rate small{font-size:10px;color:#647f9b;font-weight:400}.conflict-body{display:flex;gap:24px;align-items:center;min-height:245px}.donut-wrap{position:relative;width:175px;height:175px;flex:0 0 175px}.donut{width:100%;height:100%;border-radius:50%;transform:rotate(-90deg);box-shadow:0 0 26px rgba(57,208,161,.09)}.donut:after{content:"";display:block;position:absolute;inset:22px;border-radius:50%;background:#0b1f37;box-shadow:inset 0 0 0 1px rgba(115,190,232,.06)}.donut-center{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:2}.donut-center b{font-size:29px;color:#eef9ff}.donut-center span{font-size:11px;color:#6e88a1;margin-top:4px}.conflict-list{flex:1}.conflict-item{position:relative;display:grid;grid-template-columns:1fr auto;row-gap:5px;margin-bottom:13px;color:#a1b8cd;font-size:12px}.conflict-item b{color:#e6f4ff}.conflict-item i{display:block;height:4px;border-radius:99px;background:linear-gradient(90deg,#38aee7,#5fdcc3);margin-top:5px}.bottom-row .panel{min-height:300px}@media(max-width:1400px){.kpi-grid{grid-template-columns:repeat(4,1fr)}.grid-three{grid-template-columns:1fr 1fr}.brand{min-width:280px}}@media(max-width:900px){.hero-row{align-items:flex-start;gap:12px;flex-direction:column}.grid-two,.grid-three{grid-template-columns:1fr}.header-time,.system-status{display:none}.nav-item{padding:0 10px}.brand-subtitle{display:none}.kpi-grid{grid-template-columns:repeat(2,1fr)}}
</style>
