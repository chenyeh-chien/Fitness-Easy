<script setup lang="ts">
import { toRefs, ref, computed, onMounted, onUnmounted } from "vue"
import { clsx } from "clsx"
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome"
import { 
  offset, 
  useFloating, 
  flip, 
  shift, 
  autoUpdate, 
  size 
} from '@floating-ui/vue'
import SelectOptions from "../dropdowns/SelectOptions.vue"

interface Props {
  month: number;
  year: number;
  calendarDate: Date;
  width?: string;
}

interface Emits {
  (e: "changeMonthAndYear", month: number, year: number): void;
}

const props = withDefaults(defineProps<Props>(), {
  width: "auto",
});
const { month, year, calendarDate, width } = toRefs(props);
const emits = defineEmits<Emits>();
const wrapper = ref<HTMLDivElement | null>(null);
const reference = ref(null);
const floatingComponent = ref<any>(null);
const floating = computed(() => floatingComponent.value?.$el);
const monthList = ref([] as string[]);
const isOptions = ref(false);

const { floatingStyles } = useFloating(reference, floating, {
  placement: "bottom-start",
  whileElementsMounted: autoUpdate,
  middleware: [
    offset(8),
    flip(),
    shift({ padding: 8 }),
    size({
      apply({ rects, elements }) {
        Object.assign(elements.floating.style, {
          width: `${rects.reference.width}px`,
          maxHeight: "140px",
          overflowY: "auto",  
        });
      }
    })
  ]
});

const englishMonth = computed(() => {
  const options: Intl.DateTimeFormatOptions = { month: "long" };
  return new Intl.DateTimeFormat("en-US", options).format(calendarDate.value);
})

const containerStyle = computed(() => {
  return `width: ${width.value};`;
})

onMounted(() => {
  document.addEventListener("click", handleClickOutside);

  setEnglishMonthList(getEnglishMonthList());
})

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
})

function handleClickOutside(event: MouseEvent) {
  if (wrapper.value === null) return;

  if (!wrapper.value.contains(event.target as Node)) {
    changeIsOptions(false);
  }
}

function changeIsOptions(value: boolean) {
  isOptions.value = value;
}

function showOptions() {
  changeIsOptions(!isOptions.value);
}

function setEnglishMonthList(list: string[]) {
  monthList.value = list;
}

function getEnglishMonthList() {
  const formatter = new Intl.DateTimeFormat('en-US', { month: 'long' });
  const months: string[] = [];

  for (let i = 0; i < 12; i++) {
    const date = new Date(2024, i); // Year doesn't matter, just the month
    months.push(formatter.format(date));
  }

  return months;
}

function prevMonth() {
  const emitMonth = month.value === 0 ? 11 : month.value - 1;
  const emitYear = month.value === 0 ? year.value - 1 : year.value;

  emits("changeMonthAndYear", emitMonth, emitYear);
}

function nextMonth() {
  const emitMonth = month.value === 11 ? 0 : month.value + 1;
  const emitYear = month.value === 11 ? year.value + 1 : year.value;

  emits("changeMonthAndYear", emitMonth, emitYear);
}

function changeMonth(month: string) {
  const index = monthList.value.indexOf(month);
  changeIsOptions(false);
  emits("changeMonthAndYear", index, year.value);
}
</script>

<template>
  <div
    ref="wrapper"
    class="relative w-full min-w-32"
    data-test="month-selector">
    <div
      ref="reference"
      data-test="month-selector__container"
      :style="containerStyle"
      :class="clsx(
        'flex gap-4 justify-between text-(--datetime-color)',
        'bg-(--datetime-bg) rounded-md p-2 shadow-(--datetime-box-shadow)'
      )">
      <div
        class="cursor-pointer"
        data-test="month-selector__prev"
        @click="prevMonth">
        <FontAwesomeIcon :icon="['fas', 'chevron-left']" />
      </div>
      <div
        class="flex justify-center items-center cursor-pointer"
        data-test="month-selector__container__text"
        @click="showOptions">
        <span>{{ englishMonth }}</span>
      </div>
      <div
        class="cursor-pointer"
        data-test="month-selector__next"
        @click="nextMonth">
        <FontAwesomeIcon :icon="['fas', 'chevron-right']" />
      </div>
    </div>
    <SelectOptions
      ref="floatingComponent"
      :min-width="width"
      :style="floatingStyles"
      :options="monthList"
      :is-opened="isOptions"
      :selected-value="englishMonth"
      :text-align="'center'"
      @on-click-dropdown="changeMonth"/>
  </div>
</template>

