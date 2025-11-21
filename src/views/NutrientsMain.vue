<script setup lang="ts">
import { ref } from 'vue'
import SectionContainer from '@/components/Utils/containers/SectionContainer.vue'
import CommonButton from '@/components/Utils/buttons/CommonButton.vue'
import AddButton from '@/components/Utils/buttons/AddButton.vue'
import RightAlignContainer from '@/components/Utils/containers/RightAlignContainer.vue'
import LabeledTextbox from '@/components/Utils/textboxes/LabeledTextbox.vue'
import LabeledSelect from '@/components/Utils/dropdowns/LabeledSelect.vue'


const dropdownVal = ref<string | number>('Option1');
const options = [
  'Option1',
  'Option2',
  'Option3',
  'Option1',
  'Option2',
  'Option3'
]

function handleChangeValue(value: string | number) {
  dropdownVal.value = value;
}
</script>

<template>
  <div>
    <SectionContainer 
      :title="'Add daily target'">
      <div class="flex flex-col gap-6">
        <div class="flex flex-col gap-4">
          <LabeledTextbox 
            :label="'Date'"
            :name="'Date'"/>
          <LabeledTextbox 
            :label="'Protein'"
            :name="'Protein'"/>
          <LabeledTextbox 
            :label="'Carbohydrate'"
            :name="'Carbohydrate'"/>
          <LabeledTextbox 
            :label="'Fat'"
            :name="'Fat'"/>
          <LabeledSelect 
            :name="'default'"
            :value="dropdownVal"
            :options="options"
            @on-change-value="handleChangeValue"/>
        </div>
        <RightAlignContainer>
          <div class="flex flex-wrap gap-2">
            <AddButton />
            <CommonButton 
              :text="'Cancel'" />
          </div>
        </RightAlignContainer>
      </div>
    </SectionContainer>
  </div>
</template>