<script setup lang="ts">
import { ref, watch, onMounted, toRefs } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useDailyMeals } from '@/composables/useDailyMeals'
import TextTable from '../Utils/tables/TextTable.vue'

interface Props {
  date?: Date;
}

const props = withDefaults(defineProps<Props>(), {
  date: () => new Date(),
});
const { date } = toRefs(props);

const LABELS = [
  "Name",
  "Quantity",
  "Total (kcal)",
  "Protein (g)",
  "Carbohydrate (g)",
  "Fat (g)",
]
const { user, isAuthReady } = useAuth();
const { getDailyMeals } = useDailyMeals();
const dailyMeals = ref<any[]>([]);

onMounted(() => {
  checkUserDailyMeals();
})

async function checkUserDailyMeals() {
  if (user.value === null) {
    console.error("User not logged in");
    return;
  }

  try {
    const querySnapshot = 
      await getDailyMeals(user.value.uid, date.value);
    
    querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
    });

    if (querySnapshot.empty) {
      console.log("No meals found for this user.");
    }

    dailyMeals.value = 
      querySnapshot.docs.map((doc) => doc.data()).map((meal) => {
        return [
          meal.meal,
          meal.quantity,
          (meal.quantity * (
            meal.protein * 4 + 
            meal.carbohydrate * 4 + 
            meal.fat * 9
          )).toFixed(2),
          meal.protein.toFixed(2),
          meal.carbohydrate.toFixed(2),
          meal.fat.toFixed(2),
        ]
      });
  } catch (error) {
    console.error("Error querying daily meals:", error);
  }
}

watch(
  [isAuthReady, date],
  () => {
    checkUserDailyMeals();
  }
)

</script>

<template>
  <TextTable 
    :labels="LABELS"
    :data="dailyMeals"/>
</template>