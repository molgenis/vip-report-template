<template>
  <div>
    <TreeVisualisation v-if="decisionTree" :tree="decisionTree" />
    <p v-else>{{ $t('missingDecisionTree') }}</p>
  </div>
</template>

<script lang="ts">
import { mapActions } from 'vuex';
import { gunzipSync } from 'fflate';
import { Buffer } from 'buffer';
import Vue from 'vue';
import TreeVisualisation from '@/components/TreeVisualisation.vue';

export default Vue.extend({
  name: 'DecisionTreeViewer',
  components: {
    TreeVisualisation
  },
  methods: {
    ...mapActions(['getDecisionTreeGz'])
  },
  data: () => ({
    decisionTree: null as string | null
  }),
  async created() {
    const decisionTree = await this.getDecisionTreeGz();
    if (decisionTree) {
      this.decisionTree = Buffer.from(gunzipSync(decisionTree).buffer).toString();
    }
  }
});
</script>
