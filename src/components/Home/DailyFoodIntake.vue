<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useDailyMeals } from '@/composables/useDailyMeals'
import TextTable from '../Utils/tables/TextTable.vue'

const LABELS = [
  "Name",
  "Quantity",
  "Protein (g)",
  "Carbohydrate (g)",
  "Fat (g)",
  "Total (kcal)"
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
      await getDailyMeals(user.value.uid, new Date());
    
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
          meal.protein,
          meal.carbohydrate,
          meal.fat,
          meal.quantity * (
            meal.protein * 4 + 
            meal.carbohydrate * 4 + 
            meal.fat * 9
          )
        ]
      });
  } catch (error) {
    console.error("Error querying daily meals:", error);
  }
}

watch(
  isAuthReady,
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