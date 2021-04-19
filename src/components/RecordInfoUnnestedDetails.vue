<template>
  <div>
    <b-table small responsive="true" borderless :fields="fields" :items="items">
      <template v-slot:head()>
        {{ '' }}
      </template>
      <template v-slot:cell(actions)="data">
        <InfoButton :info="data.item.metadata.description" />
      </template>
      <template v-slot:cell(key)="data">
        {{ data.item.key }}
      </template>
      <template v-slot:cell(val)="data">
        <RecordInfoDetailsItem :metadata="data.item.metadata" :value="data.item.val" :details="true" />
      </template>
    </b-table>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { Vcf } from '@molgenis/vip-report-api';
import RecordInfoDetailsItem from '@/components/RecordInfoDetailsItem.vue';
import InfoButton from '@/components/InfoButton.vue';
import { BvTableFieldArray } from 'bootstrap-vue/src/components/table';

interface Item {
  key: string;
  val: string | string[] | number | number[] | boolean;
  metadata: Vcf.InfoMetadata;
}
export default Vue.extend({
  components: { InfoButton, RecordInfoDetailsItem },
  props: {
    metadata: Array as PropType<Vcf.InfoMetadata[]>,
    info: Object as PropType<Vcf.InfoContainer>
  },
  computed: {
    fields(): BvTableFieldArray {
      return [
        { key: 'actions', label: '', class: ['compact', 'align-middle'] },
        { key: 'key', label: 'key' },
        { key: 'val', label: 'value' }
      ];
    },
    items(): Item[] {
      const items: Item[] = [];
      for (const metadata of this.metadata) {
        const info = this.info[metadata.id];
        if (info !== undefined && info !== null) {
          const item = {
            key: metadata.id,
            val: info as string | string[] | number | number[] | boolean,
            metadata: metadata
          };
          items.push(item);
        }
      }
      items.sort(function (thisItem, thatItem) {
        return thisItem.key.localeCompare(thatItem.key);
      });
      return items;
    }
  }
});
</script>
