<template>
  <v-app>
    <v-main>
      <v-container>
        <h1 class="text-h4 my-4">URL Shortener</h1>
        <div class="">
          <Shortener />
          <Info />
          <Analytics />
          <Delete />
        </div>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import Shortener from './components/Shortener.vue'
import Info from './components/Info.vue'
import Analytics from './components/Analytics.vue'
import Delete from './components/Delete.vue'
</script>