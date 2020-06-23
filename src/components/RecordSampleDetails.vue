<template>
    <div>
        <!-- TODO: improve rendering once we have format metadata available -->
        {{ data }}
    </div>
</template>

<script lang="ts">
    // eslint-disable-next-line no-unused-vars
    import Vue, {PropType} from 'vue'
    // eslint-disable-next-line no-unused-vars

    export default Vue.extend({
        props: {
            data: Object as PropType<object>
        }
    })
</script>