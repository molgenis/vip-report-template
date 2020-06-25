<template>
    <div>
        <span v-if="metadata.number === undefined">
            <RecordInfoDetailsItemValue v-if="value !== null" :metadataId="metadata.id" :value="value"/>
        </span>
        <span v-else-if="metadata.number && metadata.number.type === 'NUMBER' && metadata.number.count === 1">
            <RecordInfoDetailsItemValue v-if="value !== null" :metadataId="metadata.id" :value="value"/>
        </span>
        <span v-else>
            <span v-for="(item, index) in value" :key="index">
                <RecordInfoDetailsItemValue v-if="value !== null" :metadataId="metadata.id" :value="item"/>
                <span v-if="index < value.length - 1">, </span>
            </span>
        </span>
    </div>
</template>

<script lang="ts">
    // eslint-disable-next-line no-unused-vars
    import Vue, {PropType} from 'vue'
    // eslint-disable-next-line no-unused-vars
    import {InfoMetadata} from '@molgenis/vip-report-api'
    import RecordInfoDetailsItemValue from '@/components/RecordInfoDetailsItemValue.vue'

    export default Vue.extend({
        components: {RecordInfoDetailsItemValue},
        props: {
            metadata: Object as PropType<InfoMetadata>,
            value: [String, Number, Boolean, Array, Object] as PropType<string | number | boolean | object | string[] | number[] | boolean[] | object[]>
        }
    })
</script>