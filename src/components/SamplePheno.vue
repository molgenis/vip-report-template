<template>
  <div v-if="phenotypes.items.length === 1 && phenotypes.items[0].phenotypicFeaturesList.length > 0">
    <span v-for="(phenotypicFeature, index) in phenotypes.items[0].phenotypicFeaturesList" :key="index">
      <span class="mr-1">
        <Anchor
          v-if="phenotypicFeature.type.id.startsWith('HP:')"
          :href="'https://hpo.jax.org/app/browse/term/' + encodeURIComponent(phenotypicFeature.type.id)"
          :text="phenotypicFeature.type.label"
        />
        <span v-else>
          {{ phenotypicFeature.type.label }}
        </span>
      </span>
    </span>
    <b-button
      v-if="hpoTerms.length > 0"
      class="ml-3"
      type="button"
      size="sm"
      variant="info"
      :href="'https://molgenis102.gcc.rug.nl?phenotypes=' + hpoTerms.join(',')"
      target="_blank"
      rel="noopener noreferrer nofollow"
    >
      {{ $t('vibe') }}
      <b-icon-box-arrow-in-up-right class="ml-1" />
    </b-button>
  </div>
  <div v-else>
    <span class="font-italic">{{ $t('phenotypesUnavailable') }}</span>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Anchor from '@/components/Anchor.vue';

export default Vue.extend({
  components: { Anchor },
  props: {
    phenotypes: Object
  },
  computed: {
    hpoTerms: function () {
      const hpoTerms = [];
      for (const phenotypicFeature of this.phenotypes.items[0].phenotypicFeaturesList) {
        if (phenotypicFeature.type.id.startsWith('HP:')) {
          hpoTerms.push(phenotypicFeature.type.id);
        }
      }
      return hpoTerms;
    }
  }
});
</script>
