/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { auth, firebaseEnabled, googleProvider } from '../lib/firebase';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(firebaseEnabled);
  const [demoMode, setDemoMode] = useState(!firebaseEnabled);

  useEffect(() => {
    if (!firebaseEnabled || !auth) {
      return undefined;
    }

    const unsubscribe = onAuthStateChanged(auth, async (nextUser) => {
      setUser(nextUser);
      setDemoMode(false);
      if (nextUser) {
        const nextToken = await nextUser.getIdToken();
        setToken(nextToken);
      } else {
        setToken(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async ({ email, password }) => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    const nextToken = await result.user.getIdToken();
    setUser(result.user);
    setToken(nextToken);
    setDemoMode(false);
  };

  const signUp = async ({ name, email, password }) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    if (name) {
      await updateProfile(result.user, { displayName: name });
    }
    const nextToken = await result.user.getIdToken();
    setUser({ ...result.user, displayName: name || result.user.displayName });
    setToken(nextToken);
    setDemoMode(false);
  };

  const signInWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    const nextToken = await result.user.getIdToken();
    setUser(result.user);
    setToken(nextToken);
    setDemoMode(false);
  };

  const signOutUser = async () => {
    if (firebaseEnabled && auth) {
      await signOut(auth);
    }
    setUser(null);
    setToken(null);
    setDemoMode(!firebaseEnabled);
  };

  const enterDemoMode = () => {
    setDemoMode(true);
    setUser({
      uid: 'demo-user',
      displayName: 'Demo User',
      email: 'demo@cryptopilot.ai',
    });
    setToken(null);
    setLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        demoMode,
        firebaseEnabled,
        signIn,
        signUp,
        signInWithGoogle,
        signOutUser,
        enterDemoMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
