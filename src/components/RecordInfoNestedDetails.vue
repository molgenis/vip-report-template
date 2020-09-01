<template>
  <div>
    <b-table small :fields="fields" :items="items">
      <template v-slot:head()="data">
        {{ data.label }}
      </template>
      <template v-slot:cell()="data">
        <RecordInfoDetailsItem :metadata="data.field.metadata" :value="data.item[data.field.index]" :details="true" />
      </template>
    </b-table>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { Info, InfoMetadata, InfoValue } from '@molgenis/vip-report-api';
import RecordInfoDetailsItem from '@/components/RecordInfoDetailsItem.vue';
import { BvTableField } from 'bootstrap-vue/src/components/table';

interface RecordInfoBvTableField extends BvTableField {
  index: number;
  metadata: InfoMetadata;
}

type RecordInfoBvTableFieldArray = Array<string | ({ key: string } & RecordInfoBvTableField)>;

export default Vue.extend({
  components: { RecordInfoDetailsItem },
  props: {
    metadata: Array as PropType<InfoMetadata[]>,
    info: Array as PropType<InfoValue[][]>
  },
  computed: {
    fields(): RecordInfoBvTableFieldArray {
      const fields = [];
      let index = 0;
      for (const info of this.metadata) {
        if (this.hasData(index)) {
          fields.push({
            key: info.id,
            label: info.description,
            index: index,
            metadata: info
          });
        }
        ++index;
      }
      return fields;
    },
    items(): InfoValue[] {
      return this.info;
    }
  },
  methods: {
    hasData(index: number): boolean {
      for (const item of this.info) {
        if (
          !(
            item[index] === null ||
            (Array.isArray(item[index]) && (item[index] as string[] | number[] | Info[]).length === 0)
          )
        ) {
          return true;
        }
      }

      return false;
    }
  }
});
</script>
