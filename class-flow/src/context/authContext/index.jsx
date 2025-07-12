import React, { useState, useEffect, useContext } from "react";
import { auth } from "@/firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

// Create context
const AuthContext = React.createContext();

// Hook to use auth context
export function useAuth() {
  return useContext(AuthContext);
  
}
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [userRoles, setUserRoles] = useState([]); // ← New!
  const [isLoading, setIsLoading] = useState(true);
  

  const db = getFirestore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, initializeUser);
    return unsubscribe;
  }, []);

  async function initializeUser(user) {
    if (user) {
      setCurrentUser({ ...user });
      setUserLoggedIn(true);

      try {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const data = userSnap.data();
          setUserRoles(data.roles || []);
        } else {
          await setDoc(userRef, {
            email: user.email,
            roles: ["Instructor"],
            isActive: true,
            createdAt: serverTimestamp(),
          });
          setUserRoles(["Instructor"]);
        }
      } catch (error) {
        console.error("Error syncing user to Firestore:", error);
      }
    } else {
      setCurrentUser(null);
      setUserLoggedIn(false);
      setUserRoles([]);
    }
    setIsLoading(false);
  }
  const isAdmin = userRoles.includes("Admin");
  const isInstructor = userRoles.includes("Instructor");
  const value = {
    currentUser,
    userLoggedIn,
    userRoles,
    isAdmin,        
    isInstructor,   
    isLoading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
}
