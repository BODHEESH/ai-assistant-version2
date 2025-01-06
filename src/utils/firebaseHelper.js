import { db, auth } from '@/config/firebase';
import { collection, addDoc, serverTimestamp, query, where, orderBy, getDocs, limit, doc, getDoc } from 'firebase/firestore';

export const saveToFirebase = async (data) => {
    if (!auth.currentUser) return null;

    try {
        const { collection: collectionName = 'chats', ...docData } = data;
        
        const chatData = {
            ...docData,
            userId: auth.currentUser.uid,
            timestamp: serverTimestamp(),
            metadata: {
                userAgent: navigator.userAgent,
                language: navigator.language,
                timestamp: new Date().toISOString(),
            },
            // Ensure these fields exist
            role: docData.role || 'user',
            content: docData.content || '',
            assistantType: docData.assistantType || 'chat',
            chatId: docData.chatId || null // Group messages by chat
        };
        
        const docRef = await addDoc(collection(db, collectionName), chatData);
        return docRef;
    } catch (error) {
        console.error('Error saving to Firebase:', error);
        return null;
    }
};

export const fetchChats = async () => {
    if (!auth.currentUser) return [];

    try {
        // First, try with just the userId filter
        const basicQuery = query(
            collection(db, 'chats'),
            where('userId', '==', auth.currentUser.uid),
            limit(50) // Add a limit to prevent loading too many chats
        );

        const querySnapshot = await getDocs(basicQuery);
        const chats = [];
        let currentChat = null;

        // Sort the results in memory since we can't use the index yet
        const sortedDocs = querySnapshot.docs.sort((a, b) => {
            const timestampA = a.data().timestamp?.toDate() || new Date(0);
            const timestampB = b.data().timestamp?.toDate() || new Date(0);
            return timestampB - timestampA; // Sort in descending order
        });

        sortedDocs.forEach((doc) => {
            const chatData = {
                id: doc.id,
                ...doc.data(),
                timestamp: doc.data().timestamp?.toDate() || new Date()
            };

            // If this is a user message or the first message of a chat
            if (chatData.role === 'user' || !currentChat) {
                if (currentChat) {
                    chats.push(currentChat);
                }
                currentChat = {
                    id: chatData.id,
                    timestamp: chatData.timestamp,
                    messages: [chatData],
                    assistantType: chatData.assistantType || 'chat',
                    systemPrompt: chatData.systemPrompt
                };
            } else {
                // Add assistant response to current chat
                currentChat.messages.push(chatData);
            }
        });

        // Add the last chat if exists
        if (currentChat) {
            chats.push(currentChat);
        }

        return chats;
    } catch (error) {
        console.error('Error fetching chats:', error);
        return [];
    }
};

export const fetchChatById = async (chatId) => {
    if (!auth.currentUser || !chatId) return null;

    try {
        const chatsQuery = query(
            collection(db, 'chats'),
            where('userId', '==', auth.currentUser.uid),
            where('chatId', '==', chatId),
            orderBy('timestamp', 'asc')
        );

        const querySnapshot = await getDocs(chatsQuery);
        const messages = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            timestamp: doc.data().timestamp?.toDate() || new Date()
        }));

        if (messages.length === 0) return null;

        return {
            id: chatId,
            messages,
            assistantType: messages[0].assistantType || 'chat',
            systemPrompt: messages[0].systemPrompt,
            timestamp: messages[0].timestamp
        };
    } catch (error) {
        console.error('Error fetching chat by ID:', error);
        return null;
    }
};

// export const fetchChatById = async (chatId) => {
//   try {
//     const chatRef = doc(db, 'chats', chatId);
//     const chatDoc = await getDoc(chatRef);

//     if (chatDoc.exists()) {
//       const data = chatDoc.data();
//       return {
//         id: chatDoc.id,
//         ...data,
//         timestamp: data.timestamp?.toDate().toISOString(),
//         messages: data.messages.map(msg => ({
//           ...msg,
//           timestamp: msg.timestamp?.toDate().toISOString()
//         }))
//       };
//     }
//     return null;
//   } catch (error) {
//     console.error('Error fetching chat:', error);
//     throw error;
//   }
// };
