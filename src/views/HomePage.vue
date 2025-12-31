<script setup lang="ts">
import { ref } from 'vue'
import { clsx } from "clsx"
import SectionContainer from '@/components/Utils/containers/SectionContainer.vue'
import DailySummary from "@/components/Home/DailySummary.vue"
import DailyFoodIntakeMain from "@/components/Meals/DailyFoodIntakeMain.vue"
import DailyWorkout from "@/components/Training/DailyWorkout.vue"

const componentKey = ref(0)

function updateComponentKey() {
  componentKey.value++;
}
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
        <DailySummary :key="componentKey"/>
      </SectionContainer>
    </div>
    <DailyFoodIntakeMain 
      :key="componentKey"
      @update-component-key="updateComponentKey"/>
    <DailyWorkout 
      :key="componentKey"
      @update-component-key="updateComponentKey"/>
  </div>
</template>