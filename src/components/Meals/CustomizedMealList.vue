<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import TextTable from '../Utils/tables/TextTable.vue'
import { useAuth } from '@/composables/useAuth'
import { useMealOptions } from '@/composables/useMealOptions'

const { user, isAuthReady } = useAuth();
const { getMealOptions } = useMealOptions();

const LABELS = [
  "Name",
  "Protein (g)",
  "Carbohydrate (g)",
  "Fat (g)",
  "Weight (g)",
]
const mealsInfo = ref<any[]>([]);
const mealOptions = computed(() => {
  return mealsInfo.value.map(item => {
    return [
      item.meal,
      item.protein.toFixed(2),
      item.carbohydrate.toFixed(2),
      item.fat.toFixed(2),
      item.weight,
    ]
  });
})

onMounted(() => {
  setMealOptions();
})

async function setMealOptions() {
  if (user.value === null) {
    console.error("User not logged in");
    return;
  }

  try {
    const querySnapshot = 
      await getMealOptions(user.value.uid);
    
    mealsInfo.value = querySnapshot.docs.map((doc) => doc.data());
  } catch (error) {
    console.error("Error querying daily meals:", error);
  }
}

watch(
  [isAuthReady],
  () => {
    setMealOptions();
  }
)
</script>

<template>
  <TextTable 
    :labels="LABELS"
    :data="mealOptions"/>
</template> 