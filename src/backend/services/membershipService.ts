import { db, auth } from '@/lib/firebase';
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
import { signInAnonymously } from 'firebase/auth';
import { Membership } from '../types';

const COLLECTION_NAME = 'memberships';

// Helper to remove undefined values
const cleanData = (data: Record<string, any>) => {
  const cleaned: Record<string, any> = {};
  Object.keys(data).forEach(key => {
    if (data[key] !== undefined) {
      cleaned[key] = data[key];
    }
  });
  return cleaned;
};

// Ensure an authenticated session exists (for rules that require auth != null)
const ensureAuth = async () => {
  if (!auth.currentUser) {
    try {
      await signInAnonymously(auth);
    } catch (error) {
      console.error("Error signing in anonymously:", error);
    }
  }
};

export const membershipService = {
  // Create a new membership
  create: async (data: Omit<Membership, 'id' | 'createdAt' | 'updatedAt'>) => {
    await ensureAuth();
    const cleanedData = cleanData(data);
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...cleanedData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return { id: docRef.id, ...data };
  },

  // Get all memberships
  getAll: async (): Promise<Membership[]> => {
    // Read usually doesn't require auth in many rules, but good to have
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
    await ensureAuth();
    const cleanedData = cleanData(data);
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      ...cleanedData,
      updatedAt: Timestamp.now(),
    });
    return { id, ...data };
  },

  // Delete a membership
  delete: async (id: string) => {
    await ensureAuth();
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
    return true;
  }
};