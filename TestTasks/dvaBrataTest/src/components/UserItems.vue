<template>
  <div class="selected-items">
    <div v-if="!selectedItems.length">
      select Item
    </div>
    <div v-else v-for="item in selectedItems" :key="item.id" class="item">
      {{ item.name }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    selectedItems: Array
  }
};
</script>

<style lang="css">
</style>