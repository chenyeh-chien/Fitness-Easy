<script setup lang="ts">
import { toRefs, ref, computed, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useDatetimeStore } from '@/stores'
import { useAuth } from '@/composables/useAuth'
import { useDailyMeals } from '@/composables/useDailyMeals'
import { useIsLoading } from '@/composables/index'
import { roundTo2 } from '@/components/Utils/utilFunctions/index'
import DigitScroller from '@/components/Utils/transitions/DigitScroller.vue'
import TextTable from '@/components/Utils/tables/TextTable.vue'

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
}, {
  label: "Cost (NTD)",
  key: "totalCost",
}]
const { user, isAuthReady } = useAuth();
const { getDailyMeals } = useDailyMeals();
const originalDailyMeals = ref<any[]>([]);
const dailyMeals = ref<any[]>([]);
const { isLoading, loadingEffect } = useIsLoading();
const dailyFoodCost = computed(() => {
  return Math.round(dailyMeals.value.reduce((acc, meal) => {
    if (meal.totalCost !== undefined) {
      return acc + meal.totalCost;
    }

    return acc;
  }, 0));
})

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
  <div class="flex flex-col gap-4">
    <div>
      <DigitScroller
        :data="dailyFoodCost"
        :transitionDuration="2"
        :size="'2xl'"
        :font-weight="700"
        :color="'var(--sidebar-link-color)'"
        :show-unit="true"
        :unit="'NTD'"/>
    </div>
    <TextTable 
      :headers="LABELS"
      :data="dailyMeals"
      :clickable="editable"
      :is-loading="isLoading"
      @select-row="handleSelectRow"/>
  </div>
</template>