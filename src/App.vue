<script setup>
import Language from './components/Language.vue';
</script>

<template>
  <div class="container">
    <RouterView />

    <footer>
      <Language />
    </footer>
  </div>
</template>
