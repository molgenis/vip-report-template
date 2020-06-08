<template>
    <div id="app">
        <Header :samples="samples" :sample="sample" @change="sample = $event" />
        <b-container fluid>
            <Alerts v-if="nrAlerts > 0" class="mt-3" :report-records="reportRecords" :total-records="totalRecords" :report-samples="reportSamples" :total-samples="totalSamples"/>
            <Report class="mt-3" :samples="samples" :sample="sample" :metadata="metadata" />
            <Footer v-if="metadata" class="mt-3" :app="metadata.app" />
        </b-container>
    </div>
</template>

<script>
    import Header from "./components/Header";
    import Alerts from "./components/Alerts";
    import Report from "./components/Report";
    import Footer from "./components/Footer";

    export default {
        name: 'App',
        components: {Header, Alerts, Report, Footer},
        data: function () {
            return {
                metadata: null,
                samples: null,
                sample: null,
                reportRecords: null,
                totalRecords: null,
                reportSamples: null,
                totalSamples: null
            }
        },
        computed: {
            nrAlerts: function () {
                let nrAlerts = 0
                if(this.reportRecords < this.totalRecords) {
                    ++nrAlerts
                }
                if(this.reportSamples < this.totalSamples) {
                    ++nrAlerts
                }
                return nrAlerts
            }
        },
        async created() {
            this.metadata = await this.$api.getMeta()

            const records = await this.$api.get('records', {size: 0})
            this.reportRecords = records.page.totalElements
            this.totalRecords = records.total

            const samples = await this.$api.get('samples')

            let sampleIndex = {}
            samples.items.forEach(sample => {
                sampleIndex[sample.person.individualId] = sample.index
            })

            this.samples = samples.items.filter(sample => sample.index !== -1).map(sample => ({
                ...sample.person, ...{
                    individual_idx: sampleIndex[sample.person.individualId],
                    paternal_idx: sampleIndex[sample.person.paternalId],
                    maternal_idx: sampleIndex[sample.person.maternalId]
                }
            }))
            this.sample = this.samples.length > 0 ? this.samples[0] : null
            this.reportSamples = samples.page.totalElements
            this.totalSamples = samples.total
        }
    }
</script>
