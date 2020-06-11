<template>
    <b-row>
        <b-col>
            <b-row>
                <b-col>
                    <SampleInfo :sample="sample" :phenotypes="phenotypes"/>
                </b-col>
            </b-row>
            <b-row>
                <b-col>
                    <RecordTable :sample="sample"/>
                </b-col>
            </b-row>
        </b-col>
    </b-row>
</template>

<script>
    import RecordTable from "./RecordTable";
    import SampleInfo from "./SampleInfo";

    export default {
        components: {SampleInfo, RecordTable},
        props: {
            sample: Object,
            phenotypes: Object
        }
    }
</script>