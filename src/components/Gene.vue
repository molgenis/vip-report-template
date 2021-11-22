<template>
  <span>
    <Anchor
      :href="'https://www.omim.org/search?search=' + encodeURIComponent(value.symbol) + '&field=approved_gene_symbol'"
      :text="value.symbol"
    />
    <b-button pill
      v-if="value.incompletePenetrance"
      size="sm"
      variant="info"
              class="ml-2 p-0"
      v-b-tooltip.click
      :title="$t('incompletePenetrance')"
    >     <sup>IP</sup>
    </b-button>
  </span>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import Anchor from '@/components/Anchor.vue';
import { Gene } from '@/types/Gene';

export default Vue.extend({
  components: { Anchor },
  props: {
    value: { type: Object as PropType<Gene> }
  }
});
</script>
