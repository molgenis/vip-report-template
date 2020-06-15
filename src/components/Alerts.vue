<template>
    <div>
        <b-alert v-if="reportRecords < totalRecords" show dismissible variant="warning">
            {{ $t('variantWarning', [reportRecords, totalRecords]) }}
        </b-alert>
        <b-alert v-if="reportSamples < totalSamples" show dismissible variant="warning">
            {{ $t('sampleWarning', [reportSamples, totalSamples]) }}
        </b-alert>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue'

    export default Vue.extend({
        props: {
            reportRecords: Number,
            totalRecords: Number,
            reportSamples: Number,
            totalSamples: Number
        },
    })
</script>