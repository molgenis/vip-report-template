<template>
    <b-nav vertical>
        <b-nav-text>{{ $t('samples') }}</b-nav-text>
        <div v-if="samples !== null">
            <b-nav-item
                    v-for="aSample in samples"
                    :key="getId(aSample)"
                    :active="sample !== null && (getId(aSample) === getId(sample))"
                    :disabled="isDisabled(aSample)"
                    :to="{name: 'samples', params: { id: getId(aSample) }}">
                {{ getLabel(aSample) }}
            </b-nav-item>
        </div>
    </b-nav>
</template>

<script lang="ts">
    import Vue from 'vue'
    import {mapActions, mapGetters} from 'vuex'

    export default Vue.extend({
        name: 'SampleNavigation',
        methods: {
            ...mapActions(['loadSamples']),
            getId(sample: any) {
                return sample.person.individualId
            },
            getLabel(sample: any) {
                return sample.person.individualId
            },
            isActive(sample: any) {
                return this.sample !== null && (this.getId(sample) === this.getId(this.sample))
            },
            isDisabled(sample: any) {
                return sample.index !== -1
            }
        },
        computed: {
            ...mapGetters(['samples', 'sample'])
        },
        async created() {
            this.loadSamples()
        },
    })
</script>
