<script setup lang="ts">
import { toRefs, ref, computed, onMounted, onUnmounted } from 'vue'
import { clsx } from 'clsx'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { 
  offset, 
  useFloating, 
  flip, 
  shift, 
  autoUpdate, 
  size 
} from '@floating-ui/vue'
import SelectOptions from './SelectOptions.vue'

interface Props {
  value?: string;
  options?: string[];
}

interface Emits {
  (e: "onChangeValue", value: string): void;
}

const props = withDefaults(defineProps<Props>(), {
  value: "Default",
  options: () => ["Default"]
})
const { value, options } = toRefs(props);
const emits = defineEmits<Emits>();
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

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
})

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
})

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
</script>

<template>
  <div ref="wrapper">
    <div 
      ref="reference"
      tabindex="0"
      :class="clsx(
        'relative text-xs text-(--dropdown-color) w-full px-3 py-1.5 rounded-md',
        'flex gap-1 justify-between bg-(--dropdown-bg) md:w-70',
        'focus:outline-none focus:shadow-(--dropdown-box-shadow)'
      )"
      @click="handleClickDropdown()">
      <div>
        <span>{{ value }}</span>
      </div>
      <div>
        <FontAwesomeIcon icon="fa-solid fa-angle-down" />
      </div>
    </div>
    <SelectOptions
      ref="floatingComponent"
      :style="floatingStyles"
      :options="options"
      :is-opened="isOpened"
      :selected-value="value"
      @on-click-dropdown="handleClickDropdown" />
  </div>
</template>

