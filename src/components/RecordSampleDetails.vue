<template>
  <div>
    <div>
      <span v-for="(alleleIndex, index) in data.GT.a" :key="index">
        <Allele :allele="alleles[alleleIndex]" :abbreviate="false" />
        <span v-if="index < data.GT.a.length - 1">
          {{ data.GT.p ? '|' : '/' }}
        </span>
      </span>
    </div>
    <RecordInfoDetails
      :metadata="metadata"
      :info="Object.fromEntries(Object.entries(data).filter(([key]) => key !== 'GT'))"
    />
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { Vcf } from '@molgenis/vip-report-api';
import RecordInfoDetails from '@/components/RecordInfoDetails.vue';
import Allele from '@/components/Allele.vue';

export default Vue.extend({
  components: { Allele, RecordInfoDetails },
  props: {
    metadata: Object as PropType<Vcf.FormatMetadataContainer>,
    data: Object as PropType<unknown>,
    alleles: Array as PropType<(string | null)[]>
  }
});
</script>
