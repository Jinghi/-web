<template>
  <section class="chart-panel">
    <div class="panel-head"><div><h3>{{ title }}</h3><span>{{ subTitle }}</span></div><div class="status-dot"><i></i>分析</div></div>
    <div ref="el" class="chart"></div>
  </section>
</template>
<script setup>
import * as echarts from 'echarts'
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
const props=defineProps({title:{type:String,required:true},subTitle:{type:String,default:''},option:{type:Object,default:()=>({})},loading:{type:Boolean,default:false}})
const el=ref(null); let chart; let resize
function render(){ if(!el.value) return; if(!chart) chart=echarts.init(el.value); chart.setOption(props.option||{},true); props.loading?chart.showLoading('default',{text:'加载中',color:'#4fc5ff',textColor:'#6f8fae',maskColor:'rgba(7,18,37,.58)'}):chart.hideLoading() }
onMounted(async()=>{await nextTick();render();resize=()=>chart?.resize();window.addEventListener('resize',resize)})
watch(()=>props.option,render,{deep:true});watch(()=>props.loading,render)
onBeforeUnmount(()=>{window.removeEventListener('resize',resize);chart?.dispose();chart=null})
</script>
<style scoped>.chart-panel{min-height:310px;padding:14px 16px 8px;background:linear-gradient(160deg,rgba(13,31,53,.96),rgba(7,20,37,.96));border:1px solid rgba(106,174,224,.11);border-radius:12px}.panel-head{display:flex;justify-content:space-between;align-items:flex-start}.panel-head h3{margin:0;color:#e3f3ff;font-size:15px}.panel-head span{font-size:9px;color:#587694;letter-spacing:1.7px}.status-dot{color:#607d9a;font-size:10px;display:flex;gap:5px;align-items:center}.status-dot i{width:5px;height:5px;border-radius:50%;background:#3bd9ad;box-shadow:0 0 7px rgba(59,217,173,.65)}.chart{height:262px;width:100%}</style>
