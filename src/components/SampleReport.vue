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
    </b-col>
  </b-row>
</template>

<script lang="ts">
import RecordTable from "@/components/RecordTable.vue";
import SampleInfo from "@/components/SampleInfo.vue";
import Vue from "vue";

export default Vue.extend({
  components: { SampleInfo, RecordTable },
  props: {
    sample: Object,
    phenotypes: Object
  }
});
</script>
