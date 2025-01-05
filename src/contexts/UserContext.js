import { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../utils/firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const UserContext = createContext({});

export const useUser = () => useContext(UserContext);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        setUser({
          ...user,
          userData: userDoc.data(),
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signup = async (email, password, displayName) => {
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(user, { displayName });
      await setDoc(doc(db, 'users', user.uid), {
        displayName,
        email,
        createdAt: new Date().toISOString(),
        chats: [],
        preferences: {},
      });
      return user;
    } catch (error) {
      throw error;
    }
  };

  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = () => {
    return signOut(auth);
  };

  const updateUserProfile = async (data) => {
    try {
      if (data.displayName) {
        await updateProfile(auth.currentUser, { displayName: data.displayName });
      }
      await setDoc(doc(db, 'users', auth.currentUser.uid), {
        ...user.userData,
        ...data,
      }, { merge: true });
      
      setUser(prev => ({
        ...prev,
        userData: { ...prev.userData, ...data },
      }));
    } catch (error) {
      throw error;
    }
  };

  const value = {
    user,
    signup,
    login,
    logout,
    updateUserProfile,
  };

  return (
    <UserContext.Provider value={value}>
      {!loading && children}
    </UserContext.Provider>
  );
}
