<template>
  <nav class="navbar is-fixed-top is-light" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <span class="navbar-item has-text-weight-semibold">VCF Report</span>
    </div>
    <div class="navbar-menu">
      <div class="navbar-start">
        <router-link class="navbar-item" :to="{ name: 'variants' }">Variants</router-link>
      </div>
    </div>
  </nav>
  <div class="container is-fluid">
    <router-view />
  </div>
</template>
