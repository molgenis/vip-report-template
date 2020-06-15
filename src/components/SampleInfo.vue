<template>
    <b-row>
        <b-col cols="1">
            <span>{{ $t('phenotypes') }}:</span>
        </b-col>
        <b-col>
            <SamplePheno :phenotypes="phenotypes"/>
        </b-col>
    </b-row>
</template>

<script lang="ts">
    import SamplePheno from '@/components/SamplePheno.vue'
    import Vue from 'vue'

    export default Vue.extend({
        components: {SamplePheno},
        props: {
            sample: Object,
            phenotypes: Object
        }
    })
</script>