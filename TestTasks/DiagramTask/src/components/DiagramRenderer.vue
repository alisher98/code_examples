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

const getColStyle = (item) => {
  const height = calculateHeight(item);
  const styleObj = {};
  if (item.quantity > 0) {
    styleObj.top = `-${height}px`;
    styleObj.height = `${height}px`;
  } else {
    styleObj.height = `${height}px`;
  }
  return styleObj
}
</script>

<template>
<div class="diagram-renderer">
  <h2>{{ title }}</h2>
  <div class="diagram">
    <div class="column-container">
      <div v-for="(item, i) in colList" :key="i + item.name" class="column">
        <div
          class="column__progress"
          :style="getColStyle(item)"
          :class="{ 'column__progress--positive': item.quantity > 0, 'column__progress--negative': item.quantity < 0 }"
        >
          <div class="column__progress__value" v-tooltip="item.quantity">
            {{ item.quantity }}
          </div>
        </div>
        <div class="column__name_container" :class="{ 'column__name_container--positive': item.quantity > 0, 'column__name_container--negative': item.quantity < 0 }">
          <div class="column__name" v-tooltip="item.name">
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
  height: 900px;
  margin-bottom: 50px;
  background: lightgoldenrodyellow;

  h2 {
    text-align: center;
    margin: 0;
    padding: 20px;
  }
  .diagram {
    max-width: 100%;
    width: fit-content;
    margin: 0 auto;
    height: calc(100% - 68px);
    padding: 0 70px;
    box-sizing: border-box;
    overflow: auto;
    display: flex;
    align-items: center;
  }
  .column-container {
    display: flex;
    position: relative;
    margin-top: 100px;
  }
  .column {
    position: relative;
    min-width: 50px;
    width: 50px;
    margin-right: 10px;
    &__progress {
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      &__value {
        cursor: help;
        position: absolute;
        top: -90px;
        transform: rotateZ(-90deg);
        text-align: left;
        min-width: 100px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      &--positive {
        background: red;
        position: absolute;
        width: 100%;
      }
      &--negative {
        background: green;
      }
    }
    &__name_container {
      position: absolute;
      bottom: -10px;
      width: 100%;
      border-top: 1px solid black;
    }
    &__name {
      cursor: help;
      position: absolute;
      left: -110px;
      bottom: -135px;
      min-width: 225px;
      max-width: 225px;
      text-align: right;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      transform: rotateZ(-80deg);
    }
  }
}
</style>