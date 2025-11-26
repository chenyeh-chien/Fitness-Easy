<script setup lang="ts">
import { clsx } from "clsx";
import { toRefs, computed } from "vue";

interface Props {
  time?: Date;
  calendarDate?: Date;
  startFromMon?: boolean;
  dateList?: number[][];
}

interface Emits {
  (e: "changeDate", date: number): void;
}

const props = withDefaults(defineProps<Props>(), {
  time: () => new Date(),
  calendarDate: () => new Date(),
  startFromMon: true,
  dateList: () => {
    return [
      [-1, -1, -1, -1, -1, -1, -1],
      [-1, -1, -1, -1, -1, -1, -1],
      [-1, -1, -1, -1, -1, -1, -1],
      [-1, -1, -1, -1, -1, -1, -1],
      [-1, -1, -1, -1, -1, -1, -1]
    ]
  }
});
const { time, calendarDate, startFromMon, dateList } = toRefs(props);
const emits = defineEmits<Emits>();

const dayLabels = computed(() => {
  return startFromMon.value ?
    ["M", "T", "W", "T", "F", "S", "S",] :
    ["S", "M", "T", "W", "T", "F", "S"]
})

const getDayLabelColorClass = (index: number) => {
  if (startFromMon.value) {
    if (index === 5) return "text-(--datetime-day-sat-color)";
    if (index === 6) return "text-(--datetime-day-sun-color)";
  } else {
    if (index === 0) return "text-(--datetime-day-sun-color)";
    if (index === 6) return "text-(--datetime-day-sat-color)";
  }
  return "";
}

const getDateClass = (date: number) => {
  return date !== -1
    ? "cursor-pointer hover:text-(--datetime-day-hover-color) hover:bg-(--datetime-day-hover-bg)"
    : "";
}

const dateStyle = computed(() => {
  return (date: number) => {
    let style = "";

    if (time.value.getFullYear() === calendarDate.value.getFullYear() &&
      time.value.getMonth() === calendarDate.value.getMonth() &&
      time.value.getDate() === date) {
      style += `
        background: var(--datetime-day-hover-bg);
        color: var(--datetime-day-hover-color);
      `;
    }

    return style;
  }
})

const setCurrentDate = (date: number) => {
  if (date === -1) return;

  emits("changeDate", date);
}
</script>

<template>
  <div
    :class="clsx(
        'w-auto h-max text-(--datetime-color) bg-(--datetime-bg)',
        'rounded-[0.3rem] p-4 box-border shadow-(--datetime-box-shadow)'
    )"
    data-test="calendar-selector">
    <div
      data-test="calendar-selector__labels"
      class="flex flex-row justify-between"
    >
      <div
        v-for="(day, index) in dayLabels"
        :key="index"
        data-test="calendar-selector__label__item"
        class="flex justify-center items-center w-8 h-8 rounded-full"
        :class="getDayLabelColorClass(index)">
        <span>{{ day }}</span>
      </div>
    </div>
    <div>
      <div
        data-test="calendar-selector__date-list"
        class="flex flex-row justify-between"
        v-for="(list, listIndex) in dateList"
        :key="listIndex">
        <div
          v-for="(date, dateIndex) in list"
          :key="dateIndex"
          data-test="calendar-selector__date"
          class="flex justify-center items-center w-8 h-8 rounded-full"
          :class="getDateClass(date)"
          :style="dateStyle(date)"
          @click="setCurrentDate(date)">
          <span v-show="date > 0">{{ date }}</span>
        </div>
      </div>
    </div>
  </div>
</template>