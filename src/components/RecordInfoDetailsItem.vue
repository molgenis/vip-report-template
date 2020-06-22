<template>
    <div>
        <span v-if="metadata.number === undefined">
            {{ value }}
        </span>
        <span v-else-if="metadata.number && metadata.number.type === 'NUMBER' && metadata.number.count === 1">
            <span v-if="metadata.type === 'NESTED'">
                <RecordInfoNestedDetails :metadata="metadata.nested" :info="[value]"/>
            </span>
            <span v-else>
                {{ value }}
            </span>
        </span>
        <span v-else>
            <span v-if="metadata.type === 'NESTED'">
                <RecordInfoNestedDetails :metadata="metadata.nested" :info="value"/>
            </span>
            <span v-else>
                <span v-for="(item, index) in value" :key="index">
                {{ item }}<span v-if="index < value.length - 1">, </span>
                </span>
            </span>
        </span>
    </div>
</template>

<script lang="ts">
    // eslint-disable-next-line no-unused-vars
    import Vue, {PropType} from 'vue'
    // eslint-disable-next-line no-unused-vars
    import {InfoMetadata} from '@molgenis/vip-report-api'
    import RecordInfoNestedDetails from '@/components/RecordInfoNestedDetails.vue'

    export default Vue.extend({
        components: {RecordInfoNestedDetails},
        props: {
            metadata: Object as PropType<InfoMetadata>,
            value: [String, Number, Boolean, Array, Object] as PropType<string | number | boolean | object | string[] | number[] | boolean[] | object[]>
        }
    })
</script>