<template>
    <div v-if="alerts.length > 0">
        <b-alert v-for="(alert, index) in alerts" :key="index" show dismissible :variant="alert.type" @dismissed="removeAlert(alert)">
            {{ $t(alert.messageId, alert.messageArgs) }}
        </b-alert>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue'
    import {mapActions, mapState} from 'vuex'

    export default Vue.extend({
        computed: {
            ...mapState(['alerts']),
        },
        methods: {
            ...mapActions(['removeAlert'])
        }
    })
</script>