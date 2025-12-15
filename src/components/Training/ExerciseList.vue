<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import TextTable from '../Utils/tables/TextTable.vue'
import { useAuth } from '@/composables/useAuth'
import { useExercises } from '@/composables/useExercises'
import { useIsLoading } from '@/composables/index'

interface Emits {
  (e: 'selectRecord', data: Record<string, any>): void
}

const emits = defineEmits<Emits>();
const { user, isAuthReady } = useAuth();
const { getExercises } = useExercises();
const { isLoading, loadingEffect } = useIsLoading();

const LABELS = [{
  label: "Body part",
  key: "bodyPart",
}, {
  label: "Exercise",
  key: "exercise",
}]
const exercisesInfo = ref<any[]>([]);

onMounted(() => {
  loadingEffect(setExercises);
})

async function setExercises() {
  if (user.value === null) {
    console.error("User not logged in");
    return;
  }

  try {
    const querySnapshot = 
      await getExercises(user.value.uid);
    
    exercisesInfo.value =
       querySnapshot.docs.map((doc) => {
        const data = doc.data();

        return {
          ...data,
          id: doc.id,
        }
       });

    console.log(exercisesInfo.value);
  } catch (error) {
    console.error("Error querying exercises:", error);
  }
}

function handleSelectRow(index: number) {
  const data = exercisesInfo.value[index];
  emits('selectRecord', data);
}

watch(
  [isAuthReady],
  () => {
    loadingEffect(setExercises);
  }
)
</script>

<template>
  <TextTable 
    :headers="LABELS"
    :data="exercisesInfo"
    :clickable="true"
    :displayed-data-cnt="4"
    :is-loading="isLoading"
    @select-row="handleSelectRow"/>
</template> 