<script setup lang="ts">
import { toRefs, onUnmounted  } from 'vue'
import clsx from 'clsx'
import { 
  DrawerContent, 
  DrawerOverlay, 
  DrawerPortal, 
  DrawerRoot, 
  DrawerTitle
} from 'vaul-vue'

interface Props {
  open: boolean;
  title: string;
}

interface Emits {
  (e: 'closeDrawer'): void;
}

const props = defineProps<Props>();
const { open, title } = toRefs(props);
const emits = defineEmits<Emits>();

onUnmounted(() => {
  // TODO: need to be resolved
  document.body.style.overflow = 'auto';
})
</script>

<template>
  <DrawerRoot
    :open="open"
    @update:open="(val) => { if (!val) emits('closeDrawer') }">
    <DrawerPortal>
      <DrawerOverlay 
        class="fixed inset-0 bg-black/80 z-50"/>
      <DrawerContent
        id="drawer-content-area"
        :class="clsx(
          'flex flex-col rounded-t-[20px]',
          'bg-(--drawer-bg) text-(--drawer-color)',
          'max-h-[90%] min-h-[50%] mt-24 fixed bottom-0 left-0 right-0 z-50 outline-none'
        )">
        <div 
          class="mx-auto w-12 h-1.5 shrink-0 rounded-full bg-zinc-300 my-4">
        </div>
        <div
          class="flex-1 overflow-y-auto p-6 scrollbar-thin">
          <DrawerTitle 
            class="font-bold text-2xl mb-2 text-center">
            {{ title }}
          </DrawerTitle>
          <slot></slot>
        </div>
      </DrawerContent>
    </DrawerPortal>
  </DrawerRoot>
</template>
