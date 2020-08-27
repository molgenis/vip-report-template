<template>
  <div></div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { mapGenerationsFromFamily } from '@/helpers/pedigreeMapper';

export default {
  name: 'pedigree',
  computed: {
    ...mapGetters({ family: 'getFamily' }),
    generations() {
      return mapGenerationsFromFamily(this.family);
    }
  },
  methods: {
    ...mapActions(['loadMetadata', 'loadSamples'])
  },
  async created() {
    await this.loadMetadata();
    await this.loadSamples();
  }
};
</script>

<style scoped></style>
