import { SiteData } from '@/types';

export const siteData: SiteData = {
  general: {
    name: "FONUS CEBU",
    fullName: "FONUS CEBU FEDERATION COOPERATIVE",
    taglineLocal: "Usa sa labing barato ug Trusted Funeral Services sa Cebu"
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
      name: "ROSA PEACE MEMORIAL PLAN",
      price: "₱267",
      contractPrice: "₱16,020",
      spotCash: "₱14,418",
      features: [
        "9 Days Home Viewing",
        "Registry of Deceased Info",
        "Tarpaulin & Vigil Candles",
        "Guest Book"
      ],
      color: "bg-base-100",
      image: "/analysis/RosaPeace_v2.png",
    },
    {
      name: "RED ROSE PLAN",
      price: "₱516",
      contractPrice: "₱30,960",
      spotCash: "₱27,864",
      features: [
        "9 Days Home Viewing",
        "2 CTC of Death Certificate",
        "1 Big Tripod Flowers",
        "Tribute with Flowers",
        "Registry & Tarpaulin"
      ],
      color: "bg-primary text-white",
      featured: true,
      image: "/analysis/RedRose_v2.png",
    },
    {
      name: "WHITE ROSE PLAN",
      price: "₱1,075",
      contractPrice: "₱64,500",
      spotCash: "₱58,050",
      features: [
        "9 Days Home Viewing",
        "3 CTC of Death Certificate",
        "2 Big Tripod Flowers",
        "Tribute with Flowers",
        "Registry & Tarpaulin"
      ],
      color: "bg-base-100",
      image: "/analysis/Whiteflower_v2.png",
    }
  ],
  programs: [
    {
      name: "DIGNITY FAMILY PROGRAM",
      description: "Mortuary Entry Age: 18-64 and 6 months. (Good as New)",
      details: [
        "OPTION 1: 100% Coverage (Annual Premium: P720 - P1,700 depending on age)",
        "OPTION 2: 50% Coverage (Annual Premium: P750 - P850 depending on age)",
        "Includes Funeral Service & Cash Assistance"
      ]
    },
    {
      name: "NOBILITY INDIVIDUAL PROGRAM",
      description: "100% Coverage for ages 18-70 years.",
      details: [
        "Annual Premium: P400 - P500",
        "Funeral Service: P20,000",
        "Cash Assistance: P10,000 - P40,000"
      ]
    }
  ],
  benefits: [
    "No age limit",
    "No contestability period",
    "No medical record required",
    "Transferable",
    "Assignable",
    "Upgradable",
    "Payable in five (5) years",
    "Spot Cash available"
  ],
  offers: [
    "Funeral Services",
    "Chapel Facilities",
    "Documentation and Assessment",
    "Memorial Plan",
    "Transport Services",
    "Casket Packages",
    "24/7 Customer Service Support"
  ],
  contact: {
    address: "Fonus Cebu Bldg. R. Colina St., Ibabao-Estancia, Mandaue City, Cebu",
    email: "mark3ting.fonuscebu@gmail.com",
    emails: ["mark3ting.fonuscebu@gmail.com", "laalvarico.fonus@gmail.com"],
    phone: ["0943-653-0264", "0966-912-5244", "032-427-5863"],
    website: "https://cjdomingo08.wixsite.com/fonuscebu",
    facebook: "https://www.facebook.com/profile.php?id=61579850414509"
  },
  board: [
    { name: "Mariolito Del Castillo", affiliation: "MAVENCO COOP" },
    { name: "Macario Quevedo", affiliation: "CEBU PEOPLES COOP" },
    { name: "Reynaldo Gandionco", affiliation: "FAIRCHILD COOP" }
  ]
};
