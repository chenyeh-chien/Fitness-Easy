<script setup lang="ts">
import { ref, watch, onMounted, toRefs } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useDailyProgress } from '@/composables/useDailyProgress'
import TextTable from '../Utils/tables/TextTable.vue'

interface Emits {
  (e: 'selectRecord', data: Record<string, any>): void;
}

const emits = defineEmits<Emits>();

const LABELS = [{
  label: "Date",
  key: "date",
}, {
  label: "Weight (kg)",
  key: "weight",
}]
const { user, isAuthReady } = useAuth();
const { getDailyProgress } = useDailyProgress();
const dailyProgress = ref<any[]>([]);

onMounted(() => {
  checkDailyProgress();
})

async function checkDailyProgress() {
  if (user.value === null) {
    console.error("User not logged in");
    return;
  }

  try {
    const querySnapshot = 
      await getDailyProgress(user.value.uid);
    
    querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
    });

    if (querySnapshot.empty) {
      console.log("No meals found for this user.");
    }
    
    dailyProgress.value = querySnapshot.docs.map((doc) => {
      const data = doc.data();

      return {
        ...data,
        id: doc.id,
      }
    });
  } catch (error) {
    console.error("Error querying daily meals:", error);
  }
}

function handleSelectRow(index: number) {
  const data = dailyProgress.value[index];
  emits('selectRecord', data);
}

watch(
  isAuthReady,
  () => {
    checkDailyProgress();
  }
)

</script>

<template>
  <TextTable 
    :headers="LABELS"
    :data="dailyProgress"
    :clickable="true"
    @select-row="handleSelectRow"/>
</template>