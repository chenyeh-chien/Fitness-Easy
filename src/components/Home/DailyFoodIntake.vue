<script setup lang="ts">
import { ref, watch, onMounted, toRefs } from 'vue'
import { storeToRefs } from 'pinia'
import { useDatetimeStore } from '@/stores/common'
import { useAuth } from '@/composables/useAuth'
import { useDailyMeals } from '@/composables/useDailyMeals'
import { useIsLoading } from '@/composables/index'
import { roundTo2 } from '@/components/Utils/utilFunctions/index'
import TextTable from '../Utils/tables/TextTable.vue'

interface Props {
  editable?: boolean;
}

interface Emits {
  (e: 'selectRecord', data: Record<string, any>): void;
}

const props = withDefaults(defineProps<Props>(), {
  editable: false,
});
const { editable } = toRefs(props);
const emits = defineEmits<Emits>();
const { currTime } = storeToRefs(useDatetimeStore());

const LABELS = [{
  label: "Name",
  key: "meal",
}, {
  label: "Quantity",
  key: "quantity",
}, {
  label: "Total (kcal)",
  key: "total",
}, {
  label: "Protein (g)",
  key: "protein",
}, {
  label: "Carbohydrate (g)",
  key: "carbohydrate",
}, {
  label: "Fat (g)",
  key: "fat",
}]
const { user, isAuthReady } = useAuth();
const { getDailyMeals } = useDailyMeals();
const originalDailyMeals = ref<any[]>([]);
const dailyMeals = ref<any[]>([]);
const { isLoading, loadingEffect } = useIsLoading();

onMounted(() => {
  loadingEffect(checkUserDailyMeals);
})

async function checkUserDailyMeals() {
  if (user.value === null) {
    console.error("User not logged in");
    return;
  }

  try {
    const querySnapshot = 
      await getDailyMeals(user.value.uid, currTime.value);

    if (querySnapshot.empty) {
      console.log("No meals found for this user.");
    }
    
    originalDailyMeals.value = querySnapshot.docs.map((doc) => {
        const data = doc.data();

        return {
          ...data,
          id: doc.id,
        }
      });


    dailyMeals.value = originalDailyMeals.value.map((meal) => {
      return {
        ...meal,
          total: roundTo2(meal.quantity * (
            meal.protein * 4 + 
            meal.carbohydrate * 4 + 
            meal.fat * 9
          )),
          protein: roundTo2(meal.protein * meal.quantity),
          carbohydrate: roundTo2(meal.carbohydrate * meal.quantity),
          fat: roundTo2(meal.fat * meal.quantity),
        }
      });
  } catch (error) {
    console.error("Error querying daily meals:", error);
  }
}

function handleSelectRow(index: number) {
  const data = originalDailyMeals.value[index];
  emits('selectRecord', data);
}

watch(
  [isAuthReady, currTime],
  () => {
    loadingEffect(checkUserDailyMeals);
  }
)

</script>

<template>
  <TextTable 
    :headers="LABELS"
    :data="dailyMeals"
    :clickable="editable"
    :is-loading="isLoading"
    @select-row="handleSelectRow"/>
</template>