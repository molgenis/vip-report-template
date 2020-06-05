<template>
    <div v-if="samples">
        <b-row v-if="sample">
            <b-col>
                <SampleInfo :sample="sample"/>
            </b-col>
        </b-row>
        <b-row v-if="sample">
            <b-col>
                <RecordTable :sample="sample" :genome-assembly="metadata.htsFile.genomeAssembly" />
            </b-col>
        </b-row>
    </div>
</template>

<script>
    import RecordTable from "./RecordTable";
    import SampleInfo from "./SampleInfo";

    export default {
        name: 'Report',
        components: {SampleInfo, RecordTable},
        props: {
            metadata: Object,
            samples: Array,
            sample: Object
        }
    }
</script>