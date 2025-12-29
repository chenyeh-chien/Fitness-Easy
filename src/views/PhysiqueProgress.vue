<script setup lang="ts">
import { ref } from 'vue'
import RightAlignContainer from '@/components/Utils/containers/RightAlignContainer.vue'
import SectionContainer from '@/components/Utils/containers/SectionContainer.vue'
import CommonButton from '@/components/Utils/buttons/CommonButton.vue'
import DailyProgress from '@/components/Physique/DailyProgress.vue'
import BodyInfo from '@/components/Physique/BodyInfo.vue'
import BodyInfoForm from '@/components/Physique/BodyInfoForm.vue'
import DailyProgressForm from '@/components/Physique/DailyProgressForm.vue'

const showAddBodyInfo = ref(false);
const showAddDailyProgress = ref(false);
const componentKey = ref(0)
const selectedDailyProgress = ref<Record<string, any> | null>(null);
const selectedBodyInfo = ref<Record<string, any> | null>(null);

function setShowAddBodyInfo(value: boolean) {
  showAddBodyInfo.value = value;
}

function setShowAddDailyProgress(value: boolean) {
  showAddDailyProgress.value = value;
}

function setSelectedDailyProgress(value: Record<string, any> | null) {
  selectedDailyProgress.value = value;
}

function setSelectedBodyInfo(value: Record<string, any> | null) {
  selectedBodyInfo.value = value;
}

async function handleShowAddDailyProgress() {
  hideForms();
  setShowAddDailyProgress(true);
}

async function handleShowAddBodyInfo() {
  hideForms();
  setShowAddBodyInfo(true);
}

async function handleSelectDailyProgress(data: Record<string, any>) {
  hideForms();
  setSelectedDailyProgress(data);
}

async function handleSelectBodyInfo(data: Record<string, any>) {
  hideForms();
  setSelectedBodyInfo(data);
}

function handleCancelForm() {
  hideForms();
  componentKey.value++;
}

function hideForms() {
  setShowAddBodyInfo(false);
  setShowAddDailyProgress(false);
  setSelectedDailyProgress(null);
  setSelectedBodyInfo(null);
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <SectionContainer
      :title="'Body Progress'">
      <DailyProgress
        :key="componentKey"
        @select-record="handleSelectDailyProgress"/>
      <RightAlignContainer>
        <div class="flex gap-2">
          <div>
            <CommonButton 
              :text="'Add daily progress'" 
              @click="handleShowAddDailyProgress"/>
          </div>
        </div>
      </RightAlignContainer>
    </SectionContainer>
    <SectionContainer
      :title="'Body Info'">
      <BodyInfo
        :key="componentKey"
        @select-record="handleSelectBodyInfo"/>
      <RightAlignContainer>
        <div class="flex gap-2">
          <div>
            <CommonButton 
              :text="'Add body info'" 
              @click="handleShowAddBodyInfo"/>
          </div>
        </div>
      </RightAlignContainer>
    </SectionContainer>
    <DailyProgressForm
      v-if="showAddDailyProgress"
      :open="showAddDailyProgress"
      @cancel-form="handleCancelForm"/>
    <DailyProgressForm
      v-if="selectedDailyProgress !== null"
      :open="selectedDailyProgress !== null"
      :action="'update'"
      :progress="selectedDailyProgress!"
      @cancel-form="handleCancelForm"/>
    <BodyInfoForm
      v-if="showAddBodyInfo"
      :open="showAddBodyInfo"
      @cancel-form="handleCancelForm"/>
    <BodyInfoForm
      v-if="selectedBodyInfo !== null"
      :open="selectedBodyInfo !== null"
      :action="'update'"
      :info="selectedBodyInfo!"
      @cancel-form="handleCancelForm"/>
  </div>
</template>