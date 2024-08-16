<template>
  <div class="container">
    <div class="top-container">
      <UserItems  :selectedItems="selectedUserItems" />
      <AvailableItems :selectedItem="selectedAvailableItem" />
    </div>
    <div class="bottom-container">
      <UserItemsList
          :userItems="userItems"
          @selectItem="handleUserItemSelect"
          :selectedUserItems="selectedUserItems"
      />
      <AvailableItemsList
          :availableItems="availableItems"
          @selectItem="handleAvailableItemSelect"
          :selectedAvailableItem="selectedAvailableItem"
      />
    </div>
  </div>
</template>

<script>
import UserItems from './components/UserItems.vue';
import AvailableItems from './components/AvailableItems.vue';
import UserItemsList from './components/UserItemsList.vue';
import AvailableItemsList from './components/AvailableItemsList.vue';

export default {
  components: {
    UserItems,
    AvailableItems,
    UserItemsList,
    AvailableItemsList,
  },
  data() {
    return {
      userItems: [
        {
          "id": 1,
          "name": "Shoes 1"
        },
        {
          "id": 2,
          "name": "Shoes 2"
        },
        {
          "id": 3,
          "name": "Shoes 3"
        },
        {
          "id": 4,
          "name": "Shoes 4"
        },
        {
          "id": 5,
          "name": "T-shirt 1"
        },
        {
          "id": 6,
          "name": "T-shirt 2"
        },
        {
          "id": 7,
          "name": "T-shirt 3"
        },
        {
          "id": 8,
          "name": "T-shirt 4"
        }
      ],
      availableItems: [
        {
          "id": 11,
          "name": "Jacket 1"
        },
        {
          "id": 12,
          "name": "Jacket 2"
        },
        {
          "id": 13,
          "name": "Jacket 3"
        },
        {
          "id": 14,
          "name": "Jacket 4"
        },
        {
          "id": 15,
          "name": "Hoodie 1"
        },
        {
          "id": 16,
          "name": "Hoodie 2"
        },
        {
          "id": 17,
          "name": "Hoodie 3"
        },
        {
          "id": 18,
          "name": "Hoodie 4"
        }
      ],
      selectedUserItems: [],
      selectedAvailableItem: null,
    };
  },
  methods: {
    handleUserItemSelect(item) {
      if (!this.selectedUserItems.includes(item) && this.selectedUserItems.length < 6) {
        this.selectedUserItems.push(item);
      }else {
        this.selectedUserItems = this.selectedUserItems.filter((filterItem) => item.id !== filterItem.id)
      }
    },
    handleAvailableItemSelect(item) {
      if (item.id === this.selectedAvailableItem?.id) {
        this.selectedAvailableItem = null;
      }else  {
        this.selectedAvailableItem = item;
      }
    }
  }
};
</script>

<style>
body {
  margin: 0;
  padding: 50px;
}
.container {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 70px;
}
.top-container {
  display: flex;
  justify-content: space-between;
  .selected-items {
    border: 3px solid black;
    width: fit-content;
    height: 100%;
    padding: 30px;
    display: flex;
    gap: 30px;
    .item {
      display: flex;
      align-items: center;
      cursor: pointer;
      height: 30px;
      padding: 15px;
      border: 3px solid black;
    }
  }
  .selected-item {
    display: flex;
    align-items: center;
    border: 5px solid black;
    width: fit-content;
    padding: 30px;
    gap: 30px;
  }
}
.bottom-container {
  display: flex;
  justify-content: space-between;
  .items-list {
    border: 3px solid black;
    height: 100%;
    padding: 30px;
    display: flex;
    gap: 30px;
    .item {
      cursor: pointer;
      display: flex;
      align-items: center;
      padding: 0 10px 0 10px;
      height: 50px;
      border: 3px solid black;
      font-size: 14px;
    }
  }
}
</style>