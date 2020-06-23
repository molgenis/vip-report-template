<template>
    <b-button size="sm" variant="link" v-b-tooltip.click :title="info">
        <b-icon-question-circle class="mr-1"/>
    </b-button>
</template>

<script lang="ts">
    // eslint-disable-next-line no-unused-vars
    import Vue, {PropType} from 'vue'

    export default Vue.extend({
        props: {
            info: String as PropType<string>
        }
    })
</script>