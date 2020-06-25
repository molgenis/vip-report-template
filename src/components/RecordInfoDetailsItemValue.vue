<template>
    <span v-if="metadataId === 'Consequence'">
        <Anchor
                :href="'http://www.sequenceontology.org/browser/obob.cgi?rm=term_list&obo_query=' + encodeURIComponent(value) + '&release=current_release'"
                :text="value"/>
    </span>
    <span v-else-if="metadataId === 'SYMBOL'">
        <Anchor :href="'https://www.omim.org/search?search=' + encodeURIComponent(value) + '&field=approved_gene_symbol'" :text="value" />
    </span>
    <span v-else>
        {{ value }}
    </span>
</template>

<script lang="ts">
    // eslint-disable-next-line no-unused-vars
    import Vue, {PropType} from 'vue'
    import Anchor from '@/components/Anchor.vue'

    export default Vue.extend({
        components: {Anchor},
        props: {
            metadataId: String as PropType<String>,
            value: [String, Number, Boolean] as PropType<string | number | boolean>
        }
    })
</script>