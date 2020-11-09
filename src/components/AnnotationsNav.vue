<template>
  <b-navbar-nav>
    <b-nav-item-dropdown :text="$t('annotations')">
      <b-dropdown-item href="#" @click="newAnnotations">{{ $t('new') }}</b-dropdown-item>
      <b-dropdown-item href="#" @click="openAnnotations">{{ $t('open') }}</b-dropdown-item>
      <b-dropdown-item href="#" @click="saveAnnotations" :disabled="!isAnnotationEnabled">{{
        $t('save')
      }}</b-dropdown-item>
      <b-dropdown-divider />
      <b-dropdown-item href="#" @click="exitAnnotations" :disabled="!isAnnotationEnabled">{{
        $t('exit')
      }}</b-dropdown-item>
    </b-nav-item-dropdown>
  </b-navbar-nav>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapActions, mapGetters, mapState } from 'vuex';
import { saveAs } from 'file-saver';

export default Vue.extend({
  computed: {
    ...mapGetters(['isAnnotationEnabled']),
    ...mapState(['metadata', 'annotations'])
  },
  methods: {
    ...mapActions(['enableAnnotations', 'disableAnnotations', 'importAnnotations']),
    newAnnotations(): void {
      this.enableAnnotations();
    },
    openAnnotations(): void {
      const input: HTMLInputElement = document.createElement('input');
      input.type = 'file';
      input.accept = '.json';
      input.onchange = () => {
        if (input.files === null || input.files.length !== 1) {
          return;
        }

        const file = input.files[0];
        const reader = new FileReader();

        reader.onload = event => {
          if (event.target === null) {
            return;
          }
          this.importAnnotations(JSON.parse(event.target.result as string));
        };

        reader.readAsText(file);
      };
      input.click();
    },
    saveAnnotations(): void {
      const json = JSON.stringify(this.annotations);
      const filename = this.metadata.htsFile.uri.replace('.vcf.gz', '').replace('.vcf', '') + '_annotations.json';
      const blob = new Blob([json], { type: 'application/json' });
      saveAs(blob, filename);
    },
    exitAnnotations(): void {
      this.disableAnnotations();
    }
  }
});
</script>
