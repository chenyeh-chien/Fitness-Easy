<script setup lang="ts">
import { computed, toRefs, ref } from 'vue'
import TextTable from '../Utils/tables/TextTable.vue'

interface Props {
  target?: {
    protein: number;
    carbohydrate: number;
    fat: number;
  },
  intake?: {
    protein: number;
    carbohydrate: number;
    fat: number;
  }
}

const props = withDefaults(defineProps<Props>(), {
  target: () => {
    return {
      protein: 0,
      carbohydrate: 0,
      fat: 0
    }
  },
  intake: () => {
    return {
      protein: 0,
      carbohydrate: 0,
      fat: 0
    }
  }
});
const { target, intake } = toRefs(props);
const LABELS = [
  "Nutrients",
  "Remain (g)",
  "Intake (g)",
  "Total (g)"
]

const nutrientsStats = computed(() => {
  return [
    [
      "Protein",
      (target.value.protein - intake.value.protein).toFixed(2),
      intake.value.protein.toFixed(2),
      target.value.protein.toFixed(2)
    ],
    [
      "Carbohydrate",
      (target.value.carbohydrate - intake.value.carbohydrate).toFixed(2),
      intake.value.carbohydrate.toFixed(2),
      target.value.carbohydrate.toFixed(2)
    ],
    [
      "Fat",
      (target.value.fat - intake.value.fat).toFixed(2),
      intake.value.fat.toFixed(2),
      target.value.fat.toFixed(2)
    ]
  ]
})
</script>

<template>
  <TextTable 
    :labels="LABELS"
    :data="nutrientsStats"/>
</template>