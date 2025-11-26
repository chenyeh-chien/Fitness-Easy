<script setup lang="ts">
import { toRefs } from "vue"
import DatetimeSelector from "./DatetimeSelector.vue"

interface Props {
  label?: string;
  time?: Date;
  width?: string;
  showTime?: boolean;
  minuteInterval?: number;
  disableTextInput?: boolean;
}

interface Emits {
  (e: "changeTime", changedTime: Date): void;
}

const props = withDefaults(defineProps<Props>(), {
  showTime: true,
});
const { label, time, width, showTime, minuteInterval,
  disableTextInput } = toRefs(props);
const emits = defineEmits<Emits>();


function changeTime(date: Date) {
  emits("changeTime", date);
}
</script>

<template>
  <div
    class="flex flex-col gap-1 text-xs text-(--datetime-label-color)"
    data-test="datetime-selector-with-label">
    <label 
      :for="label">{{ label }}</label>
    <DatetimeSelector
      :time="time"
      :width="width"
      :show-time="showTime"
      :minute-interval="minuteInterval"
      :disable-text-input="disableTextInput"
      @change-time="changeTime"
    />
  </div>
</template>
