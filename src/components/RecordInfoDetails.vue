<template>
  <div>
    <RecordInfoUnnestedDetails :metadata="unnestedMetadata" :info="info" />
    <div v-for="metadata in nestedMetadata" :key="metadata.key">
      <h4>
        {{ metadata.id }}
        <InfoButton :info="metadata.description" />
      </h4>
      <RecordInfoNestedDetails :metadata="metadata.nested" :info="getNestedInfo(metadata)" />
    </div>
  </div>
</template>

<script lang="ts">
// eslint-disable-next-line no-unused-vars
import Vue, { PropType } from 'vue';
// eslint-disable-next-line no-unused-vars
import { InfoMetadata } from '@molgenis/vip-report-api';
import RecordInfoNestedDetails from '@/components/RecordInfoNestedDetails.vue';
import RecordInfoUnnestedDetails from '@/components/RecordInfoUnnestedDetails.vue';
import InfoButton from '@/components/InfoButton.vue';

// TODO: move type to vip-report-api
interface Info {
  [index: string]: string | string[] | number | number[] | boolean | Info | Info[];
}

export default Vue.extend({
  components: {
    InfoButton,
    RecordInfoNestedDetails,
    RecordInfoUnnestedDetails
  },
  props: {
    metadata: Array as PropType<InfoMetadata[]>,
    info: Object as PropType<Info>
  },
  computed: {
    unnestedMetadata: function() {
      const unnestedMetadata = this.metadata.filter(infoMetadata => infoMetadata.type !== 'NESTED');
      unnestedMetadata.sort(this.sortMetadata);
      return unnestedMetadata;
    },
    nestedMetadata: function() {
      const nestedMetadata = this.metadata.filter(infoMetadata => infoMetadata.type === 'NESTED');
      nestedMetadata.sort(this.sortMetadata);
      return nestedMetadata;
    }
  },
  methods: {
    sortMetadata(thisItem: InfoMetadata, thatItem: InfoMetadata): number {
      return thisItem.id.localeCompare(thatItem.id);
    },
    getNestedInfo(metadata: InfoMetadata): Info[] {
      let nestedInfo: Info[];
      if (metadata.number && metadata.number.count === 1) {
        nestedInfo = [this.info[metadata.id]] as Info[];
      } else {
        nestedInfo = this.info[metadata.id] as Info[];
      }
      return nestedInfo;
    }
  }
});
</script>
