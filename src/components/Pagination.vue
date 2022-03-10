<script lang="ts">
import { computed, defineComponent, toRefs } from "vue";
import { Page } from "../api/Api";
import { useI18n } from "vue-i18n";

export default defineComponent({
  name: "VipPagination",
  props: {
    page: {
      type: Object as () => Page,
      required: true,
    },
  },
  setup(props, context) {
    const { page } = toRefs(props);

    const pages = computed(() => Math.ceil(page.value.totalElements / page.value.size));

    const onPreviousPage = () => context.emit("change", page.value.number - 1);
    const onNextPage = () => context.emit("change", page.value.number + 1);
    const onPage = (number: number) => context.emit("change", number);

    // workaround for https://github.com/intlify/vue-i18n-next/issues/324
    const { t } = useI18n(); // eslint-disable-line @typescript-eslint/unbound-method

    return {
      pages,
      onPreviousPage,
      onNextPage,
      onPage,
      t,
    };
  },
});
</script>

<template>
  <nav v-if="pages > 1" class="pagination is-centered">
    <a v-if="page.number > 0" class="pagination-previous" @click="onPreviousPage">{{ t("pagePrevious") }}</a>
    <a v-if="page.number < pages - 1" class="pagination-next" @click="onNextPage">{{ t("pageNext") }}</a>
    <ul class="pagination-list">
      <li v-if="page.number > 0">
        <a class="pagination-link" @click="onPage(0)">1</a>
      </li>
      <li v-if="page.number > 1">
        <span class="pagination-ellipsis">&hellip;</span>
      </li>
      <li>
        <a class="pagination-link is-current">{{ page.number + 1 }}</a>
      </li>
      <li v-if="page.number < pages - 2">
        <span class="pagination-ellipsis">&hellip;</span>
      </li>
      <li v-if="page.number < pages - 1">
        <a class="pagination-link" @click="onPage(pages - 1)">{{ pages }}</a>
      </li>
    </ul>
  </nav>
</template>
