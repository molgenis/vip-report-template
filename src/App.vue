<script lang="ts">
import { defineComponent } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";

export default defineComponent({
  name: "VipApp",
  setup() {
    const route = useRoute();

    // workaround for https://github.com/intlify/vue-i18n-next/issues/324
    const { t } = useI18n(); // eslint-disable-line @typescript-eslint/unbound-method

    return { route, t };
  },
});
</script>

<template>
  <nav class="navbar is-fixed-top is-light" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <span class="navbar-item has-text-weight-semibold">{{ t("vcfReport") }}</span>
    </div>
    <div class="navbar-menu">
      <div class="navbar-start">
        <router-link class="navbar-item" :to="{ name: 'variants' }">{{ t("variants") }}</router-link>
        <!-- dropdown doesn't close on click, use :key as a workaround to force rerender -->
        <div :key="route.name ? route.name : undefined" class="navbar-item has-dropdown is-hoverable">
          <a class="navbar-link">{{ t("data") }}</a>
          <div class="navbar-dropdown">
            <router-link class="navbar-item" :to="{ name: 'tree' }">{{ t("decisionTree") }}</router-link>
            <router-link class="navbar-item" :to="{ name: 'vcf' }">{{ t("vcf") }}</router-link>
          </div>
        </div>
      </div>
    </div>
  </nav>
  <div class="container is-fluid">
    <router-view />
  </div>
</template>
