<script setup lang="ts">
import { RouterView } from "vue-router";
import { clsx } from "clsx";
import NavbarMain from "./components/Navbar/NavbarMain.vue";
import SidebarMain from "./components/Sidebar/SidebarMain.vue";


// dark mode
document.documentElement.className = "dark";
</script>

<template>
  <div 
    :class="clsx(
      'w-full h-screen bg-(--page-bg)',
      'flex font-(family-name:--font-family)'
    )">
    <SidebarMain />
    <div class="flex flex-col w-full">
      <NavbarMain />
      <main class="p-4">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<style scoped>

</style>
