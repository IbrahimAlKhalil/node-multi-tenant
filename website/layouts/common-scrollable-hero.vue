<template>
  <div class="hero-section min-h-screen flex justify-center items-center">
    <div
      class="rt-scrollbar container flex justify-center h-full lg:mt-auto mb-[7vh] max-h-[80vh] overflow-y-auto"
      style="margin-top: calc(var(--header-height) + 50px)"
    >
      <div
        class="backdrop w-full h-full px-8 py-14 rounded-xl text-white h-full"
      >
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup></script>

<style scoped>
.backdrop {
  background-color: rgba(0, 0, 0, 0.7);
  background-blend-mode: multiply;
}
.hero-section {
  background: url('assets/images/HeroBackground.svg') no-repeat;
  background-size: cover;
  background-position: center;
}

/* Scrollbar Style */
.rt-scrollbar::-webkit-scrollbar {
  width: 0.5rem;
  height: 10px;
}

/* scrollbar-thumb */
.rt-scrollbar::-webkit-scrollbar-thumb {
  background: var(--color-primary);
  border-radius: 10px;
}

/* scrollbar-track */
.rt-scrollbar::-webkit-scrollbar-track {
  background: #31313185;
  border-radius: 10px;
}
</style>
