import { SiteData } from '@/types';

export const siteData: SiteData = {
  general: {
    name: "FONUS CEBU",
    fullName: "FONUS CEBU FEDERATION COOPERATIVE",
    taglineLocal: "Usa sa labing barato ug Trusted Funeral Services sa Cebu",
    fullContractYears: 5,
    officeHours: "24/7 Service | Office: Mon-Sat 8:00 AM - 5:00 PM",
    registrationNumber: "CDA Reg. No. 9520-07019145"
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
      name: "ROSA PEACE PLAN",
      tier: "Basic Plan",
      price: "₱267",
      contractPrice: "₱16,020",
      spotCash: "₱14,418",
      spotCashSavings: "10%",
      monthlyContractMonths: 60,
      features: [
        "9 Days Home Viewing",
        "Registry of Deceased Information",
        "Tarpaulin & Vigil Candles",
        "Guest Book"
      ],
      color: "bg-base-100",
      image: "/analysis/RosaPeace_v2.png",
    },
    {
      name: "RED ROSE PLAN",
      tier: "Standard Plan",
      price: "₱516",
      contractPrice: "₱30,960",
      spotCash: "₱27,864",
      spotCashSavings: "10%",
      monthlyContractMonths: 60,
      features: [
        "9 Days Home Viewing",
        "2 Certified True Copies of Death Certificate",
        "1 Large Tripod Flower Arrangement",
        "Tribute with Flowers",
        "Registry & Tarpaulin"
      ],
      color: "bg-primary text-white",
      featured: true,
      image: "/analysis/RedRose_v2.png",
    },
    {
      name: "WHITE ROSE PLAN",
      tier: "Premium Plan",
      price: "₱1,075",
      contractPrice: "₱64,500",
      spotCash: "₱58,050",
      spotCashSavings: "10%",
      monthlyContractMonths: 60,
      features: [
        "9 Days Home Viewing",
        "3 Certified True Copies of Death Certificate",
        "2 Large Tripod Flower Arrangements",
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
    { name: "Mariolito Del Castillo", role: "Chairperson", affiliation: "MAVENCO COOP" },
    { name: "Macario Quevedo", role: "Vice Chairperson", affiliation: "CEBU PEOPLES COOP" },
    { name: "Reynaldo Gandionco", role: "Director", affiliation: "FAIRCHILD COOP" }
  ],
  faqs: [
    {
      question: "Is the plan transferable to other people?",
      answer: "Yes, our plans are fully transferable. You can transfer the benefits to any family member or friend in need."
    },
    {
      question: "Are there any age limits for the memorial plans?",
      answer: "We offer plans with no age limit, ensuring that everyone can have peace of mind regarding their future memorial needs."
    },
    {
      question: "Can I upgrade my existing plan later?",
      answer: "Absolutely! Our plans are upgradable. You can start with a basic plan and move to a higher-tier plan as your needs change."
    },
    {
      question: "Is there a contestability period?",
      answer: "One of the unique benefits of FONUS Cebu is that we have no contestability period for our members."
    }
  ],
  testimonials: [
    {
      name: "Maria Santos",
      role: "Cooperative Member",
      content: "FONUS Cebu provided our family with dignified service when we needed it most. Their staff was incredibly supportive and professional.",
      date: "Oct 2024"
    },
    {
      name: "Juan Dela Cruz",
      role: "Policy Holder",
      content: "The monthly payments are very affordable. It gives me peace of mind knowing that everything is already prepared for the future.",
      date: "Jan 2025"
    },
    {
      name: "Elena G.",
      role: "Member",
      content: "Excellent service and very transparent pricing. The spot cash discount was a great help for our budget.",
      date: "Dec 2024"
    }
  ],
  processSteps: [
    {
      title: "Choose Your Plan",
      description: "Select the Rosa Peace, Red Rose, or White Rose plan that fits your family's needs.",
      icon: "Search"
    },
    {
      title: "Submit Inquiry",
      description: "Fill out the simple form or chat with us. We'll handle the paperwork for you.",
      icon: "Send"
    },
    {
      title: "Official Membership",
      description: "Receive your Membership ID and enjoy the security of a Cooperative-backed plan.",
      icon: "ShieldCheck"
    }
  ],
  planningGuide: [
    {
      step: "Immediate Actions",
      action: "Call our 24/7 Hotline",
      details: "In the event of a death, call us immediately at 0943-653-0264. We will guide you through the initial steps."
    },
    {
      step: "Documentation",
      action: "Prepare Valid IDs",
      details: "Have the valid ID of the deceased and the claimant ready. We will assist with the Death Certificate registration."
    },
    {
      step: "Arrangements",
      action: "Choose Service Type",
      details: "Decide between home viewing or chapel viewing. Our team will handle the transport and set-up."
    },
    {
      step: "Support",
      action: "Cooperative Assistance",
      details: "As a member, we will help you process any cash assistance or benefits from your specific cooperative program."
    }
  ]
};
