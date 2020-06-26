<template>
  <div>
    <b-table small responsive="true" borderless :fields="fields" :items="items">
      <template v-slot:head()>
        {{ "" }}
      </template>
      <template v-slot:cell(key)="data">
        <span v-if="data.item.key === 'c'">
          {{ $t("chr") }}
        </span>
        <span v-else-if="data.item.key === 'p'">
          {{ $t("pos") }}
        </span>
        <span v-else-if="data.item.key === 'i'">
          {{ $t("id") }}
        </span>
        <span v-else-if="data.item.key === 'r'">
          {{ $t("ref") }}
        </span>
        <span v-else-if="data.item.key === 'a'">
          {{ $t("alt") }}
        </span>
        <span v-else-if="data.item.key === 'q'">
          {{ $t("qual") }}
        </span>
        <span v-else-if="data.item.key === 'f'">
          {{ $t("filter") }}
        </span>
      </template>
      <template v-slot:cell(val)="data">
        <span v-if="data.item.key === 'c'">
          {{ data.item.val }}
        </span>
        <span v-else-if="data.item.key === 'p'">
          {{ data.item.val }}
        </span>
        <span v-else-if="data.item.key === 'i'">
          <Identifiers :identifiers="data.item.val" />
        </span>
        <span v-else-if="data.item.key === 'r'">
          <Allele :allele="data.item.val" :abbreviate="false" />
        </span>
        <span v-else-if="data.item.key === 'a'">
          <span v-for="(alt, index) in data.item.val" :key="index">
            <Allele :allele="alt" :abbreviate="false" />
            <span v-if="index < data.item.val.length - 1">, </span>
          </span>
        </span>
        <span v-else-if="data.item.key === 'q'">
          {{ data.item.val }}
        </span>
        <span v-else-if="data.item.key === 'f'">
          <span v-for="(val, index) in data.item.val" :key="index">
            {{ val }}<span v-if="index < data.item.val.length - 1">, </span>
          </span>
        </span>
      </template>
    </b-table>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import { Record } from "@molgenis/vip-report-api";
import Allele from "@/components/Allele.vue";
import Identifiers from "@/components/Identifiers.vue";

export default Vue.extend({
  components: { Allele, Identifiers },
  props: {
    record: Object as PropType<Record>
  },
  computed: {
    fields: function() {
      return [
        { key: "key", label: "key" },
        { key: "val", label: "value" }
      ];
    },
    items() {
      const items: object[] = [
        { key: "c", val: this.record["c"] },
        { key: "p", val: this.record["p"] }
      ];
      if (Object.prototype.hasOwnProperty.call(this.record, "i")) {
        items.push({ key: "i", val: this.record["i"] });
      }
      items.push({ key: "r", val: this.record["r"] });
      items.push({ key: "a", val: this.record["a"] });
      if (Object.prototype.hasOwnProperty.call(this.record, "q")) {
        items.push({ key: "q", val: this.record["q"] });
      }
      if (Object.prototype.hasOwnProperty.call(this.record, "f")) {
        items.push({ key: "f", val: this.record["f"] });
      }
      return items;
    }
  }
});
</script>
