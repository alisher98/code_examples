<template>
  <div>
    <h1>Notes</h1>
    <table>
      <thead>
      <tr>
        <th>#</th>
        <th>Title</th>
        <th>Completed</th>
        <th>Actions</th>
      </tr>
      </thead>
      <tbody>
      <tr
        v-for="(note, index) in notes"
        :key="note.id"
        :class="{ completed: note.completed }"
      >
        <td>{{ index + 1 }}</td>
        <td><router-link :to="`/todo/${slugify(note.title)}`">{{ note.title }}</router-link></td>
        <td>
          <input
            type="checkbox"
            v-model="note.completed"
            @change="toggleCompletion(note)"
          />
        </td>
        <td>
          <button @click="openEditModal(note)">Edit</button>
          <button @click="openDeleteModal(note)">Delete</button>
        </td>
      </tr>
      </tbody>
    </table>

    <Modal
      v-if="isEditModalOpen"
      title="Edit Note"
      :isOpen="isEditModalOpen"
      :onClose="closeModals"
    >
      <form @submit.prevent="saveEdit">
        <input v-model="currentNote.title" required minlength="3" maxlength="50" />
        <br>
        <br>
        <button type="submit">Save</button>
        <button @click="closeModals">Cancel</button>
      </form>
    </Modal>

    <Modal
      v-if="isDeleteModalOpen"
      title="Delete Note"
      :isOpen="isDeleteModalOpen"
      :onClose="closeModals"
    >
      <p>Are you sure you want to delete this note?</p>
      <br>
      <button @click="deleteNote">Delete</button>
      <button @click="closeModals">Cancel</button>
    </Modal>
  </div>
</template>

<script lang="ts" setup>
import {type PropType, ref} from 'vue';
import { useNotesStore } from '../stores/notes';
import Modal from './Modal.vue';
import type { Note } from "@/stores/notes.ts";
import { slugify } from "@/utils/slugify.ts";

const store = useNotesStore();
defineProps({
  notes: {
    type: Array as PropType<Note[]>,
    required: true,
  },
});


const currentNote = ref<Note>({ id: 0, title: '', completed: false, body: '' });
const isEditModalOpen = ref(false);
const isDeleteModalOpen = ref(false);

const openEditModal = (note: Note) => {
  currentNote.value = { ...note };
  isEditModalOpen.value = true;
};

const openDeleteModal = (note: Note) => {
  currentNote.value = { ...note };
  isDeleteModalOpen.value = true;
};

const closeModals = () => {
  isEditModalOpen.value = false;
  isDeleteModalOpen.value = false;
};

const saveEdit = () => {
  store.updateNote(currentNote.value);
  closeModals();
};

const deleteNote = () => {
  store.deleteNote(currentNote.value.id);
  closeModals();
};

const toggleCompletion = (note: Note) => {
  currentNote.value = { ...note, completed: !note.completed };
  store.updateNote(note);
};
</script>

<style scoped>
.completed {
  background-color: #d4edda;
  td {
    color: black;
  }
}
td,th {
  min-width: 100px !important;
}
button {
  margin: 0 5px;
}
td:has(input) {
  text-align: center;
}
input[type="checkbox"], button {
  cursor: pointer;
}
</style>
