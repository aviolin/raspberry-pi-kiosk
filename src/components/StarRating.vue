<script setup>
import { computed } from 'vue';

const props = defineProps({
    rating: Number
})

const normalizedRating = computed(() => {
    return props.rating * 10;
})


</script>

<template>
    <div class="rating" :title="rating + ' on BGG'">
        <div class="stars-background">
            <svg 
                v-for="i in 5" 
                :key="i"
                xmlns="http://www.w3.org/2000/svg" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24">
                <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z"/>
            </svg>
        </div>
        <div class="stars-foreground" :style="{ width: normalizedRating + '%' }">
            <svg 
                v-for="i in 5" 
                :key="i"
                xmlns="http://www.w3.org/2000/svg" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24">
                <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z"/>
            </svg>
        </div>
    </div>
</template>

<style scoped>
.rating {
    position: relative;
    width: fit-content;
    margin-bottom: .5rem;
}
.stars-background,
.stars-foreground {
    display: flex;
    gap: .15rem;
    align-items: center;
}
.stars-foreground {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    overflow: hidden;
}
svg {
    width: 1rem;
    height: 1rem;
    flex-shrink: 0;
    flex-grow: 0;
}
.stars-background svg {
    fill: none;
    stroke: var(--color-primary);
}
.stars-foreground svg {
    fill: var(--color-primary);
    stroke: var(--color-primary);;
}
</style>