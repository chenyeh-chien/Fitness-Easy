<script setup lang="ts">
import { onMounted } from 'vue'
import { getFunctions, httpsCallable } from 'firebase/functions'
import { app } from '@/components/Utils/Firebase/firebase'
import CustomizedMealList from './CustomizedMealList.vue'

const functions = getFunctions(app, 'us-central1');
const getMealList = httpsCallable(functions, 'getTfdaFoodData');

</script>

<template>
  <div class="flex flex-col gap-4">
    <div>
      <button 
        class="bg-blue-500 hover:bg-blue-600 text-xs text-white font-bold py-2 px-4 rounded w-max"
        @click="getMealList({foodName: '牛肉'})">
        Check Function
      </button>
    </div>
    <CustomizedMealList/>
  </div>
</template>