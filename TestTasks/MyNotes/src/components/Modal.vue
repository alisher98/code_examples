<template>
  <div class="modal-overlay" @click="closeModal">
    <div class="modal" @click.stop>
      <header class="modal-header">
        <h6>{{ title }}</h6>
        <button class="close-button" @click="closeModal">x</button>
      </header>
      <div class="modal-body">
        <slot></slot>
      </div>
      <footer class="modal-footer">
        <slot name="footer"></slot>
      </footer>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onBeforeUnmount } from 'vue';

const props = defineProps({
  title: String,
  isOpen: Boolean,
  onClose: Function,
});

const closeModal = () => {
  props.onClose?.();
};

onMounted(() => {
  document.body.style.overflow = 'hidden'; // Блокировка скролла
});

onBeforeUnmount(() => {
  document.body.style.overflow = ''; // Разблокировка скролла
});
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background: white;
  padding: 20px;
  border-radius: 8px;
  min-width: 300px;
  max-width: 500px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.modal-header {
  padding: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  background: white;
  color: black;
}

.close-button {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: black;
}
</style>
