import * as pedigreeMapper from '@/helpers/pedigreeMapper';
import { Family } from '@/types/Pedigree';
import { assignGenerations } from '@/helpers/pedigreeMapper';

describe('PedigreeMapper', () => {
  const family: Family = {
    '1': {
      familyId: '1',
      individualId: '1',
      paternalId: '3',
      maternalId: '2',
      sex: 'FEMALE',
      affectedStatus: 'MISSING'
    },
    '2': {
      familyId: '1',
      individualId: '2',
      paternalId: '5',
      maternalId: '4',
      sex: 'FEMALE',
      affectedStatus: 'MISSING'
    },
    '3': {
      familyId: '1',
      individualId: '3',
      paternalId: '6',
      maternalId: '7',
      sex: 'MALE',
      affectedStatus: 'MISSING'
    },
    '4': {
      familyId: '1',
      individualId: '4',
      paternalId: '0',
      maternalId: '0',
      sex: 'MALE',
      affectedStatus: 'MISSING'
    },
    '5': {
      familyId: '1',
      individualId: '5',
      paternalId: '0',
      maternalId: '0',
      sex: 'FEMALE',
      affectedStatus: 'MISSING'
    },
    '6': {
      familyId: '1',
      individualId: '6',
      paternalId: '0',
      maternalId: '0',
      sex: 'MALE',
      affectedStatus: 'MISSING'
    },
    '7': {
      familyId: '1',
      individualId: '7',
      paternalId: '10',
      maternalId: '11',
      sex: 'FEMALE',
      affectedStatus: 'MISSING'
    },
    '8': {
      familyId: '1',
      individualId: '8',
      paternalId: '10',
      maternalId: '11',
      sex: 'MALE',
      affectedStatus: 'MISSING'
    },
    '9': {
      familyId: '1',
      individualId: '9',
      paternalId: '10',
      maternalId: '11',
      sex: 'FEMALE',
      affectedStatus: 'MISSING'
    },
    '10': {
      familyId: '1',
      individualId: '10',
      paternalId: '0',
      maternalId: '13',
      sex: 'MALE',
      affectedStatus: 'MISSING'
    },
    '11': {
      familyId: '1',
      individualId: '11',
      paternalId: '17',
      maternalId: '0',
      sex: 'FEMALE',
      affectedStatus: 'MISSING'
    },
    '12': {
      familyId: '1',
      individualId: '12',
      paternalId: '3',
      maternalId: '2',
      sex: 'MALE',
      affectedStatus: 'MISSING'
    },
    '13': {
      familyId: '1',
      individualId: '13',
      paternalId: '0',
      maternalId: '0',
      sex: 'FEMALE',
      affectedStatus: 'MISSING'
    },
    '14': {
      familyId: '1',
      individualId: '14',
      paternalId: '0',
      maternalId: '0',
      sex: 'MALE',
      affectedStatus: 'MISSING'
    },
    '15': {
      familyId: '1',
      individualId: '15',
      paternalId: '14',
      maternalId: '9',
      sex: 'FEMALE',
      affectedStatus: 'MISSING'
    },
    '16': {
      familyId: '1',
      individualId: '16',
      paternalId: '6',
      maternalId: '7',
      sex: 'MALE',
      affectedStatus: 'MISSING'
    },
    '17': {
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
      const is_orphan = pedigreeMapper.isOrphan(family['17']);
      expect(is_orphan).toBe(true);
    });
    it('should return false when at least one of the parents is defined', () => {
      const is_orphan = pedigreeMapper.isOrphan(family['1']);
      expect(is_orphan).toBe(false);
    });
  });
  describe('calculateDepthPerPerson', () => {
    it('should return the correct generation for persons without children', () => {
      const depths = pedigreeMapper.calculateDepthPerPerson(family);
      expect(depths[3]).toContain('8');
      expect(depths[4]).toContain('15');
      expect(depths[4]).toContain('16');
      expect(depths[5]).toContain('1');
      expect(depths[5]).toContain('12');
    });
  });
  describe('getPeopleWithoutChildren', () => {
    it('should return the people without children', () => {
      const parents = ['2', '3', '4', '5', '6', '7', '9', '10', '11', '13', '14', '17'];
      const people_without_children = pedigreeMapper.getPeopleWithoutChildren(family, parents);
      const expected = ['1', '8', '12', '15', '16'];
      expect(people_without_children).toEqual(expected);
    });
  });
  describe('assignGenerations', () => {
    it('should assign correct generation to each person in family', () => {
      const people_without_children = ['1', '8', '12', '15', '16'];
      const depths = {
        1: ['4', '5', '6', '13', '14', '17'],
        2: ['2', '10', '11'],
        3: ['7', '8', '9'],
        4: ['3', '15', '16'],
        5: ['1', '12']
      };
      const generations = pedigreeMapper.assignGenerations(people_without_children, family, depths);
      const expected = {
        1: ['0-17', '13-0'],
        2: ['11-10'],
        3: ['4-5', '7-6', '9-14'],
        4: ['2-3'],
        5: []
      };
      expect(generations).toEqual(expected);
    });
  });
  describe('mapGenerationsFromFamily', () => {
    it('', () => {
      const actual = pedigreeMapper.mapGenerationsFromFamily(family);
      const expected = {
        couples: {
          '2-3': ['1', '12'],
          '4-5': ['2'],
          '7-6': ['3', '16'],
          '11-10': ['7', '8', '9'],
          '0-17': ['11'],
          '13-0': ['10'],
          '9-14': ['15']
        },
        generations: {
          1: ['0-17', '13-0'],
          2: ['11-10'],
          3: ['4-5', '7-6', '9-14'],
          4: ['2-3'],
          5: []
        }
      };
      expect(actual).toEqual(expected);
    });
  });
});
