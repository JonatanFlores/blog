<template>
  <!-- main page content -->
  <div id="main-content">
    <Navbar />
    <router-view class="py-3 px-4"></router-view>
  </div>
  <!-- end of main page content -->
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
