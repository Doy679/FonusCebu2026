export interface SiteData {
  general: GeneralData;
  hero: HeroData;
  about: AboutData;
  packages: PackageData[];
  programs: ProgramData[];
  benefits: string[];
  offers: string[];
  contact: ContactData;
  board: BoardMember[];
  faqs?: FAQData[];
  testimonials?: TestimonialData[];
  processSteps?: ProcessStep[];
  planningGuide?: PlanningGuideItem[];
  }

  export interface PlanningGuideItem {
  step: string;
  action: string;
  details: string;
  }

  export interface ProcessStep {
  title: string;
  description: string;
  icon: string;
  }

  export interface FAQData {
  question: string;
  answer: string;
  }

  export interface TestimonialData {
  name: string;
  role: string;
  content: string;
  date: string;
  }

  export interface GeneralData {
  name: string;
  fullName: string;
  taglineLocal?: string;
  fullContractYears?: number;
  officeHours?: string;
  registrationNumber?: string;
  }

  export interface HeroData {
  badge: string;
  title: string;
  subtitle: string;
  buttonText: string;
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
  tier?: string; // e.g. "Basic Plan"
  price: string; // Used for display (usually monthly)
  contractPrice?: string;
  spotCash?: string;
  spotCashSavings?: string; // Percentage e.g. "10%"
  monthlyContractMonths?: number; // e.g. 60
  features: string[];
  color: string;
  featured?: boolean;
  image?: string;
}

export interface ProgramData {
  name: string;
  description: string;
  details: string[];
}

export interface ContactData {
  address: string;
  email: string;
  emails?: string[];
  phone: string[];
  website: string;
  facebook?: string;
}

export interface BoardMember {
  name: string;
  role?: string;
  affiliation: string;
  image?: string;
}
