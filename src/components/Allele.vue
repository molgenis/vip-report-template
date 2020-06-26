<template>
  <span>
    <span
      v-if="
        (allele.startsWith('<') && allele.endsWith('>')) ||
          allele.indexOf(']') !== -1 ||
          allele.indexOf('[') !== -1
      "
      >{{ allele }}</span
    >
    <span
      v-else
      v-for="(nuc, index) in nucs"
      :key="index"
      :class="getNucClasses(nuc)"
      >{{ nuc }}</span
    >
  </span>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  props: {
    allele: String,
    abbreviate: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    nucs() {
      let nucleotides = this.allele.split("");
      if (this.abbreviate && nucleotides.length > 5) {
        const lastNuc = nucleotides[nucleotides.length - 1];
        nucleotides = nucleotides.slice(0, 3);
        nucleotides.push("\u2026"); // ellipsis
        nucleotides.push(lastNuc);
      }
      return nucleotides;
    }
  },
  methods: {
    getNucClasses(base: string): object {
      const classes: object = { nuc: true };
      // ellipsis
      if (base !== "*" && base !== "\u2026") {
        classes["nuc-" + base.toLocaleLowerCase()] = true;
      }
      return classes;
    }
  }
});
</script>
