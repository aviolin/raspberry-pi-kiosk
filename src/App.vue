<script setup>
import { onMounted } from 'vue';

import HomeView from './components/HomeView.vue';

function isRaspbian() {
  const userAgent = navigator.userAgent;
  return userAgent.includes("Linux armv") || userAgent.includes("Raspberry Pi");
}

onMounted(() => {
  if (isRaspbian()) {
    document.body.classList.add('raspbian');
  }
});
</script>


<template>
  <HomeView />
</template>

<style>
* {
  box-sizing: border-box;
}
:root {
  --color-primary: #fff;
  --color-secondary: #3a293a;
  --color-accent: orange;
  --swiper-pagination-bullet-inactive-color: var(--color-primary);
  --swiper-pagination-color: var(--color-primary);
  --swiper-pagination-bullet-width: 24px;
  --swiper-pagination-bullet-height: 24px;
}

::-webkit-scrollbar {
  width: 24px;
  height: 24px;
}

::-webkit-scrollbar-button {
  width: 0;
  height: 0;
}

::-webkit-scrollbar-thumb {
  background: var(--color-primary);
  border: 0;
  border-radius: 0;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--color-primary);
}

::-webkit-scrollbar-thumb:active {
  background: var(--color-primary);
}

::-webkit-scrollbar-track {
  background: var(--color-secondary);
  border: 0;
  border-radius: 0;
}

::-webkit-scrollbar-track:hover {
  background: var(--color-secondary);
}

::-webkit-scrollbar-track:active {
  background: var(--color-secondary);
}

::-webkit-scrollbar-corner {
  background: transparent;
}    

body {
  margin: 0;
  color: var(--color-primary);
  background: var(--color-secondary);
  font-family: 'Arimo', sans-serif;
}
.wrapper {
  display: flex;
  gap: 2rem;
}
.raspbian {
  cursor: none;
}
</style>