<template>
    <span>
        <span v-if="allele.startsWith('<') && allele.endsWith('>') || allele.indexOf(']') !== -1 || allele.indexOf('[') !== -1">{{ allele }}</span>
        <span v-else v-for="(base, index) in allele.split('')" :key="index"
              :class="getAlleleClasses(base)">{{ base }}</span>
    </span>
</template>

<script lang="ts">
    // eslint-disable-next-line no-unused-vars
    import Vue from 'vue'

    export default Vue.extend({
        props: {
            allele: String
        },
        methods: {
            getAlleleClasses(base: string): object {
                const classes: object = {nuc: true}
                // @ts-ignore
                classes['nuc-' + base.toLocaleLowerCase()] = true
                return classes
            }
        }
    })
</script>