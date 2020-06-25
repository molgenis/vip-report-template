<template>
    <div>
        <div>
            <span v-for="(alt, index) in data.gt.a" :key="index">
                <Allele :allele="alt"/>
                <span v-if="index < data.gt.a.length - 1"> {{ data.gt.p ? '|' : '/'}} </span>
            </span>
        </div>
        <RecordInfoDetails :metadata="metadata" :info="data.f" />
    </div>
</template>

<script lang="ts">
    // eslint-disable-next-line no-unused-vars
    import Vue, {PropType} from 'vue'
    // eslint-disable-next-line no-unused-vars
    import {FormatMetadata} from '@molgenis/vip-report-api'
    import RecordInfoDetails from '@/components/RecordInfoDetails.vue'
    import Allele from '@/components/Allele.vue'

    export default Vue.extend({
        components: {Allele, RecordInfoDetails},
        props: {
            metadata: Array as PropType<FormatMetadata[]>,
            data: Object as PropType<object>
        }
    })
</script>