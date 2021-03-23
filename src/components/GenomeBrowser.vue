<template>
  <div ref="igv"></div>
</template>

<script lang="ts">
import Vue from 'vue';
import igv from 'igv';
import { mapGetters, mapState } from 'vuex';
import { GenomeBrowserDb } from '@/types/GenomeBrowserDb';
import { Record } from '@molgenis/vip-report-api';

export default Vue.extend({
  computed: {
    ...mapGetters(['genomeBrowserDb']),
    ...mapState(['selectedRecord'])
  },
  mounted() {
    if (this.genomeBrowserDb !== GenomeBrowserDb.hg19 && this.genomeBrowserDb !== GenomeBrowserDb.hg38) {
      return;
    }

    const options = {
      genome: this.genomeBrowserDb
    };

    // store browser in prototype instead of data to prevent very slow report
    igv.createBrowser(this.$refs.igv, options).then((browser: never) => (Vue.prototype.$browser = browser));
  },
  methods: {
    selectRecord(record?: Record) {
      const locus = record ? `chr${record.c}:${record.p}` : 'all';
      Vue.prototype.$browser.search(locus);
    }
  },
  watch: {
    selectedRecord(newRecord?: Record) {
      if (Vue.prototype.$browser !== undefined) {
        this.selectRecord(newRecord);
      }
    }
  }
});
</script>
