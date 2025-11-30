<script setup lang="ts">
import { ref, watch, onMounted, toRefs } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useDailyMeals } from '@/composables/useDailyMeals'
import TextTable from '../Utils/tables/TextTable.vue'

interface Props {
  date?: Date;
}

interface Emits {
  (e: 'selectRecord', data: Record<string, any>): void;
}

const props = withDefaults(defineProps<Props>(), {
  date: () => new Date(),
});
const { date } = toRefs(props);
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

    // Todo: Set original data and displayed table data

    dailyMeals.value = 
      querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          ...data,
          total: (data.quantity * (
            data.protein * 4 + 
            data.carbohydrate * 4 + 
            data.fat * 9
          )).toFixed(2),
          protein: (data.protein * data.quantity).toFixed(2),
          carbohydrate: (data.carbohydrate * data.quantity).toFixed(2),
          fat: (data.fat * data.quantity).toFixed(2),
          id: doc.id,
        }
      });
  } catch (error) {
    console.error("Error querying daily meals:", error);
  }
}

function handleSelectRow(index: number) {
  // Need to get docRef to update the row
  const data = dailyMeals.value[index];
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
    :clickable="true"
    @select-row="handleSelectRow"/>
</template>