<script setup lang="ts">
import { ref } from 'vue'
import RightAlignContainer from '@/components/Utils/containers/RightAlignContainer.vue'
import SectionContainer from '@/components/Utils/containers/SectionContainer.vue'
import CommonButton from '@/components/Utils/buttons/CommonButton.vue'
import BodyInfoForm from '@/components/Physique/BodyInfoForm.vue'
import DailyProgressForm from '@/components/Physique/DailyProgressForm.vue'

// Name, Birth date, Gender, Height
// Every day weight
const showAddBodyInfo = ref(false);
const showAddDailyProgress = ref(false);

function setShowAddBodyInfo(value: boolean) {
  showAddBodyInfo.value = value;
}

function setShowAddDailyProgress(value: boolean) {
  showAddDailyProgress.value = value;
}

function handleShowAddBodyInfo() {
  hideForms();
  setShowAddBodyInfo(true);
}

function handleShowAddDailyProgress() {
  hideForms();
  setShowAddDailyProgress(true);
}

function handleCancelForm() {
  hideForms();
}

function hideForms() {
  setShowAddBodyInfo(false);
  setShowAddDailyProgress(false);
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <RightAlignContainer>
      <div class="flex gap-2">
        <div>
          <CommonButton 
            :text="'Add body info'" 
            @click="handleShowAddBodyInfo"/>
        </div>
        <div>
          <CommonButton 
            :text="'Add daily progress'" 
            @click="handleShowAddDailyProgress"/>
        </div>
      </div>
    </RightAlignContainer>
    <!-- Body info -->
    <!--
    <SectionContainer
      :title="'Body info'">
      
    </SectionContainer>
    -->
    <BodyInfoForm
      v-if="showAddBodyInfo"
      ref="bodyInfoForm"
      @cancel-form="handleCancelForm"/>
    <DailyProgressForm
      v-if="showAddDailyProgress"
      ref="dailyProgressForm"
      @cancel-form="handleCancelForm"/>
  </div>
</template>