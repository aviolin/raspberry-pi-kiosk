<script setup>
import { onMounted, onUpdated, ref } from 'vue';
import { register } from 'swiper/element/bundle'
import { storeToRefs } from 'pinia';
import { useGamesStore } from '@/stores/games';

import FilterPanel from './FilterPanel.vue';
import ItemCard from '../components/ItemCard.vue';

const swiper = ref(null);

const gamesStore = useGamesStore()
const { filteredCollection, collectionSets } = storeToRefs(gamesStore);
const { updateCollection } = gamesStore;



register(); // swiper

onMounted(async () => {
  const params = window.location.href.split('#')[1];
  if (! params) return;

  let usernames = [];

  const paramsSplit = params.split('&');
  paramsSplit.forEach(param => {
    const [key, value] = param.split('=');
    if (key === 'username') {
      usernames = value.split(',');
    }
  });

  updateCollection(usernames);

  swiper.value.initialize();
})

onUpdated(() => {
  console.log('hasdf')
})

</script>

<template>
    <FilterPanel />
    <div class="items">
        <div class="item-grid">
          <swiper-container 
            :direction="'vertical'"
            :slides-per-view="1.2"
            :space-between="16"
            :centered-slides="true"
            :pagination="true"
            :pagination-clickable="true"
            :init="false"
            ref="swiper"
          >
            <swiper-slide v-for="(set, i) in collectionSets" :key="i">
              <div class="set">
                <ItemCard v-for="item in set" :item="item" />
              </div>
            </swiper-slide>
          </swiper-container>
        </div>
    </div>
</template>

<style>
.item-grid {
  height: 100vh;

  /* display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1rem; */
}
.set {
  display: flex;
  gap: 1rem;
  justify-content: space-around;
  padding-right: 42px;
}
swiper-container {
  height: 100vh;
}
swiper-slide:not(.swiper-slide-active):not(.swiper-slide-next):not(.swiper-slide-prev) {
    opacity: 0;
}
</style>