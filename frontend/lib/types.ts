export const AREAS = [
  { value: 'DEMATAGODA', label: 'Dematagoda' },
  { value: 'KURULOPANA', label: 'Kirulapone' },
  { value: 'VATALA', label: 'Wattala' },
  { value: 'VALAVATA', label: 'Wellawatte' },
  { value: 'KOTEJENA', label: 'Kotahena' },
] as const;

export type AreaValue = (typeof AREAS)[number]['value'];

export interface Camper {
  id: string;
  fullName: string;
  age: number;
  area: AreaValue;
  mobileNumber: string;
  school: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  parentsName: string;
  telephoneNumberOfParents: string;
  religion: string;
  createdAt: string;
}

export interface CreateCamperInput {
  fullName: string;
  age: number;
  area: AreaValue;
  mobileNumber: string;
  school: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  parentsName: string;
  telephoneNumberOfParents: string;
  religion: string;
}

export function areaLabel(value: string): string {
  return AREAS.find((a) => a.value === value)?.label ?? value;
}
