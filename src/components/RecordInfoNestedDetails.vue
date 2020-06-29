<template>
  <div>
    <b-table small :fields="fields" :items="items">
      <template v-slot:head()="data">
        {{ data.label }}
      </template>
      <template v-slot:cell()="data">
        <RecordInfoDetailsItem
          :metadata="data.field.metadata"
          :value="data.item[data.field.index]"
        />
      </template>
    </b-table>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import { InfoMetadata } from "@molgenis/vip-report-api";
import RecordInfoDetailsItem from "@/components/RecordInfoDetailsItem.vue";

// TODO: move type to vip-report-api
interface Info {
  [index: string]: string | string[] | number | number[] | boolean | Info  | Info[];
}

export default Vue.extend({
  components: { RecordInfoDetailsItem },
  props: {
    metadata: Array as PropType<InfoMetadata[]>,
    info: Array as PropType<Info[]>
  },
  computed: {
    fields(): any[] {
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
    items(): Info[] {
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
