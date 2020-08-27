import { Person } from '@molgenis/vip-report-api';
import { Family, Generations } from '@/types/Pedigree';
import { max } from './numberUtils';

const parents: Array<string> = [];
const couples: { [key: string]: Array<string> } = {};

export const isOrphan = (person: Person) => {
  return person.maternalId === '0' && person.paternalId === '0';
};

const makeParent = (parent: string) => {
  if (parent != '0' && !parents.includes(parent)) {
    parents.push(parent);
  }
};

const assignParents = (father: string, mother: string, child: string) => {
  makeParent(father);
  makeParent(mother);
  const couple = mother + '-' + father;
  if (!(couple in couples)) {
    couples[couple] = [child];
  } else if (!couples[couple].includes(child)) {
    couples[couple].push(child);
  }
};

const determineDepth = (
  depth: number,
  personId: string,
  possibleDepth: Array<number>,
  family: Family,
  partnerId: string | null
) => {
  /**
   * This method will determine the depth of the person in the pedigree. It's not the same as generations because
   * orphans will be assigned to depth 1. Because we don't have the complete tree when going through the data for
   * the first time we are not able to recover all family relations and generations. The depth assigned to persons
   * without children will however be equal to their generation.
   * */
  const person = family[personId];
  if (isOrphan(person)) {
    if (!partnerId || isOrphan(family[partnerId])) {
      possibleDepth.push(depth);
    } else {
      determineDepth(depth + 1, partnerId, possibleDepth, family, null);
    }
  } else {
    determineDepthForNextPerson(person.paternalId, person.maternalId, personId, possibleDepth, depth + 1, family);
    if (partnerId && !isOrphan(family[partnerId])) {
      const partner = family[partnerId];
      determineDepthForNextPerson(partner.paternalId, partner.maternalId, partnerId, possibleDepth, depth + 1, family);
    }
  }
  return max(possibleDepth);
};

const determineDepthForNextPerson = (
  father: string,
  mother: string,
  person: string,
  possibleGenerations: Array<number>,
  depth: number,
  family: Family
) => {
  assignParents(father, mother, person);
  if (mother === '0') {
    determineDepth(depth, father, possibleGenerations, family, null);
  } else if (father === '0') {
    determineDepth(depth, mother, possibleGenerations, family, null);
  } else {
    determineDepth(depth, mother, possibleGenerations, family, father);
  }
};

const calculateDepthPerPerson = (family: Family) => {
  const depths: Generations = {};
  Object.keys(family).map((personId: string) => {
    const depth = determineDepth(1, personId, [], family, null);
    if (!(depth in depths)) {
      depths[depth] = [personId];
    } else {
      depths[depth].push(personId);
    }
  });
  return depths;
};

const getPeopleWithoutChildren = (family: Family, parents: Array<string>) => {
  return Object.keys(family).filter(person => {
    return !parents.includes(person);
  });
};

const getGenerationForPersonWithoutChildren = (personId: string, depths: Generations) => {
  let generation = 0;
  Object.keys(depths).map(depth => {
    if (depths[parseInt(depth)].includes(personId)) {
      generation = parseInt(depth);
    }
  });
  return generation;
};

const assignNextGeneration = (
  parent: string,
  generation: number,
  couplesPerGeneration: Generations,
  family: Family
) => {
  if (parent !== '0' && generation > 1) {
    const mother = family[parent].maternalId;
    const father = family[parent].paternalId;
    assignGeneration(mother, father, generation, couplesPerGeneration, family);
  }
};

const assignGeneration = function(
  mother: string,
  father: string,
  generation: number,
  couplesPerGeneration: Generations,
  family: Family
) {
  generation = generation - 1;
  const couple = mother + '-' + father;
  if (couple !== '0-0') {
    const generations = Object.keys(couplesPerGeneration).map(key => parseInt(key));
    if (!generations.includes(generation)) {
      couplesPerGeneration[generation] = [couple];
    }
    if (!couplesPerGeneration[generation].includes(couple)) {
      couplesPerGeneration[generation].push(couple);
    }
    assignNextGeneration(mother, generation, couplesPerGeneration, family);
    assignNextGeneration(father, generation, couplesPerGeneration, family);
  }
};

const assignGenerations = (peopleWithoutChildren: Array<string>, family: Family, depths: Generations) => {
  const generations = Object.keys(depths).map(key => parseInt(key));
  const couplesPerGeneration: Generations = generations.reduce((obj, key) => ({ ...obj, [key]: [] }), {});
  peopleWithoutChildren.map(person => {
    const gen = getGenerationForPersonWithoutChildren(person, depths);
    const generation = gen ? gen : 0;
    assignGeneration(family[person].maternalId, family[person].paternalId, generation, couplesPerGeneration, family);
  });
  return couplesPerGeneration;
};

const mapGenerationsFromFamily = (family: Family) => {
  const depths = calculateDepthPerPerson(family);
  const peopleWithoutChildren = getPeopleWithoutChildren(family, parents);
  const generations = assignGenerations(peopleWithoutChildren, family, depths);
  return { couples, generations };
};

export {
  assignGeneration,
  mapGenerationsFromFamily,
  assignGenerations,
  getPeopleWithoutChildren,
  calculateDepthPerPerson
};
