// src/features/admin/invite/handlers/inviteHandler.js

import { triggerToast } from "@/lib/utils/toast";
import { v4 as uuidv4 } from "uuid";
import { createInvite } from "@/features/admin/invite/inviteService";
export const handleCreateInvite = ({
  email,
  hasGeneratedUrl,
  retries,
  setToken,
  setInvite,
  setHasGeneratedUrl,
  roleId,
}) => {
  if (
    (!hasGeneratedUrl && email !== "") ||
    (hasGeneratedUrl && retries <= 2 && email !== "")
  ) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      triggerToast({
        success: false,
        title: "Invalid email",
        desc: "Please enter a valid email address (e.g., user@gmail.com)",
      });
      return;
    }

    const token = uuidv4();
    setToken(token);
    setInvite(`http://localhost:5173/invites/${token}`);
    setHasGeneratedUrl(true);

    // ✅ pass required data properly
    const result = generateInvitePayload({ email, roleId, token });
    console.log("result", result);
     handleApiCall(result)
  } else {
    triggerToast({
      success: false,
      title: "Email Required",
      desc: "Please provide a valid email address to continue.",
    });
  }
  console.log('role',roleId)
};

// ✅ make this function reusable and pure
const generateInvitePayload = ({ email, roleId, token }) => {
  const now = new Date();

  // ✅ Use ISO format directly (includes timezone info)
  const createdAt = now.toISOString(); // e.g. "2025-10-16T07:42:15.123Z"
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // +15 minutes

  return {
    email,
    role: roleId,
    token,
    invited_by: 'admin@gmail.com', // ideally from cookies or auth context
    created_at: createdAt,
    expires_at: expiresAt,
  };
};



const handleApiCall = async (data) => {
  try {
    await createInvite(data)
    console.log('created')
  } catch (error) {
    console.error(error)
  }
 
}