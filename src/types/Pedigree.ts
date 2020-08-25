import { Person } from '@molgenis/vip-report-api';

export interface Family {
  [key: string]: Person;
}

export interface Families {
  [key: string]: Family;
}

export interface Depths  { [key: number]: Array<string> };
