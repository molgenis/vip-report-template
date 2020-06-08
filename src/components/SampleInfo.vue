<template>
    <div>
        <b-row v-if="phenotype && phenotype.phenotypicFeaturesList.length > 0">
            <b-col cols="1">
                <span>{{ $tc('phenotype', 2) }}:</span>
            </b-col>
            <b-col>
                <SamplePheno :phenotype="phenotype"/>
            </b-col>
        </b-row>
    </div>
</template>

<script>
    import SamplePheno from "./SamplePheno";

    export default {
        name: 'SampleInfo',
        components: {SamplePheno},
        props: {
            sample: Object
        },
        data: function () {
            return {
                phenotype: null,
            }
        },
        methods: {
            loadPhenotypes: async function () {
                const params = {
                    query: {
                        selector: ['subject', 'id'],
                        operator: '==',
                        args: this.sample.individualId
                    }
                }
                const phenotypes = await this.$api.get('phenotypes', params)
                this.phenotype = phenotypes.items.length > 0 ? phenotypes.items[0] : null
            }
        },
        mounted() {
            this.loadPhenotypes(this.sample)
        },
        watch: {
            sample: function (sample) {
                this.loadPhenotypes(sample)
            }
        }
    }
</script>