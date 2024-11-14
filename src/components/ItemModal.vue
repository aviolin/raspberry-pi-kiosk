<script setup>
import { defineEmits, onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useGamesStore } from '@/stores/games';
import StarRating from '@/components/StarRating.vue';
import NumPlayers from '@/components/NumPlayers.vue';
import PlayTime from '@/components/PlayTime.vue';

const props = defineProps({
    item: Object
})

const gamesStore = useGamesStore();
const { collection } = storeToRefs(gamesStore);
const { addItemDetails } = gamesStore;

const emit = defineEmits(['closeModal']);

const game = ref({});

onMounted(async () => {
    game.value = await addItemDetails(props.item.id);
})

</script>

<template>
    <section class="modal container">
        <div class="row row-content">
            <div class="image-holder">
                <img :src="item.image" :alt="item.name" />
            </div>
            <div class="content-holder">
                <button @click="emit('closeModal')" class="breadcrumb">Back</button>
                <h1>{{ item.name }}</h1>
                <StarRating :rating="item.averageRating" />
                <NumPlayers :min="item.minPlayers" :max="item.maxPlayers" />
                <PlayTime :time="item.playingTime" />
                <p>{{ item.description }}</p>
            </div>
        </div>
    </section>
</template>

<style scoped>
h1 {
    margin-block: 1rem;
}
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--color-secondary);
  z-index: 99;
}
.container {
    min-height: 100vh;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}
.row {
  padding: 2rem;
    display: flex;
    gap: 1rem;
    justify-content: space-between;
    overflow: auto;
}
.row-content {
    height: 100%;
}
.image-holder {
    position: sticky;
    top: 0;
    width: 50%;
    height: calc(100vh - 4rem);
    background: #fff1;
    flex: 1;
    padding: 1rem;
}
.image-holder img {
    width: 100%;
    height: 100%;
    object-fit: contain;
}
.content-holder {
    flex: 1;
    padding-right: 6rem;
}
.breadcrumb {
    color: var(--color-primary);
    text-decoration: none;
    font-size: 1.5rem;
    background: #fff1;
    padding: 1rem;
    display:inline-block;
    position: absolute;
    top: 2rem;
    right: 2rem;
    border: 0;
}
</style>