import React from "react";
import { useAuth } from "@/app/context/authContext";


export default function Test() {
  const {logout} =useAuth()
  return (
   <div>
      <button onClick={logout}>Logout</button>
   </div>
  );
}
