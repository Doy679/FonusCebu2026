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
  