<template>
  <div>
    <b-form-checkbox
        v-if="isRecordsContainPhenotypes"
        :checked="filterRecordsByPhenotype"
        @change="this.setFilterRecordsByPhenotype"
    >{{ $t('matchPhenotype') }}
    </b-form-checkbox>
    <b-form-checkbox
        v-if="isSamplesContainInheritance"
        :checked="filterRecordsByInheritance"
        @change="this.setFilterRecordsByInheritance"
    >{{ $t('matchInheritance') }}
    </b-form-checkbox>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {mapActions, mapGetters, mapState} from 'vuex';

export default Vue.extend({
  computed: {
    ...mapGetters(['isRecordsContainPhenotypes', 'isSamplesContainInheritance']),
    ...mapState(['filterRecordsByPhenotype', 'filterRecordsByInheritance'])
  },
  methods: {
    ...mapActions(['setFilterRecordsByPhenotype', 'setFilterRecordsByInheritance'])
  }
});
</script>
