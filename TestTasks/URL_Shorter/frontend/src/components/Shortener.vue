<template>
  <v-card class="pa-4 ma-4" max-width="600" elevation="4">
    <v-card-title>Create Short URL</v-card-title>
    <v-card-text>
      <v-form @submit.prevent="create">
        <v-text-field
          v-model="originalUrl"
          label="Original URL"
          required
          prepend-inner-icon="mdi-link"
          variant="outlined"
        />

        <v-text-field
          v-model="alias"
          label="Custom alias (optional)"
          maxlength="20"
          prepend-inner-icon="mdi-pencil"
          variant="outlined"
        />

        <v-text-field
          v-model="expiresAt"
          type="datetime-local"
          label="Expires at (optional)"
          prepend-inner-icon="mdi-calendar"
          variant="outlined"
        />

        <v-btn
          color="primary"
          type="submit"
          class="mt-4"
          block
          variant="outlined"
        >
          Shorten
        </v-btn>
      </v-form>
    </v-card-text>

    <v-divider />

    <v-card-text v-if="shortUrl" class="mt-4">
      <v-alert type="success" border="start" elevation="2">
        Short URL: <a :href="shortUrl" target="_blank">{{ shortUrl }}</a>
      </v-alert>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import axios from 'axios';

const originalUrl = ref('');
const alias = ref('');
const expiresAt = ref('');
const shortUrl = ref('');

const create = async () => {
  try {
    const res = await axios.post('http://localhost:3000/shorten', {
      originalUrl: originalUrl.value,
      alias: alias.value || undefined,
      expiresAt: expiresAt.value || undefined,
    });
    shortUrl.value = res.data.shortUrl;
  } catch (err: any) {
    alert(err.response?.data?.message || 'Error');
  }
};
</script>