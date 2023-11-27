<script setup>
import Language from './components/Language.vue';
</script>

<template>
  <div class="container">
    <header>
      <nav class="navbar navbar-expand container">
        <div class="container-fluid">
          <RouterLink class="nav-link" to="/">
            <h2>TDD</h2>
          </RouterLink>

          <div class="navbar-nav">
            <RouterLink class="nav-link" to="/">Home</RouterLink>
            <RouterLink class="nav-link" to="/signup">Signup</RouterLink>
          </div>
        </div>
      </nav>
    </header>

    <RouterView />

    <footer>
      <Language />
    </footer>
  </div>
</template>
