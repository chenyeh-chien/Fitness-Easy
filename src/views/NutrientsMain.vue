<script setup lang="ts">
import { ref, useTemplateRef, nextTick } from 'vue'
import SectionContainer from '@/components/Utils/containers/SectionContainer.vue'
import DailyTarget from '@/components/Nutrients/DailyTarget.vue'
import DailyTargetForm from '@/components/Nutrients/DailyTargetForm.vue'
import RightAlignContainer from '@/components/Utils/containers/RightAlignContainer.vue'
import CommonButton from '@/components/Utils/buttons/CommonButton.vue'

const SCROLL_OPTIONS = {
  behavior: 'smooth',
}
const showAddDailyTarget = ref(false);
const componentKey = ref(0);
const dailyTargetFormRef = useTemplateRef('dailyTargetForm')
const selectedDailyTarget = ref<Record<string, any> | null>(null);

function setShowAddDailyTarget(value: boolean) {
  showAddDailyTarget.value = value;
}

function setSelectedDailyTarget(data: Record<string, any> | null) {
  selectedDailyTarget.value = data;
}

async function handleShowAddDailyTarget() {
  hideForms();
  setShowAddDailyTarget(true);

  await nextTick();
  scrollToDailyTargetForm();
}

function scrollToDailyTargetForm() {
  dailyTargetFormRef.value?.$el?.scrollIntoView(SCROLL_OPTIONS);
}

async function handleSelectDailyTarget(data: Record<string, any>) {
  hideForms();
  setSelectedDailyTarget(data);

  await nextTick();
  scrollToDailyTargetForm();
}
  

function handleCancelForm() {
  hideForms();
  componentKey.value++;
}

function hideForms() {
  setShowAddDailyTarget(false);
  setSelectedDailyTarget(null);
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <SectionContainer
      :title="'Daily Target'">
      <DailyTarget
        :key="componentKey"
        @select-record="handleSelectDailyTarget"/>
      <RightAlignContainer>
        <div class="flex gap-2">
          <div>
            <CommonButton 
              :text="'Add daily target'" 
              @click="handleShowAddDailyTarget"/>
          </div>
        </div>
      </RightAlignContainer>
    </SectionContainer>
    <DailyTargetForm 
      v-if="showAddDailyTarget" 
      ref="dailyTargetForm"
      @cancel-form="handleCancelForm"/>
    <DailyTargetForm 
      v-if="selectedDailyTarget !== null" 
      ref="dailyTargetForm"
      :action="'update'"
      :target="selectedDailyTarget"
      @cancel-form="handleCancelForm"/>
  </div>
</template>