<script setup lang="ts">
import { computed, toRefs, ref, watch } from 'vue'
import TextTable from '../Utils/tables/TextTable.vue'
import { useAuth } from '@/composables/useAuth'
import { useDailyMeals } from '@/composables/useDailyMeals'

interface Props {
  protein?: number;
  carbohydrate?: number;
  fat?: number;
}

const props = withDefaults(defineProps<Props>(), {
  protein: 0,
  carbohydrate: 0,
  fat: 0,
});
const { protein, carbohydrate, fat } = toRefs(props);
const { user, isAuthReady } = useAuth();
const { getDailyMeals } = useDailyMeals();
const dailyIntake = ref<any>({
  protein: 0,
  carbohydrate: 0,
  fat: 0,
})

watch(
  isAuthReady,
  () => {
    checkUserDailyMeals();
  }
)

async function checkUserDailyMeals() {
  if (user.value === null) {
    console.error("User not logged in");
    return;
  }

  const querySnapshot = 
    await getDailyMeals(user.value.uid, new Date());
  
  if (querySnapshot.empty) {
    console.log("No meals found for this user.");
    return;
  }

  dailyIntake.value = querySnapshot.docs
    .map(item => item.data())
    .reduce((acc, item) => {
      acc.protein += item.quantity * item.protein;
      acc.carbohydrate += item.quantity * item.carbohydrate;
      acc.fat += item.quantity * item.fat;
      return acc;
    }, { protein: 0, carbohydrate: 0, fat: 0 });
}

const nutrientsStats = computed(() => {
  return [
    [
      "Protein",
      (protein.value - dailyIntake.value.protein).toFixed(2),
      dailyIntake.value.protein.toFixed(2),
      protein.value.toFixed(2)
    ],
    [
      "Carbohydrate",
      (carbohydrate.value - dailyIntake.value.carbohydrate).toFixed(2),
      dailyIntake.value.carbohydrate.toFixed(2),
      carbohydrate.value.toFixed(2)
    ],
    [
      "Fat",
      (fat.value - dailyIntake.value.fat).toFixed(2),
      dailyIntake.value.fat.toFixed(2),
      fat.value.toFixed(2)
    ]
  ]
})

const LABELS = [
  "Nutrients",
  "Remain (g)",
  "Intake (g)",
  "Total (g)"
]
</script>

<template>
  <TextTable 
    :labels="LABELS"
    :data="nutrientsStats"/>
</template>