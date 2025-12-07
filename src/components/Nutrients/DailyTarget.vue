<script setup lang="ts">
import { ref, watch, onMounted, toRefs } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useDailyTarget } from '@/composables/useDailyTarget'
import TextTable from '../Utils/tables/TextTable.vue'

interface Emits {
  (e: 'selectRecord', data: Record<string, any>): void;
}

const emits = defineEmits<Emits>();

const LABELS = [{
  label: "Date",
  key: "date",
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
const { getDailyTargets } = useDailyTarget();
const dailyTargets = ref<any[]>([]);

onMounted(() => {
  checkDailyTargets();
})

async function checkDailyTargets() {
  if (user.value === null) {
    console.error("User not logged in");
    return;
  }

  try {
    const querySnapshot = 
      await getDailyTargets(user.value.uid);
    
    querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
    });

    if (querySnapshot.empty) {
      console.log("No body info found for this user.");
    }
    
    dailyTargets.value = querySnapshot.docs.map((doc) => {
      const data = doc.data();

      return {
        ...data,
        id: doc.id,
      }
    });
  } catch (error) {
    console.error("Error querying body info:", error);
  }
}

function handleSelectRow(index: number) {
  const data = dailyTargets.value[index];
  emits('selectRecord', data);
}

watch(
  isAuthReady,
  () => {
    checkDailyTargets();
  }
)

</script>

<template>
  <TextTable 
    :headers="LABELS"
    :data="dailyTargets"
    :clickable="true"
    @select-row="handleSelectRow"/>
</template>