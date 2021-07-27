<template>
  <div>
    <TreeVisualisation v-if="decisionTree" :tree="decisionTree" />
    <p v-else>{{ $t('missingDecisionTree') }}</p>
  </div>
</template>

<script lang="ts">
import { mapActions } from 'vuex';
import Vue from 'vue';
import TreeVisualisation from '@/components/TreeVisualisation.vue';

export default Vue.extend({
  name: 'DecisionTreeViewer',
  components: {
    TreeVisualisation
  },
  methods: {
    ...mapActions(['getDecisionTree'])
  },
  data: () => ({
    decisionTree: null as string | null
  }),
  async created() {
    const decisionTree = await this.getDecisionTree();
    if (decisionTree) {
      this.decisionTree = decisionTree;
    }
  }
});
</script>
