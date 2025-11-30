<script setup lang="ts">
import { computed, toRefs } from 'vue'
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
const LABELS = [{
  label: "Nutrients",
  key: "nutrients",
}, {
  label: "Remain (g)",
  key: "remain",
}, {
  label: "Intake (g)",
  key: "intake",
}, {
  label: "Total (g)",
  key: "total",
}]

const nutrientsStats = computed(() => {
  return [{
    "nutrients": "Protein",
    "remain": (target.value.protein - intake.value.protein).toFixed(2),
    "intake": intake.value.protein.toFixed(2),
    "total": target.value.protein.toFixed(2)
  }, {
    "nutrients": "Carbohydrate",
    "remain": (target.value.carbohydrate - intake.value.carbohydrate).toFixed(2),
    "intake": intake.value.carbohydrate.toFixed(2),
    "total": target.value.carbohydrate.toFixed(2)
  }, {
    "nutrients": "Fat",
    "remain": (target.value.fat - intake.value.fat).toFixed(2),
    "intake": intake.value.fat.toFixed(2),
    "total": target.value.fat.toFixed(2)
  }]
})
</script>

<template>
  <TextTable 
    :headers="LABELS"
    :data="nutrientsStats"/>
</template>