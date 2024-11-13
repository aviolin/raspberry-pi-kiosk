<template>
    <div class="sidebar">
        <div class="panel">
            <button class="btn-accordion">
                Category
            </button>
            <button class="btn-accordion">
                Players
            </button>
            <button class="btn-accordion">
                Ratings
            </button>
            <button class="btn-accordion">
                Value
            </button>
        </div>
    </div>
</template>

<style scoped>
.sidebar {
  /* flex-basis: 500px; */
  width: 300px;
  flex-shrink: 0;
  flex-grow: 0;
  position: relative;
}
.panel {
    display: flex;
    flex-direction: column;
    position: sticky;
    top: 0;
    left: 0;
    width: 100%;
    max-height: 100svh;
    max-height: 100vh;
    padding-block: 2rem;
}
.btn-accordion {
    border: 0;
    border-top: 1px solid var(--color-secondary);
    font-weight: 700;
    background: none;
    text-align: left;
    padding: 1rem;
    font-size: 1.3rem;
    position: relative;
}
.btn-accordion::after {
    content: '';
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%) rotate(45deg);
    border-right: 3px solid var(--color-primary);
    border-bottom: 3px solid var(--color-primary);
    width: .5rem;
    height: .5rem;
}
</style>