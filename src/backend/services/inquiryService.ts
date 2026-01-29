import { db } from '@/lib/firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  getDoc,
  query,
  orderBy
} from 'firebase/firestore';
import { Inquiry } from '../types';

const COLLECTION_NAME = 'inquiries';

export const inquiryService = {
  getAll: async (): Promise<Inquiry[]> => {
    try {
      const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Inquiry));
    } catch (error) {
      console.error("Error fetching inquiries:", error);
      return [];
    }
  },

  create: async (data: Omit<Inquiry, 'id' | 'createdAt' | 'status'>): Promise<Inquiry> => {
    try {
      const newInquiry = {
        ...data,
        createdAt: new Date().toISOString(),
        status: 'NEW'
      };

      const docRef = await addDoc(collection(db, COLLECTION_NAME), newInquiry);
      
      return {
        id: docRef.id,
        ...newInquiry
      } as Inquiry;
    } catch (error) {
      console.error("Error creating inquiry:", error);
      throw error;
    }
  },

  markAsRead: async (id: string): Promise<boolean> => {
    try {
      const inquiryRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(inquiryRef, { status: 'READ' });
      return true;
    } catch (error) {
      console.error("Error marking inquiry as read:", error);
      return false;
    }
  },

  getById: async (id: string): Promise<Inquiry | undefined> => {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Inquiry;
      } else {
        return undefined;
      }
    } catch (error) {
      console.error("Error getting inquiry:", error);
      return undefined;
    }
  },

  update: async (id: string, updates: Partial<Inquiry>): Promise<Inquiry | null> => {
    try {
      const inquiryRef = doc(db, COLLECTION_NAME, id);
      
      // Remove id from updates if present to avoid overwriting document ID
      const { id: _, ...cleanUpdates } = updates as any;
      
      await updateDoc(inquiryRef, cleanUpdates);
      
      // Fetch the updated document to return it
      const updatedSnap = await getDoc(inquiryRef);
      if (updatedSnap.exists()) {
        return { id: updatedSnap.id, ...updatedSnap.data() } as Inquiry;
      }
      return null;
    } catch (error) {
      console.error("Error updating inquiry:", error);
      return null;
    }
  }
};
