<template>
  <b-row>
    <b-col class="d-flex justify-content-center text-center">
      <textarea v-if="vcf" v-model="vcf" rows="50" cols="200" wrap="off"></textarea>
    </b-col>
  </b-row>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapActions } from 'vuex';
import { Buffer } from 'buffer';
import { gunzipSync } from 'fflate';

export default Vue.extend({
  data: () => ({
    vcf: null as string | null
  }),
  methods: {
    ...mapActions(['getVcfGz'])
  },
  async created() {
    const vcfGz = await this.getVcfGz();
    this.vcf = Buffer.from(gunzipSync(vcfGz).buffer).toString();
  }
});
</script>
