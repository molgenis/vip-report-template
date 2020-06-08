<template>
    <v-select
            id="sampleSelect"
            :filterable="false"
            :clearable="false"
            :options="samples"
            :value="sample"
            v-model="selectedSample"
            :get-option-key="sample => sample.individual_idx"
            :get-option-label="sample => sample.individualId"
            @input="$emit('change', $event)"
    />
</template>

<script>
    import "vue-select/dist/vue-select.css";

    export default {
        name: 'SampleSelect',
        props: {
            samples: Array,
            sample: Object
        },
        data: function () {
            return {
                selectedSample: this.sample
            }
        },
    }
</script>