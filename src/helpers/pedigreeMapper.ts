import { Person } from '@molgenis/vip-report-api';
import { Family, Depths } from '@/types/Pedigree';
import { max } from './utils';

let parents: Array<string> = [];
let couples: { [key: string]: Array<string> } = {};

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

const determineDepthForNextPerson = (father: string, mother: string, person: string,
                                     possible_generations: Array<number>, depth: number, family: Family) => {
  assignParents(father, mother, person);
  if (mother === '0') {
    determineDepth(depth, father, possible_generations, family, null);
  } else if (father === '0') {
    determineDepth(depth, mother, possible_generations, family, null);
  } else {
    determineDepth(depth, mother, possible_generations, family, father);
  }

};

const determineDepth = (depth: number, person_id: string, possible_depth: Array<number>, family: Family,
                        partner_id: string | null) => {
  /**
   * This method will determine the depth of the person in the pedigree. It's not the same as generations because
   * orphans will be assigned to depth 1. Because we don't have the complete tree when going through the data for
   * the first time we are not able to recover all family relations and generations. The depth assigned to persons
   * without children will however be equal to their generation.
   * */
  const person = family[person_id];
  if (isOrphan(person)) {
    if (!partner_id || isOrphan(family[partner_id])) {
      possible_depth.push(depth);
    } else {
      determineDepth(depth + 1, partner_id, possible_depth, family, null);
    }
  } else {
    determineDepthForNextPerson(person.paternalId, person.maternalId, person_id, possible_depth,
      depth + 1, family);
    if (partner_id && !isOrphan(family[partner_id])) {
      const partner = family[partner_id];
      determineDepthForNextPerson(partner.paternalId, partner.maternalId, partner_id,
        possible_depth, depth + 1, family);
    }
  }
  return max(possible_depth);
};

export const calculateDepthPerPerson = (family: Family) => {
  let depths: Depths = {};
  Object.keys(family).map((person_id: string) => {
    const depth = determineDepth(1, person_id, [], family, null)
    if (!(depth in depths)) {
      depths[depth] = [person_id]
    } else {
      depths[depth].push(person_id)
    }
  });
  return depths;
};

export const getPeopleWithoutChildren = (family: Family, parents: Array<string>) => {
  return Object.keys(family).filter((person)=> {
    return !parents.includes(person)
  })
}
