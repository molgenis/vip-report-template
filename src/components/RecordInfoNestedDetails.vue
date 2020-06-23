<template>
    <div>
        <b-table
                small
                :fields="fields"
                :items="items">
            <template v-slot:head()="data">
                {{ data.label }}
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
                    // @ts-ignore
                    if(this.hasData(index)) {
                        fields.push({key: info.id, label: info.description, index: index, metadata: info})
                    }
                    ++index
                }
                return fields
            },
            items() {
                return this.info
            }
        },
        methods: {
            hasData(index: number): boolean {
                for (let item of this.info) {
                    // @ts-ignore
                    if(!(item[index] === null || (Array.isArray(item[index]) && item[index].length === 0))) {
                        return true
                    }
                }

                return false
            }
        }
    })
</script>