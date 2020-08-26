<template>
  <Anchor
    :href="
      'https://pubmed.ncbi.nlm.nih.gov/?term=' +
        pubMedIds.map(pubMedId => encodeURIComponent(pubMedId) + '[UID]').join('+OR+') +
        '&sort=pubdate'
    "
    text="PubMed"
  />
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import Anchor from '@/components/Anchor.vue';

export default Vue.extend({
  components: { Anchor },
  props: {
    pubMedIds: Array as PropType<number[]>
  }
});
</script>
