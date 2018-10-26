<template>
  <div id="app">
    <Homepage></Homepage>
  </div>
</template>

<script>
import Homepage from './components/Homepage.vue';
import VueMarkdown from 'vue-markdown';

export default {
  name: 'app',
  components: {
    Homepage,
    VueMarkdown
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  color: #2c3e50;
}
</style>
