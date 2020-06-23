<template>
    <div id="app">
        <NavigationBar class="mb-3" />
        <!--suppress HtmlUnknownBooleanAttribute -->
        <b-container fluid>
            <Alerts/>
            <router-view/>
        </b-container>
    </div>
</template>

<script lang="ts">
    import {mapActions} from 'vuex'

    import Alerts from '@/components/Alerts.vue'
    import NavigationBar from '@/components/NavigationBar.vue'
    import Vue from 'vue'

    export default Vue.extend({
        components: {
            Alerts, NavigationBar
        },
        methods: {
            ...mapActions(['validateRecords', 'validateSamples'])
        },
        async created() {
            await this.validateRecords()
            await this.validateSamples()
        }
    })
</script>

<!--suppress CssUnusedSymbol -->
<style>
    html {
        font-size: 14px
    }

    .btn-xs {
        padding: .125rem .375rem;
        font-size: .75rem;
    }

    td {
        white-space: nowrap
    }

    td.compact {
        padding: 0;
        width: 0;
    }

    .nuc {
        padding: 0.2rem;
    }

    .nuc-a {
        background-color: #90ee90;
    }

    .nuc-c {
        background-color: #b0c4de;
    }

    .nuc-t {
        background-color: #eea2ad;
    }

    .nuc-g {
        background-color: #ffec8b;
    }

    .modal-container {
        overflow: auto;
    }

    .nav-link {
        word-break: break-all;
    }
</style>