<script setup>
import { RouterLink } from 'vue-router';
import StarRating from './StarRating.vue';
import NumPlayers from './NumPlayers.vue';
import PlayTime from './PlayTime.vue';

const props = defineProps({
    item: Object
})
</script>

<template>
    <RouterLink :to="'/games/' + item.gameId" class="item-card">
        <div class="image-holder">
            <img :src="item.image" :alt="item.name" />
            <!-- <button class="btn-like" aria-label="Like"></button> -->
        </div>
        <div class="info">
            <h1 class="header">{{ item.name }}</h1>
            <StarRating :rating="item.averageRating" />
            <NumPlayers :min="item.minPlayers" :max="item.maxPlayers" />
            <PlayTime :time="item.playingTime" />
        </div>
    </RouterLink>
</template>

<style scoped>
.item-card {
    font-family: 'Arimo', sans-serif;
    color: var(--color-primary);
    text-decoration: none;
}
.image-holder {
    width: 100%;
    max-width: 100%;
    aspect-ratio: 4 / 5;
    background-color: #fff1;
    position: relative;
    transition: .3s;
}
.image-holder img {
    padding: 1rem;
    width: 100%;
    height: 100%;
    object-fit: contain;
    transition: .3s;
}
.btn-like {
    position: absolute;
    top: 1rem;
    right: 1.5rem;
    border: 0;
    background: none;
    width: 0;
    height: 0;
    cursor: pointer;
    transition: .3s;
    opacity: 0;
    transform: translateY(1rem);
}
.btn-like::before,
.btn-like::after {
    content: '';
    position: absolute;
    background: var(--color-secondary);
    border-top-left-radius: 1rem;
    border-top-right-radius: 1rem;
    position: absolute;
    top: 0;
    width: 1rem;
    height: 1.25rem;
}
.btn-like::before {
    left: 0;
    transform: rotate(45deg);
}
.btn-like::after {
    right: 0;
    transform: rotate(-45deg);
}
.image-holder:hover {
    background: #fff3;
}
.image-holder:hover .btn-like {
    opacity: 1;
    transform:translateY(0) scale(1.2);
}
.info {
    display: flex;
    flex-direction: column;
    margin-bottom: 2rem;
    padding-inline: 1rem;
}
.header {
    flex: 1;
    font-size: 1.3rem;
    font-weight: 700;
}
</style>