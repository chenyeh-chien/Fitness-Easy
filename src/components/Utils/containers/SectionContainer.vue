<script setup lang="ts">
import { toRefs } from "vue"
import { clsx } from "clsx"

interface Props {
  title?: string;
  showTitle?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  title: "Default Title",
  showTitle: true,
});
const { title, showTitle } = toRefs(props);

</script>

<template>
  <section 
    :class="clsx(
      'p-4 rounded-lg flex flex-col gap-4',
      'bg-(--section-container-bg) border border-(--section-container-border-color)'
    )">
    <h2 
      v-if="showTitle"
      class="text-(--section-container-color)">
      {{ title }}
    </h2>
    <slot></slot>
  </section>
</template>