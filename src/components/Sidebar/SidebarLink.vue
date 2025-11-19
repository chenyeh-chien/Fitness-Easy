<script setup lang="ts">
import { toRefs } from 'vue'
import { RouterLink } from 'vue-router'
import { clsx } from "clsx"
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import type { SidebarLinkInfo } from "./Sidebar.types"

interface Props {
  info: SidebarLinkInfo;
}

const props = defineProps<Props>();
const { info } = toRefs(props);

</script>

<template>
  <RouterLink
    :class="clsx(
      'w-9 h-9 text-(--sidebar-link-color) text-sm px-3 py-1 rounded-lg',
      'flex justify-center items-center gap-3',
      'md:w-full md:justify-start',
      'hover:bg-(--sidebar-link-hover-bg) hover:cursor-pointer',
      'duration-500'
    )"
    :to="info.link">
    <div>
      <FontAwesomeIcon :icon="info.icon" />
    </div>
    <span class="hidden md:block">{{ info.name }}</span>
  </RouterLink>
</template>