<script setup lang="ts">
import TextTable from '../Utils/tables/TextTable.vue'

const labels = [
  "Nutrients",
  "Remain (g)",
  "Intake (g)",
  "Total (g)"
]

const tableData = [
[
  "Protein", "202.5", "0", "202.5"
],
[
  "Carbohydrate", "202.5", "0", "202.5"
],
[
  "Fat", "120", "0", "120"
]]
</script>

<template>
  <TextTable 
    :labels="labels"
    :data="tableData"/>
</template>