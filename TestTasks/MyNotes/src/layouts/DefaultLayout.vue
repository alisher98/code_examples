<template>
  <div>
    <header><h1>My Notes App</h1></header>
    <main><slot /></main>
    <footer class="footer">
      <p>© 2024 My Notes App</p>
    </footer>
  </div>
</template>

<style>
.footer {
  background-color: #f1f1f1;
  padding: 10px;
  text-align: center;
  border-top: 1px solid #ddd;
}
</style>
<script setup lang="ts">
</script>
