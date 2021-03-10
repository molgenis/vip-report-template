<template>
  <div ref="igv"></div>
</template>

<script lang="ts">
import Vue from 'vue';
import igv from 'igv';
import { mapGetters } from 'vuex';

export default Vue.extend({
  computed: {
    ...mapGetters(['genomeBrowserDb'])
  },

  mounted() {
    if (this.genomeBrowserDb) {
      const igvDiv = this.$refs.igv;
      const options = { genome: this.genomeBrowserDb };
      igv.createBrowser(igvDiv, options);
    }
  }
});
</script>
