<template>
  <b-row>
    <b-col>
      <b-row>
        <b-col>
          <SampleInfo :sample="sample" :phenotypes="phenotypes" />
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <RecordTable :sample="sample" />
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <GenomeBrowser />
        </b-col>
      </b-row>
    </b-col>
  </b-row>
</template>

<script lang="ts">
import RecordTable from '@/components/RecordTable.vue';
import SampleInfo from '@/components/SampleInfo.vue';
import Vue from 'vue';
import GenomeBrowser from '@/components/GenomeBrowser.vue';

export default Vue.extend({
  components: { SampleInfo, GenomeBrowser, RecordTable },
  props: {
    sample: Object,
    phenotypes: Object
  }
});
</script>
