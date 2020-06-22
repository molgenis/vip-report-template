<template>
    <span>
        <span v-if="bases.startsWith('<') && bases.endsWith('>')">{{ bases }}</span>
        <span v-else v-for="(base, index) in bases.split('')" :key="index"
              :class="getBaseClass(base)">{{ base }}</span>
    </span>
</template>

<script lang="ts">
    // eslint-disable-next-line no-unused-vars
    import Vue from 'vue'

    export default Vue.extend({
        props: {
            bases: String
        },
        methods: {
            getBaseClass(base: string): object {
                const classes: object = {nuc: true}
                // @ts-ignore
                classes['nuc-' + base.toLocaleLowerCase()] = true
                return classes
            }
        }
    })
</script>