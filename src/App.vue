<template>
    <div id="app">
        <b-container fluid>
            <b-alert v-if="reportRecords < totalRecords" show dismissible variant="warning">
                {{ $t('variantWarning', [reportRecords, totalRecords]) }}
            </b-alert>
            <b-alert v-if="reportSamples < totalSamples" show dismissible variant="warning">
                {{ $t('sampleWarning', [reportSamples, totalSamples]) }}
            </b-alert>
            <SampleNav/>
        </b-container>
    </div>
</template>

<script>
    import SampleNav from "./components/SampleNav";

    export default {
        name: 'App',
        components: {SampleNav},
        data: function () {
            return {
                reportRecords: null,
                totalRecords: null,
                reportSamples: null,
                totalSamples: null
            }
        },
        async created() {
            const records = await this.$api.get('records', {size: 0})
            this.reportRecords = records.page.totalElements
            this.totalRecords = records.total

            const samples = await this.$api.get('persons', {size: 0})
            this.reportSamples = samples.page.totalElements
            this.totalSamples = samples.total
        }
    }
</script>
