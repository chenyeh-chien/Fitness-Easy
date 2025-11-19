<script setup lang="ts">
import DigitScroller from '../Utils/transitions/DigitScroller.vue'
import NutrientsPercentage from './NutrientsPercentage.vue'
import RemainNutrients from './RemainNutrients.vue';

const value = 2700;
</script>

<template>
  <div class="flex flex-wrap gap-10">
    <div class="flex gap-10 md:flex-col">
      <div>
        <DigitScroller
          :data="value"
          :transitionDuration="2"
          :size="'2xl'"
          :font-weight="700"
          :color="'var(--sidebar-link-color)'"
          :show-unit="true"
          :unit="'kcal'"/>
      </div>
      <div>
        <RemainNutrients />
      </div>
    </div>
    <div class="flex justify-center">
      <div class="h-30 w-100">
        <NutrientsPercentage />
      </div>
    </div>
  </div>
</template>