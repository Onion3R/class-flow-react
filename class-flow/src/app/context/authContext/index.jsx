import React, { useState, useEffect, useContext } from "react";
import { auth } from "@/app/firebase/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import useTeachersGetter from "@/lib/hooks/useTeachers";

// Create context
const AuthContext = React.createContext();

// Hook to consume context
export function useAuth() {
  return useContext(AuthContext);
}

// Provider component
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isTeacher, setIsTeacher] = useState(false);
  const [isFirstTime, setIsFirstTime] = useState(null);
  const [teacherData, setTeacherData] = useState(null);

  const { data: allTeacherData, isLoading: isTeachersLoading, refresh: teacherRefresh } = useTeachersGetter();
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // Listen for Firebase auth changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user || null);
      setUserLoggedIn(!!user);
      setIsAuthLoading(false);
    });
    return unsubscribe;
  }, []);

  // Match Firebase user with teacher data
  useEffect(() => {

    if (currentUser && allTeacherData?.length > 0) {

      const foundTeacher = allTeacherData.find(
        (t) => t.firebase_uid === currentUser.uid
      );
      if (foundTeacher) {
        setTeacherData(foundTeacher);
        setIsFirstTime(foundTeacher.firstTime ?? null);

        const role = foundTeacher?.role
        setIsAdmin(role === 1);
        setIsTeacher(role === 2);
      } else {
        setTeacherData(null);
        setIsAdmin(false);
        setIsTeacher(false);
        setIsFirstTime(null);
      }
    }

    if (!currentUser) {
      setTeacherData(null);
      setIsAdmin(false);
      setIsTeacher(false);
      setIsFirstTime(null);
    }
  }, [currentUser, allTeacherData]);

  // Optional logout function
  const logout = () => signOut(auth);

  const isLoading = isAuthLoading || isTeachersLoading;
 
  const value = {
    currentUser,
    userLoggedIn,
    isAdmin,
    isTeacher,
    isLoading,
    teacherData,
    isFirstTime,
    teacherRefresh,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
}
