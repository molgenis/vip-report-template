<template>
  <span>
    <span v-for="(alt, index) in genotype.a" :key="index">
      <Allele :allele="alt" />
      <span v-if="index < genotype.a.length - 1">
        {{ genotype.p ? '|' : '/' }}
      </span>
    </span>
    <b-button
      v-if="allelicImbalance || lowReadDepth"
      size="sm"
      variant="link"
      class="ml-2 p-0"
      v-b-tooltip.click
      :title="
        (lowReadDepth ? $t('lowReadDepth') : '') +
        (allelicImbalance ? (lowReadDepth ? ' & ' : '') + $t('allelicImbalance') : '')
      "
    >
      <b-icon-exclamation-circle variant="danger" />
    </b-button>
  </span>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { Genotype } from '@molgenis/vip-report-api';
import Allele from '@/components/Allele.vue';

export default Vue.extend({
  components: { Allele },
  props: {
    genotype: Object as PropType<Genotype>,
    readDepth: { type: Number as PropType<number>, required: false },
    allelicDepth: { type: Array as PropType<number[]>, required: false }
  },
  computed: {
    lowReadDepth(): boolean {
      let lowReadDepth = false;
      if (this.readDepth && this.readDepth < 20) {
        lowReadDepth = true;
      }
      return lowReadDepth;
    },
    allelicImbalance(): boolean {
      let allelicImbalance = false;
      if (this.allelicDepth && this.genotype.t === 'het') {
        const total = this.allelicDepth.reduce((a, b) => a + b, 0);
        const balance = this.allelicDepth[0] / total;
        if (balance < 0.2 || balance > 0.8) {
          allelicImbalance = true;
        }
      }
      return allelicImbalance;
    }
  }
});
</script>
