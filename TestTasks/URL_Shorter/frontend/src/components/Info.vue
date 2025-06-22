<template>
  <v-card class="pa-4 ma-4" max-width="600" elevation="4">
    <v-card-title>Link Info</v-card-title>
    <v-card-text>
      <v-form @submit.prevent="fetchInfo">
        <v-text-field
          v-model="alias"
          label="Alias"
          required
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
        />
        <v-btn
          type="submit"
          color="info"
          block
          variant="outlined"
        >
          Get Info
        </v-btn>
      </v-form>

      <v-alert v-if="info" type="info" class="mt-4">
        <div><strong>Original URL:</strong> {{ info.originalUrl }}</div>
        <div><strong>Created At:</strong> {{ info.createdAt }}</div>
        <div><strong>Click Count:</strong> {{ info.clickCount }}</div>
      </v-alert>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import axios from 'axios';

const alias = ref('');
const info = ref<null | {
  originalUrl: string
  createdAt: string
  clickCount: number
}>(null);

const fetchInfo = async () => {
  try {
    const aliasValue = alias.value.trim().split('/').pop() || '';
    const res = await axios.get(`http://localhost:3000/info/${aliasValue}`);
    info.value = res.data;
  } catch (err: any) {
    alert(err.response?.data?.message || 'Not found');
    info.value = null;
  }
};
</script>
