export interface SiteData {
  general: GeneralData;
  hero: HeroData;
  about: AboutData;
  packages: PackageData[];
  contact: ContactData;
  board: BoardMember[];
}

export interface GeneralData {
  name: string;
  fullName: string;
}

export interface HeroData {
  title: string;
  subtitle: string;
  buttonText: string;
  badge?: string;
}

export interface AboutData {
  vision: string;
  mission: string;
  history: string;
  coreValues: CoreValue[];
  valuesList: string[];
  humaneValues?: HumaneValue[];
}

export interface CoreValue {
  letter: string;
  meaning: string;
}

export interface HumaneValue {
  letter: string;
  word: string;
}

export interface PackageData {
  name: string;
  price: string;
  features: string[];
  color: string;
  featured?: boolean;
}

export interface ContactData {
  address: string;
  email: string;
  phone: string[];
  website: string;
}

export interface BoardMember {
  name: string;
  affiliation: string;
}
