import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy,
  limit
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase only once
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

// Firebase CRUD operations
export const firebaseDB = {
  // Create a new document
  create: async (collectionName, data) => {
    try {
      const docRef = await addDoc(collection(db, collectionName), {
        ...data,
        createdAt: new Date().toISOString()
      });
      return docRef.id;
    } catch (error) {
      console.error(`❌ Error creating document in ${collectionName}:`, error);
      throw error;
    }
  },
  
  // Get a document by ID
  get: async (collectionName, id) => {
    try {
      const docRef = doc(db, collectionName, id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      return null;
    } catch (error) {
      console.error(`❌ Error getting document from ${collectionName}:`, error);
      throw error;
    }
  },
  
  // Get all documents in a collection
  getAll: async (collectionName) => {
    try {
      const querySnapshot = await getDocs(collection(db, collectionName));
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error(`❌ Error getting documents from ${collectionName}:`, error);
      throw error;
    }
  },
  
  // Update a document
  update: async (collectionName, id, data) => {
    try {
      const docRef = doc(db, collectionName, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: new Date().toISOString()
      });
      return true;
    } catch (error) {
      console.error(`❌ Error updating document in ${collectionName}:`, error);
      throw error;
    }
  },
  
  // Delete a document
  delete: async (collectionName, id) => {
    try {
      const docRef = doc(db, collectionName, id);
      await deleteDoc(docRef);
      return true;
    } catch (error) {
      console.error(`❌ Error deleting document from ${collectionName}:`, error);
      throw error;
    }
  },
  
  // Query with conditions
  query: async (collectionName, conditions = [], orderByField = null, limitCount = null) => {
    try {
      let q = collection(db, collectionName);
      
      // Add where conditions
      if (conditions && conditions.length > 0) {
        conditions.forEach(condition => {
          q = query(q, where(condition.field, condition.operator, condition.value));
        });
      }
      
      // Add order by
      if (orderByField) {
        q = query(q, orderBy(orderByField, 'desc'));
      }
      
      // Add limit
      if (limitCount) {
        q = query(q, limit(limitCount));
      }
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error(`❌ Error querying ${collectionName}:`, error);
      throw error;
    }
  }
};

export { app, db, auth, storage };