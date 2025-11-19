<script setup lang="ts">
import { clsx } from "clsx"
import { RouterLink } from 'vue-router'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import SidebarLink from "./SidebarLink.vue"

const appName = "Fitness Easy"
const navInfos = [
{
  name: "Training routine",
  icon: "fa-solid fa-dumbbell",
  link: "/training-routine"
},
{
  name: "Nutrient",
  icon: "fa-solid fa-scale-balanced",
  link: "/nutrient"
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
      'fixed w-(--sidebar-width) z-10',
      'md:w-(--sidebar-md-width) h-screen bg-(--sidebar-bg) flex justify-center p-2'
    )">
    <nav 
      class="flex flex-col gap-10 pt-1"
      aria-label="Main navigation">
      <RouterLink
        :class="clsx(
          'w-9 h-9 text-(--app-name-color) px-3 py-1 rounded-lg duration-500',
          'flex justify-center items-center gap-3',
          'md:w-full md:justify-start',
          'hover:bg-(--sidebar-link-hover-bg) hover:cursor-pointer'
        )"
        to="/">
        <div>
          <FontAwesomeIcon 
            class="text-(--app-color)"
            icon="fa-solid fa-cubes" />
        </div>
        <span class="hidden md:block font-bold">{{ appName }}</span>
      </RouterLink>
      <ul
        :class="clsx(
          'flex flex-col gap-3'
        )">
        <li 
          v-for="info in navInfos"
          :key="info.name">
          <SidebarLink 
            :info="info"
            />
        </li>
      </ul>
    </nav>
  </aside>
</template>