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

<script>
    export default {
        props: {
            reportRecords: Number,
            totalRecords: Number,
            reportSamples: Number,
            totalSamples: Number
        },
    }
</script>