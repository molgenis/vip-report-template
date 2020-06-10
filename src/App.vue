<template>
    <div id="app">
        <TopNavigationBar/>
        <b-container fluid>
            <router-view/>
        </b-container>
    </div>
</template>

<script>
    import TopNavigationBar from '@/components/NavigationBar.vue'

    export default {
        name: 'App',
        components: {
            TopNavigationBar
        }
    }
</script>