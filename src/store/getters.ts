import { State } from '@/types/State';
import { GenomeBrowserDb } from '@/types/GenomeBrowserDb';
import { Annotation } from '@/types/Annotations';
import { Api, Vcf } from '@molgenis/vip-report-api';

export default {
  samples: (state: State): Array<Api.Sample> => {
    if (state.samples === null) {
      return [];
    }

    const items = state.samples.items.slice();
    return items.sort(function (thisSample, thatSample) {
      if (thisSample.person.individualId < thatSample.person.individualId) {
        return -1;
      }
      if (thisSample.person.individualId > thatSample.person.individualId) {
        return 1;
      }
      return 0;
    });
  },
  getSampleById:
    (state: State) =>
    (id: string): Api.Sample | null => {
      if (state.samples === null) {
        return null;
      }
      return state.samples.items.find((sample) => sample.person.individualId === id) || null;
    },
  sampleMaternal: (state: State): Api.Sample | null => {
    if (state.selectedSample === null) {
      return null;
    }
    const maternalId = state.selectedSample.person.maternalId;
    if (maternalId === '0') {
      return null;
    }
    if (state.samples === null) {
      return null;
    }
    return state.samples.items.find((sample) => sample.person.individualId === maternalId) || null;
  },
  samplePaternal: (state: State): Api.Sample | null => {
    if (state.selectedSample === null) {
      return null;
    }
    const paternalId = state.selectedSample.person.paternalId;
    if (paternalId === '0') {
      return null;
    }
    if (state.samples === null) {
      return null;
    }
    return state.samples.items.find((sample) => sample.person.individualId === paternalId) || null;
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
    return state.metadata !== null && state.metadata.records.info['CAP'] !== undefined;
  },
  hasConsequences: (state: State): boolean => {
    return (
      state.metadata !== null &&
      (state.metadata.records.info['CSQ'] !== undefined || state.metadata.records.info['ANN']) !== undefined
    );
  },
  isAnnotationEnabled: (state: State): boolean => {
    return state.annotations !== null;
  },
  getAnnotation:
    (state: State) =>
    (record: Vcf.Record): Annotation => {
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
   * Returns whether records contain mvl annotations.
   */
  isRecordsContainMvl: (state: State): boolean => {
    let hasMvl;
    if (state.metadata === null) {
      hasMvl = false;
    } else {
      const csqInfo = state.metadata.records.info['CSQ'];
      if (csqInfo === undefined) {
        hasMvl = false;
      } else {
        if (csqInfo.nested === undefined) {
          hasMvl = false;
        } else {
          hasMvl = csqInfo.nested.items.some((item) => item.id === 'VKGL_UMCG');
        }
      }
    }
    return hasMvl;
  },
  /**
   * Returns whether records contain phenotype associations.
   */
  isRecordsContainPhenotypes: (state: State): boolean => {
    let hasPhenotypeAssociations;
    if (state.metadata === null) {
      hasPhenotypeAssociations = false;
    } else {
      const csqInfo = state.metadata.records.info['CSQ'];
      if (csqInfo === undefined) {
        hasPhenotypeAssociations = false;
      } else {
        if (csqInfo.nested === undefined) {
          hasPhenotypeAssociations = false;
        } else {
          hasPhenotypeAssociations = csqInfo.nested.items.some((item) => item.id === 'HPO');
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
      const vimFormat = state.metadata.records.format['VIM'];
      hasSampleInheritance = vimFormat !== undefined;
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
      const vimFormat = state.metadata.records.format['VID'];
      hasSampleInheritance = vimFormat !== undefined;
    }
    return hasSampleInheritance;
  },
  /**
   * Returns whether records contain read depth information.
   */
  isSamplesContainDepth: (state: State): boolean => {
    let hasReadDepth;
    if (state.metadata === null) {
      hasReadDepth = false;
    } else {
      const dpFormat = state.metadata.records.format['DP'];
      hasReadDepth = dpFormat !== undefined;
    }
    return hasReadDepth;
  }
};
