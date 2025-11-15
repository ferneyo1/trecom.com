import React, { useState, useEffect } from 'react';
import { User, UserRole } from './types';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import { auth, db } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeProfile: () => void = () => {};

    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      // Clean up previous profile listener if it exists
      unsubscribeProfile();

      if (firebaseUser) {
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        
        unsubscribeProfile = onSnapshot(userDocRef, 
          (userDoc) => {
            if (userDoc.exists()) {
              const userData = userDoc.data();
              setUser({
                uid: firebaseUser.uid,
                name: userData?.name || firebaseUser.displayName || 'Usuario',
                email: userData?.email || firebaseUser.email || '',
                role: userData?.role as UserRole,
              });
            } else {
              console.warn("User document not found in Firestore. Creating a default profile.");
              const newUser: User = {
                uid: firebaseUser.uid,
                name: firebaseUser.displayName || 'Nuevo Usuario',
                email: firebaseUser.email || '',
                role: UserRole.SEEKER, // Assign a safe, default role
              };
              setDoc(userDocRef, newUser).catch((error) => {
                console.error("Failed to create user document in Firestore:", error);
                signOut(auth);
              });
            }
            setLoading(false);
          }, 
          (error) => {
            console.error("Error listening to user document:", error);
            signOut(auth);
            setLoading(false);
          }
        );
      } else {
        // User is signed out.
        setUser(null);
        setLoading(false);
      }
    });

    // Cleanup subscription on unmount
    return () => {
      unsubscribeAuth();
      unsubscribeProfile();
    };
  }, []);

  const handleLogout = () => {
    signOut(auth);
  };
  
  if (loading) {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-xl font-semibold">Cargando...</div>
        </div>
    );
  }


  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-sans">
      {user ? (
        <Dashboard user={user} onLogout={handleLogout} />
      ) : (
        <Login />
      )}
    </div>
  );
}

export default App;