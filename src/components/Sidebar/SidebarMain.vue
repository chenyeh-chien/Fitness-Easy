<script setup lang="ts">
import { toRefs } from 'vue'
import { RouterLink } from 'vue-router'
import { clsx } from "clsx"
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import SidebarLink from "./SidebarLink.vue"
import type { SidebarLinkInfo } from "./Sidebar.types"

interface Props {
  pages: SidebarLinkInfo[]
  showSidebar: boolean;
}

interface Emits {
  (e: "handleShowSidebar", offset: boolean): void;
}

const props = defineProps<Props>();
const { pages, showSidebar } = toRefs(props);
const emit = defineEmits<Emits>();
</script>

<template>
  <aside 
    :class="clsx(
      'fixed left-0 top-18 h-full p-2',
      'opacity-0 duration-300 ease-in-out -translate-x-full',
      showSidebar && 'opacity-100 translate-x-0',
      'bg-(--sidebar-bg) w-full overflow-y-auto',
      'lg:hidden'
    )"
    aria-label="Mobile navigation menu">
    <nav 
      class="flex flex-col"
      aria-label="Main navigation">
      <ul
        :class="clsx(
          'flex flex-col gap-2'
        )">
        <li 
          v-for="info in pages"
          :key="info.name">
          <SidebarLink 
            :info="info" 
            @click="emit('handleShowSidebar', false)"/>
        </li>
      </ul>
    </nav>
  </aside>
</template>