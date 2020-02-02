<template>
  <nav id="sidebar" :class="{ toggled: isToggled }">
    <b-btn class="dismiss" @click.prevent="toggleNavigation">
      <i class="fas fa-arrow-left"></i>
    </b-btn>
    <div class="sidebar-header">
      <img src="@/assets/images/logo.png" alt="Logo of the Admin Area" />
      <h1>Management</h1>
    </div>
    <Navigation />
  </nav>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import Navigation from './Navigation.vue';

export default {
  name: 'sidebar',
  components: {
    Navigation,
  },
  computed: {
    ...mapState('navbar', {
      isToggled: (state) => state.isToggled,
    }),
  },
  methods: {
    ...mapActions('navbar', ['toggleNavigation']),
  },
};
</script>

<style></style>
