<script setup>
import { onMounted, onUpdated, ref } from 'vue';
import { register } from 'swiper/element/bundle'
import { storeToRefs } from 'pinia';
import { useGamesStore } from '@/stores/games';

import FilterPanel from './FilterPanel.vue';
import ItemCard from '../components/ItemCard.vue';

const swiper = ref(null);

const gamesStore = useGamesStore()
const { collection, collectionCategories, collectionSets } = storeToRefs(gamesStore);
const { updateCollection, addItemDetails } = gamesStore;


register(); // swiper


const swiperParams = {
    injectStyles: [
      `
      :host .swiper-pagination {
        width: 40px !important;
      }
      `,
    ],
  };

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

  await updateCollection(usernames);

  const _collection = [...collection.value];

  while(_collection.length) {
      await addItemDetails(_collection.splice(0,20).map(item => item.id));
  }

  Object.assign(swiper.value, swiperParams);
  swiper.value.initialize();
})

</script>

<template>
    <FilterPanel />
    <div class="items">
        <div class="item-grid">
          <swiper-container 
            :direction="'vertical'"
            :slides-per-view="1.3"
            :space-between="16"
            :centered-slides="true"
            :pagination="true"
            :pagination-clickable="true"
            :pagination-dynamic-bullets="true"
            :pagination-dynamic-main-bullets="5"
            :init="false"
            ref="swiper"
          >
            <swiper-slide v-for="(category, i) in collectionCategories" :key="i">
              <header class="category-header">{{ category.name }}</header>
              <swiper-container
                :direction="'horizontal'"
                :slides-per-view="4.3"
                :space-between="16"
                :centered-slides="false"
                :slides-per-group="3"
                :init="true"
                >
                <swiper-slide v-for="(item, i) in category.items" :key="i">
                  <ItemCard :item="item" />
                </swiper-slide>
              </swiper-container>
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
  gap: 1rem;
  justify-content: space-around;
  padding-right: 42px;
}
swiper-container {
  height: 100vh;
}
swiper-slide.swiper-slide-next + swiper-slide + swiper-slide + swiper-slide {
  opacity: .5;
}
.category-header {
  margin-left: 1rem;
  margin-bottom: 1rem;
  font-weight: bold;
  font-size: 1.5rem;
}
/* swiper-slide:not(.swiper-slide-active):not(.swiper-slide-next):not(.swiper-slide-prev) {
    opacity: 0;
} */
</style>