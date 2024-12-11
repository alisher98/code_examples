import { createRouter, createWebHistory } from 'vue-router';
import DefaultLayout from '../layouts/DefaultLayout.vue';
import NoFooterLayout from '../layouts/NoFooterLayout.vue';
import NotesList from '../pages/NotesList.vue';
import NoteDetails from '../pages/NoteDetails.vue';
import AddNote from '../pages/AddNote.vue';

export type AppLinks = 'NotesList' | 'NoteDetails' | 'AddNote';

const routes = [
  { path: '/', name: 'NotesList', component: NotesList, meta: { layout: DefaultLayout } },
  { path: '/todo/:slug', name: 'NoteDetails', component: NoteDetails, meta: { layout: DefaultLayout } },
  { path: '/add', name: 'AddNote', component: AddNote, meta: { layout: NoFooterLayout } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
