<template>
  <span>
    <span v-for="(alt, index) in genotype.a" :key="index">
      <Allele :allele="alt" />
      <span v-if="index < genotype.a.length - 1">
        {{ genotype.p ? '|' : '/' }}
      </span>
    </span>
  </span>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { Genotype } from '@molgenis/vip-report-api';
import Allele from '@/components/Allele.vue';

export default Vue.extend({
  components: { Allele },
  props: {
    genotype: Object as PropType<Genotype>
  }
});
</script>
