<template>
  <v-card class="pa-4 ma-4" max-width="600" elevation="4">
    <v-card-title>Analytics</v-card-title>
    <v-card-text>
      <v-form @submit.prevent="fetchAnalytics">
        <v-text-field
          v-model="alias"
          label="Alias"
          required
          prepend-inner-icon="mdi-chart-line"
          variant="outlined"
        />
        <v-btn
          type="submit"
          color="success"
          block
          variant="outlined"
        >
          Get Analytics
        </v-btn>
      </v-form>

      <v-alert v-if="stats" type="success" class="mt-4">
        <div><strong>Total Clicks:</strong> {{ stats.totalClicks }}</div>
        <div><strong>Last 5 IPs:</strong></div>
        <ul>
          <li v-for="(ip, idx) in stats.lastFiveIps" :key="idx">{{ ip }}</li>
        </ul>
      </v-alert>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import axios from 'axios';

const alias = ref('');
const stats = ref<null | { totalClicks: number; lastFiveIps: string[] }>(null);

const fetchAnalytics = async () => {
  try {
    const aliasValue = alias.value.trim().split('/').pop() || '';
    const res = await axios.get(`http://localhost:3000/analytics/${aliasValue}`);
    stats.value = res.data;
  } catch (err: any) {
    alert(err.response?.data?.message || 'Error');
    stats.value = null;
  }
};
</script>