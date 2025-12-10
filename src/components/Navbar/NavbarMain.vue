<script setup lang="ts">
import { clsx } from 'clsx'
import { signOut } from "firebase/auth"
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { useAuth } from '@/composables/useAuth'
import { useOverflowHidden } from "@/components/Utils/hooks"
import { auth } from "@/components/Utils/Firebase/firebase"
import ModeButton from "@/components/Navbar/ModeButton.vue"
import SidebarLink from "@/components/Sidebar/SidebarLink.vue"
import SidebarMain from "@/components/Sidebar/SidebarMain.vue"


const { user } = useAuth();
const APP_NAME = "Fitness Easy"
const [showSidebar, setShowSidebar] = useOverflowHidden(document.body);

async function handleSignout() {
  await signOut(auth);
}
</script>

<template>
  <header 
    :class="clsx(
      'fixed z-(--navbar-z-index) w-full p-5 flex justify-between gap-4',
      'bg-(--navbar-bg)'
    )">
    <div class="flex gap-4">
      <div class="flex justify-center items-center lg:hidden">
        <button 
          class="w-max text-(--navbar-color) hover:cursor-pointer"
          @click="setShowSidebar(!showSidebar)">
          <FontAwesomeIcon icon="fa-solid fa-bars"/>
        </button>
      </div>
      <RouterLink
        :class="clsx(
          'text-(--app-name-color) px-3 py-1 rounded-lg duration-500',
          'flex justify-center items-center gap-3',
          'hover:bg-(--sidebar-link-hover-bg) hover:cursor-pointer'
        )"
        to="/"
        @click="setShowSidebar(false)">
        <div>
          <FontAwesomeIcon 
            class="text-(--app-color)"
            icon="fa-solid fa-cubes" />
        </div>
        <span class="font-bold">{{ APP_NAME }}</span>
      </RouterLink>
    </div>
    <SidebarMain 
      :show-sidebar="showSidebar" 
      @handle-show-sidebar="setShowSidebar"/>
    <div class="flex gap-4">
      <div class="flex justify-center items-center">
        <button 
          class="w-max text-(--navbar-color) hover:cursor-pointer">
          <FontAwesomeIcon icon="fa-regular fa-bell"/>
        </button>
      </div>
      <div class="flex justify-center items-center">
        <ModeButton />
      </div>
      <div 
        v-if="user !== null"
        class="flex justify-center items-center">
        <button 
          class="w-max h-max hover:cursor-pointer"
          @click="handleSignout">
          <img
            class="object-cover rounded-full"
            width="24"
            height="24"
            :src="user!.photoURL!" />
        </button>
      </div>
      <RouterLink
        v-else
        to="/login"
        :class="clsx(
          'text-(--navbar-color) px-3 py-1 rounded-lg duration-500',
          'flex justify-center items-center',
          'hover:bg-(--sidebar-link-hover-bg) hover:cursor-pointer'
        )"
        @click="setShowSidebar(false)">
        <FontAwesomeIcon icon="fa-solid fa-arrow-right-to-bracket" />
      </RouterLink>
    </div>
  </header>
</template>