<script setup lang="ts">
import TextTable from '../Utils/tables/TextTable.vue'

const labels = [
  "Name",
  "Quantity",
  "Protein (g)",
  "Carbohydrate (g)",
  "Fat (g)",
  "Total (kcal)"
]

const tableData = [
[
  "Item1", "1", "10", "90", "10", "490",
],
[
  "Item2", "2", "20", "10", "5", "165",
]]
</script>

<template>
  <TextTable 
    :labels="labels"
    :data="tableData"/>
</template>