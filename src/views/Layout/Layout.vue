<template>
  <div class="shell">
    <Header />
    <main class="content"><router-view /></main>
  </div>
</template>
<script setup>
import Header from './Header.vue'
</script>
<style scoped>.shell{min-height:100vh;background:#071225;color:#d9e9f8}.content{min-height:calc(100vh - 72px)}</style>
