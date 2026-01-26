import { Inquiry } from '../types';

// In-memory storage (This will be replaced by a real Database later)
const inquiries: Inquiry[] = [];

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
  },

  getById: async (id: string): Promise<Inquiry | undefined> => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return inquiries.find(i => i.id === id);
  },

  update: async (id: string, updates: Partial<Inquiry>): Promise<Inquiry | null> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const index = inquiries.findIndex(i => i.id === id);
    if (index === -1) return null;
    
    inquiries[index] = { ...inquiries[index], ...updates };
    return inquiries[index];
  }
};