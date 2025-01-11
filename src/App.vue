<template>
  <v-app>
    <v-main>
       <HomeLoanCalculator/>
    </v-main>
  </v-app>
</template>

<script setup>
import HomeLoanCalculator from './views/HomeLoanCalculator.vue';
</script>

<style>
  @supports selector(:focus-visible) {
    .v-btn::after {
        content: none !important;
        pointer-events: none;
        border: none!important;
        border-radius: inherit;
        opacity: 0;
        transition: opacity 0.2s ease-in-out;
    }
}

html .v-btn::after {
  border: none !important;
  opacity: 0 !important;
  transition: none !important;
}

</style>