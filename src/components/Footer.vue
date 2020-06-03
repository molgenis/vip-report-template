<template>
    <b-row class="text-center">
        <b-col>
            <span class="text-muted">{{ $t('footer', [metadata.appName, metadata.appVersion, metadata.appArgs]) }}</span>
        </b-col>
    </b-row>
</template>

<script>
    export default {
        name: 'Footer',
        props: {
            metadata: Object
        }
    }
</script>