<template>
    <b-nav pills vertical>
        <b-nav-item
                v-for="sample in samples"
                :key="getId(sample)"
                :active="isActive(sample)"
                :disabled="isDisabled(sample)"
                :to="{params: { id: getId(sample) }}">
            {{ getLabel(sample) }}
        </b-nav-item>
    </b-nav>
</template>

<script lang="ts">
    import Vue from 'vue'
    import {mapState} from 'vuex'
    // eslint-disable-next-line no-unused-vars
    import {Sample} from "@/types/Sample";

    export default Vue.extend({
        computed: {
            ...mapState(['selectedSample']),
        },
        props: {
            samples: Array
        },
        methods: {
            getId(sample: Sample) {
                return sample.person.individualId
            },
            getLabel(sample: Sample) {
                return sample.person.individualId
            },
            isActive(sample: Sample) {
                return this.selectedSample !== null && (this.getId(sample) === this.getId(this.selectedSample))
            },
            isDisabled(sample: Sample) {
                return sample.index === -1
            }
        }
    })
</script>
