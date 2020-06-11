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