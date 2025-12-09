<script setup lang="ts">
import { RouterView } from "vue-router"
import { clsx } from "clsx"
import NavbarMain from "./components/Navbar/NavbarMain.vue"
import SidebarMain from "./components/Sidebar/SidebarMain.vue"


// dark mode
document.documentElement.className = "dark";
</script>

<template>
  <div 
    :class="clsx(
      'w-full h-max min-h-screen bg-(--page-bg)',
      'flex font-(family-name:--font-family)'
    )">
    <div 
      class="w-full">
      <NavbarMain />
      <main 
        :class="clsx(
          'p-5 pb-40 mt-18',
          'min-h-[calc(100vh-40px)]'
        )">
        <RouterView />
      </main>
    </div>
  </div>
</template>