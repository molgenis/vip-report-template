<template>
  <div>
    <b-row>
      <b-col>
        <RecordTableControls />
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
        <Genotype
          :genotype="data.item.s[sample.index].gt"
          :readDepth="data.item.s[sample.index].f ? data.item.s[sample.index].f.DP : undefined"
          :allelicDepth="data.item.s[sample.index].f ? data.item.s[sample.index].f.AD : undefined"
        />
      </template>
      <template v-slot:cell(father)="data">
        <Genotype
          :genotype="data.item.s[samplePaternal.index].gt"
          :readDepth="data.item.s[samplePaternal.index].f ? data.item.s[samplePaternal.index].f.DP : undefined"
          :allelicDepth="data.item.s[samplePaternal.index].f ? data.item.s[samplePaternal.index].f.AD : undefined"
        />
      </template>
      <template v-slot:cell(mother)="data">
        <Genotype
          :genotype="data.item.s[sampleMaternal.index].gt"
          :readDepth="data.item.s[sampleMaternal.index].f ? data.item.s[sampleMaternal.index].f.DP : undefined"
          :allelicDepth="data.item.s[sampleMaternal.index].f ? data.item.s[sampleMaternal.index].f.AD : undefined"
        />
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
      <template v-slot:cell(inheritance)="data">
        <RecordInfoDetailsItemMultiline
          :metadata="data.item.inheritance.metadata"
          :values="data.item.expand ? data.item.inheritance.items : data.item.inheritance.items.slice(0, 1)"
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
      <template v-slot:cell(mvl)="data">
        <span v-if="data.item.n !== undefined && data.item.n['VKGL_UMCG'] !== undefined">
          <span v-for="(mvl, index) in data.item.n['VKGL_UMCG']" :key="index">
            <span>{{ mvl }}</span>
            <span v-if="index < data.item.n['VKGL_UMCG'].length - 1">, </span>
          </span>
        </span>
      </template>
      <template v-slot:cell(vkgl)="data">
        <span v-if="data.item.n !== undefined && data.item.n['VKGL'] !== undefined">
          <span v-for="(vkgl, index) in data.item.n['VKGL']" :key="index">
            <span>{{ vkgl }}</span>
            <span v-if="index < data.item.n['VKGL'].length - 1">, </span>
          </span>
        </span>
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
      <template v-slot:cell(capice)="data">
        <span v-if="data.item.n !== undefined && data.item.n['CAP'] !== undefined">
          <span v-for="(score, index) in data.item.n['CAP']" :key="index">
            <span>{{ score.toFixed(4) }}</span>
            <span v-if="index < data.item.n['CAP'].length - 1">, </span>
          </span>
        </span>
      </template>
      <template v-slot:cell(geneMatch)="data">
        <AnnotationControl v-if="data.item.annotation" :annotation="data.item.annotation" type="geneMatch" />
      </template>
      <template v-slot:cell(class)="data">
        <AnnotationControl v-if="data.item.annotation" :annotation="data.item.annotation" type="class" />
      </template>
      <template v-slot:cell(txt)="data">
        <AnnotationControl v-if="data.item.annotation" :annotation="data.item.annotation" type="notes" />
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
        <RecordDetails
          v-if="infoModal.record"
          :metadata="metadata.records"
          :record="infoModal.record"
          :sample="sample"
        />
      </div>
    </b-modal>
  </div>
</template>

<script lang="ts">
import { mapActions, mapGetters, mapState } from 'vuex';
import Vue, { PropType } from 'vue';
import { BButton, BTable, BvTableCtxObject, BvTableFieldArray } from 'bootstrap-vue';
import {
  ComposedQuery,
  PagedItems,
  Params,
  Phenotype,
  Query,
  Record,
  RecordSample,
  Sample,
  SortOrder
} from '@molgenis/vip-report-api';
import { append, formatNumber } from '@/globals/filters';
import RecordDetails from '@/components/RecordDetails.vue';
import Allele from '@/components/Allele.vue';
import Anchor from '@/components/Anchor.vue';
import Genotype from '@/components/Genotype.vue';
import { getConsequences, getVariant, getInheritanceModesGeneSelector, getPhenotypesSelector } from '@/globals/utils';
import { Consequences } from '@/types/Consequence';
import RecordInfoDetailsItemMultiline from '@/components/RecordInfoDetailsItemMultiline.vue';
import { Annotation } from '@/types/Annotations';
import AnnotationControl from '@/components/annotation/AnnotationControl.vue';
import RecordTableControls from '@/components/RecordTableControls.vue';

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
  r: string;
  a: string[];
  q?: number;
  f?: string[];
  s?: RecordSample[];
  effect?: unknown;
  symbol?: unknown;
  inheritance?: unknown;
  hgvsC?: unknown;
  hgvsP?: unknown;
  pubMed?: unknown;
  clinVar?: unknown;
  gnomAD?: unknown;
  expand?: boolean;
  annotation?: Annotation;
}

export default Vue.extend({
  components: {
    Allele,
    Anchor,
    AnnotationControl,
    Genotype,
    RecordDetails,
    RecordInfoDetailsItemMultiline,
    RecordTableControls
  },
  props: {
    sample: Object as PropType<Sample>
  },
  data: function() {
    return {
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
    ...mapGetters([
      'genomeBrowserDb',
      'hasConsequences',
      'hasMvl',
      'hasVkgl',
      'hasCapice',
      'getAnnotation',
      'isAnnotationEnabled',
      'isRecordsContainPhenotypes',
      'isSamplesContainInheritance',
      'isSamplesContainDenovo',
      'sampleMaternal',
      'samplePaternal'
    ]),
    ...mapState([
      'metadata',
      'records',
      'annotations',
      'selectedSamplePhenotypes',
      'filterRecordsByPhenotype',
      'filterRecordsByInheritance',
      'filterRecordsByDenovo'
    ]),
    genomeAssembly(): string {
      return this.metadata.htsFile.genomeAssembly;
    },
    fields(): BvTableFieldArray {
      // field keys must much report api field ids
      const fields = [];
      fields.push({ key: 'actions', label: '', class: ['compact', 'align-top'] });
      fields.push({ key: 'p', label: 'pos', sortable: true });
      fields.push({ key: 'r', label: 'ref' });
      fields.push(this.sample ? { key: 's', label: 'sample' } : { key: 'a', label: 'alt' });
      if (this.sample && this.samplePaternal !== null) {
        fields.push({ key: 'father', label: 'father' });
      }
      if (this.sample && this.sampleMaternal !== null) {
        fields.push({ key: 'mother', label: 'mother' });
      }
      if (this.hasCapice) {
        fields.push({ key: 'capice', label: 'capice', sortable: true });
      }
      if (this.hasConsequences) {
        fields.push({ key: 'expand', label: '', class: ['compact', 'align-top'] });
        fields.push({ key: 'effect', label: 'effect' });
        fields.push({ key: 'symbol', label: 'symbol' });
        if (this.isSamplesContainInheritance) {
          fields.push({ key: 'inheritance', label: 'inheritance' });
        }
        fields.push({ key: 'hgvsC', label: 'hgvsc' });
        fields.push({ key: 'hgvsP', label: 'hgvsp' });
        fields.push({ key: 'gnomAD', label: 'gnomad' });
      }
      if (this.hasMvl) {
        fields.push({ key: 'mvl', label: 'mvl' });
      }
      if (this.hasVkgl) {
        fields.push({ key: 'vkgl', label: 'vkgl' });
      }
      if (this.hasConsequences) {
        fields.push({ key: 'clinVar', label: 'clinvar' });
        fields.push({ key: 'pubMed', label: 'pubmed' });
      }
      if (this.isAnnotationEnabled) {
        fields.push({ key: 'geneMatch', label: 'geneMatch', class: 'input' });
        fields.push({ key: 'class', label: 'class', class: 'input' });
        fields.push({ key: 'txt', label: 'txt', class: 'input', thStyle: { minWidth: '20rem' } });
      }
      return fields;
    }
  },
  methods: {
    ...mapActions(['loadRecords']),
    provider(ctx: BvTableCtxObject): Promise<Row[]> {
      const params: Params = {
        page: ctx.currentPage - 1,
        size: ctx.perPage,
        query: this.createQuery(),
        sort: this.createSort(ctx)
      };

      return this.loadRecords(params).then(() => {
        const records = this.records as PagedItems<Record>;
        this.page.totalRows = records.page.totalElements;
        this.page.totalPages = Math.ceil(records.page.totalElements / ctx.perPage);
        return records.items.map(this.mapRecordToRow);
      });
    },
    info(record: Record, index: number, button: BButton): void {
      this.infoModal.title = `Row index: ${index}`;
      this.infoModal.record = record;
      this.$root.$emit('bv::show::modal', this.infoModal.id, button);
    },
    resetInfoModal(): void {
      this.infoModal.title = '';
      this.infoModal.record = null;
    },
    createQuery(): Query | ComposedQuery | undefined {
      const queries: (Query | ComposedQuery)[] = [];
      if (this.sample) {
        queries.push(this.createSampleQuery());
      }
      if (this.isRecordsContainPhenotypes && this.hasSamplePhenotypes() && this.filterRecordsByPhenotype) {
        queries.push(this.createSamplePhenotypesQuery());
      }
      if (this.isSamplesContainInheritance && this.filterRecordsByInheritance) {
        queries.push(this.createSampleInheritanceQuery());
      }
      if (this.isSamplesContainDenovo && this.filterRecordsByDenovo) {
        queries.push(this.createSampleDenovoQuery());
      }
      // todo: translate ctx filter param to query

      let query: Query | ComposedQuery | undefined;
      if (queries.length === 0) {
        query = undefined;
      } else if (queries.length === 1) {
        query = queries[0];
      } else {
        query = {
          operator: 'and',
          args: queries
        };
      }
      return query;
    },
    createSampleQuery(): Query {
      return {
        selector: ['s', this.sample.index, 'gt', 't'],
        operator: 'in',
        args: ['het', 'hom_a', 'part']
      };
    },
    createSampleInheritanceQuery(): ComposedQuery {
      return {
        operator: 'or',
        args: [
          {
            selector: ['s', this.sample.index, 'f', 'VIM'],
            operator: '==',
            args: 1
          },
          {
            operator: 'and',
            args: [
              {
                selector: getInheritanceModesGeneSelector(this.metadata.records),
                operator: '!any_has_any',
                args: ['AD', 'AR', 'XR', 'XD', 'XL']
              },
              {
                selector: ['s', this.sample.index, 'f', 'VI'],
                operator: 'has_any',
                args: ['AD', 'AR', 'XR', 'XD', 'XL']
              }
            ]
          }
        ]
      };
    },
    createSampleDenovoQuery(): Query {
      return {
        selector: ['s', this.sample.index, 'f', 'VID'],
        operator: '==',
        args: 1
      };
    },
    hasSamplePhenotypes(): boolean {
      return this.selectedSamplePhenotypes !== null && this.selectedSamplePhenotypes.page.totalElements > 0;
    },
    createSamplePhenotypesQuery(): Query {
      const phenotypeIds = (this.selectedSamplePhenotypes.items as Phenotype[])
        .flatMap(phenotype => phenotype.phenotypicFeaturesList)
        .map(phenotypicFeature => phenotypicFeature.type.id);
      return {
        selector: getPhenotypesSelector(this.metadata.records),
        operator: 'any_has_any',
        args: [...new Set(phenotypeIds)]
      };
    },
    createSort(ctx: BvTableCtxObject): SortOrder | undefined {
      let sort: SortOrder | undefined;
      if (ctx.sortBy) {
        switch (ctx.sortBy) {
          case 'capice':
            sort = {
              property: ['n', 'CAP'],
              compare: ctx.sortDesc
                ? (a, b) => {
                    if (a === null) {
                      return b === null ? 0 : 1;
                    } else if (b === null) {
                      return -1;
                    } else {
                      return Math.max(...(b as number[])) - Math.max(...(a as number[]));
                    }
                  }
                : (a, b) => {
                    if (a === null) {
                      return b === null ? 0 : -1;
                    } else if (b === null) {
                      return 1;
                    } else {
                      return Math.max(...(a as number[])) - Math.max(...(b as number[]));
                    }
                  }
            };
            break;
          case 'p':
            // workaround for https://github.com/molgenis/vip-report-template/issues/73
            sort = undefined;
            break;
          default:
            sort = { property: ctx.sortBy, compare: ctx.sortDesc ? 'desc' : 'asc' };
            break;
        }
      } else {
        sort = undefined;
      }
      return sort;
    },
    mapRecordToRow(record: Record) {
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
        if (this.isSamplesContainInheritance) {
          row.inheritance = {
            metadata: consequences.metadata.inheritance,
            items: consequences.items.map(consequence => consequence.inheritance)
          };
        }
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
          items: consequences.items.map(consequence =>
            consequence.gnomAD !== null
              ? {
                  variant: getVariant(record, consequence),
                  gnomAD: consequence.gnomAD
                }
              : null
          )
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
      if (this.isAnnotationEnabled) {
        row.annotation = this.getAnnotation(record);
      }
      return row;
    }
  },
  filters: { append, formatNumber },
  watch: {
    sample() {
      this.page.currentPage = 1;
      (this.$refs.table as BTable).refresh();
    },
    '$store.state.annotations': function() {
      (this.$refs.table as BTable).refresh();
    },
    '$store.state.filterRecordsByPhenotype'() {
      this.page.currentPage = 1;
      (this.$refs.table as BTable).refresh();
    },
    '$store.state.filterRecordsByInheritance'() {
      this.page.currentPage = 1;
      (this.$refs.table as BTable).refresh();
    },
    '$store.state.filterRecordsByDenovo'() {
      this.page.currentPage = 1;
      (this.$refs.table as BTable).refresh();
    }
  }
});
</script>
