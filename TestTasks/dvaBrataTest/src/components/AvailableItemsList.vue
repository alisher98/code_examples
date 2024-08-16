<template>
  <div class="items-list">
    <div
        v-for="item in availableItems"
        :key="item.id"
        class="item"
        :class="{'selected': selectedAvailableItem?.id === item.id}"
        @click="selectItem(item)">
      {{ item.name }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    availableItems: Array,
    selectedAvailableItem: Object
  },
  methods: {
    selectItem(item) {
      this.$emit('selectItem', item);
    }
  }
};
</script>

<style lang="css">
.selected {
  background: black;
  color: white;
}
</style>