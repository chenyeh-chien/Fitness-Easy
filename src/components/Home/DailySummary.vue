<script setup lang="ts">
import DigitScroller from '../Utils/transitions/DigitScroller.vue'
// import NutrientsPercentage from './NutrientsPercentage.vue'
import RemainNutrients from './RemainNutrients.vue';

const value = 2700;
</script>

<template>
  <div class="flex flex-wrap gap-10">
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
    <div class="w-full">
      <RemainNutrients />
    </div>
    <!-- 顯示在當天應該攝取的比例比較適合 -->
    <!-- 
    <div class="w-full flex justify-center md:w-auto">
      <div class="w-full max-w-100 h-30 md:w-100">
        <NutrientsPercentage />
      </div>
    </div>
    -->
  </div>
</template>