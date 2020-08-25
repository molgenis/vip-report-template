<template>
  <span v-if="metadataId === 'Consequence' || metadataId === 'Annotation'">
    <Anchor
      :href="
        'http://www.sequenceontology.org/browser/obob.cgi?rm=term_list&obo_query=' +
          encodeURIComponent(value) +
          '&release=current_release'
      "
      :text="value"
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
      v-else-if="isEnsemblFeatureId()"
      :href="'http://www.ensembl.org/Homo_sapiens/Transcript/Summary?db=core;t=' + encodeURIComponent(value)"
      :text="value"
    />
    <span v-else>{{ value }}</span>
  </span>
  <span v-else-if="metadataId === 'CLIN_SIG'">{{ getClass(value) }}</span>
  <span v-else>{{ value }}</span>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import Anchor from '@/components/Anchor.vue';

export default Vue.extend({
  components: { Anchor },
  props: {
    metadataId: String as PropType<string>,
    value: [String, Number, Boolean] as PropType<string | number | boolean>
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
      let vClass;
      switch (value) {
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
      return vClass;
    }
  }
});
</script>
