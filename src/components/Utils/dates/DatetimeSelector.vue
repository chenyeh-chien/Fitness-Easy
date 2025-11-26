<script setup lang="ts">
import { toRefs, ref, computed, onMounted, onUnmounted, watch } from "vue"
import CommonTextbox from "../textboxes/CommonTextbox.vue"
import DateTime from "./DateTime.vue"

interface Props {
  width?: string;
  time?: Date;
  showTime?: boolean;
  minuteInterval?: number;
  disableTextInput?: boolean;
}

interface Emits {
  (e: "changeTime", changedTime: Date): void;
}

const props = withDefaults(defineProps<Props>(), {
  time: () => new Date,
  showTime: true,
  disableTextInput: false,
});
const { width, time, showTime, minuteInterval } = toRefs(props);
const emits = defineEmits<Emits>();
const container = ref<HTMLElement | null>(null);
const text = ref("");
const currentTime = ref(time.value);
const isOptions = ref(false);

const datetimeText = computed(() => {
  const year = currentTime.value.getFullYear();
  const month = (currentTime.value.getMonth() + 1).toString().padStart(2, '0');
  const day = currentTime.value.getDate().toString().padStart(2, '0');
  const hours = currentTime.value.getHours().toString().padStart(2, '0');
  const minutes = currentTime.value.getMinutes().toString().padStart(2, '0');

  let result = `${year}-${month}-${day}`;
  if (showTime.value) {
    result += ` ${hours}:${minutes}`;
  }

  return result;
})

onMounted(() => {
  window.addEventListener("click", handleShowOptions);
})

onUnmounted(() => {
  window.removeEventListener("click", handleShowOptions);
})

function handleShowOptions(event: MouseEvent) {
  if (container.value && !container.value.contains(event.target as Node)) {
    changeIsOptions(false);
  }
}

function changeIsOptions(value: boolean) {
  isOptions.value = value;
}

function showOptions(mode = "") {
  if (mode === "searchBox" && isOptions.value) return;

  changeIsOptions(!isOptions.value);
}

function changeTime(date: Date) {
  if (date.getTime() === currentTime.value.getTime()) return;

  currentTime.value = date;
  emits("changeTime", date);
}

function changeTimeByText(text: string) {
  const re = /^(\d{4})-(\d{2})-(\d{2})\s(\d{2}):(\d{2})$/

  const result = re.exec(text);
  if (result !== null) {
    const year = parseInt(result[1]!);
    const month = parseInt(result[2]!) - 1;
    const date = parseInt(result[3]!);
    const hour = parseInt(result[4]!);
    const minute = parseInt(result[5]!);

    const changedTime = new Date(year, month, date, hour, minute);
    changeTime(changedTime);
  }
}

function changeDateByText(text: string) {
  const re = /^(\d{4})-(\d{2})-(\d{2})$/

  const result = re.exec(text);
  if (result !== null) {
    const year = parseInt(result[1]!);
    const month = parseInt(result[2]!) - 1;
    const date = parseInt(result[3]!);

    const changedTime = new Date(year, month, date, 0, 0);
    changeTime(changedTime);
  }
}

watch(
  time,
  (newValue) => {
    if (currentTime.value.getTime() === newValue.getTime()) return;

    currentTime.value = new Date(
      newValue.getFullYear(),
      newValue.getMonth(),
      newValue.getDate(),
      newValue.getHours(),
      newValue.getMinutes()
    );
  }
)

watch(
  datetimeText,
  (newValue) => {
    if (text.value === newValue) return;

    text.value = newValue;
  },
  { immediate: true }
)

watch(
  text,
  (newValue) => {
    showTime.value ? changeTimeByText(newValue) : changeDateByText(newValue);
  }
)
</script>

<template>
  <div
    ref="container"
    class="flex flex-col gap-2"
    data-test="datetime-selector">
    <CommonTextbox
      v-model:text="text"
      :width="width"
      :readonly="disableTextInput"
      @click="showOptions('searchBox')"/>
    <DateTime
      v-if="isOptions"
      :time="currentTime"
      :width="width"
      :show-time="showTime"
      :minute-interval="minuteInterval"
      @change-time="changeTime"
    />
  </div>
</template>
