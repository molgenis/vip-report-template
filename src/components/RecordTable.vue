f
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
                        <b-form-input
                                ref="search"
                                id="searchInput"
                                v-model="filter"
                                type="text"
                                debounce="100"
                        ></b-form-input>
                    </b-input-group>
                </b-form-group>
            </b-col>
        </b-row>
        <b-table
                id="classifier-table"
                class="mt-3"
                ref="table"
                responsive=true
                hover
                small
                :items="provider"
                :fields="fields"
                :filter="filter"
                :show-empty=true
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
                    <b-icon-search/>
                </b-button>
            </template>
            <template v-slot:cell(p)="data">
                <Anchor v-if="genomeBrowserDb"
                        :href="'https://genome-euro.ucsc.edu/cgi-bin/hgTracks?db=' + encodeURIComponent(genomeBrowserDb) + '&position=' + encodeURIComponent('chr' + data.item.c + ':' + Math.max(0, (data.item.p - 500)) + '-' + (data.item.p + 500))"
                        :text="data.item.p | formatNumber(true) | append(data.item.c + ':')"/>
                <span v-else>{{ data.item.p | formatNumber(true) | append(data.item.c + ':') }}</span>
            </template>
            <template v-slot:cell(i)="data">
                <Identifiers :identifiers="data.item.i"/>
            </template>
            <template v-slot:cell(r)="data">
                <Allele :allele="data.item.r"/>
            </template>
            <template v-slot:cell(a)="data">
                <span v-for="(alt, index) in data.item.a" :key="index">
                    <Allele :allele="alt"/>
                    <span v-if="index < data.item.a.length - 1">, </span>
                </span>
            </template>
            <template v-slot:cell(s)="data">
                <span v-for="(alt, index) in data.item.s[sample.index].gt.a" :key="index">
                    <Allele :allele="alt"/>
                    <span v-if="index < data.item.s[sample.index].gt.a.length - 1"> {{ data.item.s[sample.index].gt.p ? '|' : '/'}} </span>
                </span>
            </template>
            <template v-slot:cell(father)="data">
                <span v-for="(alt, index) in data.item.s[samplePaternal.index].gt.a" :key="index">
                    <Allele :allele="alt"/>
                    <span v-if="index < data.item.s[samplePaternal.index].gt.a.length - 1"> {{ data.item.s[samplePaternal.index].gt.p ? '|' : '/'}} </span>
                </span>
            </template>
            <template v-slot:cell(mother)="data">
                <span v-for="(alt, index) in data.item.s[sampleMaternal.index].gt.a" :key="index">
                    <Allele :allele="alt"/>
                    <span v-if="index < data.item.s[sampleMaternal.index].gt.a.length - 1"> {{ data.item.s[sampleMaternal.index].gt.p ? '|' : '/'}} </span>
                </span>
            </template>
            <template v-slot:cell(q)="data">
                {{ data.item.q | formatNumber }}
            </template>
            <template v-slot:cell(f)="data">
                <span v-for="(filter, index) in data.item.f" :key="filter">
                    <span>{{ filter }}</span>
                    <span v-if="index < data.item.f.length - 1">, </span>
                </span>
            </template>
        </b-table>
        <b-pagination v-if="page.totalPages > 1"
                      v-model="page.currentPage"
                      :total-rows="page.totalRows"
                      :per-page="page.perPage"
                      align="center"
                      aria-controls="classifier-table"
        ></b-pagination>

        <b-modal
                :id="infoModal.id"
                size="xl"
                :title="$t('recordDetails')"
                no-fade
                ok-only
                @hide="resetInfoModal">
            <template v-slot:modal-ok>
                {{ $t('ok') }}
            </template>
            <div class="modal-container">
                <RecordDetails :metadata="metadata.records" :record="infoModal.record" :sample="sample"/>
            </div>
        </b-modal>
    </div>
</template>

<script lang="ts">
    import {mapActions, mapGetters, mapState} from 'vuex'
    // eslint-disable-next-line no-unused-vars
    import Vue, {PropType} from 'vue'
    // eslint-disable-next-line no-unused-vars
    import {BButton, BFormInput, BTable, BvTableCtxObject} from 'bootstrap-vue'
    // eslint-disable-next-line no-unused-vars
    import {PagedItems, Record, Sample} from '@molgenis/vip-report-api'
    import {append, formatNumber} from '@/globals/filters'
    import RecordDetails from '@/components/RecordDetails.vue'
    import Identifiers from '@/components/Identifiers.vue'
    import Allele from '@/components/Allele.vue'
    import Anchor from '@/components/Anchor.vue'

    export default Vue.extend({
        components: {Allele, Anchor, Identifiers, RecordDetails},
        props: {
            sample: Object as PropType<Sample>
        },
        data: function () {
            return {
                filter: '' as string,
                isTableBusy: false as boolean,
                sortBy: null as string | null,
                sortDesc: false as boolean,
                page: {
                    currentPage: 1,
                    perPage: 20
                } as object,
                infoModal: {
                    id: 'info-modal',
                    title: '',
                    record: null
                } as object
            }
        },
        computed: {
            ...mapGetters(['getSampleById', 'genomeBrowserDb']),
            ...mapState(['metadata', 'records']),
            genomeAssembly() {
                return this.metadata.htsFile.genomeAssembly
            },
            samplePaternal() {
                const paternalId = this.sample.person.paternalId
                return paternalId !== '0' ? this.getSampleById(paternalId) : null
            },
            sampleMaternal() {
                const maternalId = this.sample.person.maternalId
                return maternalId !== '0' ? this.getSampleById(maternalId) : null
            },
            fields: function () {
                // field keys must much report api field ids
                return [
                    {key: 'actions', label: '', class: ['compact', 'align-middle']},
                    {key: 'p', label: 'pos', sortable: true},
                    {key: 'i', label: 'id'},
                    {key: 'r', label: 'ref'},
                    this.sample ? {key: 's', label: 'sample'} : {key: 'a', label: 'alt'},
                    this.sample && this.samplePaternal ? {key: 'father', label: 'father'} : null,
                    this.sample && this.sampleMaternal ? {key: 'mother', label: 'mother'} : null,
                    {key: 'q', label: 'qual', sortable: true},
                    {key: 'f', label: 'filter'}]
            }
        },
        methods: {
            ...mapActions(['loadRecords']),
            provider(ctx: BvTableCtxObject) {
                // todo: translate filter param to query
                const params: any = {
                    page: ctx.currentPage - 1,
                    size: ctx.perPage,
                    sort: ctx.sortBy ? ctx.sortBy : undefined,
                    desc: ctx.sortDesc
                }
                if (this.sample) {
                    params.query = {
                        selector: ['s', this.sample.index, 'gt', 't'],
                        operator: 'in',
                        args: ['het', 'hom_a', 'part']
                    }
                }
                // @ts-ignore
                return this.loadRecords(params).then(() => {
                    const records = this.records as PagedItems<Record>
                    // @ts-ignore
                    this.page.totalRows = records.page.totalElements
                    // @ts-ignore
                    this.page.totalPages = Math.ceil(records.page.totalElements / ctx.perPage)
                    return records.items
                })
            },
            clearSearch() {
                // @ts-ignore
                this.filter = ''
                const searchElement = this.$refs.search as BFormInput
                searchElement.focus()
            },
            info(record: Record, index: number, button: BButton) {
                // @ts-ignore
                this.infoModal.title = `Row index: ${index}`
                // @ts-ignore
                this.infoModal.record = record
                // @ts-ignore
                this.$root.$emit('bv::show::modal', this.infoModal.id, button)
            },
            resetInfoModal() {
                // @ts-ignore
                this.infoModal.title = ''
                // @ts-ignore
                this.infoModal.content = ''
            }
        },
        filters: {append, formatNumber},
        watch: {
            sample: function () {
                (this.$refs.table as BTable).refresh()
            }
        }
    })
</script>