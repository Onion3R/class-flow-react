
import React, { useEffect } from 'react';
import { useLocation, Navigate, Outlet, useNavigate } from "react-router-dom";
// import { useAuth } from '@/app/context/authContext';
import { useAuth } from '@/app/context/authContext';

function RequiredAuth() {
  const { userLoggedIn, isAdmin, isTeacher, isLoading, isFirstTime } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  console.log('is first time?',isFirstTime)
  useEffect(() => {
    if (isLoading) return;

    if (userLoggedIn && location.pathname === "/") {
      console.log("Is first time:", isFirstTime);

      if (isFirstTime) {
        console.log("Redirecting to complete sign-up");
        navigate("/complete-sign-up", { replace: true });
      } else if (isAdmin & !isFirstTime) {
        navigate("/admin", { replace: true });
      } else if (isTeacher & !isFirstTime) {
        navigate("/dashboard", { replace: true });
      } else {
        // Optional fallback for users with no role
        navigate("/user", { replace: true });
      }
    }
  }, [userLoggedIn, isAdmin, isTeacher, isLoading, isFirstTime, location.pathname, navigate]);

  if (!userLoggedIn && !isLoading) {
    return <Navigate to="/user" state={{ from: location }} />;
  }

  return <Outlet />;
}

export default RequiredAuth;
