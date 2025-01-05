import { db } from '@/config/firebase';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  getDocs,
  serverTimestamp 
} from 'firebase/firestore';

// Collection names
const CHATS_COLLECTION = 'chats';
const MESSAGES_COLLECTION = 'messages';

// Save a new chat session
export const createChatSession = async (userId) => {
  try {
    const chatRef = await addDoc(collection(db, CHATS_COLLECTION), {
      userId,
      createdAt: serverTimestamp(),
      lastMessageAt: serverTimestamp()
    });
    return chatRef.id;
  } catch (error) {
    console.error('Error creating chat session:', error);
    throw error;
  }
};

// Save a new message
export const saveMessage = async (chatId, message) => {
  try {
    const messageData = {
      chatId,
      role: message.role,
      content: message.content,
      timestamp: serverTimestamp()
    };
    
    const messageRef = await addDoc(collection(db, MESSAGES_COLLECTION), messageData);
    return messageRef.id;
  } catch (error) {
    console.error('Error saving message:', error);
    throw error;
  }
};

// Get chat history for a user
export const getUserChatHistory = async (userId) => {
  try {
    const chatsQuery = query(
      collection(db, CHATS_COLLECTION),
      where('userId', '==', userId),
      orderBy('lastMessageAt', 'desc')
    );
    
    const chatsSnapshot = await getDocs(chatsQuery);
    const chats = [];
    
    for (const chatDoc of chatsSnapshot.docs) {
      const messagesQuery = query(
        collection(db, MESSAGES_COLLECTION),
        where('chatId', '==', chatDoc.id),
        orderBy('timestamp', 'asc')
      );
      
      const messagesSnapshot = await getDocs(messagesQuery);
      const messages = messagesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      chats.push({
        id: chatDoc.id,
        ...chatDoc.data(),
        messages
      });
    }
    
    return chats;
  } catch (error) {
    console.error('Error getting chat history:', error);
    throw error;
  }
};

// Get messages for a specific chat
export const getChatMessages = async (chatId) => {
  try {
    const messagesQuery = query(
      collection(db, MESSAGES_COLLECTION),
      where('chatId', '==', chatId),
      orderBy('timestamp', 'asc')
    );
    
    const messagesSnapshot = await getDocs(messagesQuery);
    return messagesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting chat messages:', error);
    throw error;
  }
};