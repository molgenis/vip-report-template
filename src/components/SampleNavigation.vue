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
import { Api } from '@molgenis/vip-report-api';

export default Vue.extend({
  computed: {
    ...mapState(['selectedSample']),
    probandSamples(): Api.Sample[] {
      return this.samples.filter((sample) => sample.proband === true);
    }
  },
  props: {
    samples: Array as PropType<Api.Sample[]>
  },
  methods: {
    getId(sample: Api.Sample) {
      return sample.person.individualId;
    },
    getLabel(sample: Api.Sample) {
      return sample.person.individualId;
    },
    isActive(sample: Api.Sample) {
      return this.selectedSample !== null && this.getId(sample) === this.getId(this.selectedSample);
    },
    isDisabled(sample: Api.Sample) {
      return sample.index === -1;
    }
  }
});
</script>
