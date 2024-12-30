<script setup>
import { RouterView } from 'vue-router'
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
</script>

<template>
  <div class="app-container">
    <Header />
    <div class="content">
      <RouterView />
    </div>
    <Footer />
  </div>
</template>

<style scoped>
@media print {
  .app-container > *:not(.content) {
    display: none !important;
  }

  body {
    margin: 0;
    padding: 0;
  }

  .content {
    margin: 0;
    padding: 0;
  }
}

.app-container {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.content {
  flex-grow: 1;
  background-color: #ffffff;
}
</style>
