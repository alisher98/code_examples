import { ref } from 'vue'
import { defineStore } from 'pinia'
import textData from './diagram-data-second-task.json';

export const useDiagramStore = defineStore('diagram', () => {
  const data = ref([]);
  const getData = () => {
    data.value = textData;
  }

  return { getData, data };
})
