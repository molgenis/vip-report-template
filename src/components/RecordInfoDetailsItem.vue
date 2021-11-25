<template>
  <span v-if="metadata.number.type === 'NUMBER' && metadata.number.count === 1">
    <span v-if="metadata.id === 'GeneObject'">
      <Gene v-if="value.length > 0" :value="value" />
    </span>
    <RecordInfoDetailsItemValue v-if="value !== null" :metadataId="metadata.id" :value="value" :details="details" />
  </span>
  <span v-else>
    <span v-if="metadata.id === 'PUBMED'">
      <PubMedAnchor v-if="value.length > 0" :pubMedIds="value" />
    </span>
    <span v-else-if="metadata.id === 'GeneObject'">
      <Gene v-if="value.length > 0" :value="value" />
    </span>
    <span v-else>
      <span v-for="(item, index) in value" :key="index">
        <RecordInfoDetailsItemValue v-if="value !== null" :metadataId="metadata.id" :value="item" :details="details" />
        <span v-if="index < value.length - 1">, </span>
      </span>
    </span>
  </span>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { Vcf } from '@molgenis/vip-report-api';
import RecordInfoDetailsItemValue from '@/components/RecordInfoDetailsItemValue.vue';
import PubMedAnchor from '@/components/PubMedAnchor.vue';
import Gene from '@/components/Gene.vue';

export default Vue.extend({
  components: { Gene, PubMedAnchor, RecordInfoDetailsItemValue },
  props: {
    metadata: Object as PropType<Vcf.InfoMetadata>,
    value: [String, Number, Boolean, Array, Object] as PropType<
      string | number | boolean | unknown | string[] | number[] | boolean[] | unknown[]
    >,
    details: {
      type: Boolean as PropType<boolean>,
      default: false
    }
  }
});
</script>
