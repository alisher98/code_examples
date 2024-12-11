<template>
  <component :is="layout">
    <router-view />
  </component>
</template>

<script setup lang="ts">
import {computed, onBeforeMount} from 'vue';
import { useRoute } from 'vue-router';
import {useNotesStore} from "@/stores/notes.ts";

const route = useRoute();
const notesStore = useNotesStore();

onBeforeMount(() => {
  notesStore.fetchNotes();
});

const layout = computed(() =>
  route.meta.layout === 'NoFooter' ? 'NoFooterLayout' : 'DefaultLayout',
);
</script>
