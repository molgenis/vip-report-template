<template>
  <div>
    <span v-for="(id, index) in identifiers" :key="id">
      <!-- dbSNP ID -->
      <Anchor
        v-if="id.startsWith('rs')"
        :href="'https://www.ncbi.nlm.nih.gov/snp/' + encodeURIComponent(id)"
        :text="id"
      />
      <!-- dbVar ID -->
      <Anchor
        v-else-if="id.startsWith('esv') || id.startsWith('nsv')"
        :href="'https://www.ncbi.nlm.nih.gov/dbvar/variants/' + encodeURIComponent(id)"
        :text="id"
      />
      <span v-else>{{ id }}</span>
      <span v-if="index < identifiers.length - 1">, </span>
    </span>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import Anchor from '@/components/Anchor.vue';

export default Vue.extend({
  components: { Anchor },
  props: {
    identifiers: Array as PropType<string[]>
  }
});
</script>
