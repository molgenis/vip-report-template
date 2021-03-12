<template>
  <GeneMatchAnnotation v-if="type === 'geneMatch'" :value="annotation.geneMatch" @update="onUpdate" />
  <ClassificationAnnotation v-else-if="type === 'class'" :value="annotation.class" @update="onUpdate" />
  <NotesAnnotation v-else-if="type === 'notes'" :value="annotation.txt" @update="onUpdate" />
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { Annotation } from '@/types/Annotations';
import GeneMatchAnnotation from '@/components/annotation/GeneMatchAnnotation.vue';
import ClassificationAnnotation from '@/components/annotation/ClassificationAnnotation.vue';
import NotesAnnotation from '@/components/annotation/NotesAnnotation.vue';
import { mapActions } from 'vuex';

export default Vue.extend({
  components: { ClassificationAnnotation, GeneMatchAnnotation, NotesAnnotation },
  props: {
    annotation: { type: Object as PropType<Annotation> },
    type: {
      validator: function (value: string) {
        return ['geneMatch', 'class', 'notes'].indexOf(value) !== -1;
      }
    }
  },
  methods: {
    ...mapActions(['upsertAnnotation']),
    onUpdate(value: string) {
      const annotation: Annotation = Object.assign({}, this.annotation);
      switch (this.type) {
        case 'geneMatch':
          annotation.geneMatch = value;
          break;
        case 'class':
          annotation.class = value;
          break;
        case 'notes':
          annotation.txt = value;
          break;
        default:
          throw "unknown type '" + this.type + "'";
      }
      this.upsertAnnotation(annotation);
    }
  }
});
</script>
