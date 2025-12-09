<script setup lang="ts">
import { toRefs } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { clsx } from "clsx"
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import type { SidebarLinkInfo } from "./Sidebar.types"

interface Props {
  info: SidebarLinkInfo;
}

const props = defineProps<Props>();
const { info } = toRefs(props);
const route = useRoute();

</script>

<template>
  <RouterLink
    :class="clsx(
      'text-(--sidebar-link-color) text-sm px-3 py-1 rounded-lg',
      'flex items-center gap-5',
      'md:w-full md:justify-start',
      'hover:bg-(--sidebar-link-hover-bg) hover:cursor-pointer duration-500',
      route.path === info.link && 'bg-(--sidebar-link-hover-bg)'
    )"
    :to="info.link">
    <div class="flex justify-center items-center">
      <FontAwesomeIcon :icon="info.icon" />
    </div>
    <span>{{ info.name }}</span>
  </RouterLink>
</template>