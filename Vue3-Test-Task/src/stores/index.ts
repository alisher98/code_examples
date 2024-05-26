import { ref, watch } from 'vue'
import type { Ref } from 'vue'
import { defineStore } from 'pinia'

export const useRickAndMortyStore = defineStore('rickAndMorty', () => {
  const base_url: String = import.meta.env.VITE_BASE_URL;
  const characters: Ref<any[]> = ref([]);
  const pagination: Ref<any> = ref({});
  const query = ref('');

  const fetchCharacters = async (query: String): Promise<void> => {
    const response = await fetch(`${base_url}/character/${query}`);
    const data = await response.json();
    setCharacters(data.results);
    setPagination(data.info);
  }

  const setCharacters = (data: any[]) => {
    characters.value = data;
  }

  const setPagination = (data: any) => {
    pagination.value = data;
  }

  const setQuery = (data: any) => {
    let newQuery = '';
    Object.keys(data).forEach((key) => {
      if (data[key] !== '') {
        if (newQuery === '') {
          newQuery += `?${key}=${data[key]}`;
        } else {
          newQuery += `&${key}=${data[key]}`;
        }
      }
    })
    query.value = newQuery;
  }

  watch(query, (newQuery) => {
    fetchCharacters(newQuery);
  })

  return {
    fetchCharacters,
    setQuery,
    characters,
    pagination,
  }
});
