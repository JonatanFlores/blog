<template>
  <b-nav vertical class="w-100">
    <b-nav-item :to="{ name: 'dashboard' }" exact>
      <i class="fas fa-tachometer-alt"></i> Dashboard
    </b-nav-item>
    <b-nav-item href="#" exact>
      <i class="fa fa-folder"></i> Manage Menus
    </b-nav-item>
    <b-nav-item href="#" exact>
      <i class="fas fa-columns"></i> Manage Pages
    </b-nav-item>
    <b-nav-item href="#" exact>
      <i class="fa fa-users"></i> Manage Users
    </b-nav-item>
  </b-nav>
</template>

<script>
export default {
  name: 'navigation',
  components: {},
};
</script>
