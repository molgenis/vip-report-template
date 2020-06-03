<template>
    <div id="app">
        <Header/>
        <b-container fluid>
            <Alerts v-if="nrAlerts > 0" class="mt-3" :report-records="reportRecords" :total-records="totalRecords" :report-samples="reportSamples" :total-samples="totalSamples"/>
            <Report class="mt-3" />
            <Footer class="mt-3" :metadata="metadata" />
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

            const samples = await this.$api.get('persons', {size: 0})
            this.reportSamples = samples.page.totalElements
            this.totalSamples = samples.total
        }
    }
</script>
