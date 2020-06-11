<template>
    <div>
        <b-row>
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
                {{ $t(data.label) }}
            </template>
            <template v-slot:cell(pos)="data">
                <a v-if="genomeBrowserDb" :href="'https://genome-euro.ucsc.edu/cgi-bin/hgTracks?db=' + encodeURIComponent(genomeBrowserDb) + '&position=' + encodeURIComponent('chr' + data.item.c + ':' + Math.max(0, (data.item.p - 500)) + '-' + (data.item.p + 500))" target="_blank">
                    {{ data.item.c + ':' + numberWithCommas(data.item.p) }}
                    <b-icon-box-arrow-in-up-right class="ml-1" />
                </a>
                <span v-else>{{ data.item.c + ':' + numberWithCommas(data.item.p) }}</span>
            </template>
            <template v-slot:cell(id)="data">
                <span v-for="(id, index) in data.item.i" :key="id">
                    <a v-if="id.startsWith('rs')" :href="'https://www.ncbi.nlm.nih.gov/snp/' + id" target="_blank">{{ id }}</a>
                    <span v-else>{{ id }}</span>
                    <span v-if="index < data.item.i.length - 1">, </span>
                </span>
            </template>
            <template v-slot:cell(ref)="data">
                <span v-for="(nuc, index) in data.item.r.split('')" :key="index"
                      :class="{'nuc': true, 'nuc-a': nuc === 'A', 'nuc-c': nuc === 'C', 'nuc-t': nuc === 'T', 'nuc-g': nuc === 'G'}">{{ nuc }}</span>
            </template>
            <template v-slot:cell(alt)="data">
                <span v-for="(alt, index) in data.item.a" :key="index">
                    <span v-for="(nuc, index) in alt.split('')" :key="index"
                          :class="{'nuc': true, 'nuc-a': nuc === 'A', 'nuc-c': nuc === 'C', 'nuc-t': nuc === 'T', 'nuc-g': nuc === 'G'}">{{ nuc }}</span>
                    <span v-if="index < data.item.a.length - 1">, </span>
                </span>
            </template>
            <template v-slot:cell(sample)="data">
                <span v-for="(alt, index) in data.item.s[sample.index].gt.a" :key="index">
                    <span v-for="(nuc, index) in alt.split('')" :key="index"
                          :class="{'nuc': true, 'nuc-a': nuc === 'A', 'nuc-c': nuc === 'C', 'nuc-t': nuc === 'T', 'nuc-g': nuc === 'G'}">{{ nuc }}</span>
                    <span v-if="index < data.item.s[sample.index].gt.a.length - 1"> {{ data.item.s[sample.index].gt.p ? '|' : '/'}} </span>
                </span>
            </template>
            <template v-slot:cell(father)="data">
                <span v-for="(alt, index) in data.item.s[samplePaternal.index].gt.a" :key="index">
                    <span v-for="(nuc, index) in alt.split('')" :key="index"
                          :class="{'nuc': true, 'nuc-a': nuc === 'A', 'nuc-c': nuc === 'C', 'nuc-t': nuc === 'T', 'nuc-g': nuc === 'G'}">{{ nuc }}</span>
                    <span v-if="index < data.item.s[samplePaternal.index].gt.a.length - 1"> {{ data.item.s[samplePaternal.index].gt.p ? '|' : '/'}} </span>
                </span>
            </template>
            <template v-slot:cell(mother)="data">
                <span v-for="(alt, index) in data.item.s[sampleMaternal.index].gt.a" :key="index">
                    <span v-for="(nuc, index) in alt.split('')" :key="index"
                          :class="{'nuc': true, 'nuc-a': nuc === 'A', 'nuc-c': nuc === 'C', 'nuc-t': nuc === 'T', 'nuc-g': nuc === 'G'}">{{ nuc }}</span>
                    <span v-if="index < data.item.s[sampleMaternal.index].gt.a.length - 1"> {{ data.item.s[sampleMaternal.index].gt.p ? '|' : '/'}} </span>
                </span>
            </template>
            <template v-slot:cell(qual)="data">
                {{ data.item.q }}
            </template>
            <template v-slot:cell(filter)="data">
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
    </div>
</template>

<script>
    import {mapActions, mapGetters, mapState} from "vuex";

    export default {
        props: {
            sample: Object
        },
        data: function () {
            return {
                filter: '',
                isTableBusy: false,
                sortBy: null,
                sortDesc: false,
                page: {
                    currentPage: 1,
                    perPage: 20
                }
            }
        },
        computed: {
            ...mapGetters(['getSampleById']),
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
                return [
                    {key: 'pos', label: 'pos', sortable: true},
                    {key: 'id', label: 'id'},
                    {key: 'ref', label: 'ref'},
                    this.sample ? {key: 'sample', label: 'sample'} : {key: 'alt', label: 'alt'},
                    this.sample && this.samplePaternal ? {key: 'father', label: 'father'} : null,
                    this.sample && this.sampleMaternal ? {key: 'mother', label: 'mother'} : null,
                    {key: 'qual', label: 'qual', sortable: true},
                    {key: 'filter', label: 'filter'}]
            },
            genomeBrowserDb: function () {
                let genomeBrowserDb
                switch (this.genomeAssembly) {
                    case 'NCBI34':
                        genomeBrowserDb = 'hg16'
                        break
                    case 'NCBI35':
                        genomeBrowserDb = 'hg17'
                        break
                    case 'NCBI36':
                        genomeBrowserDb = 'hg18'
                        break
                    case 'GRCh37':
                        genomeBrowserDb = 'hg19'
                        break
                    case 'GRCh38':
                        genomeBrowserDb = 'hg38'
                        break
                    case 'UNKNOWN':
                    default:
                        genomeBrowserDb = null
                        break
                }
                return genomeBrowserDb
            }
        },
        methods: {
            ...mapActions(['loadRecords']),
            provider(ctx) {
                const params = {
                    page: ctx.currentPage - 1,
                    size: ctx.perPage,
                    sort: ctx.sortBy ? ctx.sortBy : undefined,
                    desc: ctx.sortDesc
                }
                if (this.sample) {
                    params.query = {
                        selector: ['s', this.sample.index, 'gt', 't'],
                        operator: '!in',
                        args: ['hom_r', 'miss']
                    }
                }
                return this.loadRecords(params).then(() => {
                    const records = this.records
                    this.page.totalRows = records.page.totalElements
                    this.page.totalPages = Math.ceil(records.page.totalElements / ctx.perPage)
                    return records.items
                })
            },
            clearSearch() {
                this.filter = ''
                this.$refs.search.focus()
            },
            numberWithCommas(x) {
                let parts = x.toString().split(".");
                parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                return parts.join(".");
            }
        },
        watch: {
            sample: function() {
                this.$refs.table.refresh()
            }
        }
    }
</script>

<style scoped>
    .nuc {
        padding: 0.2rem;
    }

    .nuc-a {
        background-color: #90ee90;
    }

    .nuc-c {
        background-color: #b0c4de;
    }

    .nuc-t {
        background-color: #eea2ad;
    }

    .nuc-g {
        background-color: #ffec8b;
    }
</style>