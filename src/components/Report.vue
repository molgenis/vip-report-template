<template>
    <div v-if="samples">
        <b-row v-if="samples.length > 1">
            <b-col>
                <SampleSelect :samples="samples" :sample="sample" @change="sample = $event"/>
            </b-col>
        </b-row>
        <b-row v-if="sample">
            <b-col>
                <SampleInfo :sample="sample"/>
            </b-col>
        </b-row>
        <b-row v-if="sample">
            <b-col>
                <RecordTable :sample="sample"/>
            </b-col>
        </b-row>
    </div>
</template>

<script>
    import RecordTable from "./RecordTable";
    import SampleSelect from "./SampleSelect";
    import SampleInfo from "./SampleInfo";

    export default {
        name: 'Report',
        components: {SampleInfo, SampleSelect, RecordTable},
        data: function () {
            return {
                samples: null,
                sample: null
            }
        },
        watch: {
            samples: function (samples) {
                this.sample = samples.length > 0 ? samples[0] : null
            }
        },
        created() {
            this.$api.get('persons').then(samples => {
                let sampleIndex = {}
                samples.items.forEach((sample, index) => {
                    sampleIndex[sample.individualId] = index
                })

                this.samples = samples.items.map(sample => ({
                    ...sample, ...{
                        individual_idx: sampleIndex[sample.individualId],
                        paternal_idx: sampleIndex[sample.paternalId],
                        maternal_idx: sampleIndex[sample.maternalId]
                    }
                }))
            })
        },
    }
</script>