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
import Vue, { PropType } from 'vue';
import { Vcf } from '@molgenis/vip-report-api';
import RecordInfoNestedDetails from '@/components/RecordInfoNestedDetails.vue';
import RecordInfoUnnestedDetails from '@/components/RecordInfoUnnestedDetails.vue';
import InfoButton from '@/components/InfoButton.vue';

export default Vue.extend({
  components: {
    InfoButton,
    RecordInfoNestedDetails,
    RecordInfoUnnestedDetails
  },
  props: {
    metadata: Object as PropType<Vcf.InfoMetadataContainer>,
    info: Object as PropType<Vcf.InfoContainer>
  },
  computed: {
    unnestedMetadata: function () {
      const unnestedMetadata = Object.values(this.metadata).filter((infoMetadata) => infoMetadata.nested === undefined);
      unnestedMetadata.sort(this.sortMetadata);
      return unnestedMetadata;
    },
    nestedMetadata: function () {
      const nestedMetadata = Object.values(this.metadata).filter((infoMetadata) => infoMetadata.nested !== undefined);
      nestedMetadata.sort(this.sortMetadata);
      return nestedMetadata;
    }
  },
  methods: {
    sortMetadata(thisItem: Vcf.InfoMetadata, thatItem: Vcf.InfoMetadata): number {
      return thisItem.id.localeCompare(thatItem.id);
    },
    getNestedInfo(metadata: Vcf.InfoMetadata): Vcf.Value[] {
      let nestedInfo: Vcf.Value[][];
      if (metadata.number && metadata.number.count === 1) {
        nestedInfo = [this.info[metadata.id] as Vcf.Value[]];
      } else {
        nestedInfo = this.info[metadata.id] as Vcf.Value[][];
      }
      return nestedInfo;
    }
  }
});
</script>
