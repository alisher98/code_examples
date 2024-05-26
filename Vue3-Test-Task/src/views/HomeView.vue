<script setup lang="ts">
import { useRickAndMortyStore } from '@/stores';
import { onMounted, ref } from 'vue';
import Card from '@/components/HomeCard.vue';
import Filter from '@/components/HomeFilter.vue';

const mortyStore = useRickAndMortyStore();
const query: any = ref({ page: 1, name: '', status: '', species: '', type: ''});

onMounted(() => {
  let queryString = '';
  Object.keys(query.value).forEach(key => {
    if (query.value[key]) {
      if (!queryString) {
        queryString += `?${key}=${query.value[key]}`;
      } else {
        queryString += `&${key}=${query.value[key]}`;
      }
    }
  });
  mortyStore.fetchCharacters(queryString);
});
</script>

<template>
  <div class="home">
    <div class="home__filter">
      <Filter />
    </div>
    <div class="home_cards">
      <Card
        v-for="character in mortyStore.characters"
        :key="character.id"
        :character="character"
      />
    </div>
  </div>
</template>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
}
.home {
  min-height: 100vh;
  background: #242520;
  padding: 20px;
  .home_cards {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    gap: 20px;
  }
}
</style>
