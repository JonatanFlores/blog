<template>
  <div id="app">
    <Sidebar />
    <MainContent />
  </div>
</template>

<script>
import Sidebar from '@/components/Sidebar.vue';
import MainContent from '@/components/MainContent.vue';

import '@/assets/scss/styles.scss';

export default {
  name: 'app',
  components: {
    Sidebar,
    MainContent,
  },
};
</script>
