<template>
  <b-form-checkbox
    v-if="isRecordsContainPhenotypes"
    :checked="filterRecordsByPhenotype"
    @change="this.setFilterRecordsByPhenotype"
    >{{ $t('matchPhenotype') }}</b-form-checkbox
  >
</template>

<script lang="ts">
import Vue from 'vue';
import { mapActions, mapGetters, mapState } from 'vuex';

export default Vue.extend({
  computed: {
    ...mapGetters(['isRecordsContainPhenotypes']),
    ...mapState(['filterRecordsByPhenotype'])
  },
  methods: {
    ...mapActions(['setFilterRecordsByPhenotype'])
  }
});
</script>
