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

// FIXME broken due to API changes

<script lang="ts">
import Vue, { PropType } from 'vue';
import { Vcf } from '@molgenis/vip-report-api';
import RecordInfoDetailsItem from '@/components/RecordInfoDetailsItem.vue';
import { BvTableField } from 'bootstrap-vue/src/components/table';

interface RecordInfoBvTableField extends BvTableField {
  index: number;
  metadata: Vcf.InfoMetadata;
}

type RecordInfoBvTableFieldArray = Array<string | ({ key: string } & RecordInfoBvTableField)>;

export default Vue.extend({
  components: { RecordInfoDetailsItem },
  props: {
    metadata: Object as PropType<Vcf.NestedInfoMetadata>,
    info: Array as PropType<Vcf.Value[][]>
  },
  computed: {
    fields(): RecordInfoBvTableFieldArray {
      const fields = [];
      let index = 0;
      for (const info of this.metadata.items) {
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
    items(): Vcf.Value[] {
      return this.info;
    }
  },
  methods: {
    hasData(index: number): boolean {
      for (const item of this.info) {
        if (
          !(
            item[index] === null ||
            (Array.isArray(item[index]) && (item[index] as string[] | number[] | Vcf.Value[]).length === 0)
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
