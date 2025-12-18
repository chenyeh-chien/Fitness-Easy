<script setup lang="ts">
import { clsx } from 'clsx'
import SidebarLink from "../Sidebar/SidebarLink.vue"
import type { SidebarLinkInfo } from "../Sidebar/Sidebar.types"

interface Props {
  pages: SidebarLinkInfo[]
}

const props = defineProps<Props>();
</script>

<template>
  <nav 
    class="hidden lg:block"
    aria-label="Main navigation">
    <ul
      :class="clsx(
        'flex gap-4'
      )">
      <li 
        v-for="info in pages"
        :key="info.name">
        <SidebarLink 
          :display-icon="false"
          :info="info" />
      </li>
    </ul>
  </nav>
</template>