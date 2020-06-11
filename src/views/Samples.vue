<template>
    <b-row>
        <b-col cols="2">
            <SampleNavigation v-if="samples" :samples="samples"/>
        </b-col>
        <b-col>
            <SampleReport v-if="selectedSample" :sample="selectedSample" :phenotypes="selectedSamplePhenotypes"/>
        </b-col>
    </b-row>
</template>

<script lang="ts">
    import Vue from 'vue'
    import SampleNavigation from "@/components/SampleNavigation.vue";
    import SampleReport from "@/components/SampleReport.vue";
    import {mapActions, mapGetters, mapState} from "vuex";

    export default Vue.extend({
        components: {SampleNavigation, SampleReport},
        computed: {
            ...mapGetters(['samples', 'getSampleById']),
            ...mapState(['selectedSample', 'selectedSamplePhenotypes'])
        },
        methods: {
            ...mapActions(['loadMetadata', 'loadSamples', 'selectSample']),
            getId(sample: any) {
                return sample.person.individualId
            }
        },
        async created() {
            await this.loadMetadata()
            await this.loadSamples()
            if (this.$route.params.id) {
                const sample = this.getSampleById(this.$route.params.id)
                this.selectSample(sample)
            } else {
                const sample = this.samples.find((sample: any) => sample.index !== -1)
                if (sample !== null) {
                    await this.$router.push({params: {id: this.getId(sample)}})
                }
            }
        },
        watch: {
            $route(to, from) {
                if (to.params.id !== from.params.id) {
                    const sample = this.getSampleById(to.params.id)
                    this.selectSample(sample)
                }
            }
        }
    })
</script>
