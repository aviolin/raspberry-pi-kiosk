<script setup lang="ts">
import ItemCard from '../components/ItemCard.vue';
import { onMounted } from 'vue';
import collection from '../../collection.js';
// console.log(collection);

//https://boardgamegeek.com/xmlapi2/thing?id=68448&stats=1

// onMounted(() => {
//   fetch('	https://bgg-json.azurewebsites.net/collection/aviolin',
//     {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/xml'
//       }
//     })
//     .then(response => response.text())
//     .then(data => console.log(data))
//     .catch(error => console.error(error))
// })
</script>

<template>
    <!-- <FilterPanel /> -->
    <div class="items">
        <div class="item-grid">
          <ItemCard v-for="item in collection" :key="item.name" :item="item" />
        </div>
    </div>
</template>

<style>
.items {
  flex: 1;
}
.item-grid {
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 2rem;
  padding: 2rem;
  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
  @media (min-width: 992px) {
    grid-template-columns: 1fr 1fr 1fr;
  }
}
</style>