<template>
  <div class="note-details">
    <h2>Note Details</h2>
    <p v-if="note">
      <strong>Title:</strong> {{ note.title }}<br />
      <strong>Body:</strong> {{ note.body }}<br />
      <strong>Status:</strong> {{ note.completed ? 'Completed' : 'Not Completed' }}
    </p>
    <p v-else>Note not found.</p>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { type Note, useNotesStore } from '../stores/notes';
import { slugify } from '../utils/slugify';

const route = useRoute();
const store = useNotesStore();
const note = ref<Note>();

onMounted(() => {
  const slug = route.params.slug as string;
  note.value = store.notes.find((n) => slugify(n.title) === slug);
});
</script>

<style scoped>
.note-details {
  padding: 20px;
}
</style>
