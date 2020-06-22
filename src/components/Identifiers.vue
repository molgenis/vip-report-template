<template>
    <div>
        <span v-for="(id, index) in identifiers" :key="id">
            <!-- dbSNP ID -->
            <a v-if="id.startsWith('rs')" :href="'https://www.ncbi.nlm.nih.gov/snp/' + encodeURIComponent(id)" target="_blank">
                {{ id }}
                <b-icon-box-arrow-in-up-right class="ml-1"/>
            </a>
            <!-- dbVar ID -->
            <a v-else-if="id.startsWith('esv') || id.startsWith('nsv')" :href="'https://www.ncbi.nlm.nih.gov/dbvar/variants/' + encodeURIComponent(id)" target="_blank">
                {{ id }}
                <b-icon-box-arrow-in-up-right class="ml-1"/>
            </a>
            <span v-else>{{ id }}</span>
            <span v-if="index < identifiers.length - 1">, </span>
        </span>
    </div>
</template>

<script lang="ts">
    // eslint-disable-next-line no-unused-vars
    import Vue, {PropType} from 'vue'

    export default Vue.extend({
        props: {
            identifiers: Array as PropType<string[]>
        }
    })
</script>