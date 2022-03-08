<script lang="ts">
import { computed, ComputedRef, defineComponent, toRefs } from "vue";
import { useI18n } from "vue-i18n";
import Pos from "./Pos.vue";
import Ref from "./Ref.vue";
import Alt from "./Alt.vue";
import Info from "./info/Info.vue";
import Format from "./format/Format.vue";
import { Metadata, Record } from "../../api/vcf/Vcf";

export default defineComponent({
  name: "VipRecordTable",
  components: { Alt, Format, Info, Pos, Ref },
  props: {
    records: {
      type: Array as () => Record[],
      required: true,
    },
    recordMetadata: {
      type: Object as () => Metadata,
      required: true,
    },
  },
  setup(props) {
    const { recordMetadata } = toRefs(props);

    // workaround for https://github.com/intlify/vue-i18n-next/issues/324
    const { t } = useI18n(); // eslint-disable-line @typescript-eslint/unbound-method

    const hasNestedMetadata: ComputedRef<boolean> = computed(
      (): boolean => Object.values(recordMetadata.value.info).find((info) => info.nested !== undefined) !== undefined
    );
    const nrFormatFields: ComputedRef<number> = computed((): number => Object.keys(recordMetadata.value.format).length);
    const nrSamples: ComputedRef<number> = computed((): number => recordMetadata.value.header.samples.length);

    const asArray = (val: unknown): unknown[][] => val as unknown[][];

    return { t, hasNestedMetadata, nrFormatFields, nrSamples, asArray };
  },
});
</script>

<template>
  <div class="table-container">
    <table class="table is-narrow">
      <thead>
        <tr>
          <th :rowspan="hasNestedMetadata ? 2 : undefined">
            <abbr :title="t('pos')">{{ t("posAbbr") }}</abbr>
          </th>
          <th :rowspan="hasNestedMetadata ? 2 : undefined">
            <abbr :title="t('ref')">{{ t("refAbbr") }}</abbr>
          </th>
          <th :rowspan="hasNestedMetadata ? 2 : undefined">
            <abbr :title="t('alt')">{{ t("altAbbr") }}</abbr>
          </th>
          <th
            v-for="(info, index) in recordMetadata.info"
            :key="index"
            :rowspan="info.nested ? undefined : 2"
            :colspan="info.nested ? info.nested.items.length : undefined"
          >
            <abbr :title="info.description">{{ info.id }}</abbr>
          </th>
          <template v-if="nrFormatFields > 0">
            <th
              v-for="(sample, sampleIndex) in recordMetadata.header.samples"
              :key="sampleIndex"
              :colspan="nrFormatFields"
            >
              <abbr :title="sample">{{ sample }}</abbr>
            </th>
          </template>
        </tr>
        <tr v-if="hasNestedMetadata || nrFormatFields > 0">
          <template v-if="hasNestedMetadata">
            <template v-for="(info, infoIndex) in recordMetadata.info" :key="infoIndex">
              <template v-if="info.nested">
                <th v-for="(infoNested, infoNestedIndex) in info.nested.items" :key="infoNestedIndex">
                  <abbr :title="infoNested.description">{{ infoNested.id }}</abbr>
                </th>
              </template>
            </template>
          </template>
          <template v-for="(sample, sampleIndex) in recordMetadata.header.samples" :key="sampleIndex">
            <th v-for="(format, formatIndex) in recordMetadata.format" :key="formatIndex">
              <abbr :title="format.description">{{ format.id }}</abbr>
            </th>
          </template>
        </tr>
      </thead>

      <tbody>
        <tr v-for="record in records" :key="record.getId()">
          <td>
            <router-link :to="{ name: 'variant', params: { variantId: record.getId() } }"
              ><Pos :record="record" :record-metadata="recordMetadata"
            /></router-link>
          </td>
          <td>
            <Ref :record="record" :record-metadata="recordMetadata" />
          </td>
          <td>
            <Alt :record="record" :record-metadata="recordMetadata" />
          </td>
          <template v-for="(info, infoIndex) in recordMetadata.info" :key="infoIndex">
            <template v-if="info.nested">
              <td v-for="(nestedInfo, nestedInfoIndex) in info.nested.items" :key="nestedInfoIndex">
                <template v-for="(item, itemIndex) in asArray(record.n[info.id])" :key="itemIndex">
                  <Info
                    :info="item[nestedInfoIndex]"
                    :info-metadata="nestedInfo"
                    :record="record"
                    :record-metadata="recordMetadata"
                  /><br />
                </template>
              </td>
            </template>
            <td v-else>
              <Info
                :info="record.n[info.id]"
                :info-metadata="info"
                :record="record"
                :record-metadata="recordMetadata"
              />
            </td>
          </template>
          <template v-for="(sample, sampleIndex) in recordMetadata.header.samples" :key="sampleIndex">
            <td v-for="(format, formatIndex) in recordMetadata.format" :key="formatIndex">
              <Format
                :format="record.s[sampleIndex][format.id]"
                :format-metadata="format"
                :record="record"
                :record-metadata="recordMetadata"
              />
            </td>
          </template>
        </tr>
      </tbody>
    </table>
  </div>
</template>
