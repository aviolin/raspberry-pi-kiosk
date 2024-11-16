<script setup>
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useGamesStore } from '@/stores/games';

const gamesStore = useGamesStore();

const { filterGroups } = storeToRefs(gamesStore);
const { applyFilter } = gamesStore;

const isModalOpen = ref(false);
const isLoading = ref(false);

const updateFilter = (e) => {
    isLoading.value = true;
    setTimeout(() => {
        applyFilter(e.target.dataset.group, e.target.dataset.value);
        isLoading.value = false;
    })
}

</script>

<template>
    <button class="btn btn-filter" @click="isModalOpen = !isModalOpen">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
            <circle cx="4" cy="6" r="2" />
            <rect x="7" y="5" width="13" height="2" rx="1" />
            <circle cx="20" cy="12" r="2" />
            <rect x="3" y="11" width="13" height="2" rx="1" />
            <circle cx="10" cy="18" r="2" />
            <rect x="13" y="17" width="8" height="2" rx="1" />
        </svg>
    </button>
    <div class="loader" v-if="isLoading"></div>
    <div class="overlay" v-if="isModalOpen"></div>
    <div class="sidebar" v-if="isModalOpen">
        <button class="btn btn-close" @click="isModalOpen = !isModalOpen">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                <path d="M8 8l8 8M8 16L16 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
            </svg>
        </button>
        <div class="panel">
            <div class="group" v-for="group in filterGroups">
                <header>{{ group.label }}</header>
                <div class="checkbox-wrapper" v-for="value in group.values">
                    <input 
                        type="checkbox" 
                        :data-group="group.name" 
                        :data-value="value" 
                        :checked="group.activeValues.includes(value)"
                        @change="updateFilter" :id="group.name + ':' + value"
                    />
                    <label :for="group.name + ':' + value">{{ value }}</label>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.btn {
    background: #fff1;
    border: 0;
    width: 58px;
    height: 58px;
    color: var(--color-primary);
}
.btn-filter {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 50;
}
.btn-close {
    background: var(--color-secondary);
    color: var(--color-primary);
    float: right;
}
.sidebar {
  width: 300px;
  position: fixed;
  right: 0;
  top: 0;
  height: 100vh;
  z-index: 55;
  background: var(--color-primary);
  color: var(--color-secondary);
}
.overlay,
.loader {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5);
    z-index: 35;
}
.loader {
    z-index:9999;
}
.panel {
    display: flex;
    flex-direction: column;
    top: 0;
    left: 0;
    width: 100%;
    max-height: 100svh;
    max-height: 100vh;
    padding: 1rem;
    overflow: auto;
}
header {
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 0.5rem;
}
.group {
    margin-bottom: 1rem;
}

.checkbox-wrapper {
    position: relative;
    height:48px;
    display: flex;
    align-items: center;
}
.checkbox-wrapper label {
    padding-left: 4rem;
    font-size: 1.5rem;
}
.checkbox-wrapper label::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 40px;
    height: 40px;
    border-radius: 0.25rem;
    border: 1px solid var(--color-secondary);
}
input[type="checkbox"] {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
}
input[type="checkbox"]:checked + label::after {
    background: var(--color-secondary);
}

 
</style>