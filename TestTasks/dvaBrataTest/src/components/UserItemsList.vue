<template>
  <div class="items-list">
    <div
        v-for="item in userItems"
        :key="item.id"
        class="item"
        :class="{'selected': selectedUserItems.includes(item)}"
        @click="selectItem(item)">
      {{ item.name }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    userItems: Array,
    selectedUserItems: Array
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