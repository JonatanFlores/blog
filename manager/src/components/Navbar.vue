<template>
  <header>
    <b-navbar toogleable="lg" class="bg-white border-bottom">
      <b-btn
        type="button"
        variant="light"
        class="d-md-none"
        @click.prevent="toggleNavigation"
      >
        <span class="navbar-toggler-icon"></span>
      </b-btn>

      <section class="profile-top ml-auto">
        <b-dropdown
          id="dropdown-1"
          class="mr-2"
          variant="light"
          text="Jonatan Flores"
        >
          <b-dropdown-item>
            <i class="fa fa-user-circle"></i> My Profile
          </b-dropdown-item>
          <b-dropdown-item>
            <i class="fa fa-sign-out-alt"></i> Logout
          </b-dropdown-item>
        </b-dropdown>

        <img src="http://placehold.it/54x54" class="rounded-circle ml-auto" />
      </section>
    </b-navbar>
  </header>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'navbar',
  components: {},
  methods: {
    ...mapActions('navbar', ['toggleNavigation']),
  },
};
</script>
