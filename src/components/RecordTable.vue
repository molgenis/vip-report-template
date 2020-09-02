<template>
  <div>
    <!-- hidden, see note in methods.provider -->
    <b-row style="display: none; visibility: hidden">
      <b-col md="4">
        <b-form-group>
          <b-input-group class="mt-3">
            <template v-slot:append>
              <b-button variant="outline-secondary">
                <span v-if="filter" @click="clearSearch">{{ $t('clear') }}</span>
                <span v-else>{{ $t('search') }}</span>
              </b-button>
            </template>
            <b-form-input ref="search" id="searchInput" v-model="filter" type="text" debounce="100"></b-form-input>
          </b-input-group>
        </b-form-group>
      </b-col>
    </b-row>
    <b-table
      id="classifier-table"
      class="mt-3"
      ref="table"
      responsive="true"
      hover
      small
      :items="provider"
      :fields="fields"
      :filter="filter"
      :show-empty="true"
      :busy.sync="isTableBusy"
      :sort-by.sync="sortBy"
      :sort-desc.sync="sortDesc"
      :current-page="page.currentPage"
      :per-page="page.perPage"
      :empty-text="$t('emptyTableMessage')"
      :key="sample.index"
    >
      <template v-slot:head()="data">
        {{ data.label ? $t(data.label) : '' }}
      </template>
      <template v-slot:cell(actions)="data">
        <b-button class="btn-xs" @click="info(data.item, data.index, $event.target)" mr="3">
          <b-icon-search />
        </b-button>
      </template>
      <template v-slot:cell(p)="data">
        <Anchor
          v-if="genomeBrowserDb"
          :href="
            'https://genome-euro.ucsc.edu/cgi-bin/hgTracks?db=' +
              encodeURIComponent(genomeBrowserDb) +
              '&position=' +
              encodeURIComponent('chr' + data.item.c + ':' + Math.max(0, data.item.p - 500) + '-' + (data.item.p + 500))
          "
          :text="data.item.p | formatNumber(true) | append(data.item.c + ':')"
        />
        <span v-else>{{ data.item.p | formatNumber(true) | append(data.item.c + ':') }}</span>
      </template>
      <template v-slot:cell(i)="data">
        <Identifiers :identifiers="data.item.i" />
      </template>
      <template v-slot:cell(r)="data">
        <Allele :allele="data.item.r" />
      </template>
      <template v-slot:cell(a)="data">
        <span v-for="(alt, index) in data.item.a" :key="index">
          <Allele :allele="alt" />
          <span v-if="index < data.item.a.length - 1">, </span>
        </span>
      </template>
      <template v-slot:cell(s)="data">
        <Genotype :genotype="data.item.s[sample.index].gt" />
      </template>
      <template v-slot:cell(father)="data">
        <Genotype :genotype="data.item.s[samplePaternal.index].gt" />
      </template>
      <template v-slot:cell(mother)="data">
        <Genotype :genotype="data.item.s[sampleMaternal.index].gt" />
      </template>
      <template v-slot:cell(expand)="data">
        <b-button
          v-if="data.item.effect.items.length > 1"
          class="btn-xs"
          @click="data.item.expand = !data.item.expand"
          mr="3"
        >
          <b-icon-chevron-up v-if="data.item.expand" />
          <b-icon-chevron-down v-else />
        </b-button>
      </template>
      <template v-slot:cell(effect)="data">
        <RecordInfoDetailsItemMultiline
          :metadata="data.item.effect.metadata"
          :values="data.item.expand ? data.item.effect.items : data.item.effect.items.slice(0, 1)"
        />
      </template>
      <template v-slot:cell(symbol)="data">
        <RecordInfoDetailsItemMultiline
          :metadata="data.item.symbol.metadata"
          :values="data.item.expand ? data.item.symbol.items : data.item.symbol.items.slice(0, 1)"
        />
      </template>
      <template v-slot:cell(hgvsC)="data">
        <RecordInfoDetailsItemMultiline
          :metadata="data.item.hgvsC.metadata"
          :values="data.item.expand ? data.item.hgvsC.items : data.item.hgvsC.items.slice(0, 1)"
        />
      </template>
      <template v-slot:cell(hgvsP)="data">
        <RecordInfoDetailsItemMultiline
          :metadata="data.item.hgvsP.metadata"
          :values="data.item.expand ? data.item.hgvsP.items : data.item.hgvsP.items.slice(0, 1)"
        />
      </template>
      <template v-slot:cell(gnomAD)="data">
        <RecordInfoDetailsItemMultiline
          :metadata="data.item.gnomAD.metadata"
          :values="data.item.expand ? data.item.gnomAD.items : data.item.gnomAD.items.slice(0, 1)"
        />
      </template>
      <template v-slot:cell(clinVar)="data">
        <RecordInfoDetailsItemMultiline
          :metadata="data.item.clinVar.metadata"
          :values="data.item.expand ? data.item.clinVar.items : data.item.clinVar.items.slice(0, 1)"
        />
      </template>
      <template v-slot:cell(pubMed)="data">
        <RecordInfoDetailsItemMultiline
          :metadata="data.item.pubMed.metadata"
          :values="data.item.expand ? data.item.pubMed.items : data.item.pubMed.items.slice(0, 1)"
        />
      </template>
    </b-table>
    <b-pagination
      v-if="page.totalPages > 1"
      v-model="page.currentPage"
      :total-rows="page.totalRows"
      :per-page="page.perPage"
      align="center"
      aria-controls="classifier-table"
    ></b-pagination>

    <b-modal :id="infoModal.id" size="xl" :title="$t('recordDetails')" no-fade ok-only @hide="resetInfoModal">
      <template v-slot:modal-ok>
        {{ $t('ok') }}
      </template>
      <div class="modal-container">
        <RecordDetails :metadata="metadata.records" :record="infoModal.record" :sample="sample" />
      </div>
    </b-modal>
  </div>
</template>

<script lang="ts">
import { mapActions, mapGetters, mapState } from 'vuex';
import Vue, { PropType } from 'vue';
import { BButton, BFormInput, BTable, BvTableCtxObject, BvTableFieldArray } from 'bootstrap-vue';
import { PagedItems, Params, Record, RecordSample, Sample } from '@molgenis/vip-report-api';
import { append, formatNumber } from '@/globals/filters';
import RecordDetails from '@/components/RecordDetails.vue';
import Identifiers from '@/components/Identifiers.vue';
import Allele from '@/components/Allele.vue';
import Anchor from '@/components/Anchor.vue';
import Genotype from '@/components/Genotype.vue';
import { getConsequences } from '@/globals/utils';
import { Consequences } from '@/types/Consequence';
import RecordInfoDetailsItemMultiline from '@/components/RecordInfoDetailsItemMultiline.vue';

interface Page {
  currentPage: number;
  perPage: number;
  totalRows: number;
  totalPages: number;
}

interface InfoModal {
  id: string;
  title: string;
  record: Record | null;
}

interface Row {
  c: string;
  p: number;
  i?: string[];
  r: string;
  a: string[];
  q?: number;
  f?: string[];
  s?: RecordSample[];
  effect?: unknown;
  symbol?: unknown;
  hgvsC?: unknown;
  hgvsP?: unknown;
  pubMed?: unknown;
  clinVar?: unknown;
  gnomAD?: unknown;
  expand?: boolean;
}

export default Vue.extend({
  components: { Allele, Anchor, Genotype, Identifiers, RecordDetails, RecordInfoDetailsItemMultiline },
  props: {
    sample: Object as PropType<Sample>
  },
  data: function() {
    return {
      filter: '' as string,
      isTableBusy: false as boolean,
      sortBy: null as string | null,
      sortDesc: false as boolean,
      page: {
        currentPage: 1,
        perPage: 20
      } as Page,
      infoModal: {
        id: 'info-modal',
        title: '',
        record: null
      } as InfoModal
    };
  },
  computed: {
    ...mapGetters(['getSampleById', 'genomeBrowserDb', 'hasConsequences']),
    ...mapState(['metadata', 'records']),
    genomeAssembly(): string {
      return this.metadata.htsFile.genomeAssembly;
    },
    samplePaternal(): Sample | null {
      const paternalId = this.sample.person.paternalId;
      return paternalId !== '0' ? this.getSampleById(paternalId) : null;
    },
    sampleMaternal(): Sample | null {
      const maternalId = this.sample.person.maternalId;
      return maternalId !== '0' ? this.getSampleById(maternalId) : null;
    },
    fields(): BvTableFieldArray {
      // field keys must much report api field ids
      const fields = [];
      fields.push({ key: 'actions', label: '', class: ['compact', 'align-top'] });
      fields.push({ key: 'p', label: 'pos', sortable: true });
      fields.push({ key: 'i', label: 'id' });
      fields.push({ key: 'r', label: 'ref' });
      fields.push(this.sample ? { key: 's', label: 'sample' } : { key: 'a', label: 'alt' });
      if (this.sample && this.samplePaternal) {
        fields.push({ key: 'father', label: 'father' });
      }
      if (this.sample && this.sampleMaternal) {
        fields.push({ key: 'mother', label: 'mother' });
      }
      if (this.hasConsequences) {
        fields.push({ key: 'expand', label: '', class: ['compact', 'align-top'] });
        fields.push({ key: 'effect' });
        fields.push({ key: 'symbol' });
        fields.push({ key: 'hgvsC' });
        fields.push({ key: 'hgvsP' });
        fields.push({ key: 'gnomAD', label: 'gnomAD' });
        fields.push({ key: 'clinVar', label: 'ClinVar' });
        fields.push({ key: 'pubMed', label: 'Literature' });
      }
      return fields;
    }
  },
  methods: {
    ...mapActions(['loadRecords']),
    provider(ctx: BvTableCtxObject): Promise<Row[]> {
      // todo: translate filter param to query
      const params: Params = {
        page: ctx.currentPage - 1,
        size: ctx.perPage,
        sort: ctx.sortBy ? ctx.sortBy : undefined,
        desc: ctx.sortDesc
      };
      if (this.sample) {
        params.query = {
          // todo: remove as unknown as string after Query type fix in vip-report-api
          selector: ['s', (this.sample.index as unknown) as string, 'gt', 't'],
          operator: 'in',
          args: ['het', 'hom_a', 'part']
        };
      }
      return this.loadRecords(params).then(() => {
        const records = this.records as PagedItems<Record>;
        this.page.totalRows = records.page.totalElements;
        this.page.totalPages = Math.ceil(records.page.totalElements / ctx.perPage);
        return records.items.map(record => {
          const row: Row = { ...record };
          if (this.hasConsequences) {
            const consequences: Consequences = getConsequences(record, this.metadata.records);
            row.effect = {
              metadata: consequences.metadata.effect,
              items: consequences.items.map(consequence => consequence.effect)
            };
            row.symbol = {
              metadata: consequences.metadata.symbol,
              items: consequences.items.map(consequence => consequence.symbol)
            };
            row.hgvsC = {
              metadata: consequences.metadata.hgvsC,
              items: consequences.items.map(consequence => consequence.hgvsC)
            };
            row.hgvsP = {
              metadata: consequences.metadata.hgvsP,
              items: consequences.items.map(consequence => consequence.hgvsP)
            };
            row.gnomAD = {
              metadata: consequences.metadata.gnomAD,
              items: consequences.items.map(consequence => consequence.gnomAD)
            };
            row.clinVar = {
              metadata: consequences.metadata.clinVar,
              items: consequences.items.map(consequence => consequence.clinVar)
            };
            row.pubMed = {
              metadata: consequences.metadata.pubMed,
              items: consequences.items.map(consequence => consequence.pubMed)
            };
            row.expand = false;
          }
          return row;
        });
      });
    },
    clearSearch(): void {
      this.filter = '';
      const searchElement = this.$refs.search as BFormInput;
      searchElement.focus();
    },
    info(record: Record, index: number, button: BButton): void {
      this.infoModal.title = `Row index: ${index}`;
      this.infoModal.record = record;
      this.$root.$emit('bv::show::modal', this.infoModal.id, button);
    },
    resetInfoModal(): void {
      this.infoModal.title = '';
      this.infoModal.record = null;
    }
  },
  filters: { append, formatNumber },
  watch: {
    sample() {
      (this.$refs.table as BTable).refresh();
    }
  }
});
</script>
