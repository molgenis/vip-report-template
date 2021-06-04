<template>
  <div id="app">
    <NavigationBar class="mb-3" />
    <!--suppress HtmlUnknownBooleanAttribute -->
    <b-container fluid>
      <Alerts />
      <router-view />
    </b-container>
  </div>
</template>

<script lang="ts">
import { mapActions } from 'vuex';

import Alerts from '@/components/Alerts.vue';
import NavigationBar from '@/components/NavigationBar.vue';
import Vue from 'vue';

export default Vue.extend({
  components: {
    Alerts,
    NavigationBar
  },
  methods: {
    ...mapActions(['validateRecords', 'validateSamples'])
  },
  async created() {
    await this.validateRecords();
    await this.validateSamples();
  }
});
</script>

<!--suppress CssUnusedSymbol -->
<style>
html {
  font-size: 12px;
}

.btn-xs {
  padding: 0.125rem 0.375rem;
  font-size: 0.75rem;
}

td {
  white-space: nowrap;
}

td.compact {
  padding: 0.25rem;
  width: 0;
}

td.input {
  padding-top: 0rem;
  padding-bottom: 0rem;
}

.nuc {
  width: 0.9rem;
  display: inline-block;
  text-align: center;
}

.nuc-a {
  background-color: #90ee90;
}

.nuc-c {
  background-color: #b0c4de;
}

.nuc-t {
  background-color: #eea2ad;
}

.nuc-g {
  background-color: #ffec8b;
}

/* missing */
.nuc-m {
  background-color: #e3e3e3;
}

.modal-container {
  overflow: auto;
}

.nav-link {
  word-break: break-all;
}

.nav-vertical {
  max-height: calc(100vh - 9rem);
  overflow-y: auto;
  flex-wrap: nowrap;
}

.igv-root {
  margin-left: 0;
  margin-right: 0;
}

.btn-link {
  padding: 0;
}

textarea {
  font-family: monospace;
}
</style>
