<template>
  <span>
    {{ sample.person.individualId }}
    <b-icon-square-fill
      v-if="sample.person.affectedStatus === 'AFFECTED' && sample.person.sex === 'MALE'"
      v-b-tooltip.hover
      :title="$t('maleAffected')"
    />
    <b-icon-square
      v-else-if="sample.person.affectedStatus === 'UNAFFECTED' && sample.person.sex === 'MALE'"
      v-b-tooltip.hover
      :title="$t('maleUnaffected')"
    />
    <b-icon-circle-fill
      v-else-if="sample.person.affectedStatus === 'AFFECTED' && sample.person.sex === 'FEMALE'"
      v-b-tooltip.hover
      :title="$t('femaleAffected')"
    />
    <b-icon-circle
      v-else-if="sample.person.affectedStatus === 'UNAFFECTED' && sample.person.sex === 'FEMALE'"
      v-b-tooltip.hover
      :title="$t('femaleUnaffected')"
    />
    <b-icon-question-circle v-else-if="sample.person.sex === 'FEMALE'" v-b-tooltip.hover :title="$t('femaleUnknown')" />
    <b-icon-question-square v-else-if="sample.person.sex === 'MALE'" v-b-tooltip.hover :title="$t('maleUnknown')" />
  </span>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { Sample } from '@molgenis/vip-report-api';

export default Vue.extend({
  props: {
    sample: Object as PropType<Sample>
  }
});
</script>
