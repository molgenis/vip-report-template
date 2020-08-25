import * as pedigreeMapper from '@/helpers/pedigreeMapper';
import { Family } from '@/types/Pedigree';

describe('PedigreeMapper', () => {
  const family: Family = {
    1: {
      familyId: '1',
      individualId: '1',
      paternalId: '3',
      maternalId: '2',
      sex: 'FEMALE',
      affectedStatus: 'MISSING'
    },
    2: {
      familyId: '1',
      individualId: '2',
      paternalId: '5',
      maternalId: '4',
      sex: 'FEMALE',
      affectedStatus: 'MISSING'
    },
    3: {
      familyId: '1',
      individualId: '3',
      paternalId: '6',
      maternalId: '7',
      sex: 'MALE',
      affectedStatus: 'MISSING'
    },
    4: {
      familyId: '1',
      individualId: '4',
      paternalId: '0',
      maternalId: '0',
      sex: 'MALE',
      affectedStatus: 'MISSING'
    },
    5: {
      familyId: '1',
      individualId: '5',
      paternalId: '0',
      maternalId: '0',
      sex: 'FEMALE',
      affectedStatus: 'MISSING'
    },
    6: {
      familyId: '1',
      individualId: '6',
      paternalId: '0',
      maternalId: '0',
      sex: 'MALE',
      affectedStatus: 'MISSING'
    },
    7: {
      familyId: '1',
      individualId: '7',
      paternalId: '10',
      maternalId: '11',
      sex: 'FEMALE',
      affectedStatus: 'MISSING'
    },
    8: {
      familyId: '1',
      individualId: '8',
      paternalId: '10',
      maternalId: '11',
      sex: 'MALE',
      affectedStatus: 'MISSING'
    },
    9: {
      familyId: '1',
      individualId: '9',
      paternalId: '11',
      maternalId: '10',
      sex: 'FEMALE',
      affectedStatus: 'MISSING'
    },
    10: {
      familyId: '1',
      individualId: '10',
      paternalId: '0',
      maternalId: '13',
      sex: 'MALE',
      affectedStatus: 'MISSING'
    },
    11: {
      familyId: '1',
      individualId: '11',
      paternalId: '17',
      maternalId: '0',
      sex: 'FEMALE',
      affectedStatus: 'MISSING'
    },
    12: {
      familyId: '1',
      individualId: '12',
      paternalId: '3',
      maternalId: '2',
      sex: 'MALE',
      affectedStatus: 'MISSING'
    },
    13: {
      familyId: '1',
      individualId: '13',
      paternalId: '0',
      maternalId: '0',
      sex: 'FEMALE',
      affectedStatus: 'MISSING'
    },
    14: {
      familyId: '1',
      individualId: '14',
      paternalId: '0',
      maternalId: '0',
      sex: 'MALE',
      affectedStatus: 'MISSING'
    },
    15: {
      familyId: '1',
      individualId: '15',
      paternalId: '14',
      maternalId: '9',
      sex: 'FEMALE',
      affectedStatus: 'MISSING'
    },
    16: {
      familyId: '1',
      individualId: '16',
      paternalId: '6',
      maternalId: '7',
      sex: 'MALE',
      affectedStatus: 'MISSING'
    },
    17: {
      familyId: '1',
      individualId: '17',
      paternalId: '0',
      maternalId: '0',
      sex: 'MALE',
      affectedStatus: 'MISSING'
    }
  };
  describe('isOrphan', () => {
    it('should return true when parents are both 0', () => {
      const isOrphan = pedigreeMapper.isOrphan(family['17']);
      expect(isOrphan).toBe(true)
    });
    it('should return false when at least one of the parents is defined', () => {
      const isOrphan = pedigreeMapper.isOrphan(family['1']);
      expect(isOrphan).toBe(false)
    });
  });
});
