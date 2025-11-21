<script setup lang="ts">
import { toRefs } from "vue"
import { clsx } from "clsx"

interface Props {
  title?: string;
}

const props = withDefaults(defineProps<Props>(), {
  title: "Default Title"
});
const { title } = toRefs(props);

</script>

<template>
  <section 
    :class="clsx(
      'p-4 rounded-lg flex flex-col gap-4',
      'bg-(--section-container-bg) border border-(--section-container-border-color)'
    )">
    <h2 
      class="text-(--section-container-color)">
      {{ title }}
    </h2>
    <slot></slot>
  </section>
</template>