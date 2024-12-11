<template>
  <div>
    <h1>Create Note</h1>
    <form @submit.prevent="addNote">
      <input v-model="newNote.title" required minlength="3" maxlength="50" />
      <label>
        <input type="checkbox" v-model="newNote.completed" />
        Completed
      </label>
      <button type="submit">Add</button>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import {type Note, useNotesStore} from '../stores/notes';
import { useRouter } from 'vue-router';

const store = useNotesStore();
const router = useRouter();

const newNote = ref<Note>({ title: '', completed: false, id: Math.random() * 10000 + 1000, body: '' });

const addNote = () => {
  store.addNote(newNote.value);
  router.push('/');
};
</script>
