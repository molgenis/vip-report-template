<template>
    <div id="app">
        <NavigationBar/>
        <!--suppress HtmlUnknownBooleanAttribute -->
        <b-container fluid>
            <router-view/>
        </b-container>
    </div>
</template>

<script>
    import NavigationBar from '@/components/NavigationBar.vue'

    export default {
        components: {
            NavigationBar
        }
    }
</script>

<!--suppress CssUnusedSymbol -->
<style>
    .btn-xs {
        padding: .125rem .375rem;
        font-size: .75rem;
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
</style>