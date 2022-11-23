<template>
  <div class="box-card">
    <div>
      <router-view/>
    </div>
  </div>
</template>

<script lang="ts" setup>

</script>

<style scoped>
.box-card {
  height: 89%;
  width: 100%;
}
.box-card  div {
  width: calc(100vw - 300px);
  height: 100%;
  margin: auto;
}
</style>