import { defineStore } from 'pinia';
import type { Ref } from 'vue';
import { ref } from 'vue';

export interface Note {
  id: number;
  title: string;
  body: string;
  completed: boolean;
}

export const useNotesStore = defineStore('notes', () => {
  const notes: Ref<Note[]> = ref([]);
  const filterCompleted: Ref<boolean> = ref(false);

  const fetchNotes = async () => {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts');
    const data = await response.json();
    notes.value = data.map((note: Note) => ({ ...note, completed: false }));
  };

  const addNote = (note: Note) => {
    const newNote = {
      id: note.id || Date.now(),
      title: note.title,
      body: note.body,
      completed: note.completed,
    };
    notes.value.push(newNote);
    console.log('notes', note);
  };

  const deleteNote = (id: number) => {
    notes.value = notes.value.filter((note) => note.id !== id);
  };

  const updateNote = ({ id, title, body }: Note) => {
    const note = notes.value.find((note) => note.id === id);
    if (note) {
      note.title = title;
      note.body = body;
    }
  }

  return { notes, filterCompleted, fetchNotes, addNote, deleteNote, updateNote };
});
