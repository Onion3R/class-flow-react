import React, { useState, useEffect } from "react";
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
import { doCreateUserWithEmailAndPassword } from "@/firebase/auth"; // You’ll need to implement this
import { useAuth } from "@/context/authContext";

export default function RegisterFormComponent({ className, ...props }) {
  const { userLoggedIn, isLoading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

 useEffect(() => {
  if(password != confirmPassword && confirmPassword.length > 0) {
  setErrorMessage("Password not match")
  } else {
    setErrorMessage(null)
  }
 }, [confirmPassword])
  

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!isRegistering) {
      setIsRegistering(true);
      setErrorMessage("");
      try {
        await doCreateUserWithEmailAndPassword(email, confirmPassword);
        // Optionally redirect or show success
      } catch (err) {
        setErrorMessage("Registration failed. Please try again.");
        setIsRegistering(false);
      }
    }
  };

  if (!isLoading && userLoggedIn) {
    return <Navigate to="/dashboard" replace />;
  }


  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Create an account</CardTitle>
          <CardDescription>Enter your details to register</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit}>
            <div className="flex flex-col gap-6">
              
              {/* Email */}
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* Password */}
              <div className="grid gap-3">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="cnfPassword">Confirm Password</Label>
                <Input
                  id="cnfPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                {errorMessage && (
                  <span className="text-red-600 text-sm ml-1.5">
                    {errorMessage}
                  </span>
                )}
              </div>

              {/* Submit */}
              <Button type="submit" className="w-full" disabled={isRegistering}>
                {isRegistering ? (
                  <>
                    <Loader2Icon className="animate-spin mr-2" />
                    Creating account...
                  </>
                ) : (
                  "Register"
                )}
              </Button>
            <Button
              variant="outline"
              className="w-full"
              // onClick={onGoogleSignIn}
              // disabled={isSigningIn}
            >
              Register with Google
            </Button>
        </div>

            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <a href="/login" className="underline underline-offset-4">
                Login
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
