export interface User {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'USER';
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  plan?: string;
  subject: string;
  message: string;
  createdAt: string;
  status: 'NEW' | 'READ' | 'ARCHIVED';
}

export interface MembershipRecord {
  year: string;
  package: string;
  validity: string;
  representative: string;
  remarks: string;
}

export interface Membership {
  id: string;
  // Front of card
  name: string;
  presentAddress: string;
  birthdate: string;
  gender: string;
  coopName: string;
  dateIssued: string;
  imageUrl?: string | null; // For the photo placeholder
  
  // Back of card
  emergencyContact: string; // The "In Case of Emergency" box content
  records: MembershipRecord[]; // The table rows
  
  createdAt: string;
  updatedAt: string;
}
  