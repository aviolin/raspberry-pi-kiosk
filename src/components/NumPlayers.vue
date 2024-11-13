<script setup>
import { computed } from 'vue';

const props = defineProps({
    min: Number,
    max: Number
})

const playersText = computed(() => {
    return props.min + (props.max !== props.min ? '-' + props.max : '');
})
</script>

<template>
    <p class="players">
        <svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 2h4v4h-4V2zM7 7h10v2h-2v13h-2v-6h-2v6H9V9H7V7zM5 5v2h2V5H5zm0 0H3V3h2v2zm14 0v2h-2V5h2zm0 0V3h2v2h-2z" fill="currentColor"/>
        </svg> {{ playersText }}
    </p>
</template>

<style scoped>
.players {
    flex: 1;
    margin-top: 0;
    margin-bottom: 0.5rem;
    display: flex;
    align-items:center;
}
.players svg {
    height: 1.5rem;
    width: 1.5rem;
    margin-right: .25rem;

}
</style>