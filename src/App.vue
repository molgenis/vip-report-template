<template>
    <div id="app">
        <Header :samples="samples" :sample="sample" @change="sample = $event" />
        <b-container fluid>
            <Alerts v-if="nrAlerts > 0" class="mt-3" :report-records="reportRecords" :total-records="totalRecords" :report-samples="reportSamples" :total-samples="totalSamples"/>
            <Report class="mt-3" :samples="samples" :sample="sample" />
            <Footer v-if="metadata" class="mt-3" :metadata="metadata" />
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

            const persons = await this.$api.get('persons')

            let personIndex = {}
            persons.items.forEach((person, index) => {
                personIndex[person.individualId] = index
            })

            this.samples = persons.items.map(person => ({
                ...person, ...{
                    individual_idx: personIndex[person.individualId],
                    paternal_idx: personIndex[person.paternalId],
                    maternal_idx: personIndex[person.maternalId]
                }
            }))
            this.sample = this.samples.length > 0 ? this.samples[0] : null
            this.reportSamples = persons.page.totalElements
            this.totalSamples = persons.total
        }
    }
</script>
