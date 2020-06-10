<template>
    <b-row>
        <b-col cols="1">
            <span>{{ $tc('phenotype', 2) }}:</span>
        </b-col>
        <b-col>
            <SamplePheno :phenotypes="phenotypes"/>
        </b-col>
    </b-row>
</template>

<script>
    import SamplePheno from "./SamplePheno";

    export default {
        name: 'SampleInfo',
        components: {SamplePheno},
        props: {
            sample: Object,
            phenotypes: Object
        }
    }
</script>