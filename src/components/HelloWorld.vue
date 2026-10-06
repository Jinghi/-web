<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <p>
      基于 Vue 3 + Vite 构建的前端工程<br />
      查看
      <a href="https://vuejs.org" target="_blank" rel="noopener">Vue 3 官方文档</a>
      了解更多。
    </p>
    <h3>生态与技术栈</h3>
    <ul>
      <li><a href="https://vitejs.dev" target="_blank" rel="noopener">Vite</a></li>
      <li><a href="https://router.vuejs.org" target="_blank" rel="noopener">Vue Router 4</a></li>
      <li><a href="https://pinia.vuejs.org" target="_blank" rel="noopener">Pinia</a></li>
      <li><a href="https://element-plus.org" target="_blank" rel="noopener">Element Plus</a></li>
    </ul>
  </div>
</template>

<script setup>
defineProps({
  msg: {
    type: String,
    default: ''
  }
})
</script>

<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
