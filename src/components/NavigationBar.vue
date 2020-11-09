<template>
  <b-navbar type="light" variant="light">
    <b-navbar-brand :to="{ name: 'home' }">{{ $t('brand') }}</b-navbar-brand>
    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
    <b-collapse id="nav-collapse" is-nav>
      <AnnotationsNav />
      <b-navbar-nav class="ml-auto">
        <b-nav-item :to="{ name: 'about' }">{{ $t('about') }}</b-nav-item>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script lang="ts">
import AnnotationsNav from '@/components/AnnotationsNav.vue';
import Vue from 'vue';

export default Vue.extend({
  components: { AnnotationsNav }
});
</script>
