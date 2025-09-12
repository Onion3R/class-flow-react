import React, { useState } from "react";
import { cn } from "@/lib/utils/utils";
import { Button } from "@/components/ui/button";
import { Loader2Icon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Navigate } from "react-router-dom";
import { doSignInWithEmailAndPassword, doSignInWithGoogle } from "@/app/firebase/auth";
import { useAuth } from "@/app/context/authContext";

export default function LoginFormComponent({ className, ...props }) {
  const { userLoggedIn, isLoading, userRoles } = useAuth();
  const isAdmin = userRoles?.includes("Admin");
  const isInstructor = userRoles?.includes("Instructor");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // 🔐 Email Login Handler
  const onSubmit = async (e) => {
    e.preventDefault();
    if (!isSigningIn) {
      setIsSigningIn(true);
      setErrorMessage("");
      try {
        await doSignInWithEmailAndPassword(email, password);
      } catch (err) {
        if (err && typeof err.code === "string") {
          setErrorMessage(
            "Email or password is incorrect. If you don’t have an account, consider signing up."
          );
        }
        setIsSigningIn(false);
      }
    }
  };

  // 🔐 Google Login Handler
  const onGoogleSignIn = async (e) => {
    e.preventDefault();
    if (!isSigningIn) {
      setIsSigningIn(true);
      try {
        await doSignInWithGoogle();
      } catch (err) {
        setIsSigningIn(false);
      }
    }
  };

  // 🔁 Redirect Based on Role
  if (!isLoading && userLoggedIn) {
    if (isAdmin) return <Navigate to="/admin" replace />;
    if (isInstructor) return <Navigate to="/dashboard" replace />;
  }


  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit}>
            <div className="flex flex-col gap-6">
              {/* Email Field */}
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* Password Field */}
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                {errorMessage && (
                  <span className="text-red-600 text-sm ml-1.5">
                    {errorMessage}
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSigningIn}
                >
                  {isSigningIn ? (
                    <>
                      <Loader2Icon className="animate-spin mr-2" />
                      Please wait
                    </>
                  ) : (
                    "Login"
                  )}
                </Button>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={onGoogleSignIn}
                  disabled={isSigningIn}
                >
                  Login with Google
                </Button>
              </div>
            </div>

            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <a href="/register" className="underline underline-offset-4">
                Sign up
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
