<script setup>
import { onMounted, ref } from 'vue';
import { register } from 'swiper/element'
import { storeToRefs } from 'pinia';
import { useGamesStore } from '@/stores/games';

import ItemCard from '../components/ItemCard.vue';

const swiper = ref(null);

const gamesStore = useGamesStore()
const { collectionSets } = storeToRefs(gamesStore);
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

</script>

<template>
    <!-- <FilterPanel /> -->
    <div class="items">
        <div class="item-grid">
          <swiper-container 
            :direction="'vertical'"
            :slides-per-view="1.2"
            :space-between="16"
            :centered-slides="true"
            :init="false"
            ref="swiper"
          >
            <swiper-slide v-for="(set, i) in collectionSets" :key="i">
              <div class="set">
                <ItemCard v-for="item in collectionSets[i]" :item="item" />
              </div>
            </swiper-slide>
          </swiper-container>
        </div>
    </div>
</template>

<style>
.item-grid {
  height: 100vh;
}
.set {
  display: flex;
  justify-content: space-around;
}
swiper-container {
  height: 100vh;
}
</style>