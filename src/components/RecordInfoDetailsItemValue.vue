<template>
  <span v-if="metadataId === 'Consequence' || metadataId === 'Annotation'">
    <Anchor
      :href="
        'http://www.sequenceontology.org/browser/obob.cgi?rm=term_list&obo_query=' +
          encodeURIComponent(value) +
          '&release=current_release'
      "
      :text="details ? value : value.replace(/_variant$/, '')"
    />
  </span>
  <span v-else-if="metadataId === 'SYMBOL' || metadataId === 'Gene_Name'">
    <Anchor
      :href="'https://www.omim.org/search?search=' + encodeURIComponent(value) + '&field=approved_gene_symbol'"
      :text="value"
    />
  </span>
  <span v-else-if="metadataId === 'Feature' || metadataId === 'Feature_ID'">
    <Anchor
      v-if="isRefSeqFeatureId()"
      :href="'https://www.ncbi.nlm.nih.gov/nuccore/' + encodeURIComponent(value)"
      :text="value"
    />
    <Anchor
      v-else-if="isEnsemblFeatureId() && (genomeAssembly === 'GRCh37' || genomeAssembly === 'GRCh38')"
      :href="
        'http://' +
          (genomeAssembly === 'GRCh37' ? 'grch37' : 'www') +
          '.ensembl.org/Homo_sapiens/Transcript/Summary?db=core;t=' +
          encodeURIComponent(value)
      "
      :text="value"
    />
    <span v-else>{{ value }}</span>
  </span>
  <span v-else-if="metadataId === 'hgvsC' || metadataId === 'HGVSc'">
    <Anchor
      v-if="isRefSeqFeatureId()"
      :href="'https://www.ncbi.nlm.nih.gov/nuccore/' + encodeURIComponent(value.substring(0, value.indexOf(':')))"
      :text="getHgvsText(value)"
    />
    <Anchor
      v-else-if="isEnsemblFeatureId() && (genomeAssembly === 'GRCh37' || genomeAssembly === 'GRCh38')"
      :href="
        'http://' +
          (genomeAssembly === 'GRCh37' ? 'grch37' : 'www') +
          '.ensembl.org/Homo_sapiens/Transcript/Summary?db=core;t=' +
          encodeURIComponent(value.substring(0, value.indexOf(':')))
      "
      :text="getHgvsText(value)"
    />
    <span v-else>{{ getHgvsText(value) }}</span>
  </span>
  <span v-else-if="metadataId === 'hgvsP' || metadataId === 'HGVSp'">
    <span>{{ getHgvsText(value) }}</span>
  </span>
  <span v-else-if="metadataId === 'gnomAD_AF'">
    <Anchor
      v-if="typeof value === 'object' && value.variant !== null"
      :href="
        'https://gnomad.broadinstitute.org/variant/' +
          encodeURIComponent([value.variant.chr, value.variant.pos, value.variant.ref, value.variant.alt].join('-')) +
          '?dataset=gnomad_r2_1'
      "
      :text="details ? value.gnomAD : value.gnomAD.toFixed(5)"
    />
    <span v-else>{{ details ? value.gnomAD : value.gnomAD.toFixed(5) }}</span>
  </span>
  <span v-else-if="metadataId === 'CLIN_SIG'">{{ getClass(value) }}</span>
  <span v-else>{{ value }}</span>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import Anchor from '@/components/Anchor.vue';
import { mapState } from 'vuex';

export default Vue.extend({
  components: { Anchor },
  props: {
    metadataId: String as PropType<string>,
    value: [String, Number, Boolean, Object] as PropType<string | number | boolean | object>,
    details: {
      type: Boolean as PropType<boolean>,
      default: false
    }
  },
  computed: {
    ...mapState(['metadata']),
    genomeAssembly(): string {
      return this.metadata.htsFile.genomeAssembly;
    }
  },
  methods: {
    isRefSeqFeatureId(): boolean {
      let isRefSeqFeatureId;
      if (typeof this.value === 'string') {
        isRefSeqFeatureId =
          this.value.startsWith('NM_') ||
          this.value.startsWith('NR_') ||
          this.value.startsWith('NP_') ||
          this.value.startsWith('XM_') ||
          this.value.startsWith('XR_') ||
          this.value.startsWith('XP_');
      } else {
        isRefSeqFeatureId = false;
      }
      return isRefSeqFeatureId;
    },
    isEnsemblFeatureId(): boolean {
      let isEnsemblFeatureId;
      if (typeof this.value === 'string') {
        isEnsemblFeatureId = this.value.startsWith('ENST');
      } else {
        isEnsemblFeatureId = false;
      }
      return isEnsemblFeatureId;
    },
    getClass(value: string): string {
      const tokens = value.split('/');
      const vClasses = [];
      for (const token of tokens) {
        let vClass;
        switch (token) {
          case 'benign':
            vClass = 'B';
            break;
          case 'likely_benign':
            vClass = 'LB';
            break;
          case 'uncertain_significance':
            vClass = 'VUS';
            break;
          case 'likely_pathogenic':
            vClass = 'LP';
            break;
          case 'pathogenic':
            vClass = 'P';
            break;
          default:
            vClass = value;
        }
        vClasses.push(vClass);
      }
      return vClasses.join('/');
    },
    getHgvsText(value: string): string {
      let textValue;
      if (this.details) {
        textValue = value;
      } else {
        textValue = value.indexOf(':') !== -1 ? value.substring(value.indexOf(':') + 1) : value;
        if (textValue.length > 29) {
          textValue = textValue.substring(0, 26) + '...';
        }
      }
      return textValue;
    }
  }
});
</script>
