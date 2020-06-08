<template>
    <b-row class="text-center">
        <b-col>
            <span class="text-muted">{{ $t('footer', [app.name, app.version, app.args]) }}</span>
        </b-col>
    </b-row>
</template>

<script>
    export default {
        name: 'Footer',
        props: {
            app: Object
        }
    }
</script>