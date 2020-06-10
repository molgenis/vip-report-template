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

    export default Vue.extend({
        name: 'SampleNavigation',
        computed: {
            ...mapState(['selectedSample']),
        },
        props: {
            samples: Array
        },
        methods: {
            getId(sample: any) {
                return sample.person.individualId
            },
            getLabel(sample: any) {
                return sample.person.individualId
            },
            isActive(sample: any) {
                return this.selectedSample !== null && (this.getId(sample) === this.getId(this.selectedSample))
            },
            isDisabled(sample: any) {
                return sample.index === -1
            }
        }
    })
</script>
