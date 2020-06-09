<template>
    <b-row>
        <b-col cols="2">
            <SampleNavigation />
        </b-col>
        <b-col>
            <SampleReport />
        </b-col>
    </b-row>
</template>

<script lang="ts">
    import Vue from 'vue'
    import {mapActions, mapGetters} from 'vuex'
    import SampleNavigation from "@/components/SampleNavigation.vue";
    import SampleReport from "@/components/SampleReport.vue";

    export default Vue.extend({
        name: 'Samples',
        components: {SampleNavigation, SampleReport},
        methods: mapActions(['loadSamples']),
        computed: {
            ...mapGetters(['samples'])
        },
        created() {
            this.loadSamples()
        },
    })
</script>
