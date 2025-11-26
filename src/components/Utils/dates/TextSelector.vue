<script setup lang="ts">
import { toRefs, ref, computed, onMounted, onUnmounted } from "vue"
import { clsx } from 'clsx'
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
  value: any;
  list?: any[];
  width?: string;
}

interface Emits {
  (e: "changeValue", value: any): void;
}

const props = withDefaults(defineProps<Props>(), {
  list: () => [],
  width: "max-content",
});
const { value, list, width } = toRefs(props);
const emits = defineEmits<Emits>();
const wrapper = ref<HTMLDivElement | null>(null);
const reference = ref(null);
const floatingComponent = ref<any>(null);
const floating = computed(() => floatingComponent.value?.$el);
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

const containerStyle = computed(() => {
  return `width: ${width.value};`;
})

onMounted(() => {
  window.addEventListener("click", handleShowOptions);
})

onUnmounted(() => {
  window.removeEventListener("click", handleShowOptions);
})

function handleShowOptions(event: MouseEvent) {
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

function changeValue(item: any) {
  changeIsOptions(false);
  emits("changeValue", item);
}
</script>

<template>
  <div
    ref="wrapper"
    class="relative"
    data-test="text-selector">
    <div
      ref="reference"
      data-test="text-selector__container"
      :style="containerStyle"
      :class="clsx(
        'text-(--datetime-color) bg-(--datetime-bg) rounded-md p-2',
        'box-border shadow-(--datetime-box-shadow) cursor-pointer'
      )"
      @click="showOptions">
      <span>{{ value }}</span>
    </div>
    <SelectOptions
      ref="floatingComponent"
      :style="floatingStyles"
      :min-width="width"
      :options="list"
      :is-opened="isOptions"
      :selected-value="value"
      @on-click-dropdown="changeValue"/>
  </div>
</template>
