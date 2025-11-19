<script setup lang="ts">
import TextTable from '../Utils/tables/TextTable.vue'

const labels = [
  "Workout exercise",
  "Sets",
  "Reps",
  "Set time"
]

const tableData = [
[
  "槓鈴胸推", "4", "8", "5:00"
],
[
  "啞鈴上胸推", "4", "8", "5:00"
]]
</script>

<template>
  <TextTable 
    :labels="labels"
    :data="tableData"/>
</template>