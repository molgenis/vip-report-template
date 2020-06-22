<template>
    <div>
        <b-table
                small
                responsive=true
                :fields="fields"
                :items="items">
            <template v-slot:head()="data">
                {{ data.label ? $t(data.label) : '' }}
            </template>
            <template v-slot:cell(key)="data">
                <span v-if="data.item.key === 'c'">
                    {{ $t('chr') }}
                </span>
                <span v-else-if="data.item.key === 'p'">
                    {{ $t('pos') }}
                </span>
                <span v-else-if="data.item.key === 'i'">
                    {{ $t('id') }}
                </span>
                <span v-else-if="data.item.key === 'r'">
                    {{ $t('ref') }}
                </span>
                <span v-else-if="data.item.key === 'a'">
                    {{ $t('alt') }}
                </span>
                <span v-else-if="data.item.key === 'q'">
                    {{ $t('qual') }}
                </span>
                <span v-else-if="data.item.key === 'f'">
                    {{ $t('filter') }}
                </span>
                <span v-else-if="data.item.key === 'n'">
                    {{ $t('info') }}
                </span>
                <span v-else-if="data.item.key === 's'">
                    {{ $t('sample') }}
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
                    <Allele :allele="data.item.val"/>
                </span>
                <span v-else-if="data.item.key === 'a'">
                    <span v-for="(alt, index) in data.item.val" :key="index">
                        <Allele :allele="alt"/>
                        <span v-if="index < data.item.val.length - 1">, </span>
                    </span>
                </span>
                <span v-else-if="data.item.key === 'q'">
                    {{ data.item.val }}
                </span>
                <span v-else-if="data.item.key === 'f'">
                    {{ data.item.val }}
                </span>
                <span v-else-if="data.item.key === 'n'">
                    <RecordInfoDetails :metadata="metadata.info" :info="data.item.val" />
                </span>
                <span v-else-if="data.item.key === 's'">
                    {{ data.item.val[sample.index] }}
                </span>
            </template>
        </b-table>
    </div>
</template>

<script lang="ts">
    // eslint-disable-next-line no-unused-vars
    import Vue, {PropType} from 'vue'
    // eslint-disable-next-line no-unused-vars
    import {Record, RecordsMetadata, Sample} from '@molgenis/vip-report-api'
    import Allele from '@/components/Allele.vue'
    import Identifiers from '@/components/Identifiers.vue'
    import RecordInfoDetails from '@/components/RecordInfoDetails.vue'

    export default Vue.extend({
        components: {Allele, Identifiers, RecordInfoDetails},
        props: {
            metadata: Object as PropType<RecordsMetadata>,
            record: Object as PropType<Record>,
            sample: Object as PropType<Sample>
        },
        computed: {
            fields: function () {
                return [
                    {key: 'key', label: 'prop'},
                    {key: 'val', label: 'value'}]
            },
            items() {
                const items = []
                for (let key in this.record) {
                    const item = {key: key, val: this.record[key]}
                    items.push(item)
                }
                return items
            }
        }
    })
</script>