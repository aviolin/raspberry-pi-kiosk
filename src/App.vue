<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <!-- <header>
    <div class="wrapper">
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </div>
  </header> -->

  <RouterView />
</template>

<style>
* {
  box-sizing: border-box;
}
:root {
  --color-primary: #fff;
  --color-secondary: #672267;
}
body {
  margin: 0;
  color: var(--color-primary);
  background: var(--color-secondary);
}
.wrapper {
  display: flex;
  /* padding-inline: 2rem; */
  gap: 2rem;
}
</style>