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
        <RecordInfoDetailsItem :metadata="data.item.metadata" :value="data.item.val" />
      </template>
    </b-table>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { InfoMetadata } from '@molgenis/vip-report-api';
import RecordInfoDetailsItem from '@/components/RecordInfoDetailsItem.vue';
import InfoButton from '@/components/InfoButton.vue';

// TODO: move type to vip-report-api
interface Info {
  [index: string]: string | string[] | number | number[] | boolean;
}

interface Item {
  key: string;
  val: string | string[] | number | number[] | boolean;
  metadata: InfoMetadata;
}
export default Vue.extend({
  components: { InfoButton, RecordInfoDetailsItem },
  props: {
    metadata: Array as PropType<InfoMetadata[]>,
    info: Object as PropType<Info>
  },
  computed: {
    fields(): any[] {
      return [
        { key: 'actions', label: '', class: ['compact', 'align-middle'] },
        { key: 'key', label: 'key' },
        { key: 'val', label: 'value' }
      ];
    },
    items(): Item[] {
      const items: Item[] = [];
      for (const metadata of this.metadata) {
        if (this.info[metadata.id] !== undefined) {
          const item = {
            key: metadata.id,
            val: this.info[metadata.id],
            metadata: metadata
          };
          items.push(item);
        }
      }
      items.sort(function(thisItem, thatItem) {
        return thisItem.key.localeCompare(thatItem.key);
      });
      return items;
    }
  },
  methods: {
    getInfoMetadata(key: string): InfoMetadata {
      const infoMetadata = this.metadata.find(item => item.id === key);
      if (infoMetadata === undefined) {
        throw new Error("missing info metadata for '" + key + "'");
      }
      return infoMetadata;
    }
  }
});
</script>
