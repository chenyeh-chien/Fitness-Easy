<script setup lang="ts">
import { toRefs, ref, watch, onMounted, onUnmounted } from 'vue'
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

interface Props {
  value?: string | number;
  options?: (string | number)[];
}

interface Emits {
  (e: "onChangeValue", value: string | number): void;
}

const props = withDefaults(defineProps<Props>(), {
  value: "Default",
  options: () => ["Default"]
})
const { value, options } = toRefs(props);
const emits = defineEmits<Emits>();
const wrapper = ref<HTMLDivElement | null>(null);
const reference = ref(null);
const floating = ref(null);
const isOpened = ref(false);
const { floatingStyles, update } = useFloating(reference, floating, {
  placement: "bottom-start",
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

function handleClickDropdown(selectedVal?: string | number) {
  isOpened.value = !isOpened.value;

  if (selectedVal !== undefined) {
    emits('onChangeValue', selectedVal);
  }
}

watch(
  isOpened,
  (val) => {
    if (reference.value === null || floating.value === null) {
      return;
    }

    if (val) {
      autoUpdate(reference.value, floating.value, update);
    }
  }
)
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
    <ul 
      ref="floating"
      :style="floatingStyles"
      :class="clsx(
        'bg-(--dropdown-bg) rounded-md text-xs text-(--dropdown-color)',
        'flex flex-col gap-2 shadow-(--dropdown-box-shadow)',
        'overflow-y-auto [&::-webkit-scrollbar]:w-2',
        '[&::-webkit-scrollbar-thumb]:rounded-full',
        '[&::-webkit-scrollbar-track]:bg-(--dropdown-scrollbar-track)',
        '[&::-webkit-scrollbar-thumb]:bg-(--dropdown-scrollbar-thumb)',
        !isOpened && 'hidden'  
      )">
      <li 
        v-for="option in options"
        tabindex="0"
        :class="clsx(
          'px-3 py-1.5',
          'hover:bg-(--dropdown-hover-bg)',
          'focus:outline-none'
        )"
        @click="handleClickDropdown(option)">
        {{ option }}
      </li>
    </ul>
  </div>
</template>

