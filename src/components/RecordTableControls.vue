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
    <b-form-checkbox
      v-if="isSamplesContainDenovo"
      :checked="filterRecordsByDenovo"
      @change="this.setFilterRecordsByDenovo"
      >{{ $t('matchDenovo') }}
    </b-form-checkbox>
    <b-form-checkbox v-if="isSamplesContainDepth" :checked="filterRecordsByDepth" @change="this.setFilterRecordsByDepth"
      >{{ $t('matchDepth') }}
    </b-form-checkbox>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapActions, mapGetters, mapState } from 'vuex';

export default Vue.extend({
  computed: {
    ...mapGetters([
      'isRecordsContainPhenotypes',
      'isSamplesContainInheritance',
      'isSamplesContainDenovo',
      'isSamplesContainDepth'
    ]),
    ...mapState([
      'filterRecordsByPhenotype',
      'filterRecordsByInheritance',
      'filterRecordsByDenovo',
      'filterRecordsByDepth'
    ])
  },
  methods: {
    ...mapActions([
      'setFilterRecordsByPhenotype',
      'setFilterRecordsByInheritance',
      'setFilterRecordsByDenovo',
      'setFilterRecordsByDepth'
    ])
  }
});
</script>
