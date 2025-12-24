<script setup lang="ts">
import { 
  toRefs, 
  ref, 
  computed, 
  onMounted, 
  onUnmounted,
  watch
} from "vue"
import { 
  offset, 
  useFloating, 
  flip, 
  shift, 
  autoUpdate, 
  size 
} from '@floating-ui/vue'
import SearchBox from "./SearchBox.vue"
import SelectOptions from "@/components/Utils/dropdowns/SelectOptions.vue"

interface Props {
  results: string[];
}

interface Emits {
  (e: "onChangeValue", value: string): void;
}

const props = defineProps<Props>();
const { results } = toRefs(props);
const emits = defineEmits<Emits>();
const text = defineModel<string>("text", { required: true });
const wrapper = ref<HTMLDivElement | null>(null);
const reference = ref(null);
const floatingComponent = ref<any>(null);
const floating = computed(() => floatingComponent.value?.$el);
const isOpened = ref(false);

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
          zIndex: 1000  
        });
      }
    })
  ]
});

const filteredOptions = computed(() => {
  if (text.value === "") return [];

  return results.value.filter((option) => {
    return option.toLowerCase().includes(text.value.toLowerCase());
  });
});

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});

function handleClickOutside(event: MouseEvent) {
  if (wrapper.value === null) return;

  if (!wrapper.value.contains(event.target as Node)) {
    isOpened.value = false;
  }
}

function handleClickDropdown(selectedVal?: string) {
  isOpened.value = !isOpened.value;

  if (selectedVal !== undefined) {
    emits('onChangeValue', selectedVal);
  }
}

watch(
  text,
  () => {
    isOpened.value = true;
  }
);
</script>

<template>
  <div ref="wrapper">
    <SearchBox 
      ref="reference"
      v-model:text="text"
      @click="handleClickDropdown">
      <SelectOptions
        ref="floatingComponent"
        :style="floatingStyles"
        :options="filteredOptions"
        :is-opened="isOpened"
        :selected-value="text"
        @on-click-dropdown="handleClickDropdown" />
    </SearchBox>
  </div>
</template>
