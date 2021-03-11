<template>
  <div ref="igv"></div>
</template>

<script lang="ts">
import eventHub from '@/eventHub';
import Vue from 'vue';
import igv from 'igv';
import { mapGetters } from 'vuex';

export default Vue.extend({
  computed: {
    ...mapGetters(['genomeBrowserDb'])
  },

  mounted() {
    if (this.genomeBrowserDb) {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const that = this;
      const igvDiv = this.$refs.igv;
      const options = { genome: this.genomeBrowserDb };
      igv.createBrowser(igvDiv, options).then(function (browser: any) {
        eventHub.$on('show-genome-browser', function () {
          that.$nextTick(() => browser.visibilityChange());
        });
      });
    }
  }
});
</script>
