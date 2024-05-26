<script setup lang="ts">
import { ref } from 'vue';
import { useRickAndMortyStore } from '@/stores';
const rickStore = useRickAndMortyStore();
const query = ref({ name: '', status: '', page: 1 });
const save = () => {
  query.value.page = 1;
  rickStore.setQuery(query.value);
}
</script>

<template>
  <div class="filter">
    <label>
      Имя
      <input v-model="query.name" type="text">
    </label>
    Статус:
    <label>
      Все
      <input v-model="query.status" value="" name="status" type="radio">
    </label>
    <label>
      Жив
      <input v-model="query.status" value="alive" name="status" type="radio">
    </label>
    <label>
      Мертв
      <input v-model="query.status" value="dead" name="status" type="radio">
    </label>
    <label>
      Неизвестно
      <input v-model="query.status" value="unknown" name="status" type="radio">
    </label>
    <button @click="save" type="button">
      Применить
    </button>
    <div class="pagination">
      <button :disabled="!rickStore.pagination.prev" @click="rickStore.setQuery({ ...query, page: --query.page })" type="button">
        Prev
      </button>
      Page: {{ query.page }}
      <button :disabled="!rickStore.pagination.next" @click="rickStore.setQuery({ ...query, page: ++query.page })" type="button">
        Next
      </button>
    </div>
  </div>
</template>

<style lang="scss">
.filter {
  width: 800px;
  margin: 0 auto 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  label {
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 0 10px;
  }
  button {
    padding: 10px 20px;
    background: #242520;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  .pagination {
    display: flex;
    align-items: center;
    gap: 20px;
    button {
      padding: 5px 10px;
      &:disabled {
        background: #ccc;
        cursor: not-allowed;
      }
    }
  }
}
</style>