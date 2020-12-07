import { State } from '@/types/State';
import { GenomeBrowserDb } from '@/types/GenomeBrowserDb';
import { Record, Sample } from '@molgenis/vip-report-api';
import { Annotation } from '@/types/Annotations';

export default {
  samples: (state: State): Array<Sample> => {
    if (state.samples === null) {
      return [];
    }

    const items = state.samples.items.slice();
    return items.sort(function(thisSample, thatSample) {
      if (thisSample.person.individualId < thatSample.person.individualId) {
        return -1;
      }
      if (thisSample.person.individualId > thatSample.person.individualId) {
        return 1;
      }
      return 0;
    });
  },
  getSampleById: (state: State) => (id: string): Sample | null => {
    if (state.samples === null) {
      return null;
    }
    return state.samples.items.find(sample => sample.person.individualId === id) || null;
  },
  genomeBrowserDb: (state: State): GenomeBrowserDb | null => {
    if (state.metadata === null) {
      return null;
    }

    let genomeBrowserDb: GenomeBrowserDb | null;
    switch (state.metadata.htsFile.genomeAssembly) {
      case 'NCBI34':
        genomeBrowserDb = GenomeBrowserDb.hg16;
        break;
      case 'NCBI35':
        genomeBrowserDb = GenomeBrowserDb.hg17;
        break;
      case 'NCBI36':
        genomeBrowserDb = GenomeBrowserDb.hg18;
        break;
      case 'GRCh37':
        genomeBrowserDb = GenomeBrowserDb.hg19;
        break;
      case 'GRCh38':
        genomeBrowserDb = GenomeBrowserDb.hg38;
        break;
      case 'UNKNOWN':
      default:
        genomeBrowserDb = null;
        break;
    }

    return genomeBrowserDb;
  },
  hasCapice: (state: State): boolean => {
    return state.metadata !== null && state.metadata.records.info.find(item => item.id === 'CAP') !== undefined;
  },
  hasMvl: (state: State): boolean => {
    return state.metadata !== null && state.metadata.records.info.find(item => item.id === 'MVL') !== undefined;
  },
  hasVkgl: (state: State): boolean => {
    return state.metadata !== null && state.metadata.records.info.find(item => item.id === 'VKGL') !== undefined;
  },
  hasConsequences: (state: State): boolean => {
    return (
      state.metadata !== null &&
      state.metadata.records.info.find(item => item.id === 'CSQ' || item.id === 'ANN') !== undefined
    );
  },
  isAnnotationEnabled: (state: State): boolean => {
    return state.annotations !== null;
  },
  getAnnotation: (state: State) => (record: Record): Annotation => {
    if (state.annotations === null) {
      throw 'Annotations disabled';
    }
    if (state.selectedSample == null) {
      throw 'No sample selected';
    }

    const sampleId = state.selectedSample.person.individualId;
    const key = `${sampleId}_${record.c}_${record.p}_${record.r}_${record.a.join(',')}`;
    let annotation = state.annotations[key];
    if (annotation === undefined) {
      annotation = {
        sampleId: sampleId,
        chr: record.c,
        pos: record.p,
        ref: record.r,
        alt: record.a,
        geneMatch: null,
        class: null,
        txt: null
      };
    }
    return annotation;
  },
  /**
   * Returns whether records contain phenotype associations.
   */
  isRecordsContainPhenotypes: (state: State): boolean => {
    let hasPhenotypeAssociations;
    if (state.metadata === null) {
      hasPhenotypeAssociations = false;
    } else {
      const csqInfo = state.metadata.records.info.find(item => item.id === 'CSQ');
      if (csqInfo === undefined) {
        hasPhenotypeAssociations = false;
      } else {
        if (csqInfo.nested === undefined) {
          hasPhenotypeAssociations = false;
        } else {
          hasPhenotypeAssociations = csqInfo.nested.some(item => item.id === 'HPO');
        }
      }
    }
    return hasPhenotypeAssociations;
  },
  /**
   * Returns whether records contain inheritance matching information.
   */
  isSamplesContainInheritance: (state: State): boolean => {
    let hasSampleInheritance;
    if (state.metadata === null) {
      hasSampleInheritance = false;
    } else {
      const vimFormat = state.metadata.records.format.find(item => item.id === 'VIM');
      hasSampleInheritance = vimFormat !== undefined
    }
    return hasSampleInheritance;
  },
  /**
   * Returns whether records contain denovo information.
   */
  isSamplesContainDenovo: (state: State): boolean => {
    let hasSampleInheritance;
    if (state.metadata === null) {
      hasSampleInheritance = false;
    } else {
      const vimFormat = state.metadata.records.format.find(item => item.id === 'VID');
      hasSampleInheritance = vimFormat !== undefined
    }
    return hasSampleInheritance;
  }
};
