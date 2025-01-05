import { db } from '../utils/firebase';
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
  query,
  where,
  orderBy,
  getDocs,
} from 'firebase/firestore';

export const chatService = {
  async createChat(userId, assistant) {
    try {
      const chatRef = await addDoc(collection(db, 'chats'), {
        userId,
        assistant,
        messages: [],
        timestamp: serverTimestamp(),
      });
      return chatRef.id;
    } catch (error) {
      console.error('Error creating chat:', error);
      throw error;
    }
  },

  async addMessage(chatId, message) {
    try {
      const chatRef = doc(db, 'chats', chatId);
      await updateDoc(chatRef, {
        messages: message,
        lastUpdated: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error adding message:', error);
      throw error;
    }
  },

  async getUserChats(userId) {
    try {
      const q = query(
        collection(db, 'chats'),
        where('userId', '==', userId),
        orderBy('timestamp', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error('Error getting user chats:', error);
      throw error;
    }
  },

  async updateChatMetadata(chatId, metadata) {
    try {
      const chatRef = doc(db, 'chats', chatId);
      await updateDoc(chatRef, {
        ...metadata,
        lastUpdated: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating chat metadata:', error);
      throw error;
    }
  },
};
