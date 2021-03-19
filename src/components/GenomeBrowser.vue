<template>
  <div v-if="supportedGenomeBrowserDb" ref="igv"></div>
</template>

<script lang="ts">
import Vue from 'vue';
import igv from 'igv';
import { mapGetters, mapState } from 'vuex';
import { GenomeBrowserDb } from '@/types/GenomeBrowserDb';

export default Vue.extend({
  computed: {
    ...mapGetters(['genomeBrowserDb']),
    ...mapState(['selectedRecord']),
    supportedGenomeBrowserDb() {
      let supported;
      switch (this.genomeBrowserDb) {
        case GenomeBrowserDb.hg16:
        case GenomeBrowserDb.hg17:
        case GenomeBrowserDb.hg18:
          supported = false;
          break;
        case GenomeBrowserDb.hg19:
        case GenomeBrowserDb.hg38:
          supported = true;
          break;
        default:
          supported = false;
          break;
      }
      return supported;
    }
  },
  mounted() {
    if (this.supportedGenomeBrowserDb) {
      const igvDiv = this.$refs.igv;
      const options = {
        genome: this.genomeBrowserDb
      };
      igv.createBrowser(igvDiv, options).then(function (browser: never) {
        // storing in data instead of prototype results in very slow report
        Vue.prototype.$browser = browser;
      });
    }
  },
  methods: {
    selectRecord(record?: Record) {
      if (this.supportedGenomeBrowserDb) {
        let locus;
        if (record !== null) {
          let chr = record.c;
          if (!chr.startsWith('chr')) {
            chr = 'chr' + chr;
          }
          locus = chr + ':' + record.p;
        } else {
          locus = 'all';
        }
        Vue.prototype.$browser.search(locus);
      }
    }
  },
  watch: {
    selectedRecord(newRecord?: Record) {
      this.selectRecord(newRecord);
    }
  }
});
</script>
