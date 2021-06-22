<template>
  <div>
    <span v-if="genomeBrowserUnavailable">{{ $t('genomeBrowserUnavailable') }}</span>
    <div ref="igv"></div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import igv from 'igv';
import { mapActions, mapGetters, mapState } from 'vuex';
import { Vcf } from '@molgenis/vip-report-api';

export default Vue.extend({
  computed: {
    ...mapGetters(['genomeBrowserDb']),
    ...mapState(['selectedRecord', 'selectedSample'])
  },
  data() {
    return {
      genomeBrowserUnavailable: false
    };
  },
  methods: {
    ...mapActions(['getBam', 'getFastaGz', 'getGenesGz', 'getVcfGz']),
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
      this.genomeBrowserUnavailable = config === null;
    },
    async deleteGenomeBrowser() {
      igv.removeBrowser(Vue.prototype.$browser);
      Vue.prototype.$browser = undefined;
      this.genomeBrowserUnavailable = this.hasGenomeBrowser();
    },
    async createBrowserConfig(record: Vcf.Record): Promise<unknown | null> {
      const sampleIds = [];
      if (this.selectedSample) {
        const sampleId = this.selectedSample.person.individualId;
        sampleIds.push(sampleId);

        const paternalId = this.selectedSample.person.paternalId;
        if (paternalId !== '0') {
          sampleIds.push(paternalId);
        }

        const maternalId = this.selectedSample.person.maternalId;
        if (maternalId !== '0') {
          sampleIds.push(maternalId);
        }
      }

      const data = await Promise.all([
        this.getFastaGz({ contig: record.c, pos: record.p }),
        this.getVcfGz(),
        this.getGenesGz(),
        ...sampleIds.map((sampleId) => this.getBam(sampleId))
      ]);
      const fastaGz = data[0];
      const vcfGz = data[1];
      const genesGz = data[2];
      const bams = data.slice(3);
      if (fastaGz === null) {
        return null;
      }

      let order = 1;
      let tracks = [];
      if (genesGz) {
        tracks.push({
          order: order++,
          type: 'annotation',
          format: 'refGene',
          name: 'Genes',
          url: 'data:application/gzip;base64,' + genesGz.toString('base64')
        });
      }
      tracks.push({
        order: order++,
        type: 'variant',
        format: 'vcf',
        name: 'Variants',
        url: 'data:application/gzip;base64,' + vcfGz.toString('base64')
      });

      for (let i = 0; i < sampleIds.length; ++i) {
        const bam = bams[i];
        if (bam !== null) {
          const sampleId = sampleIds[i];
          tracks.push({
            order: order++,
            type: 'alignment',
            format: 'bam',
            name: `Alignment (${sampleId})`,
            url: 'data:application/gzip;base64,' + bam.toString('base64')
          });
        }
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
        },
        showCenterGuide: true
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
