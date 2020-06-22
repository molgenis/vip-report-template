<template>
    <div>
        <b-table
                small
                :fields="fields"
                :items="items">
            <template v-slot:head()="data">
                {{ $t(data.label) }}
            </template>
            <template v-slot:cell()="data">
                <span v-if="data.field.metadata.number === undefined">
                    {{ data.item[data.field.index] }}
                </span>
                <span v-else-if="data.field.metadata.number && data.field.metadata.number.type === 'NUMBER' && data.field.metadata.number.count === 1">
                    {{ data.item[data.field.index] }}
                </span>
                <span v-else>
                    <span v-for="(item, index) in data.item[data.field.index]" :key="index">
                        {{ item }}<span v-if="index < data.item[data.field.index].length - 1">, </span>
                    </span>
                </span>
            </template>
        </b-table>
    </div>
</template>

<script lang="ts">
    // eslint-disable-next-line no-unused-vars
    import Vue, {PropType} from 'vue'
    // eslint-disable-next-line no-unused-vars
    import {InfoMetadata} from '@molgenis/vip-report-api'

    export default Vue.extend({
        props: {
            metadata: Array as PropType<InfoMetadata[]>,
            info: Array as PropType<object[]>
        },
        computed: {
            fields: function () {
                const fields = []
                let index = 0
                for (const info of this.metadata) {
                    fields.push({key: info.id, label: info.description, index: index, metadata: info})
                    ++index
                }
                return fields
            },
            items() {
                return this.info
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