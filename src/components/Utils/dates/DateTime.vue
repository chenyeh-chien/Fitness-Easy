<script setup lang="ts">
import { toRefs, ref, computed, onMounted, watch } from "vue"
import MonthSelector from "./MonthSelector.vue"
import TextSelector from "./TextSelector.vue"
import CalendarSelector from "./CalendarSelector.vue"
import clsx from "clsx"

interface Props {
  time?: Date;
  width?: string;
  startFromMon?: boolean;
  showTime?: boolean;
  minuteInterval?: number;
}

interface Emits {
  (e: "changeTime", changedTime: Date): void;
}

const props = withDefaults(defineProps<Props>(), {
  time: () => new Date,
  width: "16rem",
  startFromMon: true,
  showTime: true,
  minuteInterval: 1,
});
const { time, width, startFromMon, showTime, minuteInterval } = toRefs(props);
const emits = defineEmits<Emits>();
const dateList = ref(
  [
    [-1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1]
  ]
);
const yearList = ref([] as number[]);
const hourList = ref([] as string[]);
const minuteList = ref([] as string[]);
const currentMonth = ref(0);
const currentYear = ref(2020);
const currentDate = ref(1);
const currentHour = ref("00");
const currentMinute = ref("00");

const startDayIndex = computed(() => {
  return startFromMon.value ? 1 : 0;
})

const calendarDate = computed(() => {
  return new Date(
    currentYear.value, currentMonth.value, currentDate.value,
    parseInt(currentHour.value), parseInt(currentMinute.value));
})

onMounted(() => {
  setYearList(buildYearList(new Date()));
  setHourList(buildHourList());
  setMinuteList(buildMinuteList(minuteInterval.value));
})

function setYearList(list: number[]) {
  yearList.value = list;
}

function setHourList(list: string[]) {
  hourList.value = list;
}

function setMinuteList(list: string[]) {
  minuteList.value = list;
}

function buildYearList(date: Date, futureYearCount: number = 3) {
  const year = date.getFullYear();
  const result = [];

  for (let i = year + futureYearCount; i >= 1970; i--) {
    result.push(i);
  }

  return result;
}

function buildHourList() {
  const result = [];

  for (let i = 0; i < 24; i++) {
    result.push(i.toString().padStart(2, '0'));
  }

  return result;
}

function buildMinuteList(interval: number) {
  const result = [];

  for (let i = 0; i < 60; i += interval) {
    result.push(i.toString().padStart(2, '0'));
  }

  return result;
}

function setDatetimeConfig(date: Date) {
  currentYear.value = date.getFullYear();
  currentMonth.value = date.getMonth();
  currentDate.value = date.getDate();
  currentHour.value = date.getHours().toString().padStart(2, '0');
  currentMinute.value = date.getMinutes().toString().padStart(2, '0');

  setDateList(date);
}

function setDateList(date: Date) {
  const firstDate = new Date(date.getFullYear(), date.getMonth(), 1);
  dateList.value = buildDateList(firstDate);
}

function buildDateList(firstDate: Date) {
  let date = new Date(firstDate);

  const result: number[][] = [];
  const firstList = fillByEmpty([], date.getDay())
  let index = 0;

  while (date.getMonth() === firstDate.getMonth()) {
    if (result.length === 0) {
      result.push(firstList);
    } else if (date.getDay() === startDayIndex.value) {
      result.push([]);
      index++;
    }

    result[index]!.push(date.getDate());
    date.setDate(date.getDate() + 1);
  }

  if (result[index]) {
    result[index] = fillByEmpty(result[index]!, 7, true);
  }

  return result;
}

function fillByEmpty(container: number[], currentIndex: number, append?: boolean) {
  const result: number[] = JSON.parse(JSON.stringify(container));
  const totalDay = 7;
  const lastIndex = append ? totalDay : (currentIndex - startDayIndex.value);
  const calcIndex = lastIndex === -1 ? 6 : lastIndex;

  while (result.length < calcIndex) {
    result.push(-1);
  }

  return result;
}

function changeMonthAndYear(month: number, year: number) {
  currentMonth.value = month;
  currentYear.value = year;
}

function changeYear(year: number) {
  currentYear.value = year;
}

function changeDate(date: number) {
  currentDate.value = date;

  emits("changeTime", calendarDate.value);
}

function changeHour(hour: string) {
  currentHour.value = hour;
}

function changeMinute(minute: string) {
  currentMinute.value = minute;
}

watch(
  time,
  (newValue) => {
    setDatetimeConfig(newValue);
  },
  { immediate: true }
)

watch(
  calendarDate,
  (newValue) => {
    setDateList(newValue);
  },
)

watch(
  [currentHour, currentMinute],
  () => {
    emits("changeTime", calendarDate.value);
  },
)
</script>

<template>
  <div
    class="absolute flex flex-col gap-2 z-(--datetime-z-index) text-xs mt-10"
    data-test="date-time">
    <div
      class="flex gap-2"
      data-test="date-time__options"
      :style="`min-width: ${width};`">
      <MonthSelector
        :month="currentMonth"
        :year="currentYear"
        :calendar-date="calendarDate"
        @change-month-and-year="changeMonthAndYear"
      />
      <TextSelector
        :value="currentYear"
        :list="yearList"
        @change-value="changeYear"
      />
      <template v-if="showTime">
        <TextSelector
          :value="currentHour"
          :list="hourList"
          @change-value="changeHour"
        />
        <TextSelector
          :value="currentMinute"
          :list="minuteList"
          @change-value="changeMinute"
        />
      </template>
      <div
        :class="clsx(
          'text-(--datetime-color) bg-(--datetime-bg) rounded-md',
          'p-2 box-border shadow-(--datetime-box-shadow) cursor-pointer'
        )"
        data-test="date-time__today"
        @click="setDatetimeConfig(new Date())">
        <span>Today</span>
      </div>
    </div>
    <CalendarSelector
      :time="time"
      :calendar-date="calendarDate"
      :start-from-mon="startFromMon"
      :date-list="dateList"
      @change-date="changeDate"
    />
  </div>
</template>
