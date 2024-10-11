<script setup>
import { onMounted, ref } from 'vue'
const { data, title } = defineProps(['data', 'title']);
const colList = ref([]);
onMounted(() => {
  colList.value = [...data].sort((a, b) => a.quantity - b.quantity);
})

const calculateHeight = (item) => {
  const maxHeight = 200;
  const maxQuantity = Math.max(...colList.value.map((item) => Math.abs(item.quantity)));
  return Math.abs(item.quantity) / maxQuantity * maxHeight;
}

const getColStyle = (item, type) => {
  if (type === 'positive' && !item.quantity > 0) {
    return { height: 0 }
  }
  if (type === 'negative' && !item.quantity < 0) {
    return { height: 0 }
  }
  const height = calculateHeight(item);
  const styleObj = {};
  styleObj.height = `${height}px`;
  return styleObj
}

const formatNumber = (number) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}
</script>

<template>
<div class="diagram-renderer">
  <h2>{{ title }}</h2>
  <div class="diagram">
    <div class="column-container">
      <div
        v-for="(item, i) in colList"
        :key="i + item.name"
        class="column column--positive"
      >
        <div class="column__progress_value">
          {{ formatNumber(item.quantity) }}
        </div>
        <div
          v-if="item.quantity > 0"
          class="column__progress column__progress--positive"
          :style="getColStyle(item, 'positive')"
        >
        </div>
      </div>
    </div>
    <div class="column-container">
      <div
        v-for="(item, i) in colList"
        :key="i + item.name"
        class="column"
      >
        <div
          v-if="item.quantity < 0"
          class="column__progress column__progress--negative"
          :style="getColStyle(item, 'negative')"
        >
        </div>
      </div>
    </div>
    <div class="column-container">
      <div
        v-for="(item, i) in colList"
        :key="i + item.name"
        class="column"
      >
        <div class="column__name_container">
          <div class="column__name">
            {{ item.name }}
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<style lang="scss" scoped>
.diagram-renderer {
  width: 100%;
  margin-bottom: 50px;
  background: lightgoldenrodyellow;

  h2 {
    text-align: center;
    margin: 0;
    padding: 40px;
  }
  .diagram {
    max-width: 100%;
    width: fit-content;
    height: auto;
    margin: 0 auto;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 10px 70px 70px;
    overflow-y: auto;
  }
  .column-container {
    display: flex;
    width: max-content;
  }
  .column {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-width: 50px;
    width: 50px;
    margin-right: 10px;
    &--positive {
      align-items: center;
      justify-content: flex-end;
    }
    &__progress_value {
      font-weight: 600;
      writing-mode: vertical-lr;
      margin-bottom: 40px;
      transform: rotate(180deg);
    }
    &__progress {
      width: 100%;
      &--positive {
        background: red;
      }
      &--negative {
        background: green;
      }
    }
    &__name_container {
      position: relative;
      bottom: -10px;
      width: 100%;
      border-bottom: 1px solid black;
      padding-bottom: 10px;
      writing-mode: vertical-lr;
      display: flex;
      align-items: center;
      transform: rotate(180deg);
    }
    &__name {
      white-space: nowrap;
      transform: rotate(10deg);
      margin-left: 17%;
    }
  }
}
</style>