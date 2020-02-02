<template>
  <div id="main-content">
    <Navbar />
    <router-view class="py-3 px-4"></router-view>
  </div>
</template>

<script>
import Navbar from './Navbar.vue';

export default {
  name: 'main-content',
  components: {
    Navbar,
  },
};
</script>
