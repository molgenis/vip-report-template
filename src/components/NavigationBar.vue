<template>
  <b-navbar type="light" variant="light">
    <b-navbar-brand :to="{ name: 'home' }">{{ $t('brand') }}</b-navbar-brand>
    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
    <b-collapse id="nav-collapse" is-nav>
      <AnnotationsNav />
      <b-navbar-nav>
        <b-nav-item-dropdown :text="$t('data')">
          <b-dropdown-item :to="{ name: 'vcf' }">{{ $t('vcf') }}</b-dropdown-item>
          <b-dropdown-item :to="{ name: 'decision-tree' }">{{ $t('treeViewer') }}</b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>
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
