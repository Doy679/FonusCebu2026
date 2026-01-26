import { Inquiry } from '../types';

// In-memory storage (This will be replaced by a real Database later)
const inquiries: Inquiry[] = [
  {
    id: '1',
    name: 'Maria Santos',
    email: 'maria.santos@gmail.com',
    phone: '09171234567',
    address: 'Talisay City, Cebu',
    plan: 'Rosa Peace',
    subject: 'Rosa Peace Plan Inquiry',
    message: 'Good morning, I would like to ask if the Rosa Peace Plan is available for installments? Also, do you have a branch near Talisay City?',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(), // 2 hours ago
    status: 'NEW'
  },
  {
    id: '2',
    name: 'Juan Dela Cruz',
    email: 'juandelacruz@yahoo.com',
    subject: 'Membership Requirements',
    message: 'Hi, I want to become a member of the cooperative. What are the requirements and how much is the initial fee?',
    createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    status: 'READ'
  },
  {
    id: '3',
    name: 'Sarah Lim',
    email: 'slim@company.ph',
    subject: 'Corporate Partnership',
    message: 'We are looking for a funeral service provider for our employees. Do you offer corporate packages?',
    createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    status: 'ARCHIVED'
  }
];

export const inquiryService = {
  getAll: async (): Promise<Inquiry[]> => {
    // Simulate DB delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    return [...inquiries].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  create: async (data: Omit<Inquiry, 'id' | 'createdAt' | 'status'>): Promise<Inquiry> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    const newInquiry: Inquiry = {
      ...data,
      id: Math.random().toString(36).substring(7),
      createdAt: new Date().toISOString(),
      status: 'NEW'
    };
    
    inquiries.push(newInquiry);
    return newInquiry;
  },

  markAsRead: async (id: string): Promise<boolean> => {
    const index = inquiries.findIndex(i => i.id === id);
    if (index !== -1) {
      inquiries[index].status = 'READ';
      return true;
    }
    return false;
  }
};