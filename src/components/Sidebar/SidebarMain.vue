<script setup lang="ts">
import { onMounted, ref } from "vue"
import { RouterLink } from 'vue-router'
import { clsx } from "clsx"
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import SidebarLink from "./SidebarLink.vue"
import type { UserInfo } from "@/types/common"


const appName = "Fitness Easy"
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
const userInfo = ref<UserInfo | null>(null)

onMounted(() => {
  if (localStorage.getItem('userInfo') === null) return;

  setUserInfo(JSON.parse(localStorage.getItem('userInfo')!));
})

function setUserInfo(user: UserInfo) {
  userInfo.value = user;
}
</script>

<template>
  <aside 
    :class="clsx(
      'fixed w-(--sidebar-width) z-10',
      'md:w-(--sidebar-md-width) h-screen bg-(--sidebar-bg) flex justify-center p-2'
    )">
    <nav 
      class="flex flex-col justify-between"
      aria-label="Main navigation">
      <div class="flex flex-col gap-10">
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
      </div>
      <div 
        v-if="userInfo !== null"
        class="flex justify-center items-center">
        <button 
          class="w-max h-max hover:cursor-pointer">
          <img 
            class="object-cover rounded-full"
            width="30"
            height="30"
            :src="userInfo.avatar!" />
        </button>
      </div>
      <SidebarLink 
        v-else
        :info="{
          icon: 'fa-solid fa-arrow-right-to-bracket',
          link: '/login',
          name: 'Login'
        }" />
    </nav>
  </aside>
</template>