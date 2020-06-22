<template>
    <div>
        <b-table
                small
                responsive=true
                :fields="fields"
                :items="items">
            <template v-slot:head()="data">
                {{ $t(data.label) }}
            </template>
            <template v-slot:cell(key)="data">
                <!-- todo: show description in addition to key: {{ getInfoMetadata(data.item.key).description }} -->
                {{ data.item.key }}
            </template>
            <template v-slot:cell(val)="data">
                <RecordInfoDetailsItem :metadata="getInfoMetadata(data.item.key)" :value="data.item.val"/>
            </template>
        </b-table>
    </div>
</template>

<script lang="ts">
    // eslint-disable-next-line no-unused-vars
    import Vue, {PropType} from 'vue'
    // eslint-disable-next-line no-unused-vars
    import {InfoMetadata} from '@molgenis/vip-report-api'
    import RecordInfoDetailsItem from '@/components/RecordInfoDetailsItem.vue'

    export default Vue.extend({
        components: {RecordInfoDetailsItem},
        props: {
            metadata: Array as PropType<InfoMetadata[]>,
            info: Object as PropType<object>
        },
        computed: {
            fields: function () {
                return [
                    {key: 'key', label: 'prop'},
                    {key: 'val', label: 'value'}]
            },
            items() {
                const items = []
                for (let key in this.info) {
                    // fix for invalid VCF
                    if (key !== '') {
                        // @ts-ignore
                        const item = {key: key, val: this.info[key]}
                        items.push(item)
                    }
                }
                return items
            }
        },
        methods: {
            getInfoMetadata(key: string): InfoMetadata {
                const infoMetadata = this.metadata.find(item => item.id === key)
                if (infoMetadata === undefined) {
                    throw new Error('missing info metadata for \'' + key + '\'')
                }
                return infoMetadata
            }
        }
    })
</script>