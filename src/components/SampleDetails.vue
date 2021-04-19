<template>
  <span>
    {{ sample.person.individualId }}
    <b-button
      size="sm"
      variant="link"
      v-if="sample.person.affectedStatus === 'AFFECTED' && sample.person.sex === 'MALE'"
      v-b-tooltip.click
      :title="$t('maleAffected')"
    >
      <b-icon-square-fill />
    </b-button>
    <b-button
      size="sm"
      variant="link"
      v-else-if="sample.person.affectedStatus === 'UNAFFECTED' && sample.person.sex === 'MALE'"
      v-b-tooltip.click
      :title="$t('maleUnaffected')"
    >
      <b-icon-square />
    </b-button>
    <b-button
      size="sm"
      variant="link"
      v-else-if="sample.person.affectedStatus === 'AFFECTED' && sample.person.sex === 'FEMALE'"
      v-b-tooltip.click
      :title="$t('femaleAffected')"
    >
      <b-icon-circle-fill />
    </b-button>
    <b-button
      size="sm"
      variant="link"
      v-else-if="sample.person.affectedStatus === 'UNAFFECTED' && sample.person.sex === 'FEMALE'"
      v-b-tooltip.click
      :title="$t('femaleUnaffected')"
    >
      <b-icon-circle />
    </b-button>
    <b-button
      size="sm"
      variant="link"
      v-else-if="sample.person.sex === 'FEMALE'"
      v-b-tooltip.click
      :title="$t('femaleUnknown')"
    >
      <b-icon-question-circle />
    </b-button>
    <b-button
      size="sm"
      variant="link"
      v-else-if="sample.person.sex === 'MALE'"
      v-b-tooltip.click
      :title="$t('maleUnknown')"
    >
      <b-icon-question-square />
    </b-button>
    <b-button
      size="sm"
      variant="link"
      v-else-if="sample.person.affectedStatus === 'AFFECTED'"
      v-b-tooltip.click
      :title="$t('sexUnknownAffected')"
    >
      <b-icon-diamond-fill />
    </b-button>
    <b-button
      size="sm"
      variant="link"
      v-else-if="sample.person.affectedStatus === 'UNAFFECTED'"
      v-b-tooltip.click
      :title="$t('sexUnknownUnaffected')"
    >
      <b-icon-diamond />
    </b-button>
    <b-button size="sm" variant="link" v-else v-b-tooltip.click :title="$t('sexUnknownAffectedUnknown')">
      <b-icon-question-diamond />
    </b-button>
  </span>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { Api } from '@molgenis/vip-report-api';

export default Vue.extend({
  props: {
    sample: Object as PropType<Api.Sample>
  }
});
</script>
