<script setup lang="ts">
import SectionContainer from '@/components/Utils/containers/SectionContainer.vue'
import CommonButton from '@/components/Utils/buttons/CommonButton.vue'
import AddButton from '@/components/Utils/buttons/AddButton.vue'
import RightAlignContainer from '@/components/Utils/containers/RightAlignContainer.vue'
import LabeledTextbox from '@/components/Utils/textboxes/LabeledTextbox.vue'

</script>

<template>
  <div>
    <SectionContainer 
      :title="'Add daily target'">
      <LabeledTextbox 
        :name="'test'"/>
      <RightAlignContainer>
        <div class="flex flex-wrap gap-2">
          <AddButton />
          <CommonButton 
            :text="'Cancel'" />
        </div>
      </RightAlignContainer>
    </SectionContainer>
  </div>
</template>