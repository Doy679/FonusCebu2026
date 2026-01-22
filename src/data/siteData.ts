import { SiteData } from '@/types';

export const siteData: SiteData = {
  general: {
    name: "FONUS CEBU",
    fullName: "FONUS CEBU FEDERATION COOPERATIVE",
  },
  hero: {
    badge: "Region 7's Pioneer",
    title: "WE VALUE HUMAN DIGNITY",
    subtitle: "We are a federation cooperative dedicated to providing decent and affordable memorial services. Experience the warmth and reliability of true cooperation.",
    buttonText: "View Packages",
  },
  about: {
    vision: "THE MOST TRUSTED FUNERAL AND MEMORIAL PROVIDER IN OUR COUNTRY.",
    mission: "PROVIDER OF THE DECENT YET AFFORDABLE AND DIGNIFIED FUNERAL AND MEMORIAL SERVICES.",
    history: "IS A SWEDISH BRAND OF \"FUNERAL SERVICES\". IT WAS ORGANIZED IN CEBU SEPTEMBER 2009 AND CDA REGISTERED ON JULY 2011.",
    coreValues: [],
    valuesList: [],
    humaneValues: [
      { letter: "H", word: "HOLISTIC" },
      { letter: "U", word: "UNFORGETTABLE" },
      { letter: "M", word: "MEANINGFUL" },
      { letter: "A", word: "AFFORDABLE" },
      { letter: "N", word: "NATURE AND" },
      { letter: "E", word: "ENVIRONMENT FRIENDLY SERVICES" }
    ]
  },
  packages: [
    {
      name: "Mercury",
      price: "₱600",
      features: [
        "Service Value: 20K",
        "Natural Death: 10K",
        "Accidental: 70K"
      ],
      color: "bg-base-100"
    },
    {
      name: "Mars",
      price: "₱1,400",
      features: [
        "Service Value: 80K",
        "Natural Death: 10K",
        "Accidental: 130K"
      ],
      color: "bg-primary text-white",
      featured: true
    },
    {
      name: "Jupiter",
      price: "₱1,700",
      features: [
        "Service Value: 100K",
        "Natural Death: 10K",
        "Accidental: 150K"
      ],
      color: "bg-base-100"
    }
  ],
  contact: {
    address: "R. Colina St., Ibabao-Estancia, Mandaue City, Cebu",
    email: "fonuscebufc@gmail.com",
    phone: ["(032) 272-2493", "(032) 272-2433"],
    website: "https://cjdomingo08.wixsite.com/fonuscebu"
  },
  board: [
    { name: "Mariolito Del Castillo", affiliation: "MAVENCO COOP" },
    { name: "Macario Quevedo", affiliation: "CEBU PEOPLES COOP" },
    { name: "Reynaldo Gandionco", affiliation: "FAIRCHILD COOP" }
  ]
};
