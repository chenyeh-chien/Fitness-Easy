<script setup lang="ts">
import { ref, watch, onMounted, toRefs } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useBodyInfo } from '@/composables/useBodyInfo'
import TextTable from '../Utils/tables/TextTable.vue'

interface Emits {
  (e: 'selectRecord', data: Record<string, any>): void;
}

const emits = defineEmits<Emits>();

const LABELS = [{
  label: "First name",
  key: "firstName",
}, {
  label: "Last name",
  key: "lastName",
}, {
  label: "Birth date",
  key: "birthDate",
}, {
  label: "Gender",
  key: "gender",
}, {
  label: "Height (cm)",
  key: "height",
}]
const { user, isAuthReady } = useAuth();
const { getBodyInfo } = useBodyInfo();
const bodyInfo = ref<any[]>([]);

onMounted(() => {
  checkBodyInfo();
})

async function checkBodyInfo() {
  if (user.value === null) {
    console.error("User not logged in");
    return;
  }

  try {
    const querySnapshot = 
      await getBodyInfo(user.value.uid);

    if (querySnapshot.empty) {
      console.log("No body info found for this user.");
    }
    
    bodyInfo.value = querySnapshot.docs.map((doc) => {
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
  const data = bodyInfo.value[index];
  emits('selectRecord', data);
}

watch(
  isAuthReady,
  () => {
    checkBodyInfo();
  }
)

</script>

<template>
  <TextTable 
    :headers="LABELS"
    :data="bodyInfo"
    :clickable="true"
    @select-row="handleSelectRow"/>
</template>