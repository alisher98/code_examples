<template>
  <div class="notes-list">
    <h2>Notes List</h2>
    Filter by completed:
    <button @click="toggleFilter" class="filter-button">
      {{ store.filterCompleted ? 'Show All' : 'Show Completed' }}
    </button>
    <br>
    <button @click="isCreateModalOpen = true" class="filter-button">
      Add Note
    </button>
    <NoteTable :notes="filteredNotes" />
    <Modal
      v-if="isCreateModalOpen"
      @close="isCreateModalOpen = false"
      title="Add Note"
    >
      <form @submit.prevent="addNote">
        <input v-model="newNote.title" required minlength="3" maxlength="50" />
        <br>
        <label>
          <input type="checkbox" v-model="newNote.completed" />
          <b>is completed</b>
        </label>
        <br>
        <button type="submit">Add</button>
      </form>
    </Modal>
  </div>
</template>

<script lang="ts" setup>
import {computed, ref, watch} from 'vue';
import { type Note, useNotesStore } from '../stores/notes';
import NoteTable from '../components/NoteTable.vue';
import { useRoute } from "vue-router";
import Modal from "@/components/Modal.vue";

const store = useNotesStore();
const filteredNotes = computed<Note[]>(() =>
  store.filterCompleted ? store.notes.filter((n) => n.completed) : store.notes
);
const route = useRoute();
const isCreateModalOpen = ref(false);
const newNote = ref<Note>({ title: '', completed: false, id: 0, body: '' });

watch(
  () => route.query.onlyCompleted, // Отслеживаем параметр в URL
  (value) => {
    store.filterCompleted = value === 'true'; // Обновляем состояние фильтра
  },
  { immediate: true } // Выполняем сразу, если параметр уже есть
);

const toggleFilter = () => {
  store.filterCompleted = !store.filterCompleted;
  const urlParams = new URLSearchParams(window.location.search);
  urlParams.set('onlyCompleted', store.filterCompleted.toString());
  window.history.pushState({}, '', `${window.location.pathname}?${urlParams}`);
};

const addNote = () => {
  store.addNote(newNote.value);
  isCreateModalOpen.value = false;
};
</script>

<style scoped>
.notes-list {
  padding: 20px;
}
label {
  color: black;
  display: flex;
  gap: 10px;
}
.filter-button {
  margin-bottom: 10px;
  padding: 5px 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
}
.filter-button:hover {
  background-color: #0056b3;
}
</style>
