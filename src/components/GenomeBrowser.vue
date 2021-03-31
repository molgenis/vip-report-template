<template>
  <div ref="igv"></div>
</template>

<script lang="ts">
import Vue from 'vue';
import igv from 'igv';
import { mapActions, mapGetters, mapState } from 'vuex';
import { GenomeBrowserDb } from '@/types/GenomeBrowserDb';
import { Vcf } from '@molgenis/vip-report-api';

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
    igv.createBrowser(this.$refs.igv, options).then((browser: never) => {
      Vue.prototype.$browser = browser;
      this.loadVariantTrack();
    });
  },
  methods: {
    ...mapActions(['getVcfGz']),
    async loadVariantTrack() {
      const data = await this.getVcfGz();
      Vue.prototype.$browser.loadTrack({
        type: 'variant',
        format: 'vcf',
        name: 'Variants',
        url: 'data:application/gzip;base64,' + data.toString('base64')
      });
    },
    selectRecord(record?: Vcf.Record) {
      const locus = record ? `chr${record.c}:${record.p}` : 'all';
      Vue.prototype.$browser.search(locus);
    }
  },
  watch: {
    selectedRecord(newRecord?: Vcf.Record) {
      if (Vue.prototype.$browser !== undefined) {
        this.selectRecord(newRecord);
      }
    }
  }
});
</script>
