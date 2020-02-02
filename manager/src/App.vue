<template>
  <div id="app">
    <Sidebar />
    <MainContent />
    <div class="overlay" :class="{ toggled: isToggled }"></div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

import Sidebar from '@/components/Sidebar.vue';
import MainContent from '@/components/MainContent.vue';

import '@/assets/scss/styles.scss';

export default {
  name: 'app',
  components: {
    Sidebar,
    MainContent,
  },
  computed: {
    ...mapState('navbar', {
      isToggled: (state) => state.isToggled,
    }),
  },
};
</script>
