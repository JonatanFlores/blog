<template>
  <nav id="sidebar" :class="{ active: isToggled }">
    <div class="sidebar-header">
      <img src="@/assets/images/logo.png" alt="Logo of the Admin Area" />
      <h1>Management</h1>
    </div>
    <Navigation />
  </nav>
</template>


<script>
import { mapState } from 'vuex';
import Navigation from './Navigation.vue';

export default {
  name: 'sidebar',
  components: {
    Navigation,
  },
  computed: {
    ...mapState('navbar', {
      isToggled: state => state.isToggled,
    }),
  },
};
</script>

<style></style>
