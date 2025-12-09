<script setup lang="ts">
import { clsx } from 'clsx'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import ModeButton from './ModeButton.vue';
</script>

<template>
  <div 
    :class="clsx(
      'fixed z-(--navbar-z-index) w-full p-3 flex justify-end gap-4',
      'bg-(--navbar-bg)'
    )">
    <div>
      <button 
        class="w-max text-(--navbar-color) hover:cursor-pointer">
        <FontAwesomeIcon icon="fa-regular fa-bell"/>
      </button>
    </div>
    <div class="flex justify-center items-center">
      <ModeButton />
    </div>
  </div>
</template>