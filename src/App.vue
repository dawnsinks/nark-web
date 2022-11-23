<script setup lang="ts">

import Header from "./components/Header.vue";
import Content from "./components/Content.vue";
import Footer from "./components/Footer.vue";
</script>

<template>
  <div class="app">
    <Header/>
    <Content/>
    <Footer/>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
}
.app {
  height: 100vh;
}

</style>
