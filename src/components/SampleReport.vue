<template>
  <b-row>
    <b-col>
      <b-row>
        <b-col>
          <SampleInfo :sample="sample" :phenotypes="phenotypes" />
        </b-col>
      </b-row>
      <b-tabs>
        <b-tab :title="$t('records')" title-link-class="capitalize" active @click="hideGenomeBrowser">
          <b-row>
            <b-col>
              <RecordTable :sample="sample" />
            </b-col>
          </b-row>
        </b-tab>
        <b-tab :title="$t('genomeBrowser')" title-link-class="capitalize" @click="showGenomeBrowser">
          <b-row>
            <b-col>
              <GenomeBrowser />
            </b-col>
          </b-row>
        </b-tab>
      </b-tabs>
    </b-col>
  </b-row>
</template>

<script lang="ts">
import eventHub from '@/eventHub';
import RecordTable from '@/components/RecordTable.vue';
import SampleInfo from '@/components/SampleInfo.vue';
import Vue from 'vue';
import GenomeBrowser from '@/components/GenomeBrowser.vue';

export default Vue.extend({
  components: { SampleInfo, GenomeBrowser, RecordTable },
  props: {
    sample: Object,
    phenotypes: Object
  },
  methods: {
    showGenomeBrowser() {
      eventHub.$emit('show-genome-browser', true);
    },
    hideGenomeBrowser() {
      eventHub.$emit('show-genome-browser', false);
    }
  }
});
</script>
