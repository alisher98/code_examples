<script setup lang="ts">
defineProps<{
  character: {
    id: number;
    name: string;
    status: string;
    species: string;
    type: string;
    gender: string;
    image: string;
    location: {
      name: string;
      url: string;
    };
    origin: {
      name: string;
      url: string;
    };
  }
}>()
</script>

<template>
  <div class="card">
    <img :src="character.image" alt="Card image" class="card__image">
    <div class="card__body">
      <h3 class="card__title">{{ character.name }}</h3>
      <p class="card__status" :class="{ active: character.status.toLowerCase() === 'alive' }">{{ character.status }} - {{ character.species }}</p>
      <p class="card__text_desc">
        Last known location:
      </p>
      <p class="card__text">
        {{ character.location.name }}
      </p>
      <p class="card__text_desc">
        First seen in:
      </p>
      <p class="card__text">
        {{ character.origin.name }}
      </p>
    </div>
  </div>
</template>

<style lang="scss">
.card {
  display: flex;
  width: 25%;
  border-radius: 10px;
  background: #fff;
  img {
    height: 220px;
    width: 220px;
    object-fit: cover;
    border-radius: 10px;
  }
  .card__body {
    width: 100%;
    padding: 5px 15px;
    .card__title {
      font-size: 22px;
      font-weight: 700;
      margin-bottom: 5px;
    }
    .card__status {
      margin-bottom: 20px;
      &::before {
        content: '';
        display: inline-block;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: red;
        margin-right: 5px;
      }
      &.active {
        &::before {
          background: green;
        }
      }
    }
    .card__text_desc {
      font-size: 14px;
      font-weight: 600;
      margin-top: 10px;
      margin-bottom: 5px;
      color: rgb(108, 105, 105);
    }
    .card__text {
      margin-bottom: 20px;
    }
  }
}
</style>