<script setup lang="ts">
import { ref, watch, onMounted, toRefs } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useDailyMeals } from '@/composables/useDailyMeals'
import { roundTo2 } from '@/components/Utils/utilFunctions/index'
import TextTable from '../Utils/tables/TextTable.vue'

interface Props {
  date?: Date;
  editable?: boolean;
}

interface Emits {
  (e: 'selectRecord', data: Record<string, any>): void;
}

const props = withDefaults(defineProps<Props>(), {
  date: () => new Date(),
  editable: false,
});
const { date, editable } = toRefs(props);
const emits = defineEmits<Emits>();

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
  [isAuthReady, date],
  () => {
    checkUserDailyMeals();
  }
)

</script>

<template>
  <TextTable 
    :headers="LABELS"
    :data="dailyMeals"
    :clickable="editable"
    @select-row="handleSelectRow"/>
</template>