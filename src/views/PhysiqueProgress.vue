<script setup lang="ts">
import { ref, nextTick, useTemplateRef } from 'vue'
import CanvasChart from '@/components/Utils/chart/CanvasChart.vue'
import RightAlignContainer from '@/components/Utils/containers/RightAlignContainer.vue'
import SectionContainer from '@/components/Utils/containers/SectionContainer.vue'
import CommonButton from '@/components/Utils/buttons/CommonButton.vue'
import DailyProgress from '@/components/Physique/DailyProgress.vue'
import BodyInfo from '@/components/Physique/BodyInfo.vue'
import BodyInfoForm from '@/components/Physique/BodyInfoForm.vue'
import DailyProgressForm from '@/components/Physique/DailyProgressForm.vue'
import DailyProgressChart from '@/components/Physique/DailyProgressChart.vue'

// Name, Birth date, Gender, Height
// Every day weight
const SCROLL_OPTIONS = {
  behavior: 'smooth',
}
const showAddBodyInfo = ref(false);
const showAddDailyProgress = ref(false);
const componentKey = ref(0)
const dailyProgressFormRef = useTemplateRef('dailyProgressForm')
const bodyInfoFormRef = useTemplateRef('bodyInfoForm')
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

  await nextTick();
  scrollToDailyProgressForm();
}

async function handleShowAddBodyInfo() {
  hideForms();
  setShowAddBodyInfo(true);

  await nextTick();
  scrollToBodyInfoForm();
}

function scrollToDailyProgressForm() {
  dailyProgressFormRef.value?.$el?.scrollIntoView(SCROLL_OPTIONS);
}

function scrollToBodyInfoForm() {
  bodyInfoFormRef.value?.$el?.scrollIntoView(SCROLL_OPTIONS);
}

async function handleSelectDailyProgress(data: Record<string, any>) {
  hideForms();
  setSelectedDailyProgress(data);

  await nextTick();
  scrollToDailyProgressForm();
}

async function handleSelectBodyInfo(data: Record<string, any>) {
  hideForms();
  setSelectedBodyInfo(data);

  await nextTick();
  scrollToBodyInfoForm();
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
      <div class="flex flex-col gap-10 md:flex-row">
        <div class="flex justify-center items-center">
          <DailyProgressChart/>
        </div>
        <DailyProgress
          :key="componentKey"
          @select-record="handleSelectDailyProgress"/>
      </div>
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
    <BodyInfoForm
      v-if="showAddBodyInfo"
      ref="bodyInfoForm"
      @cancel-form="handleCancelForm"/>
    <BodyInfoForm
      v-if="selectedBodyInfo !== null"
      ref="bodyInfoForm"
      :action="'update'"
      :info="selectedBodyInfo"
      @cancel-form="handleCancelForm"/>
    <DailyProgressForm
      v-if="showAddDailyProgress"
      ref="dailyProgressForm"
      @cancel-form="handleCancelForm"/>
    <DailyProgressForm
      v-if="selectedDailyProgress !== null"
      ref="dailyProgressForm"
      :action="'update'"
      :progress="selectedDailyProgress"
      @cancel-form="handleCancelForm"/>
  </div>
</template>