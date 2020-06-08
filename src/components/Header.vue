<template>
    <b-navbar type="light" variant="light">
        <b-navbar-brand href="#">{{ $t('brand') }}</b-navbar-brand>
        <b-nav-form v-if="samples && samples.length > 1">
            <SampleSelect :samples="samples" :sample="sample" @change="$emit('change', $event)"/>
        </b-nav-form>
    </b-navbar>
</template>

<script>
    import SampleSelect from "./SampleSelect";

    export default {
        name: 'Header',
        components: {SampleSelect},
        props: {
            samples: Array,
            sample: Object
        }
    }
</script>