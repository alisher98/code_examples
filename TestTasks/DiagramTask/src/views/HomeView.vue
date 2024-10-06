<script setup>
import { useDiagramStore } from '@/stores/diagram.js'
import DiagramRenderer from '@/components/DiagramRenderer.vue'
import { onMounted, ref } from 'vue'

const store = useDiagramStore();
const diagrams = ref([]);

onMounted(() => {
  store.getData();
  diagrams.value = Object.keys(store.data);
})
</script>
<template>
  <div class="home">
    <h1>Диаграммы</h1>
    <DiagramRenderer v-for="item in diagrams" :key="item" :title="item" :data="store.data[item]" />
  </div>
</template>
<style>
.home {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 1200px;
  margin: 0 auto;
}
h1 {
  margin-bottom: 50px;
}
</style>
