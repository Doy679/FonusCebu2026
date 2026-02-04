import { db } from '@/lib/firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDoc, 
  orderBy, 
  query, 
  Timestamp 
} from 'firebase/firestore';
import { Membership } from '../types';

const COLLECTION_NAME = 'memberships';

export const membershipService = {
  // Create a new membership
  create: async (data: Omit<Membership, 'id' | 'createdAt' | 'updatedAt'>) => {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...data,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return { id: docRef.id, ...data };
  },

  // Get all memberships
  getAll: async (): Promise<Membership[]> => {
    const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.().toISOString() || new Date().toISOString(),
        updatedAt: data.updatedAt?.toDate?.().toISOString() || new Date().toISOString(),
      } as Membership;
    });
  },

  // Get a single membership by ID
  getById: async (id: string): Promise<Membership | null> => {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        createdAt: data.createdAt?.toDate?.().toISOString(),
        updatedAt: data.updatedAt?.toDate?.().toISOString(),
      } as Membership;
    }
    return null;
  },

  // Update a membership
  update: async (id: string, data: Partial<Membership>) => {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now(),
    });
    return { id, ...data };
  },

  // Delete a membership
  delete: async (id: string) => {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
    return true;
  }
};
