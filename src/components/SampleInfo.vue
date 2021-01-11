<template>
  <b-row>
    <b-col>
      <b-row>
        <b-col cols="1">
          <span>{{ $t('pedigree') }}:</span>
        </b-col>
        <b-col>
          <SamplePedigree :sample="sample" />
        </b-col>
      </b-row>
      <b-row>
        <b-col cols="1">
          <span>{{ $t('phenotypes') }}:</span>
        </b-col>
        <b-col>
          <SamplePheno :phenotypes="phenotypes" />
        </b-col>
      </b-row>
    </b-col>
  </b-row>
</template>

<script lang="ts">
import SamplePheno from '@/components/SamplePheno.vue';
import SamplePedigree from '@/components/SamplePedigree.vue';
import Vue from 'vue';

export default Vue.extend({
  components: { SamplePheno, SamplePedigree },
  props: {
    sample: Object,
    phenotypes: Object
  }
});
</script>
