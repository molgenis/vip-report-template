<template>
    <div>
        <span v-for="(phenotypicFeature, index) in phenotype.phenotypicFeaturesList" :key="index">
            <span class="mr-1">
                <a v-if="phenotypicFeature.type.id.startsWith('HP:')"
                   :href="'https://hpo.jax.org/app/browse/term/' + phenotypicFeature.type.id" target="_blank">
                    {{ phenotypicFeature.type.label }}
                    <b-icon-box-arrow-in-up-right class="ml-1" />
                </a>
                <span v-else>
                    {{ phenotypicFeature.type.label }}
                </span>
            </span>
        </span>
        <b-button v-if="hpoTerms.length > 0"
                  class="ml-3"
                  type="button"
                  size="sm"
                  variant="info"
                  :href="'https://molgenis102.gcc.rug.nl?phenotypes=' + hpoTerms.join(',')"
                  target="_blank">
            {{ $t('vibe') }}
            <b-icon-box-arrow-in-up-right class="ml-1" />
        </b-button>
    </div>
</template>

<script>
    export default {
        name: 'SamplePheno',
        props: {
            phenotype: Object
        },
        computed: {
            hpoTerms: function () {
                let hpoTerms = []
                for (let phenotypicFeature of this.phenotype.phenotypicFeaturesList) {
                    if (phenotypicFeature.type.id.startsWith("HP:")) {
                        hpoTerms.push(phenotypicFeature.type.id)
                    }
                }
                return hpoTerms
            }
        }
    }
</script>