<script setup lang="ts">
import { clsx } from "clsx"
import LoginCard from "@/components/Login/LoginCard.vue"


</script>

<template>
  <div 
    :class="clsx(
      'w-full h-full flex justify-center items-center'
    )">
    <LoginCard />
  </div>
</template>