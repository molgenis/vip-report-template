<template>
  <b-nav pills vertical class="nav-vertical">
    <b-nav-item
      v-for="sample in probandSamples"
      :key="getId(sample)"
      :active="isActive(sample)"
      :disabled="isDisabled(sample)"
      :to="{ params: { id: getId(sample) } }"
    >
      {{ getLabel(sample) }}
    </b-nav-item>
  </b-nav>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { mapState } from 'vuex';
import { Sample } from '@molgenis/vip-report-api';

export default Vue.extend({
  computed: {
    ...mapState(['selectedSample']),
    probandSamples(): Sample[] {
      return this.samples.filter((sample) => sample.proband === true);
    }
  },
  props: {
    samples: Array as PropType<Sample[]>
  },
  methods: {
    getId(sample: Sample) {
      return sample.person.individualId;
    },
    getLabel(sample: Sample) {
      return sample.person.individualId;
    },
    isActive(sample: Sample) {
      return this.selectedSample !== null && this.getId(sample) === this.getId(this.selectedSample);
    },
    isDisabled(sample: Sample) {
      return sample.index === -1;
    }
  }
});
</script>
