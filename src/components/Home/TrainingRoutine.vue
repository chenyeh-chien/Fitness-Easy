<script setup lang="ts">
import TextTable from '../Utils/tables/TextTable.vue'

const LABELS = [{
  label: "Workout exercise",
  key: "workoutExercise",
}, {
  label: "Sets",
  key: "sets",
}, {
  label: "Reps",
  key: "reps",
}, {
  label: "Set time",
  key: "setTime",
}]

const tableData = [{
  "workoutExercise": "槓鈴胸推",
  "sets": "4",
  "reps": "8",
  "setTime": "5:00"
}, {
  "workoutExercise": "啞鈴上胸推",
  "sets": "4",
  "reps": "8",
  "setTime": "5:00"
}]
</script>

<template>
  <TextTable 
    :headers="LABELS"
    :data="tableData"/>
</template>