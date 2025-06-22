<template>
  <v-card class="pa-4 ma-4" max-width="600" elevation="4">
    <v-card-title>Delete Short Link</v-card-title>
    <v-card-text>
      <v-form @submit.prevent="deleteLink">
        <v-text-field
          v-model="alias"
          label="Alias"
          required
          prepend-inner-icon="mdi-delete"
          variant="outlined"
        />
        <v-btn type="submit" color="error" block
               variant="outlined">Delete</v-btn>
      </v-form>

      <v-alert v-if="message" type="success" class="mt-4">{{ message }}</v-alert>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import axios from 'axios';

const alias = ref('');
const message = ref('');

const deleteLink = async () => {
  try {
    const aliasValue = alias.value.trim().split('/').pop() || '';
    await axios.delete(`http://localhost:3000/delete/${aliasValue}`);
    message.value = 'Link deleted successfully';
  } catch (err: any) {
    alert(err.response?.data?.message || 'Error deleting link');
  }
};
</script>