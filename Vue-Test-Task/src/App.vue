<template lang="pug">
  #app
    router-view
</template>

<style lang="scss">

@import './assets/css/reset.css';
@import url('https://fonts.googleapis.com/css2?family=Fira+Sans:ital,wght@0,400;1,900&family=Inter:wght@300;400&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Fira+Sans:ital,wght@0,400;1,900&family=Inter:wght@300;400&family=Montserrat&display=swap');

#app {
  font-family: Fira Sans, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 100vw;
  height: 100vh;
}
</style>
