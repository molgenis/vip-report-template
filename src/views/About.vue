<template>
    <span v-if="metadata !== null">{{ $t('footer', [metadata.app.name, metadata.app.version, metadata.app.args]) }}</span>
</template>

<script lang="ts">
    import Vue from 'vue'
    import {mapActions, mapState} from 'vuex'

    export default Vue.extend({
        methods: mapActions(['loadMetadata']),
        computed: {
            ...mapState(['metadata'])
        },
        created() {
            this.loadMetadata()
        },
    })
</script>
