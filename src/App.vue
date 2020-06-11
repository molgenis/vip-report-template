<template>
    <div id="app">
        <NavigationBar/>
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

<style>
    .btn-xs {
        padding: .125rem .375rem;
        font-size: .75rem;
    }
    td.compact {
        padding: 0rem;
        width: 0;
    }
</style>