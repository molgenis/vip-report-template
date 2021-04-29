<template>
  <div ref="igv"></div>
</template>

<script lang="ts">
import Vue from 'vue';
import igv from 'igv';
import { mapActions, mapGetters, mapState } from 'vuex';
import { Vcf } from '@molgenis/vip-report-api';

export default Vue.extend({
  computed: {
    ...mapGetters(['genomeBrowserDb']),
    ...mapState(['selectedRecord'])
  },
  methods: {
    ...mapActions(['getFastaGz', 'getGenesGz', 'getVcfGz']),
    hasGenomeBrowser() {
      return Vue.prototype.$browser !== undefined;
    },
    async createGenomeBrowser(config: unknown) {
      Vue.prototype.$browser = await igv.createBrowser(this.$refs.igv, config);
    },
    async updateGenomeBrowser(record: Vcf.Record | null) {
      const config = record !== null ? await this.createBrowserConfig(record) : null;
      if (config === null) {
        if (this.hasGenomeBrowser()) {
          await this.deleteGenomeBrowser();
        }
      } else {
        if (this.hasGenomeBrowser()) {
          Vue.prototype.$browser.loadSessionObject(config);
        } else {
          await this.createGenomeBrowser(config);
        }
      }
    },
    async deleteGenomeBrowser() {
      igv.removeBrowser(Vue.prototype.$browser);
      Vue.prototype.$browser = undefined;
    },
    async createBrowserConfig(record: Vcf.Record): Promise<unknown | null> {
      const data = await Promise.all([
        this.getFastaGz({ contig: record.c, pos: record.p }),
        this.getVcfGz(),
        this.getGenesGz()
      ]);
      const fastaGz = data[0];
      const vcfGz = data[1];
      const genesGz = data[2];
      if (fastaGz === null) {
        return null;
      }

      let tracks = [];
      tracks.push({
        type: 'variant',
        format: 'vcf',
        name: 'Variants',
        url: 'data:application/gzip;base64,' + vcfGz.toString('base64')
      });
      if (genesGz !== null) {
        tracks.push({
          type: 'annotation',
          format: 'refGene',
          name: 'Genes',
          url: 'data:application/gzip;base64,' + genesGz.toString('base64')
        });
      }
      return {
        reference: {
          id: this.genomeBrowserDb !== null ? this.genomeBrowserDb : 'reference_unknown',
          name: this.genomeBrowserDb !== null ? this.genomeBrowserDb : 'Reference',
          fastaURL: 'data:application/gzip;base64,' + fastaGz.toString('base64'),
          tracks: tracks
        },
        locus: record.c + ':' + record.p,
        showChromosomeWidget: false,
        loadDefaultGenomes: false,
        nucleotideColors: {
          A: 'rgb(144, 238, 144)',
          C: 'rgb(176, 196, 222)',
          T: 'rgb(238, 162, 173)',
          G: 'rgb(255, 236, 139)',
          N: 'rgb(80,80,80)'
        }
        // bug in igv?
        // showCenterGuide: true
      };
    }
  },
  watch: {
    selectedRecord(newRecord: Vcf.Record | null) {
      this.updateGenomeBrowser(newRecord);
    }
  }
});
</script>
