<script setup lang="ts">
import { clsx } from "clsx";
import SectionContainer from '@/components/Utils/containers/SectionContainer.vue';
import DailySummary from "@/components/Home/DailySummary.vue";
import DailyFoodIntake from "@/components/Home/DailyFoodIntake.vue";
</script>

<template>
  <div
    :class="clsx(
      'flex flex-col gap-4'
    )">
    <div
      :class="clsx(
        'flex flex-wrap gap-4 xl:flex-row'
      )">
      <SectionContainer 
        class="w-full"
        :title="'Daily summary'">
        <DailySummary />
      </SectionContainer>
    </div>
    <SectionContainer 
      class="w-full"
      :title="'Training'">
    </SectionContainer>
    <SectionContainer 
      class="w-full"
      :title="'Daily food intake'">
      <DailyFoodIntake />
    </SectionContainer>
  </div>
</template>