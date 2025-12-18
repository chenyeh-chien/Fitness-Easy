<script setup lang="ts">
import { toRefs } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { clsx } from "clsx"
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import type { SidebarLinkInfo } from "./Sidebar.types"

interface Props {
  info: SidebarLinkInfo;
  displayIcon?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  displayIcon: true,
});
const { info, displayIcon } = toRefs(props);
const route = useRoute();

</script>

<template>
  <RouterLink
    :class="clsx(
      'text-(--sidebar-link-color) text-sm px-3 py-2 rounded-lg',
      'flex items-center gap-5',
      'md:w-full md:justify-start',
      'hover:bg-(--sidebar-link-hover-bg) hover:cursor-pointer duration-500',
      route.path === info.link && 'bg-(--sidebar-link-bg)'
    )"
    :to="info.link">
    <div 
      v-if="displayIcon"
      class="flex justify-center items-center">
      <FontAwesomeIcon :icon="info.icon" />
    </div>
    <span>{{ info.name }}</span>
  </RouterLink>
</template>