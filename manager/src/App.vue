<template>
  <div id="app">
    <div id="nav"><router-link :to="{ name: 'dashboard' }">Dashboard</router-link></div>
    <router-view />
  </div>
</template>
