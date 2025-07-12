import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  UserRound,
  LogOutIcon,
  Moon,
  Sun,
  SunMoon,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useTheme } from "@/components/theme-provider";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import avatar from "@Assets/avatar.jpg";
import { useAuth } from "@/context/authContext";
import { doSignOut } from "@/firebase/auth";

function AvatarPopUpComponent() {
  const { theme, setTheme } = useTheme();
  const { currentUser, userLoggedIn } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = async (e) => {
    e.preventDefault();
    if (!isLoggingOut) {
      setIsLoggingOut(true);
      try {
        await doSignOut(); // ✅ Sign out from Firebase
        navigate("/", { replace: true }); // 🔁 Redirect to login
      } catch (error) {
        console.error("Sign out failed:", error);
      } finally {
        setIsLoggingOut(false);
      }
    }
  };

  // 🔐 Auth protection redirect
  if (!userLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Popover>
      <PopoverTrigger className="cursor-pointer">
        <Avatar>
          <AvatarImage src={avatar} alt="User Avatar" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-2.5">
        <div>
          <p className="px-2 my-2.5 text-sm font-medium">
            {currentUser?.email || "anonymous@example.com"}
          </p>

          <Button size="sm" variant="ghost" className="w-full flex justify-between">
            <span>Account</span> <UserRound />
          </Button>

          <Button
            size="sm"
            variant="ghost"
            className="w-full flex justify-between"
            onClick={handleSignOut}
            disabled={isLoggingOut}
          >
            <span>{isLoggingOut ? "Signing out..." : "Sign out"}</span>
            <LogOutIcon />
          </Button>

          <div className="w-full flex items-center justify-between px-2.5 mt-2.5">
            <span className="text-sm">Theme</span>
            <ToggleGroup
              type="single"
              className="border"
              size="sm"
              value={theme}
              onValueChange={setTheme}
            >
              <ToggleGroupItem value="light"><Sun className="size-4" /></ToggleGroupItem>
              <ToggleGroupItem value="dark"><Moon className="size-4" /></ToggleGroupItem>
              <ToggleGroupItem value="system"><SunMoon className="size-4" /></ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default AvatarPopUpComponent;
