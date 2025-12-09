<script setup lang="ts">
import { toRefs } from 'vue'
import { RouterLink } from 'vue-router'
import { clsx } from "clsx"
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import SidebarLink from "./SidebarLink.vue"

interface Props {
  showSidebar: boolean;
}

interface Emits {
  (e: "handleShowSidebar", offset: boolean): void;
}

const props = defineProps<Props>();
const { showSidebar } = toRefs(props);
const emit = defineEmits<Emits>();
const navInfos = [
  {
  name: "Nutrients",
  icon: "fa-solid fa-scale-balanced",
  link: "/nutrients"
},
{
  name: "Training routine",
  icon: "fa-solid fa-dumbbell",
  link: "/training-routine"
},
{
  name: "Daily meals",
  icon: "fa-solid fa-utensils",
  link: "/daily-meals"
},
{
  name: "Physique progress",
  icon: "fa-solid fa-weight-scale",
  link: "/physique-progress"
}]
</script>

<template>
  <aside 
    :class="clsx(
      'fixed left-0 top-18 h-full p-5',
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
          'flex flex-col gap-3'
        )">
        <li 
          v-for="info in navInfos"
          :key="info.name">
          <SidebarLink 
            :info="info" 
            @click="emit('handleShowSidebar', false)"/>
        </li>
      </ul>
    </nav>
  </aside>
</template>