<template>
    <div v-if="samples">
        <b-row v-if="samples.length > 1">
            <b-col>
                <SampleSelect :samples="samples" :sample="sample" @change="sample = $event"/>
            </b-col>
        </b-row>
        <b-row>
            <b-col>
                <RecordTable v-if="sample" :sample="sample"/>
            </b-col>
        </b-row>
    </div>
</template>

<script>
    import RecordTable from "./RecordTable";
    import SampleSelect from "./SampleSelect";

    export default {
        name: 'SampleNav',
        components: {SampleSelect, RecordTable},
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
            this.$api.get('samples').then(samples => {
                this.samples = samples.items.map((sample, index) => ({
                    id: index,
                    label: sample.name
                }))
            })
        },
    }
</script>