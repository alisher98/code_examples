<template>
  <div class="selected-item">
    <div v-if="!selectedItem">
      select Item
    </div>
    <div v-else >
      {{ selectedItem.name }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    selectedItem: Object
  }
};
</script>