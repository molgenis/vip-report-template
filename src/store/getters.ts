import { State } from '@/types/State';
import { GenomeBrowserDb } from '@/types/GenomeBrowserDb';
import { Sample } from '@molgenis/vip-report-api';

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
  hasVkgl: (state: State): boolean => {
    return state.metadata !== null && state.metadata.records.info.find(item => item.id === 'VKGL') !== undefined;
  },
  hasConsequences: (state: State): boolean => {
    return (
      state.metadata !== null &&
      state.metadata.records.info.find(item => item.id === 'CSQ' || item.id === 'ANN') !== undefined
    );
  }
};
