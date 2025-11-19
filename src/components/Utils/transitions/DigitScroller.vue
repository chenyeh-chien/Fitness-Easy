<script setup lang="ts">
import { toRefs, ref, computed, onMounted, watch } from "vue";
import { clsx } from "clsx";

interface Props {
  name?: string;
  data?: number;
  size?: SizeOption;
  fontWeight?: number;
  transitionDuration?: number;
  showUnit?: boolean;
  unit?: string;
  color?: string;
}

type SizeInfo = {
  fontSize: number,
  width: number,
  height: number,
  unitSize: number
}

type SizeOption =
  "2xs" |
  "xs"  |
  "sm"  |
  "lg"  |
  "xl"  |
  "2xl"

const props = withDefaults(defineProps<Props>(), {
    name: "default",
    data: 0,
    size: "lg",
    fontWeight: 500,
    transitionDuration: 5,
    showUnit: false,
    unit: "%",
    color: "#696969"
});

const { data, size, fontWeight, transitionDuration, showUnit,
        unit, color } = toRefs(props);
const digits = ref<number[]>([]);
const sizeMap = ref<Record<SizeOption, SizeInfo>>({
    "2xs": { fontSize: 15, width: 10, height: 20, unitSize: 8 },
    "xs": { fontSize: 23, width: 14, height: 28, unitSize: 12 },
    "sm": { fontSize: 31, width: 18, height: 36, unitSize: 14 },
    "lg": { fontSize: 39, width: 22, height: 44, unitSize: 16 },
    "xl": { fontSize: 47, width: 26, height: 52, unitSize: 18 },
    "2xl": { fontSize: 55, width: 30, height: 60, unitSize: 20 }
})

onMounted(async () => {
    await arrangeDigits("Init");
})

const digitsContainerStyle = computed(() => {
    return `
        font-size: ${sizeMap.value[size.value].fontSize}px;
        font-weight: ${fontWeight.value}; 
        width: ${sizeMap.value[size.value].width}px; 
        height: ${sizeMap.value[size.value].height}px;
        color: ${color.value};
    `;
})

const digitsNumbers = computed(() => {
  return (index: number) => {
    return `
      transition-duration: ${transitionDuration.value}s; 
      transition-delay: .5s;
      transform: translate3d(0px, -${sizeMap.value[size.value].height * digits.value[index]!}px, 0px);
      line-height: ${sizeMap.value[size.value].height}px;
    `;
  }
})

const digitsUnitStyle = computed(() => {
    return `
        font-size: ${sizeMap.value[size.value].unitSize}px;
        width: max-content;
        color: ${color.value};
        margin-bottom: 5px;
        margin-left: 4px;
        transition-duration: ${transitionDuration.value}s; 
        transition-delay: .5s;
        height: fit-content;
    `;
})

const arrangeDigits = async (mode: string = "") => {
    let tempNum = data.value;
    const tempDigits = [];

    do {
        tempDigits.unshift(tempNum % 10);
        tempNum =  Math.floor(tempNum / 10);
    } while (tempNum > 0)

    digits.value = tempDigits;

    if (mode === "Init") {
        await delay(1000);
    }
}

const delay = (milliseconds: number) => {
    return new Promise((resolve) => {
        setTimeout(resolve, milliseconds);
    });
}
watch(
    data,
    async () => {
        await arrangeDigits("Init");
    },
    { deep: true }
)
</script>

<template>
  <span 
    class="relative overflow-hidden whitespace-nowrap">
    <TransitionGroup 
      name="scroller" 
      appear>
      <span 
        v-for="index in digits.length" 
        :class="clsx(
          'relative inline-block overflow-hidden align-bottom',
          'h-full text-center'
        )"
        :style="digitsContainerStyle"
        :key="index">
        <span 
          :class="clsx(
            'absolute flex flex-col w-full h-full'
          )"
          :style="digitsNumbers(index - 1)">
          <span>0</span>
          <span>1</span>
          <span>2</span>
          <span>3</span>
          <span>4</span>
          <span>5</span>
          <span>6</span>
          <span>7</span>
          <span>8</span>
          <span>9</span>
        </span>
      </span>
    </TransitionGroup>
    <span 
      v-if="showUnit" 
      :class="clsx(
        'relative inline-block overflow-hidden align-bottom',
        'h-full text-center'
      )"
      :style="digitsUnitStyle">
      {{ unit }}
    </span>
  </span>
</template>

<style>
.scroller-enter-active,
.scroller-leave-active {
    transition: all 0.5s ease-in-out;
}
.scroller-enter,
.scroller-leave-to {
    opacity: 0;
    transform: translateY(30px);
}
</style>