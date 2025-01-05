import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, query, where, getDocs, orderBy, limit, Timestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export const saveInteraction = async (data) => {
  try {
    const {
      type,
      content,
      category,
      role = 'user',
      metadata = {},
      timestamp = Timestamp.now(),
      userId = auth.currentUser?.uid || 'anonymous'
    } = data;

    const docRef = await addDoc(collection(db, 'interactions'), {
      type,
      content,
      category,
      role,
      metadata,
      timestamp,
      userId
    });

    return docRef.id;
  } catch (error) {
    console.error('Error saving interaction:', error);
    throw error;
  }
};

export const getInteractionStats = async (userId = 'anonymous') => {
  try {
    const stats = {
      totalChats: 0,
      totalCodeReviews: 0,
      totalResponses: 0,
      categoryDistribution: {},
      dailyActivity: {},
      featureUsage: {}
    };

    const q = query(
      collection(db, 'interactions'),
      where('userId', '==', userId),
      orderBy('timestamp', 'desc'),
      limit(1000)
    );

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      
      // Update totals
      if (data.type === 'chat') stats.totalChats++;
      if (data.type === 'code_review') stats.totalCodeReviews++;
      if (data.role === 'assistant') stats.totalResponses++;

      // Update category distribution
      if (data.category) {
        stats.categoryDistribution[data.category] = (stats.categoryDistribution[data.category] || 0) + 1;
      }

      // Update daily activity
      const date = data.timestamp.toDate().toISOString().split('T')[0];
      stats.dailyActivity[date] = (stats.dailyActivity[date] || 0) + 1;

      // Update feature usage
      if (data.type !== 'feature_selection') {
        stats.featureUsage[data.type] = (stats.featureUsage[data.type] || 0) + 1;
      }
    });

    return stats;
  } catch (error) {
    console.error('Error getting interaction stats:', error);
    throw error;
  }
};

export const searchInteractions = async (userId = 'anonymous', searchQuery = '', type = null) => {
  try {
    let q = query(
      collection(db, 'interactions'),
      where('userId', '==', userId),
      orderBy('timestamp', 'desc')
    );

    if (type) {
      q = query(q, where('type', '==', type));
    }

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs
      .filter(doc => {
        const data = doc.data();
        return !searchQuery || 
          data.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          data.type.toLowerCase().includes(searchQuery.toLowerCase());
      })
      .map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp.toDate()
      }));
  } catch (error) {
    console.error('Error searching interactions:', error);
    throw error;
  }
};

export { db, auth };
